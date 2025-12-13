// Prayer Math Utilities - Core astronomical calculations

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
    return (rad * 180) / Math.PI;
}

/**
 * Calculate sine of angle in degrees
 */
export function dsin(deg: number): number {
    return Math.sin(degToRad(deg));
}

/**
 * Calculate cosine of angle in degrees
 */
export function dcos(deg: number): number {
    return Math.cos(degToRad(deg));
}

/**
 * Calculate tangent of angle in degrees
 */
export function dtan(deg: number): number {
    return Math.tan(degToRad(deg));
}

/**
 * Calculate arcsine and return result in degrees
 */
export function darcsin(x: number): number {
    return radToDeg(Math.asin(x));
}

/**
 * Calculate arccosine and return result in degrees
 */
export function darccos(x: number): number {
    return radToDeg(Math.acos(x));
}

/**
 * Calculate arctangent and return result in degrees
 */
export function darctan(x: number): number {
    return radToDeg(Math.atan(x));
}

/**
 * Calculate arctangent2 and return result in degrees
 */
export function darctan2(y: number, x: number): number {
    return radToDeg(Math.atan2(y, x));
}

/**
 * Calculate arccotangent and return result in degrees
 */
export function darccot(x: number): number {
    return radToDeg(Math.atan(1 / x));
}

/**
 * Fix angle to be within [0, 360)
 */
export function fixAngle(angle: number): number {
    return fix(angle, 360);
}

/**
 * Fix hour to be within [0, 24)
 */
export function fixHour(hour: number): number {
    return fix(hour, 24);
}

/**
 * Fix value to be within [0, range)
 */
export function fix(value: number, range: number): number {
    value = value - range * Math.floor(value / range);
    return value < 0 ? value + range : value;
}

/**
 * Calculate Julian Day from date
 */
export function julianDay(year: number, month: number, day: number): number {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day + B - 1524.5;
}

/**
 * Calculate equation of time for a given Julian day
 */
export function equationOfTime(jd: number): number {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
    return q / 15 - fixHour(RA);
}

/**
 * Calculate sun declination for a given Julian day
 */
export function sunDeclination(jd: number): number {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    return darcsin(dsin(e) * dsin(L));
}

/**
 * Calculate mid-day (Dhuhr) time
 */
export function midDay(jd: number, _timezone: number): number {
    const eqt = equationOfTime(jd);
    return fixHour(12 - eqt);
}

/**
 * Calculate sun angle time (for Fajr, Isha, etc.)
 */
export function sunAngleTime(
    jd: number,
    angle: number,
    latitude: number,
    direction: 'ccw' | 'cw'
): number {
    const decl = sunDeclination(jd);
    const noon = midDay(jd, 0);
    const t = (1 / 15) * darccos(
        (-dsin(angle) - dsin(decl) * dsin(latitude)) /
        (dcos(decl) * dcos(latitude))
    );
    return noon + (direction === 'ccw' ? -t : t);
}

/**
 * Calculate Asr time based on juristic method
 */
export function asrTime(
    jd: number,
    latitude: number,
    factor: number  // 1 for Shafi'i/Standard, 2 for Hanafi
): number {
    const decl = sunDeclination(jd);
    const angle = -darccot(factor + dtan(Math.abs(latitude - decl)));
    return sunAngleTime(jd, angle, latitude, 'cw');
}

/**
 * Adjust time for timezone and longitude
 */
export function adjustForTimezone(
    time: number,
    longitude: number,
    timezone: number
): number {
    return time + timezone - longitude / 15;
}
