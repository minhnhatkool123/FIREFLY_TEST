const validateCoordinate = coordinate => {
	const pattern = /^\d{3}:\d{3}$/;
	return pattern.test(coordinate);
};

module.exports = { validateCoordinate };
