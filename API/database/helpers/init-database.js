const mongoose = require('mongoose');

/*
	init-database initializes the data for the CAS subjects and 2018 curricula
*/

const curriculum = require('../curriculum/degree_programs');
const subj = require('../curriculum/subjects');
const Subject = require('../models/subject.js');
const Degree = require('../models/curriculum');

const loadSubjects = async () => {
	try {
		const subjectList = await Subject.find({});
		if (subjectList.length == 0) {
			for (let i in subj) {
				await Subject.create(subj[i]);
			}
			// console.log("Loaded subjects in db");
		} else {
			// console.log("Subjects already in db");
		}
	} catch (e) {
		// console.log(e);
	}
};

const loadCurricula = async() => {
	try {
		const curriculumList = await Degree.find({});
		if (curriculumList.length == 0) {
			for (let i in curriculum) {
				await Degree.create(curriculum[i]);
			}
			// console.log("Loaded curricula in db");
		} else {
			// console.log("All curriculum already in db");
		}
	} catch (e) {
		// console.log(e);
	}
}

exports.loadData = async() => {
	await loadSubjects();
	await loadCurricula();
}
