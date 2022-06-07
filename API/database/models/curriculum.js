/*******************************
 *
 * curriculum.js is where the DegreeSchema is defined.
 *
 * ATTRIBUTES:
 *  - DegreeSchema:
 * 		name: name of the degree program
 * 		major: major of the degree program
 * 			- limited to SP, Thesis and MST majors only
 *      subjects: reference to Subject schema,
 *			- list of subjects that need to be taken by the student to finish their degree
 * 		specializationUnits: number of specialization units to be taken by the student
 * 			- specialization units are free electives, majors, and specialization courses needed by the student but are not explicitly stated in the curriculum
 * 			- e.g. BSCS has 15-18 free electives that may be composed of Computer Science, Management, Statistics, Biology, Agriculture, Physics courses
 *      geElectiveUnits: number of GE elective units to be taken by the student
 *      maxThesisIterations: maximum number of thesis iterations
 *
 *
 ********************************/

 const mongoose = require('mongoose');

 // Degree Program Schema
 const DegreeSchema = new mongoose.Schema({
	 name: {
		 type: String,
		 required: true,
	 },
	 major : {
		 type: String
	 },
	 subjects: {
		 type: [[mongoose.ObjectId]],
		 required: true,
	 },
	 specializationUnits: {
		 type: Number,
		 required: true,
	 },
	 geElectiveUnits: {
		 type: Number,
		 required: true,
	 },
	 maxThesisIterations: {
		 type: Number,
		 required: true,
	 },
 },
	 { collection : 'curriculum' }
 );

 module.exports = mongoose.model("Degree", DegreeSchema);