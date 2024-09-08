import { combineReducers } from 'redux';
import userReducer from "../services/userSlice";
import { persistReducer } from 'redux-persist'; // Ensure this is correct
import storage from 'redux-persist/lib/storage'; // Correct import path

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const rootReducer = combineReducers({
    user: persistedReducer,
});

export default rootReducer;
