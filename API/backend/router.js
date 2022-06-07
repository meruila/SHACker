// This is the router file for the SHACker app.
// This will handle the post requests. 
// For more info about POST requests, refer to this resource: https://www.w3schools.com/tags/ref_httpmethods.asp

const controller = require('./controller'); 

module.exports = (app) => {
	app.post("/sign",controller.sign);
	app.post("/login",controller.login);
	app.post("/unsign",controller.unsign);
	app.post("/addUser",controller.addUser);
	app.post("/isAdmin",controller.isUserAdmin);
	app.post("/viewLogs",controller.viewLogs);
	app.post("/deleteUser",controller.deleteUser);
	app.post("/adminExists",controller.adminExists);
	app.post("/getAllUsers",controller.getAllUsers);
	app.post("/viewSummary",controller.viewSummary);
	app.post("/adminSignUp",controller.adminSignUp);
	app.post("/promoteUser",controller.promoteUser);
	app.post("/viewProfile",controller.viewProfile);
	app.post("/editProfile",controller.editProfile);
	app.post("/homeRecords",controller.homeRecords);
	app.post("/deleteAllLogs",controller.deleteAllLogs);
	app.post("/changePassword",controller.changePassword);
	app.post("/deleteAllRecords", controller.deleteAllRecords);
	app.post("/checkForWarnings",controller.checkForWarnings);
	app.post("/addStudentRecord",controller.addStudentRecord);
	app.post("/getStudentRecords",controller.getStudentRecords);
	app.post("/viewStudentRecord",controller.viewStudentRecord);
	app.post("/updateStudentRecord",controller.updateStudentRecord);
	app.post("/deleteStudentRecord",controller.deleteStudentRecord);
}