import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const AppointmentReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_appointment_content':
      return payload;
    case 'get_user_appointment':
      return payload;
    case 'get_next_appointment':
      return { ...state, nextAppointment: payload };
    default:
      return state;
  }
};

const getAppointmentContent = dispatch => {
  return async () => {
    const response = await axiosApi.get('/appointment');

    dispatch({ type: 'get_appointment_content', payload: response.data });
  };
};

const getUserAppointments = dispatch => {
  return async nhi => {
    const response = await axiosApi.get(`/appointment/${nhi}`);

    dispatch({ type: 'get_user_appointment', payload: response.data });
  };
};

const getNextAppointment = dispatch => {
  return async (details, childDetails) => {
    try {
      
      // Build array of NHIs from user and children
      const nhiArray = [details?.nhi].filter(Boolean);
      
      if (childDetails && Array.isArray(childDetails)) {
        childDetails.forEach(child => {
          if (child?.nhi) nhiArray.push(child.nhi);
        });
      }
      
      if (nhiArray.length === 0) {
        dispatch({ type: 'get_next_appointment', payload: null });
        return;
      }
      
      const nhiParams = nhiArray.join(',');
      
      const response = await axiosApi.get(`/Appointments/next?nhis=${nhiParams}`);

      dispatch({ type: 'get_next_appointment', payload: response.data });
    } catch (error) {
      console.error('Error fetching next appointment:', error);
      console.error('Error details:', error?.response?.data);
      dispatch({ type: 'get_next_appointment', payload: null });
    }
  };
};

export const { Provider, Context } = createDataContext(
  AppointmentReducer,
  { getAppointmentContent, getUserAppointments, getNextAppointment },
  { appointments: [], userAppointments: [], nextAppointment: null },
);
