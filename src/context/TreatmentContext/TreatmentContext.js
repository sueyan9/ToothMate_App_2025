import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const TreatmentReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'get_treatments':
        return { ...state, treatments: payload };
        case 'create_treatment':
        return { ...state, treatments: [...(state.treatments || []), payload] };
        default:
        return state;
    }
};

const getTreatments = dispatch => {
    return async nhi => {
        try {
        const response = await axiosApi.get(
            `/Treatment/${nhi}`,
            { params: { limit: 400 } }
        );
        dispatch({ type: 'get_treatments', payload: response.data.items });
        } catch (error) {
        console.error('Error fetching treatments:', error);
        throw error;
        }
    };
};

const createTreatment = dispatch => {
    return async (userNhi, toothNumber, treatmentType, date, notes) => {
        try {
        if (!userNhi) {
            throw new Error('User NHI is required');
        }
        if (!toothNumber) {
            throw new Error('Tooth number is required');
        }
        if (!treatmentType) {
            throw new Error('Treatment type is required');
        }

        const response = await axiosApi.post(
            '/createTreatment',
            {
            userNhi,
            toothNumber,
            treatmentType,
            date,
            notes,
            completed: false,
            }
        );

        dispatch({ type: 'create_treatment', payload: response.data });
        console.log(`Treatment created successfully:`, response.data);
        return response.data;
        } catch (error) {
        console.error('Error creating treatment:', error);
        throw error;
        }
    };
};

const deleteTreatment = dispatch => {
    return async treatmentId => {
        try {
        if (!treatmentId) {
            throw new Error('Treatment ID is required');
        }

        await axiosApi.delete(`/Treatment/${treatmentId}`);

        console.log(`Treatment ${treatmentId} deleted successfully`);
        return treatmentId;
        } catch (error) {
        console.error('Error deleting treatment:', error);
        throw error;
        }
    };
};

export const { Provider, Context } = createDataContext(
    TreatmentReducer,
    { getTreatments, createTreatment, deleteTreatment },
    { treatments: [] },
);