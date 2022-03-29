import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import Root Reducer
import { rootReducer } from 'store/reducers/rootReducer';

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = composeWithDevTools(middlewareEnhancer);

export const store = createStore(rootReducer, undefined, composedEnhancers);
