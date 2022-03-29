import { combineReducers } from 'redux';

// Import List of Reducers
import { NearRPCReducer } from './NearRPCReducer/NearRPCReducer';

export const rootReducer = combineReducers({
	NearRPCReducer,
});
