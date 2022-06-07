/*******************************
 * 
 * STUDENT RECORD SCHEMA
 * Attributes:
 *      name
 *          - last                  (String)
 *          - first                 (String)
 *      course                      (String)
 *      studentNo                   (String)
 *      Total Units Taken           (String)
 *      GWA                         (String)
 *      records                     (Array of Semesters)
 *          - sem                   (String)
 *          - year                  (String)
 *          - subjects              (Array)
 *          - units                 (String)
 *          - status                (String)
 *      verifiedBy                  (Array of String)
 *      remarks                     (Array of String)
 * 
********************************/

const mongoose = require("mongoose");       

// //semester schema
const Semester_Schema = new mongoose.Schema({
    sem: {
        type: String,       // originally Number, made it String to accommodate midyear (M)
        required: true
    },
    year: {
        type: String,
        required: true
    },
    subjects: {
        type: [[String]]
    },
    units: {
        type: String,        // originally Number
        required: true
    },
    status: {
        type: String,
        required: true
    }
});
//#endregion

//student record schema
const StudentRecord_Schema = new mongoose.Schema({
    //#region single-valued attribute
    name: {
        last: {
            type: String,
            required: true
        },
        first: {
            type: String,
            required: true
        }
    },
    course: {                              
        type: String,                  
        required: true,
    },
    studentNo : {
        type: String,                               
        unique: true,                               
        required: true                             
    }, 
    records: {
        type: [Semester_Schema],
        required: true
    },
    totalUnitsTaken: {
        type: Number,
        required: true
    },
    totalUnitsRequired: {
        type: Number,
        required: true
    },
    GWA: {
        type: Number,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    
    // emails of users that signed the student record
    verifiedBy: {
        type: [String]
    },

    // comments of users on the student record
    remarks: {
        type: [String]
    }
},
{ collection : 'student-record' });

module.exports = mongoose.model("StudentRecord", StudentRecord_Schema);