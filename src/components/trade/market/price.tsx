import React from 'react';

export const Price: React.FC<{ value: number }> = (props) => {
	return <div className="text-xl px-7 text-trade-red">{`${props.value}`}</div>;
};
