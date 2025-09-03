import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const EducationReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'get_education_content':
      return { ...state, educationData: payload };
    case 'get_age_content':
      return { ...state, ageSpecificContent: payload };
    case 'toggle_favourite':
      return {
        ...state,
        educationData: state.educationData.map(item =>
          item._id === payload.id
            ? { ...item, favourite: !item.favourite }
            : item
        )
      };
    case 'update_education_item':
      return {
        ...state,
        educationData: state.educationData.map(item =>
          item._id === payload._id ? payload : item
        )
      };
    case 'add_education_content':
      return {
        ...state,
        educationData: [...state.educationData, payload]
      };
    default:
      return state;
  }
};

// Get all education content from 'education' collection
const getEducationContent = dispatch => {
  return async () => {
    try {
      const response = await axiosApi.get('/education');
      dispatch({ type: 'get_education_content', payload: response.data });
    } catch (error) {
      console.error('Error fetching education content:', error);
    }
  };
};

// Add new education content
const addEducationContent = dispatch => {
  return async (educationItem) => {
    try {
      // Structure matches your data format:
      // { _id, topic, category, recommended, favourite, content: [] }
      const response = await axiosApi.post('/education', educationItem);
      dispatch({ type: 'add_education_content', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error adding education content:', error);
      throw error;
    }
  };
};

// Toggle favourite status for an education item
const toggleFavourite = dispatch => {
  return async (id) => {

    try {
      const testResponse = await axiosApi.put('/education/test');
      console.log('Test route response:', testResponse.data);
    } catch (testError) {
      console.error('Test route failed:', testError.response?.status);
    }
    try {
      console.log('=== CONTEXT TOGGLE FAVOURITE ===');
      console.log('Making request to:', `/updateFavourite/${id}`);
      console.log('Axios baseURL:', axiosApi.baseURL);
      console.log('Full URL would be:', `${axiosApi.defaults.baseURL}/updateFavourite/${id}`);
      
      // Let's also try to make a simple GET request first to test connectivity
      console.log('Testing basic connectivity...');
      try {
        const testResponse = await axiosApi.get('/education');
        console.log('Basic GET /education works, got', testResponse.data.length, 'items');
      } catch (testError) {
        console.error('Basic GET /education failed:', testError.response?.status);
      }
      
      const response = await axiosApi.put(`/updateFavourite/${id}`);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      dispatch({ type: 'toggle_favourite', payload: { id } });
      return response.data;
    } catch (error) {
      console.error('Error toggling favourite:', error.message);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Request URL that failed:', error.config?.url);
      console.error('Request method:', error.config?.method);
      throw error;
    }
  };
};  

// Update education content (topic, category, recommended, content array, etc.)
const updateEducationContent = dispatch => {
  return async (id, updates) => {
    try {
      const response = await axiosApi.put(`/education/${id}`, updates);
      dispatch({ type: 'update_education_item', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error updating education content:', error);
      throw error;
    }
  };
};

// Delete education content
const deleteEducationContent = dispatch => {
  return async (id) => {
    try {
      await axiosApi.delete(`/education/${id}`);
      // Refresh the list after deletion
      const response = await axiosApi.get('/education');
      dispatch({ type: 'get_education_content', payload: response.data });
    } catch (error) {
      console.error('Error deleting education content:', error);
      throw error;
    }
  };
};

// Get education content by category (Oral Care, Conditions, Treatments)
const getEducationByCategory = dispatch => {
  return async (category) => {
    try {
      const response = await axiosApi.get(`/education?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education by category:', error);
      throw error;
    }
  };
};

// Get recommended content (where recommended is not null)
const getRecommendedContent = dispatch => {
  return async () => {
    try {
      const response = await axiosApi.get('/education?recommended=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended content:', error);
      throw error;
    }
  };
};

// Get favourite content (where favourite is true)
const getFavouriteContent = dispatch => {
  return async () => {
    try {
      const response = await axiosApi.get('/education?favourite=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching favourite content:', error);
      throw error;
    }
  };
};

// Search education content by topic
const searchEducationContent = dispatch => {
  return async (searchTerm) => {
    try {
      const response = await axiosApi.get(`/education?search=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching education content:', error);
      throw error;
    }
  };
};

export const { Provider, Context } = createDataContext(
  EducationReducer,
  {
    getEducationContent,
    addEducationContent,
    toggleFavourite,
    updateEducationContent,
    deleteEducationContent,
    getEducationByCategory,
    getRecommendedContent,
    getFavouriteContent,
    searchEducationContent
  },
  { educationData: [], ageSpecificContent: [] }
);