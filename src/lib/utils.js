export const getRandom = array => {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
};

export const getRandomNumberBetween = (min = 0, max = 100) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isImageUrl = url => {
	return (
		url &&
		url.match(/.(jpg|png|gif|gifv)/) &&
		url.match(/(i.imgur.com|i.redd.it|gfycat.com)/)
	);
};
