// var csv = "./honors-grade.csv"

// checker for name validity
const isValidName = (name) => {
    const nameChecker = /^[a-z ,.'-]+$/i; // Lifted from: https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    return nameChecker.test(name);
}

// formats name to title case
const formatName = (name) => {
    var newName = name[0].toUpperCase() + name.substring(1).toLowerCase();
    return newName;
}

// checker for course validity
const isValidCourse = (course) => {
    const courseChecker = /^b(a|s)\s?[a-z]+$/i;
    return courseChecker.test(course); 
}

// formats course (BS STAT -> BSSTAT)
const formatCourse = (course) => {
    var newCourse = course.trim().toUpperCase();
    return newCourse;
}

// checker for student number validity
const isValidStudentNo = (studentNo) => {
    const studentNoChecker = /^\d{4}-?\d{5}$/i;
    return studentNoChecker.test(studentNo); 
}

// formats GWA -> limits digit to 5 decimal places
const formatGWA = (GWA) => {
    const GWARegex = /(\d+(\.\d{1,5})?)\d*/
    return GWA.match(GWARegex)[1]
}

// checker for grade validity
const isValidGrade = (grade) => {
    const letterChecker = /^[a-z]{1,4}$/i;
    if ((!isNaN(grade) && grade >= 0) || letterChecker.test(grade))
        return true;
    return false;
 }

// checker for subject row validity
const isValidSubject = (data) => {
    const unitsChecker = /^(\(\d+\))?\s?\d+$/;
    const decimalChecker = /^([0-9]*[.]?)[0-9]+$/;
    if (isValidGrade(data[1])  && unitsChecker.test(data[2]) && decimalChecker.test(data[3]) && decimalChecker.test(data[4])) {
        return data;
    }
    else {
        return -1;
    }
}

// checker for semester details validity (non-negative units and II/12/13 year format)
const isValidSemesterDetails = (units, semData) => {
    const semRegex = /^.{1,2}\/\d{2}\/\d{2}/
    if ((!isNaN(units) && units >= 0) && semRegex.test(semData)) return true;
    else return false;
}

// helper function to create sem record
const createSemRecord = (subjectsList, units, semData, status) => {
    // blank semester object
    var semester = {
        sem: semData,
        year: semData,
        subjects: [],
        units: units,
        status: status
    }

    var sem = semData.split("/");
    semester.subjects = subjectsList;
    
    if (sem[0].length === 1){
        if (sem[0].toUpperCase() === 'M')
            semester.sem = 'M';
        else if (sem[0] === '2')
            semester.sem = '2';
        else
            semester.sem = '1'        
    }
    if (sem[0].length === 2) semester.sem = "2";

    // acadYear = "20" + sem[1] + "-20" + nextYear.toString();
    var acadYear = '20' + sem[1] + '-20' + sem[2].trim();
    semester.year = acadYear
    
    return semester
}

exports.csvParser = data => {
    //blank student record object
    var studentRecord = {
        name: {
            last: '',
            first: ''
        },
        course: '',
        studentNo: '',
        records: [],
        totalUnitsTaken: 0,
        totalUnitsRequired: 0,
        GWA: 0.00,
        verifiedBy: []
    }

    var rows = data.split('\n');
    if (rows.length < 8){
        return {success: false, errors:{err:'[Parsing Error] Minimum data requirement not met.', row: null}, data: {}};
    }
    var nameField = rows[0].split(',');
    var unitsIndex = 0
    var subjects = []

    // add name field
    if (isValidName(nameField[0]) && isValidName(nameField[1])) {
        studentRecord.name.last = formatName(nameField[0]); 
        studentRecord.name.first = formatName(nameField[1]);
    }
    else return {success: false, errors:{err:'[Parsing Error] Student name', row: "1"}, data: {}};

    // add course field or student number
    var secondRow = rows[1].split(',')[0];
    var thirdRow = rows[2].split(',')[0];

    // look for course match at rows 2 or 3
    if (isValidCourse(secondRow)){
        studentRecord.course = formatCourse(secondRow);
    }
    else if (isValidCourse(thirdRow)){
        studentRecord.course = formatCourse(thirdRow);
    }
    else return {success: false, errors:{err:'[Parsing Error] Course.', row:"2"}, data: {}};
    
    // look for student number match at rows 2 or 3
    if (isValidStudentNo(secondRow)){
        studentRecord.studentNo = secondRow;
    }
    else if (isValidStudentNo(thirdRow)){
        studentRecord.studentNo = thirdRow;
    }
    else return {success: false, errors:{err:'[Parsing Error] Student Number', row:"3"}, data: {}};

    // row[3] is skipped since it only contains header title [COURSE, GRADE, UNITS, ...]
    // add subjects
    for (let i = 4; i < rows.length; i++) {
        var row = rows[i].split(',');
        var subject = row.slice(0, 5);
        if (subject[0] === '' || !isNaN(subject[0])) {
            unitsIndex = i;
            break;
        }
        // check subjects (first index must not be LOA or AWOL)
        if (subject[0].toUpperCase() !== 'AWOL' && subject[0].toUpperCase() !== 'LOA'){
            if (isValidSubject(subject) !== -1)
                subjects.push(subject);
            else
                // console.log("Parsing error: [Subject] " + subject + "at row" + String(i+1));
                return {success: false, errors:{err:'[Parsing Error] Subject', row: String(i+1)}, data: {}};
            }

        // create sem record
        if (row.length >= 6 && row[6] !== '\r' && row[6] !== '') {
            if(!isValidSemesterDetails(row[5], row[6])){
                // console.log("Parsing error: [Semester Details] at row " + String(i+1));
                return {success: false, errors:{err:'[Parsing Error] Semester Details', row:String(i+1)}, data: {}};
            }
            if (row[0].toUpperCase() === 'LOA'){
                studentRecord.records.push(createSemRecord(subjects, row[5], row[6], 'LOA'));
            } else if (row[0].toUpperCase() === 'AWOL'){
                studentRecord.records.push(createSemRecord(subjects, row[5], row[6], 'AWOL'));
            } else{
                studentRecord.records.push(createSemRecord(subjects, row[5], row[6], 'ENROLLED'));
            }  
            subjects = []
        }
    }

    if (subjects.length !== 0){
        // console.log("Parsing error: Subjects not assigned to a semester before " + String(unitsIndex+1));
        return {success: false, errors:{err:'[Parsing Error]: Subjects not assigned to a semester', row:String(unitsIndex+1)}, data: {}};
    }
    // add units taken
    var totalUnitsTaken = rows[unitsIndex].split(",")[1];
    if (totalUnitsTaken && !isNaN(totalUnitsTaken) && totalUnitsTaken >= 0)
        studentRecord.totalUnitsTaken = totalUnitsTaken
    else 
        return {success: false, errors:{err:'[Parsing Error] Total Units Taken', row:String(unitsIndex+1)}, data: {}};
        // console.log("Parsing error: [Total Units Taken]")
    
    
    // add GWA
    var GWA = rows[unitsIndex+1].split(',')[1];
    if (GWA && !isNaN(GWA) && GWA >= 0)
        studentRecord.GWA = formatGWA(GWA);
    else
        return {success: false, errors:{err:'[Parsing Error] GWA', row:String(unitsIndex+2)}, data: {}};
        // console.log("Parsing error: [GWA]")


    // add total units required
    var totalUnitsRequired = rows[unitsIndex+2].split(',')[0]
    if (totalUnitsRequired && !isNaN(totalUnitsRequired) && totalUnitsRequired >= 0)
        studentRecord.totalUnitsRequired = totalUnitsRequired
    else
        return {success: false, errors:{err:'[Parsing Error] Total Units Required', row:String(unitsIndex+3)}, data: {}};
    

    // returns student record in json
    return {success: true, errors: null, data: studentRecord};
}

