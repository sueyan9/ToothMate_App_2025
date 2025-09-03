import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosApi from '../../api/axios';
import createDataContext from '../createDataContext';

const FAVOURITES_KEY = 'user_favourites';

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
    case 'update_favourites_from_storage':
      return {
        ...state,
        educationData: state.educationData.map(item => ({
          ...item,
          favourite: payload.favouriteIds.includes(item._id)
        }))
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

const getEducationContent = dispatch => {
  return async () => {
    try {
      const response = await axiosApi.get('/education');
      const educationData = response.data;
      
      const favouriteIds = await getStoredFavourites();
      
      const educationDataWithFavourites = educationData.map(item => ({
        ...item,
        favourite: favouriteIds.includes(item._id)
      }));
      
      dispatch({ 
        type: 'get_education_content', 
        payload: educationDataWithFavourites 
      });
    } catch (error) {
      console.error('Error fetching education content:', error);
    }
  };
};

// Add new education content
const addEducationContent = dispatch => {
  return async (educationItem) => {
    try {
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
      const newFavourites = await toggleFavouriteInStorage(id);
      
      dispatch({ type: 'toggle_favourite', payload: { id } });
      
      return { success: true, favouriteIds: newFavourites };
    } catch (error) {
      console.error('Error toggling favourite locally:', error);
      throw error;
    }
  };
};

const syncFavouritesFromStorage = dispatch => {
  return async () => {
    try {
      const favouriteIds = await getStoredFavourites();
      
      dispatch({ 
        type: 'update_favourites_from_storage', 
        payload: { favouriteIds } 
      });
    } catch (error) {
      console.error('Error syncing favourites from storage:', error);
    }
  };
};

const getStoredFavourites = async () => {
  try {
    const favourites = await AsyncStorage.getItem(FAVOURITES_KEY);
    if (favourites === null) {
      await saveFavouritesToStorage([]);
      return [];
    }
    return JSON.parse(favourites);
  } catch (error) {
    console.error('Error getting favourites from storage:', error);
    return [];
  }
};

const saveFavouritesToStorage = async (favouriteIds) => {
  try {
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favouriteIds));
  } catch (error) {
    console.error('Error saving favourites to storage:', error);
  }
};

const toggleFavouriteInStorage = async (itemId) => {
  try {
    const currentFavourites = await getStoredFavourites();
    const isCurrentlyFavourite = currentFavourites.includes(itemId);
    
    let newFavourites;
    if (isCurrentlyFavourite) {
      newFavourites = currentFavourites.filter(id => id !== itemId);
    } else {
      newFavourites = [...currentFavourites, itemId];
    }
    
    await saveFavouritesToStorage(newFavourites);
    return newFavourites;
  } catch (error) {
    console.error('Error toggling favourite in storage:', error);
    throw error;
  }
};

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
    searchEducationContent,
    syncFavouritesFromStorage
  },
  { educationData: [], ageSpecificContent: [] }
);