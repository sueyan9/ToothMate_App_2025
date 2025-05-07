import createDataContext from '../createDataContext';
import axiosApi from '../../api/axios';

const AppointmentReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_appointment_content':
      return payload;
    case 'get_user_appointment':
      return payload;
    default:
      return null;
  }
};

const getAppointmentContent = dispatch => {
  return async () => {
    const response = await axiosApi.get('/Appointment');

    dispatch({ type: 'get_appointment_content', payload: response.data });
  };
};

const getUserAppointments = dispatch => {
  return async nhi => {
    const response = await axiosApi.get(`/Appointment/${nhi}`);

    dispatch({ type: 'get_user_appointment', payload: response.data });
  };
};

export const { Provider, Context } = createDataContext(
  AppointmentReducer,
  { getAppointmentContent, getUserAppointments },
  [],
);
