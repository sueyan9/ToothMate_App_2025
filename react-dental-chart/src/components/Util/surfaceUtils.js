export function isAnteriorFDI(n) {
    n = Number(n);
    return [11,12,13,21,22,23,31,32,33,41,42,43].includes(n);
}

export function classifyToothClass(n) {
    return isAnteriorFDI(n) ? 'ANTERIOR' : 'POSTERIOR';
}

// Parse surface string (special handling for ROOT;
// For anterior teeth: O -> I, B -> F, P -> L)
export function parseSurfaces(surfaceStr, anterior) {
    if (!surfaceStr) return [];
    const s = surfaceStr.toUpperCase().replace(/\s+/g, '');
    if (s === 'ROOT') return ['ROOT']; // ✅ Do not split into letters
    return Array.from(new Set(
        s.split('').map(ch => {
            if (ch === 'B') return 'F';
            if (ch === 'P') return 'L';
            if (anterior && ch === 'O') return 'I';
            return ch;
        })
    ));
}

// Treatment mapping: e.g. 'Root Canal' -> 'rootcanal'
export function normalizeTreatmentType(raw) {
    if (!raw) return 'normal';
    return raw.toLowerCase().replace(/\s+/g, '').replace('placement','');
}

// When no surfaces are provided:
// - For root canal → return ROOT
// - For others → return null (means whole tooth, not surface-specific)
export function normalizeSurfaces(surfaces, toothNumber, treatmentType) {
    if (!surfaces) {
        if (normalizeTreatmentType(treatmentType) === 'rootcanal') return ['ROOT'];
        return null;
    }
    if (Array.isArray(surfaces)) return Array.from(new Set(surfaces.map(s => s.toUpperCase())));
    return Array.from(new Set(surfaces.toUpperCase().replace(/\s+/g,'').split('')));
}

export function getIndexMapForTooth(toothNumber, DEFAULT_INDEX_MAP, OVERRIDE_INDEX_MAP) {
    const klass = classifyToothClass(toothNumber);
    const tpl = DEFAULT_INDEX_MAP?.[klass] || {};
    const ov  = OVERRIDE_INDEX_MAP?.[toothNumber] || {};
    return new Proxy({}, {
        get(_t, key) { return ov[key] ?? tpl[key] ?? []; }
    });
}

// Return **array of material indices (as strings)**
export function resolveHighlightIndices({
                                            toothNumber,
                                            surfaceStr,
                                            includeContact = false,
                                            includeRoot = false,
                                            DEFAULT_INDEX_MAP,
                                            OVERRIDE_INDEX_MAP,
                                        }) {
    const anterior = isAnteriorFDI(toothNumber);
    const letters  = parseSurfaces(surfaceStr || '', anterior);
    const map      = getIndexMapForTooth(toothNumber, DEFAULT_INDEX_MAP, OVERRIDE_INDEX_MAP);

    const ids = new Set();
    letters.forEach(k => (map[k] || []).forEach(id => ids.add(String(id))));

    if (includeContact) {
        const hasC = map['C'] && map['C'].length;
        const contact = hasC ? map['C'] : [ ...(map['M']||[]), ...(map['D']||[]) ];
        contact.forEach(id => ids.add(String(id)));
    }
    if (includeRoot) (map['ROOT'] || []).forEach(id => ids.add(String(id)));

    return Array.from(ids.values()); // Example: ['28','29','30']
}
