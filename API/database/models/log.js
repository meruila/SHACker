/*******************************
 * 
 * log.js is where the LogSchema is defined.
 *
 * ATTRIBUTES:
 * 		time: time and date of edit
 * 		recordNumber: the student number of the record that was edited
 * 		description: description of the edit made
 * 		editor: the email of the editor 
 *
 ********************************/
 const mongoose = require('mongoose');

 // Log Schema
 const LogSchema = new mongoose.Schema({
	 time: {type: String, required: true},
	 recordNumber: {type: String, required: true},
	 description: {type: String, required: true},
	 editorEmail: {type: String, required: true}
 },
	 {collection: 'log'});
 
 module.exports = mongoose.model('Log', LogSchema);