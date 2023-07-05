import React from 'react';
import { OrderlyProvider } from '@/hooks/orderlyContext';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { WrapRootElementBrowserArgs } from 'gatsby';

export default ({ element, props }: WrapRootElementBrowserArgs) => {
	return (
		<Provider store={store}>
			<OrderlyProvider>{element}</OrderlyProvider>
		</Provider>
	);
};
