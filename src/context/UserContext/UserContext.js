import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const UserReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_user':
      return { ...state, details: payload };
    case 'get_child':
      return { ...state, childDetails: payload };
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
    case 'set_profile_picture':
      return { ...state, selectedProfilePicture: payload };
    // NEW: Add profile switching cases
    case 'set_current_account':
      return {
        ...state,
        currentAccountType: payload.accountType,
        currentAccountData: payload.accountData,
      };
    case 'load_current_account':
      return {
        ...state,
        currentAccountType: payload.accountType,
        currentAccountData: payload.accountData,
      };
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

      // Always add the hardcoded fields when getting user data
      const userDataWithHardcodedFields = {
        ...response.data,
        address: await getStoredField('userAddress') || '',
        emergencyContactName: await getStoredField('emergencyContactName') || '',
        emergencyContactPhone: await getStoredField('emergencyContactPhone') || ''
      };

      dispatch({ type: 'get_user', payload: userDataWithHardcodedFields });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
};

const getChild = dispatch => {
  return async () => {
    const id = await AsyncStorage.getItem('id');
    try {
      // First, get the parent user's data which should contain children array
      const parentResponse = await axiosApi.get(`/user/${id}`);
      const childrenIds = parentResponse.data.children; // Assuming the field is called 'children'

      if (!childrenIds || childrenIds.length === 0) {
        dispatch({ type: 'get_child', payload: [] });
        return;
      }

      // Fetch all children's data
      const childrenPromises = childrenIds.map(childId =>
        axiosApi.get(`/user/${childId}`)
      );

      const childrenResponses = await Promise.all(childrenPromises);

      // Extract the data from each response and add hardcoded fields
      const childrenData = await Promise.all(
        childrenResponses.map(async (response) => ({
          ...response.data,
          address: await getStoredField(`userAddress_${response.data._id}`) || '',
          emergencyContactName: await getStoredField(`emergencyContactName_${response.data._id}`) || '',
          emergencyContactPhone: await getStoredField(`emergencyContactPhone_${response.data._id}`) || ''
        }))
      );

      dispatch({ type: 'get_child', payload: childrenData });
    } catch (error) {
      console.error('Error fetching children data:', error);
      dispatch({ type: 'get_child', payload: [] });
    }
  };
};

// Helper function to get stored fields
const getStoredField = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting stored field ${key}:`, error);
    return null;
  }
};

// Helper function to store fields
const storeField = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing field ${key}:`, error);
  }
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

const setProfilePicture = dispatch => {
  return async (pictureIndex) => {
    try {
      await AsyncStorage.setItem('selectedProfilePicture', pictureIndex.toString());
      dispatch({ type: 'set_profile_picture', payload: pictureIndex });
    } catch (error) {
      console.error("Error saving profile picture: ", error);
    }
  };
};

const getProfilePicture = dispatch => {
  return async () => {
    try {
      const savedPicture = await AsyncStorage.getItem('selectedProfilePicture');
      if (savedPicture !== null) {
        dispatch({ type: 'set_profile_picture', payload: parseInt(savedPicture) });
      }
    } catch (error) {
      console.error('Error loading profile picture: ', error);
    }
  }
}

// NEW: Profile switching functions
const setCurrentAccount = dispatch => {
  return async (accountType, accountData) => {
    try {
      // Store the current account in AsyncStorage for persistence
      await AsyncStorage.setItem('currentAccountType', accountType);
      await AsyncStorage.setItem('currentAccountData', JSON.stringify(accountData));

      dispatch({
        type: 'set_current_account',
        payload: { accountType, accountData }
      });
    } catch (error) {
      console.error('Error setting current account:', error);
    }
  };
};

const loadCurrentAccount = dispatch => {
  return async () => {
    try {
      const savedAccountType = await AsyncStorage.getItem('currentAccountType');
      const savedAccountData = await AsyncStorage.getItem('currentAccountData');

      if (savedAccountType && savedAccountData) {
        dispatch({
          type: 'load_current_account',
          payload: {
            accountType: savedAccountType,
            accountData: JSON.parse(savedAccountData)
          }
        });
      } else {
        // Default to main account if nothing is saved
        dispatch({
          type: 'load_current_account',
          payload: {
            accountType: 'current',
            accountData: null
          }
        });
      }
    } catch (error) {
      console.error('Error loading current account:', error);
      // Default to main account on error
      dispatch({
        type: 'load_current_account',
        payload: {
          accountType: 'current',
          accountData: null
        }
      });
    }
  };
};

const updateUser = dispatch => {
  return async (formData) => {
    try {
      const id = await AsyncStorage.getItem('id');
      console.log('Updating user with ID:', id);

      // Get current user data to compare emails
      const currentUserResponse = await axiosApi.get(`/user/${id}`);
      const currentEmail = currentUserResponse.data.email;
      const newEmail = formData.email.trim().toLowerCase();

      // Basic email format validation
      if (!formData.email.includes('@') || !formData.email.includes('.')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      // Only check if email exists if the user is changing their email
      if (currentEmail.toLowerCase() !== newEmail) {
        console.log('Email is being changed, checking if new email exists...');

        // Check if the new email already exists
        try {
          const emailCheckResponse = await axiosApi.get(`/checkEmail/${newEmail}`);
          if (emailCheckResponse.data.exists) {
            console.log('Email already exists');
            return { success: false, error: 'Email already exists. Please choose a different email.' };
          }
        } catch (emailCheckError) {
          console.error('Error checking email:', emailCheckError);
          return { success: false, error: 'Error validating email. Please try again.' };
        }
      } else {
        console.log('Email unchanged, skipping email validation');
      }

      // Only send email to database
      const updateData = { email: formData.email };
      console.log('Update data (email only):', updateData);

      const response = await axiosApi.put(`/updateUser/${id}`, updateData);
      console.log('Update response:', response.data);

      if (response.data.error === "") {
        // Store the hardcoded fields in AsyncStorage for persistence
        await storeField('userAddress', formData.address || '');
        await storeField('emergencyContactName', formData.emergencyContactName || '');
        await storeField('emergencyContactPhone', formData.emergencyContactPhone || '');

        // Get current user data
        const userResponse = await axiosApi.get(`/user/${id}`);
        console.log('Fetched user data:', userResponse.data);

        // Merge with the stored hardcoded fields
        const updatedUserData = {
          ...userResponse.data,
          address: formData.address || '',
          emergencyContactName: formData.emergencyContactName || '',
          emergencyContactPhone: formData.emergencyContactPhone || ''
        };

        console.log('Final user data with hardcoded fields:', updatedUserData);
        dispatch({ type: 'get_user', payload: updatedUserData });
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user details' };
    }
  };
};

const changePassword = dispatch => {
  return async (currentPassword, newPassword) => {
    try {
      const id = await AsyncStorage.getItem('id');

      const response = await axiosApi.put(`/changePassword/${id}`, {
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      // If no error is thrown, the password was changed successfully
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);

      // Check if it's a 422 error (invalid current password)
      if (error.response && error.response.status === 422) {
        return { success: false, error: error.response.data.error || 'Invalid current password' };
      }

      return { success: false, error: 'Failed to change password. Please try again.' };
    }
  };
};

const updateClinic = dispatch => {
  return async (clinicId, privacyConsent = null) => {
    try {
      const id = await AsyncStorage.getItem('id');
      
      const requestBody = {
        clinic: clinicId
      };
      
      // Include privacy consent if provided
      if (privacyConsent !== null) {
        requestBody.privacyConsent = privacyConsent;
      }
      
      console.log('UpdateClinic - User ID:', id, 'Clinic ID:', clinicId, 'Request body:', requestBody);
      
      const response = await axiosApi.put(`/updateUserClinic/${id}`, requestBody);
      console.log('UpdateClinic - Response:', response.data);
      
      if (response.data.error === "") {
        // Refresh clinic data after successful update
        const userClinic = await axiosApi.get(`/getUserClinic/${id}`);
        console.log('UpdateClinic - User clinic data:', userClinic.data);
        const clinicID = userClinic.data.clinic;
        const clinicResponse = await axiosApi.get(`/getDentalClinic/${clinicID}`);
        console.log('UpdateClinic - New clinic data:', clinicResponse.data);
        dispatch({ type: 'get_clinic', payload: clinicResponse.data.clinic });

        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
      return { success: false, error: 'Failed to update clinic. Please try again.' };
    }
  };
};

export const { Provider, Context } = createDataContext(
  UserReducer,
  {
    getUserDOB,
    getNhiAndAppointments,
    getDentalClinic,
    getUser,
    getChild,
    checkCanDisconnect,
    disconnectChild,
    getAllImages,
    setProfilePicture,
    getProfilePicture,
    updateUser,
    changePassword,
    updateClinic,
    setCurrentAccount,
    loadCurrentAccount,
  },
  {
    appointments: [],
    clinic: null,
    details: {},
    canDisconnect: null,
    images: [],
    selectedProfilePicture: null,
  },
);