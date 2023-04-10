function route(app) {
	app.use('/user', require('./user.router'));
}
module.exports = route;
