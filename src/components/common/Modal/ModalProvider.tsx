import { FC, ReactNode } from 'react';
import Modal from 'react-modal';

// Import types
import { IChildren } from 'types/types';

interface IModalProvider {
	closeModal: () => void;
	isOpen: boolean;
	children: ReactNode;
}

export const ModalProvider: FC<IModalProvider> = ({ children, closeModal, isOpen = false }) => {
	Modal.setAppElement('#root');

	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: 0,
			padding: 0,
		},
		overlay: {
			background: 'rgba(44, 45, 46, 0.6)',
		},
	};

	return (
		<Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
			{children}
		</Modal>
	);
};
