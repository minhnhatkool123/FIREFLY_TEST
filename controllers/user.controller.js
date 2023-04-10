const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { validateCoordinate } = require('../utilities/validate-coordinate');
const { calculateDistance } = require('../utilities/calculateDistance');

const fs = require('fs');

const add = async (req, res) => {
	try {
		const { firstname, lastname, age, coordinate } = _.get(req, 'body', {});

		if (!firstname || !lastname || !age || !coordinate) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Missing required information',
			});
		}

		if (!_.isNumber(age) || age < 0 || age > 100) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Wrong age format.',
			});
		}

		if (!validateCoordinate(coordinate)) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Wrong coordinate format.',
			});
		}

		const id = uuidv4();

		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);

			const newUser = { id, firstname, lastname, age, coordinate };

			users.push(newUser);

			fs.writeFile('./users.json', JSON.stringify(users), 'utf8', err => {
				if (err) {
					return res.status(500).json({
						success: false,
						data: null,
						error: 'An error occurred. Please try again later.',
					});
				}

				return res.status(201).json({
					success: true,
					data: null,
					error: null,
				});
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

const read = async (req, res) => {
	try {
		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);
			return res.status(200).json({
				success: true,
				data: users,
				error: null,
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

const search = async (req, res) => {
	try {
		const name = _.get(req, 'query.name', null);

		if (!name) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Missing query parameter.',
			});
		}

		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);

			const filteredUsers = users.filter(user => {
				return (
					user.firstname.toLowerCase().startsWith(name.toLowerCase()) ||
					user.lastname.toLowerCase().startsWith(name.toLowerCase())
				);
			});

			const sortedUsers = filteredUsers.sort((a, b) => {
				return b.firstname.localeCompare(a.firstname);
			});

			return res
				.status(200)
				.json({ success: true, data: sortedUsers, error: null });
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

const edit = async (req, res) => {
	try {
		const id = req.params.id;
		const { firstname, lastname, age, coordinate } = _.get(req, 'body', {});

		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);
			const user = users.find(user => user.id === id);
			if (!user.id) {
				return res
					.status(404)
					.json({ success: false, data: null, error: 'User not found' });
			}

			if (firstname) {
				user.firstname = firstname;
			}

			if (lastname) {
				user.lastname = lastname;
			}

			if (age) {
				if (!_.isNumber(age) || age < 0 || age > 100) {
					return res.status(400).json({
						success: false,
						data: null,
						error: 'Wrong age format.',
					});
				}
				user.age = age;
			}

			if (coordinate) {
				if (!validateCoordinate(coordinate)) {
					return res.status(400).json({
						success: false,
						data: null,
						error: 'Wrong coordinate format.',
					});
				}
				user.coordinate = coordinate;
			}

			fs.writeFile('./users.json', JSON.stringify(users), 'utf8', err => {
				if (err) {
					return res.status(500).json({
						success: false,
						data: null,
						error: 'An error occurred. Please try again later.',
					});
				}

				return res.status(200).json({
					success: true,
					data: user,
					error: null,
				});
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;

		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);
			const userIndex = users.findIndex(user => user.id === id);
			if (userIndex === -1) {
				return res
					.status(404)
					.json({ success: false, data: null, error: 'User not found' });
			}

			users.splice(userIndex, 1);

			fs.writeFile('./users.json', JSON.stringify(users), 'utf8', err => {
				if (err) {
					return res.status(500).json({
						success: false,
						data: null,
						error: 'An error occurred. Please try again later.',
					});
				}

				return res.status(200).json({
					success: true,
					data: null,
					error: null,
				});
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

const locate = async (req, res) => {
	try {
		const n = parseInt(_.get(req, 'query.n', 0));
		const userId = _.get(req, 'query.userId', null);

		if (!userId) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Missing query parameter.',
			});
		}

		fs.readFile('./users.json', 'utf8', (err, data) => {
			if (err) {
				return res.status(500).json({
					success: false,
					data: null,
					error: 'An error occurred. Please try again later.',
				});
			}

			const users = JSON.parse(data);
			const user = users.find(u => u.id === userId);

			if (!user.id) {
				return res
					.status(404)
					.json({ success: false, data: null, error: 'User not found' });
			}

			const distances = users.map(u => ({
				...u,
				distance: calculateDistance(user.coordinate, u.coordinate),
			}));

			const sortedUsers = distances
				.filter(u => u.id !== userId)
				.sort((a, b) => a.distance - b.distance);

			const closestUsers = sortedUsers.slice(
				0,
				n === 0 ? sortedUsers.length : n,
			);
			console.log(closestUsers);

			return res.status(200).json({
				success: true,
				data: closestUsers,
				error: null,
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			data: null,
			error: 'An error occurred. Please try again later.',
		});
	}
};

module.exports = {
	add,
	read,
	search,
	edit,
	deleteUser,
	locate,
};
