import { treatmentColors } from '../../data/treatmentColors';

export const getToothSegmentColor = (treatment) => {
    return treatmentColors[treatment] || treatmentColors.default;
};