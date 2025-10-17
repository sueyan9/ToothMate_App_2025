import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const TreatmentReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'get_treatments':
        return { ...state, treatments: payload };
        case 'create_treatment':
        return { ...state, treatments: [...(state.treatments || []), payload] };
        case 'delete_treatment':
        return { ...state, treatments: [] }; // Clear treatments after deletion
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
    return async (userNhi, toothNumber, treatmentType, date, notes, test) => {
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
            test
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

const deleteTestTreatment = dispatch => {
    return async () => {
        try {
        const response = await axiosApi.delete('/Treatment/test_data');

        dispatch({ type: 'delete_treatment', payload: response.data });
        
        console.log(`Test treatments deleted:`, response.data);
        return response.data;
        } catch (error) {
        console.error('Error deleting test treatments:', error);
        throw error;
        }
    };
};

export const { Provider, Context } = createDataContext(
    TreatmentReducer,
    { getTreatments, createTreatment, deleteTestTreatment },
    { treatments: [] },
);