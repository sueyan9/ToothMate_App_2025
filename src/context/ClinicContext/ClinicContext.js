import createDataContext from '../createDataContext';
import axiosApi from '../../api/axios';

const ClinicReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_all_clinics':
      return payload;
    case 'search_clinics':
      return payload;
    default:
      return null;
  }
};

const getAllClinics = dispatch => {
  return async () => {
    const response = await axiosApi.get('/Clinics');

    dispatch({ type: 'get_all_clinics', payload: response.data });
  };
};

const getClinicNames = dispatch => {
  return async () => {
    const response = await axiosApi.get('/nameClinics');
    dispatch({ type: 'get_all_clinics', payload: response.data });
  };
};

const searchClinics = dispatch => {
  return async search => {
    const response = await axiosApi.get(`/Clinics/${search}`);

    dispatch({ type: 'search_clinics', payload: response.data });
  };
};

const addClinic =
  () =>
  async ({ name, suburb, phone, email, bookingURL }) => {
    try {
      const response = await axiosApi.post('/addClinic', {
        name,
        suburb,
        phone,
        email,
        bookingURL,
      });
    } catch (err) {
      console.log('oops');
    }
  };

export const { Provider, Context } = createDataContext(
  ClinicReducer,
  { getAllClinics, addClinic, searchClinics, getClinicNames },
  [],
);
