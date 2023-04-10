function calculateDistance(coord1, coord2) {
	const [x1, y1] = coord1.split(':').map(Number);
	const [x2, y2] = coord2.split(':').map(Number);
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

module.exports = { calculateDistance };
