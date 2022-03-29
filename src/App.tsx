import { Normalize } from 'styled-normalize';
import { Provider } from 'react-redux';

// Import store
import { store } from 'store';

// Import pages
import { MainPages } from 'pages/MainPages';

export const App = () => {
	return (
		<Provider store={store}>
			<Normalize />
			<MainPages />
		</Provider>
	);
};
