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

export const isTestServer = guild => {
  return guild && guild.available && guild.id === process.env.TEST_SERVER;
};

export const isTestBot = () => {
	return process.env.NODE_ENV !== 'production';
};

export const humanize = number => {
	return (number || 0).toLocaleString('en-US');
};