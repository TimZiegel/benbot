export const getRandom = array => {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
};

export const isImageUrl = url => {
	return (
		url &&
		url.match(/.(jpg|png|gif|gifv)/) &&
		url.match(/(i.imgur.com|i.redd.it|gfycat.com)/)
	);
};
