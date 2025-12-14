// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Get the audio directory path (AppData/Audio)
/// Creates the directory if it doesn't exist
#[tauri::command]
fn get_audio_directory(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    let audio_dir = app_data_dir.join("Audio");

    // Create directory if it doesn't exist
    if !audio_dir.exists() {
        fs::create_dir_all(&audio_dir)
            .map_err(|e| format!("Failed to create audio directory: {}", e))?;
    }

    audio_dir
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Invalid path encoding".to_string())
}

/// Copy audio file to AppData/Audio directory
#[tauri::command]
fn copy_audio_file(
    app: tauri::AppHandle,
    source_path: String,
    file_name: String,
) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    let audio_dir = app_data_dir.join("Audio");

    // Create directory if it doesn't exist
    if !audio_dir.exists() {
        fs::create_dir_all(&audio_dir)
            .map_err(|e| format!("Failed to create audio directory: {}", e))?;
    }

    let dest_path = audio_dir.join(&file_name);

    // Copy file
    fs::copy(&source_path, &dest_path).map_err(|e| format!("Failed to copy file: {}", e))?;

    dest_path
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Invalid path encoding".to_string())
}

/// Open file dialog and return selected audio file path
#[tauri::command]
async fn open_audio_file_dialog(
    app: tauri::AppHandle,
    title: String,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let file_path = app
        .dialog()
        .file()
        .set_title(&title)
        .add_filter("Audio Files", &["mp3", "wav", "ogg", "m4a", "flac", "aac"])
        .blocking_pick_file();

    Ok(file_path.map(|p| p.to_string()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_audio_directory,
            copy_audio_file,
            open_audio_file_dialog
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
