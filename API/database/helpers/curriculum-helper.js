const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;

/*
    curriculum-helper retrieves the curriculum from the database and converts it to an array of degree program objects
*/

const Subject = require("../models/subject");
const Degree = require("../models/curriculum");

exports.checkCurriculum = async(name) => {
    try {
        let degreeProgram = [];
        const out = await Degree.find({name: name});
        for (let i = 0; i < out.length; i++) {
            let degree = {
                _id: out[i]._id,
                name: out[i].name,
                // majors considered are only SP, Thesis, and MST majors. A major can be left blank if they do not apply to any of the three previously mentioned
                major: out[i].major
            }
            let array_input = out[i].subjects;
            let array_output = []

            for (let j = 0; j < array_input.length; j++) {
                let choices = {
                    "code": [],
                    "units": 0
                };
                // this is to consider subjects with options to them (e.g. HIST 1/KAS 1)
                for (let k = 0; k < out[i].subjects[j].length; k++) {

                    let subject_object = new ObjectId(out[i].subjects[j][k]);
                    const raw_subj = await Subject.findById(subject_object);
                    const subj = { code: raw_subj.code, units: raw_subj.units };
                    choices.units = subj.units;
                    choices.code.push(subj.code);
                }
                array_output.push(choices);
            }

            degree.subjects = array_output;
            // specializationUnits are the total units of majors, free electives, and specialization courses needed in the curriculum but are not explicitly stated
            // (e.g. 15-18 units of free electives for BSCS) 
            degree.specializationUnits = out[i].specializationUnits;
            // GE elective units are the units of subjects listed in CAS OCS Form 19 (e.g. HUM 3, KAS 4, MATH 10, PHILARTS 1, PHLO 1)
            degree.geElectiveUnits = out[i].geElectiveUnits;
            // maxThesisIterations refer to the maximum of iterations the student can take their terminal course (i.e. Thesis, SP)
            degree.maxThesisIterations = out[i].maxThesisIterations;

            degreeProgram.push(degree);
        }
        return degreeProgram;
        
    } catch(e){
        console.log(e);
    }
}