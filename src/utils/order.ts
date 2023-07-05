export const numberToLenght = (value: number): number => {
	const arr = value.toString().split('.');
	if (arr.length === 1) {
		return 0;
	}
	return arr[1].length;
};
