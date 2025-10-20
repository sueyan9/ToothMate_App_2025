// Adult (11–48) -> Primary FDI (51–85)
export function permanentToPrimaryFDI(num) {
    const map = {
        11: 51, 12: 52, 13: 53, 14: 54, 15: 55,
        21: 61, 22: 62, 23: 63, 24: 64, 25: 65,
        31: 71, 32: 72, 33: 73, 34: 74, 35: 75,
        41: 81, 42: 82, 43: 83, 44: 84, 45: 85,
    };
    return map[num] || null;
}

// Display number (adult: 11–48; child: 51–85)
export function formatDisplayNumber(permanentNum, isChild) {
    if (!isChild) return String(permanentNum);
    const p = permanentToPrimaryFDI(permanentNum);
    return p ? String(p) : String(permanentNum);
}

// Display name (child premolars shown as "Primary molar")
export function getDisplayToothName(permanentNum, isChild) {
    if ([11,21,31,41].includes(permanentNum)) return isChild ? 'Primary central incisor' : 'Central incisor';
    if ([12,22,32,42].includes(permanentNum)) return isChild ? 'Primary lateral incisor' : 'Lateral incisor';
    if ([13,23,33,43].includes(permanentNum)) return isChild ? 'Primary canine' : 'Canine';

    if (isChild) {
        if ([14,24,34,44].includes(permanentNum)) return 'First primary molar';
        if ([15,25,35,45].includes(permanentNum)) return 'Second primary molar';
        if ([16,26,36,46].includes(permanentNum)) return 'First molar';
        if ([17,27,37,47].includes(permanentNum)) return 'Second molar';
        return 'Tooth';
    }

    if ([14,24,34,44].includes(permanentNum)) return 'First premolar';
    if ([15,25,35,45].includes(permanentNum)) return 'Second premolar';
    if ([16,26,36,46].includes(permanentNum)) return 'First molar';
    if ([17,27,37,47].includes(permanentNum)) return 'Second molar';
    if ([18,28,38,48].includes(permanentNum)) return 'Third molar (Wisdom)';
    return 'Tooth';
}