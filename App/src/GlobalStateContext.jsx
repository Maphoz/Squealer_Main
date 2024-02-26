// GlobalStateContext.js
import React, { createContext, useContext, useReducer } from 'react';
import cookies from './utlis/cookie';

const GlobalStateContext = createContext();

const initialState = {
  dataUpdated: {
    profileData: false,
    notificationData: false,
    homeData: false,
    searchData: false,
    buyCharacterData: false,
    feedData: false,
    channelData: false,
  },
  unregisteredUser: cookies.get('accessToken') == null,
  loggedId: null
};


const actionTypes = {
  TOGGLE_DATA_UPDATE: 'TOGGLE_DATA_UPDATE',
  SET_REGISTERED_USER: 'SET_REGISTERED_USER',
  SET_NEW_FRIEND: 'SET_NEW_FRIEND',
  SET_ALL_TRUE: 'SET_ALL_TRUE',
  SET_LOGGED_ID: 'SET_LOGGED_ID',
  SET_SELECTED_TRUE: 'SET_SELECTED_TRUE',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_REGISTERED_USER:
      return {
        ...state,
        unregisteredUser: false,
        loggedId: action.payload
      };
    case actionTypes.SET_NEW_FRIEND:
        return {
          ...state,
          dataUpdated: {
            ...state.dataUpdated,
            profileData: true
          }
        };
    case actionTypes.SET_NEW_CHANNEL:
          return {
            ...state,
            dataUpdated: {
              ...state.dataUpdated,
              profileData: true
            }
      };
      case actionTypes.UPDATE_CHANNEL:
        return {
          ...state,
          dataUpdated: {
            ...state.dataUpdated,
            channelData: true
          }
    };

    case actionTypes.SET_NEW_HISTORY:
        return {
          ...state,
          dataUpdated: {
            ...state.dataUpdated,
            profileData: true
          }
    };

    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        dataUpdated: {
          ...state.dataUpdated,
          profileData: true
        }
  };


    case actionTypes.SET_ALL_TRUE:
      return {
        ...state,
        dataUpdated: Object.fromEntries(
          Object.keys(state.dataUpdated).map((key) => [key, true])
        ),
      };
    case actionTypes.TOGGLE_DATA_UPDATE:
      return {
        ...state,
        dataUpdated: {
          ...state.dataUpdated,
          [action.payload]: false,
        },
      };
    case actionTypes.SET_SELECTED_TRUE:
        const keysToSetTrue = action.payload;
  
        return {
          ...state,
          dataUpdated: {
            ...state.dataUpdated,
            // Set only the specified keys to true
            ...Object.fromEntries(keysToSetTrue.map((key) => [key, true])),
          },
        };
    default:
      return state;
  }
};

const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export { GlobalStateProvider, useGlobalState, actionTypes };
