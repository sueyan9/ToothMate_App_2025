import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import createDataContext from '../createDataContext';
import axiosApi from '../../api/axios';

const UserReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_user':
      return { ...state, details: payload };
    case 'get_user_appointment':
      return { ...state, appointments: payload };
    case 'get_clinic':
      return { ...state, clinic: payload };
    case 'get_DOB':
      return { ...state, dob: payload };
    case 'can_disconnect':
      return { ...state, canDisconnect: payload };
    case 'get_all_images':
      return { ...state, images: payload };
    default:
      return state;
  }
};

const checkCanDisconnect = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    try {
      const dobResponse = await axiosApi.get(`/getDOB/${id}`);
      const isChild = await axiosApi.get(`/isChild/${id}`);
      const today = dayjs();
      const dob = dayjs(new Date(dobResponse.data.dob));
      const dateDiff = today.diff(dob, 'year');

      let canDc = false;
      if (dateDiff > 18 && isChild.data.isChild != null) {
        canDc = true;
      }

      dispatch({ type: 'can_disconnect', payload: canDc });
    } catch (error) {
      console.error('Error checking disconnect:', error);
    }
  };
};

const getUserDOB = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    const response = await axiosApi.get(`/getDOB/${id}`);

    dispatch({ type: 'get_DOB', payload: response.data });
  };
};

const getUser = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    try {
      const response = await axiosApi.get(`/user/${id}`);
      dispatch({ type: 'get_user', payload: response.data });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
};

const getNhiAndAppointments = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
    const { nhi } = nhiResponse.data;
    const response = await axiosApi.get(`/Appointment/${nhi}`);

    const temp = [].concat(response.data).sort((a, b) => (a.date < b.date ? 1 : -1));

    dispatch({ type: 'get_user_appointment', payload: temp });
  };
};

const getDentalClinic = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    try {
      const userClinic = await axiosApi.get(`/getUserClinic/${id}`);
      const clinicID = userClinic.data.clinic;
      const response = await axiosApi.get(`/getDentalClinic/${clinicID}`);
      dispatch({ type: 'get_clinic', payload: response.data.clinic });
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
  };
};

const disconnectChild = () => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    const response = await axiosApi.post('/disconnectchild', { id });
  };
};

const getAllImages = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    const nhiResponse = await axiosApi.get(`/getNhi/${id}`);
    const { nhi } = nhiResponse.data;
    const response = await axiosApi.get(`/getAllImages/${nhi}`);

    dispatch({ type: 'get_all_images', payload: response.data });
  };
};

export const { Provider, Context } = createDataContext(
    UserReducer,
    {
      getUserDOB,
      getNhiAndAppointments,
      getDentalClinic,
      getUser,
      checkCanDisconnect,
      disconnectChild,
      getAllImages,
    },
    {
      appointments: [],
      clinic: null,
      details: {},
      canDisconnect: null,
      images: [],
    },
);
