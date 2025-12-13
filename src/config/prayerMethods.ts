// Prayer Methods Configuration
import type { CalculationMethod, CalculationMethodParams } from '../types/prayer.types';

export const PRAYER_METHODS: Record<CalculationMethod, CalculationMethodParams> = {
    MWL: {
        name: 'Muslim World League',
        fajrAngle: 18,
        ishaAngle: 17,
    },
    ISNA: {
        name: 'Islamic Society of North America',
        fajrAngle: 15,
        ishaAngle: 15,
    },
    Egypt: {
        name: 'Egyptian General Authority of Survey',
        fajrAngle: 19.5,
        ishaAngle: 17.5,
    },
    Makkah: {
        name: 'Umm al-Qura University, Makkah',
        fajrAngle: 18.5,
        ishaAngle: 0,
        ishaMinutes: 90,
    },
    Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        fajrAngle: 18,
        ishaAngle: 18,
    },
    Tehran: {
        name: 'Institute of Geophysics, Tehran',
        fajrAngle: 17.7,
        ishaAngle: 14,
        maghribAngle: 4.5,
        midnight: 'Jafari',
    },
    Jafari: {
        name: 'Shia Ithna Ashari, Leva Institute, Qum',
        fajrAngle: 16,
        ishaAngle: 14,
        maghribAngle: 4,
        midnight: 'Jafari',
    },
    Singapore: {
        name: 'MUIS Singapore',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    JAKIM: {
        name: 'JAKIM Malaysia',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    Kemenag: {
        name: 'Kementerian Agama Indonesia',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    Custom: {
        name: 'Custom',
        fajrAngle: 18,
        ishaAngle: 17,
    },
};
