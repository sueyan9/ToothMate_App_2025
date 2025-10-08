export const getToothPositionFromData = (toothNumber, basePosition, eruptionLevels = {}) => {
    const v = typeof eruptionLevels[toothNumber] === 'number' ? eruptionLevels[toothNumber] : 1.0;
    if (v >= 1.0) return basePosition;

    const off = (1 - v) * 0.15;
    const isUpper = toothNumber >= 11 && toothNumber <= 28;

    return isUpper
        ? [basePosition[0], basePosition[1] + off * 2.0, basePosition[2] + off * -1.5]
        : [basePosition[0], basePosition[1] - off * 1.55, basePosition[2] - off * 0.5];
};

