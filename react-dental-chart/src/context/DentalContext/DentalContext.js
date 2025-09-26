import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const DentalReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_user_dental':
      return { ...state, userDetails: payload };
    case 'get_teeth_data':
      return { ...state, teethData: payload };
    case 'get_treatments':
      return { ...state, treatments: payload };
    case 'get_tooth_treatments':
      return { ...state, toothTreatments: payload };
    case 'set_current_nhi':
      return { ...state, currentNhi: payload };
    case 'set_loading':
      return { ...state, loading: payload };
    case 'set_error':
      return { ...state, error: payload };
    default:
      return state;
  }
};

const getUserDental = dispatch => {
  return async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      const response = await axiosApi.get(`/user/${id}`);
      dispatch({ type: 'get_user_dental', payload: response.data });
    } catch (error) {
      console.error('Error fetching user dental data:', error);
      dispatch({ type: 'set_error', payload: 'Error fetching user data' });
    }
  };
};

const getNhiAndTeethData = dispatch => {
  return async () => {
    try {
      dispatch({ type: 'set_loading', payload: true });
      dispatch({ type: 'set_error', payload: null });
      
      const id = await AsyncStorage.getItem('id');
      const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
      const { nhi } = nhiResponse.data;
      
      dispatch({ type: 'set_current_nhi', payload: nhi });
      
      const teethResponse = await axiosApi.get(`/getToothData/${nhi}`);
      dispatch({ type: 'get_teeth_data', payload: teethResponse.data });
      
    } catch (error) {
      console.error('Error fetching teeth data:', error);
      dispatch({ type: 'set_error', payload: 'Error fetching dental data' });
    } finally {
      dispatch({ type: 'set_loading', payload: false });
    }
  };
};

const getTreatments = dispatch => {
  return async (nhi = null) => {
    try {
      let nhiToUse = nhi;
      
      if (!nhiToUse) {
        const id = await AsyncStorage.getItem('id');
        const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
        nhiToUse = nhiResponse.data.nhi;
      }
      
      const response = await axiosApi.get(`/treatments/${nhiToUse}`);
      dispatch({ type: 'get_treatments', payload: response.data });
    } catch (error) {
      console.error('Error fetching treatments:', error);
      dispatch({ type: 'set_error', payload: 'Error fetching treatments' });
    }
  };
};

const getToothTreatments = dispatch => {
  return async (toothNumber, nhi = null) => {
    try {
      let nhiToUse = nhi;
      
      if (!nhiToUse) {
        const id = await AsyncStorage.getItem('id');
        const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
        nhiToUse = nhiResponse.data.nhi;
      }
      
      const response = await axiosApi.get(`/treatments/${nhiToUse}/tooth/${toothNumber}`);
      dispatch({ type: 'get_tooth_treatments', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error fetching tooth treatments:', error);
      dispatch({ type: 'set_error', payload: 'Error fetching tooth treatments' });
      throw error;
    }
  };
};

const addTreatment = dispatch => {
  return async (treatmentData) => {
    try {
      // Get user's NHI if not provided in treatmentData
      if (!treatmentData.patientId) {
        const id = await AsyncStorage.getItem('id');
        const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
        treatmentData.patientId = nhiResponse.data.nhi;
      }
      
      const response = await axiosApi.post('/treatment', treatmentData);
      
      // Refresh teeth data after adding treatment
      dispatch(getNhiAndTeethData);
      
      return { success: true, treatment: response.data };
    } catch (error) {
      console.error('Error adding treatment:', error);
      dispatch({ type: 'set_error', payload: 'Error adding treatment' });
      return { success: false, error: 'Failed to add treatment' };
    }
  };
};

const updateTreatment = dispatch => {
  return async (treatmentId, updateData) => {
    try {
      const response = await axiosApi.put(`/treatment/${treatmentId}`, updateData);
      
      // Refresh teeth data after updating treatment
      dispatch(getNhiAndTeethData);
      
      return { success: true, treatment: response.data };
    } catch (error) {
      console.error('Error updating treatment:', error);
      dispatch({ type: 'set_error', payload: 'Error updating treatment' });
      return { success: false, error: 'Failed to update treatment' };
    }
  };
};

const deleteTreatment = dispatch => {
  return async (treatmentId) => {
    try {
      await axiosApi.delete(`/treatment/${treatmentId}`);
      
      // Refresh teeth data after deleting treatment
      dispatch(getNhiAndTeethData);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting treatment:', error);
      dispatch({ type: 'set_error', payload: 'Error deleting treatment' });
      return { success: false, error: 'Failed to delete treatment' };
    }
  };
};

const getToothInfo = () => {
  return (toothNumber, teethData) => {
    if (!teethData || !teethData.teeth) {
      return {
        name: `Tooth ${toothNumber}`,
        treatments: [],
        futuretreatments: []
      };
    }
    
    return teethData.teeth[toothNumber] || {
      name: `Tooth ${toothNumber}`,
      treatments: [],
      futuretreatments: []
    };
  };
};

const clearError = dispatch => {
  return () => {
    dispatch({ type: 'set_error', payload: null });
  };
};

export const { Provider, Context } = createDataContext(
  DentalReducer,
  {
    getUserDental,
    getNhiAndTeethData,
    getTreatments,
    getToothTreatments,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    getToothInfo,
    clearError,
  },
  {
    userDetails: {},
    teethData: { teeth: {} },
    treatments: [],
    toothTreatments: [],
    currentNhi: null,
    loading: false,
    error: null,
  }
);