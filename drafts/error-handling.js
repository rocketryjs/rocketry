/*
	Module dependencies
*/
const pino = require("pino")();


process.on("uncaughtException", function(error) {
	pino.error(error);
	if (!error.isOperational) {
		process.exit(1);
	}
});


const info = function(info) {
	pino.info(info);
};
const error = function(error) {
	pino.error(error);
};


module.exports = {
	error
};
