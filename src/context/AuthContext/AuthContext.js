import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosApi from '../../api/axios';
import { navigate } from '../../navigationRef';
import createDataContext from '../createDataContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'signin':
      return {
        errorMessage: '',
        token: action.payload.token,
        id: action.payload.id,
      };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    case 'change_password':
      return { ...state, errorMessage: action.payload };
    case 'signout':
      return { token: null, errorMessage: '' };
    case 'user':
      return { errorMessage: 'Hello', token: action.payload };
    case 'getchildaccounts':
      return {
        errorMessage: '',
        children: action.payload.children,
      };
    default:
      return state;
  }
};

const user = dispatch => async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axiosApi.post('/user', { token });
    dispatch({ type: 'user', payload: response.data.user });
  } catch (err) {}
};

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const id = await AsyncStorage.getItem('id');
  const parentId = await AsyncStorage.getItem('parentId');

  console.log('tryLocalSignin - token:', token);
  console.log('tryLocalSignin - id:', id);
  console.log('tryLocalSignin - parentId:', parentId);

  try {
    const autoLoginResponse = await axiosApi.post('/qrAutoLogin', {});
    
    await AsyncStorage.setItem('token', autoLoginResponse.data.token);
    await AsyncStorage.setItem('id', autoLoginResponse.data.id);
    
    dispatch({ 
      type: 'signin', 
      payload: { 
        token: autoLoginResponse.data.token, 
        id: autoLoginResponse.data.id 
      } 
    });
    navigate('mainFlow', { screen: 'AccountFlow' });
    return;
  } catch (autoLoginErr) {
    console.log('Auto-login not available, proceeding with normal login');
  }

  if (token) {
    try {
      const isChildResponse = await axiosApi.get(`/isChild/${id}`);
      console.log('isChild response:', isChildResponse.data);

      const isChild = isChildResponse.data.isChild;
      console.log('isChild:', isChild);

      if (id) {
        if (!isChild) {
          dispatch({ type: 'signin', payload: { token, id } });
          navigate('mainFlow', { screen: 'AccountFlow' });
        } else {
          navigate('Welcome');
        }
      } else {
        navigate('Welcome');
      }
    } catch (err) {
      console.error('Error fetching isChild status:', err);
      navigate('loginFlow');
    }
  } else {
    navigate('Welcome');
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

// make an api request to sign up with user details
const signUp =
  dispatch =>
  async ({ firstname, lastname, email, nhi, password, dob, clinic }) => {
    try {
      const parentid = await AsyncStorage.getItem('id');
      if (parentid === null) {
        const response = await axiosApi.post('/signup', {
          firstname,
          lastname,
          email,
          nhi,
          password,
          dob,
          clinic,
        });
        console.log("Signup success:", response.data);
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('id', response.data.id);

        dispatch({
          type: 'signin',
          payload: { token: response.data.token, id: response.data.id },
        });
        console.log("Navigating to mainFlow");
        navigate('mainFlow', { screen: 'AccountFlow' });

      } else {
        const response = await axiosApi.post('/signupchild', {
          firstname,
          lastname,
          email,
          nhi,
          password,
          dob,
          clinic,
          parent: parentid,
        });
        console.log("Sign Up Child Success:", response.data);
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('id', response.data.id);
        await AsyncStorage.setItem('parentid', parentid);
        navigate('childFlow', { screen: 'AccountFlow' });
      }
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Invalid Sign Up Details',
      });
    }
  };

const getChildAccounts = dispatch => async () => {
  try {
    const id = await AsyncStorage.getItem('id');
    const response = await axiosApi.get(`/getchildaccounts/${id}`);
    dispatch({
      type: 'getchildaccounts',
      payload: { children: response.data },
    });
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Error retrieving child accounts',
    });
  }
};

const signupchild =
  dispatch =>
  async ({ firstname, lastname, email, mobile, password, dob, clinic, parent }) => {
    try {
      const response = await axiosApi.post('/signupchild', {
        firstname,
        lastname,
        email,
        mobile,
        password,
        dob,
        clinic,
        parent,
      });
      // await AsyncStorage.setItem("token", response.data.token);
      // dispatch({ type: "signin", payload: response.data.token });
      navigate('Account');
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Invalid Sign Up Details',
      });
    }
  };

const signin =
  dispatch =>
  async ({ emailOrNhi, password }) => {
    try {
      const response = await axiosApi.post('/signin', { emailOrNhi, password });

      const userDetails = response.data.user;

      // Master admin always has access
      const isMasterAdmin = userDetails.nhi?.toUpperCase() === 'ABY0987';
      const hasAccess = isMasterAdmin || userDetails.restricted_access === true;

      if (!hasAccess) {
        dispatch({
          type: 'add_error',
          payload: 'Access denied, please contact admin.',
        });
        return; // Stop here - don't log them in
      }

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('id', response.data.id);
      dispatch({
        type: 'signin',
        payload: { token: response.data.token, id: response.data.id },
      });

      // navigate('AccountFlow');
      navigate('mainFlow', { screen: 'AccountFlow' });
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Invalid Login Details',
      });
    }
  };

  const completeRegistration = dispatch => async ({ signupCode, nhi, email, password, patientId }) => {
  try {
    const response = await axiosApi.post('/completeRegistration', {
      signupCode,
      nhi,
      email,
      password,
      patientId
    });

    console.log("Registration completion success:", response.data);

    // Store token and ID in AsyncStorage
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('id', response.data.id);

    // Update state with signin
    dispatch({
      type: 'signin',
      payload: {
        token: response.data.token,
        id: response.data.id
      },
    });

    // Navigate to main app
    console.log("Navigating to mainFlow after registration completion");
    navigate('mainFlow', { screen: 'AccountFlow' });

  } catch (err) {
    console.error("Registration completion failed:", err.response?.data || err.message);
    dispatch({
      type: 'add_error',
      payload: err.response?.data?.error || 'Registration completion failed',
    });
    // Re-throw the error so the component can handle it
    throw err;
  }
};

const updateUser = dispatch => {
  return async ({ firstname, lastname, email, mobile, dob }) => {
    try {
      const id = await AsyncStorage.getItem('id');
      const response = await axiosApi.put(`/updateUser/${id}`, {
        firstname,
        lastname,
        email,
        mobile,
        dob,
      });

      dispatch({ type: 'clear_error_message' });
      // navigate('UserAccount');
      navigate('mainFlow', {
        screen: 'AccountFlow',
        params: { screen: 'UserAccount' },
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'add_error',
        payload: 'Error While Changing Details',
      });
    }
  };
};

const updateUserClinic = dispatch => {
  return async ({ clinic }) => {
    try {
      const id = await AsyncStorage.getItem('id');
      const response = await axiosApi.put(`/updateUserClinic/${id}`, { clinic });

      dispatch({ type: 'clear_error_message' });
      // navigate('UserAccount');
      navigate('mainFlow', {
        screen: 'AccountFlow',
        params: { screen: 'UserAccount' },
      });
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Error While Changing Clinic',
      });
    }
  };
};

const changePassword = dispatch => {
  return async ({ oldPassword, newPassword }) => {
    try {
      const id = await AsyncStorage.getItem('id');
      const response = await axiosApi.put(`/changePassword/${id}`, {
        oldPassword,
        newPassword,
      });

      dispatch({ type: 'clear_error_message' });
      // navigate('UserAccount');
      navigate('mainFlow', {
        screen: 'AccountFlow',
        params: { screen: 'UserAccount' },
      });
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'Error While Changing Password',
      });
    }
  };
};

const signout = dispatch => async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('id');
  await AsyncStorage.removeItem('parentid');
  dispatch({ type: 'signout' });
  navigate('loginFlow');
};

const findUserByEmailOrNhi = dispatch => async ({ emailOrNhi }) => {
  try {
    const response = await axiosApi.post('/findUserByEmailOrNhi', {
      emailOrNhi: emailOrNhi.toLowerCase()
    });

    return response.data;
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err.response?.data?.error || 'Error finding user',
    });
    throw err;
  }
};

const verifySignupCodeForReset = dispatch => async ({ userId, signupCode }) => {
  try {
    const response = await axiosApi.post('/verifySignupCodeForReset', {
      userId,
      signupCode
    });
    console.log('verifySignupCodeForReset response:', response.data);
    console.log('Response valid property:', response.data.valid);
    return response.data;
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err.response?.data?.error || 'Error verifying code',
    });
    throw err;
  }
};
const resetPassword = dispatch => async ({ userId, newPassword }) => {
  try {
    const response = await axiosApi.post('/resetPassword', {
      userId,
      newPassword
    });

    dispatch({ type: 'clear_error_message' });
    return response.data;
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err.response?.data?.error || 'Error resetting password',
    });
    throw err;
  }
};

const qrAutoLogin = dispatch => async () => {
  try {
    const response = await axiosApi.post('/qrAutoLogin', {});
    
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('id', response.data.id);
    
    dispatch({
      type: 'signin',
      payload: { token: response.data.token, id: response.data.id },
    });
    
    navigate('mainFlow', { screen: 'AccountFlow' });
    
  } catch (err) {
    console.error('QR auto-login error:', err);
    dispatch({
      type: 'add_error',
      payload: err.response?.data?.error || 'Auto-login failed',
    });
  }
};

export const { Provider, Context } = createDataContext(
    authReducer,
    {
      signUp,
      signin,
      signout,
      clearErrorMessage,
      tryLocalSignin,
      user,
      getChildAccounts,
      signupchild,
      updateUser,
      updateUserClinic,
      changePassword,
      completeRegistration,
      findUserByEmailOrNhi,
      verifySignupCodeForReset,
      resetPassword,
      qrAutoLogin,
    },
    { token: null, errorMessage: '', id: null },
);