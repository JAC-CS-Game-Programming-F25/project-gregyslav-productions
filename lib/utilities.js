export function getRandomPositiveNumber(min, max) {
	return (Math.random() * (max - min) + min);
}

export function getRandomNumber(min, max) {
	return getRandomPositiveNumber(min, max) * (Math.random() < 0.5 ? -1 : 1);
}

export function getRandomNegativeNumber(min, max) {
	return getRandomPositiveNumber(min, max) * -1;
}
