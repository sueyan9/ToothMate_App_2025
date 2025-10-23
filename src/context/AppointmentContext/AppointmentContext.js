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
    case 'confirm_appointment':
      return {
        ...state,
        nextAppointment: state.nextAppointment?._id === payload._id 
          ? payload 
          : state.nextAppointment,
    };
    case 'unconfirm_appointment':
      return {
        ...state,
        nextAppointment: state.nextAppointment?._id === payload._id 
          ? payload 
          : state.nextAppointment,
      };
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

const confirmAppointment = dispatch => {
  return async () => {
    try {
      // Calculate date 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      // Fetch ALL appointments
      const response = await axiosApi.get('/Appointments');
      const allAppointments = response.data;
      
      // Filter appointments CREATED in the past 3 days (not scheduled for the past 3 days)
      const recentAppointments = allAppointments.filter(apt => {
        // Use createdAt if available, otherwise extract timestamp from MongoDB _id
        const createdDate = apt.createdAt 
          ? new Date(apt.createdAt) 
          : new Date(parseInt(apt._id.substring(0, 8), 16) * 1000);
        return createdDate >= threeDaysAgo;
      });
      
      console.log(`Found ${recentAppointments.length} appointments in the past 3 days`);
      
      // Confirm each recent appointment
      const confirmedAppointments = [];
      for (const apt of recentAppointments) {
        try {
          const confirmResponse = await axiosApi.patch(
            `/Appointments/${apt._id}/confirm`,
            { confirmed: true }
          );
          confirmedAppointments.push(confirmResponse.data);
          console.log(`Appointment ${apt._id} confirmed successfully`);
        } catch (err) {
          console.error(`Failed to confirm appointment ${apt._id}:`, err);
        }
      }
      
      dispatch({ type: 'confirm_appointments', payload: confirmedAppointments });

      return confirmedAppointments;
    } catch (error) {
      console.error('Error confirming appointments:', error);
      throw error;
    }
  };
};

const unconfirmAppointment = dispatch => {
  return async () => {
    try {
      // Calculate date 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      // Fetch ALL appointments
      const response = await axiosApi.get('/Appointments');
      const allAppointments = response.data;
      
      // Filter appointments CREATED in the past 3 days (not scheduled for the past 3 days)
      const recentAppointments = allAppointments.filter(apt => {
        const createdDate = new Date(apt.createdAt || apt.created_at);
        return createdDate >= threeDaysAgo;
      });
      
      console.log(`Found ${recentAppointments.length} appointments in the past 3 days to unconfirm`);
      
      // Unconfirm each recent appointment
      const unconfirmedAppointments = [];
      for (const apt of recentAppointments) {
        try {
          const unconfirmResponse = await axiosApi.patch(
            `/Appointments/${apt._id}/confirm`,
            { confirmed: false }
          );
          unconfirmedAppointments.push(unconfirmResponse.data);
          console.log(`Appointment ${apt._id} unconfirmed successfully`);
        } catch (err) {
          console.error(`Failed to unconfirm appointment ${apt._id}:`, err);
        }
      }
      
      dispatch({ type: 'unconfirm_appointments', payload: unconfirmedAppointments });

      return unconfirmedAppointments;
    } catch (error) {
      console.error('Error unconfirming appointments:', error);
      throw error;
    }
  };
};

export const { Provider, Context } = createDataContext(
  AppointmentReducer,
  { getAppointmentContent, getUserAppointments, getNextAppointment, confirmAppointment, unconfirmAppointment },
  { appointments: [], userAppointments: [], nextAppointment: null },
);
