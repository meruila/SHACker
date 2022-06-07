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

// checker if course format is valid AND is offered by CAS
const isValidCourse = (course) => {
    // list of all BS and BA courses offered
    const bsCourses = ['ACHM', 'AMAT', 'APHY', 'BIO', 'CHEM', 'CS', 'MATH', 'MST', 'STAT'];
    const baCourses = ['CA', 'PHLO', 'SOC'];
    // creates a text in the form of (BS) AHCM|AMAT|APHY|... | (BA) CA|PHLO|SOCIO
    const text =  `^((BS)\\s?(${bsCourses.join('|')}))$|^((BA)\\s?(${baCourses.join('|')}))$`;
    const courseChecker = new RegExp(text, 'i');
    return courseChecker.test(course); 
}

// formats course to no spacing and checks if park of the CAS
const formatCourse = (course) => {
    // extracts Bs sTAT -> BSSTAT
    const courseFormatter =  /^(B(A|S))\s?([A-Z]+)/i;
    var match = course.match(courseFormatter);
    return `${match[1].toUpperCase()}${match[3].toUpperCase()}`;
};

// checker for student number validity
const isValidStudentNo = (studentNo) => {
    const studentNoChecker = /^\d{4}(-|\s)?\d{5}$/i;
    return studentNoChecker.test(studentNo); 
}

// formats for student number validity
const formatStudentNo = (studentNo) => {
    const studentNoFormatter = /^(\d{4})(-|\s)?(\d{5})$/i;
    var match = studentNo.match(studentNoFormatter);
    return `${match[1]}-${match[3]}`;
}

// checker for semester validity
const isValidSem = (sem) => {
    return (sem === '1' || sem === '2' || sem === 'M'); 
}

// checker for semester validity
const isValidYear = (year) => {
    const yearChecker = /(\d{4})(-|\s)?(\d{4})/ ;
    var match = year.match(yearChecker);
    if (!match) return false;
    return ((parseInt(match[1]) + 1) === parseInt(match[3]));
}

// checker for subject and semester units, weighted grade, and running validity
const isValidNumericValue = (value) => {
    return (!isNaN(value) && value >= 0);
}

// checker for semester status
const isValidStatus = (status) => {
    return (['ENROLLED', 'LOA', 'AWOL'].includes(status.toUpperCase()));
}

// checker for valid course
const isValidCourseCode = (courseCode) => {
    // CHEM 19.1.2b (MST)
    const courseCodeChecker = /^[a-z]+\s?(\d+(\.\d+)*[a-z]?)?(\s?\([a-z]+\))?$/i;
    return courseCodeChecker.test(courseCode);
}

// formats course into upper case with space between subj name and code, omits dept (MST), (AH), ...
const formatCourseCode = (courseCode) => {
    const courseCodeFormatter = /^([a-z]+)\s?(\d+(\.\d+)*[a-z]?)?.*$/i;
    var match = courseCode.match(courseCodeFormatter);
    if (match[2]) return `${match[1]} ${match[2]}`.toUpperCase();
    return `${match[1]}`.toUpperCase();
}

// checker for grade validity
const isValidGrade = (grade) => {
    const letterChecker = /^INC|DRP|DFG|P|S|U$/;
    return ((!isNaN(grade) && ((grade === '4'|| grade === '5') || ((grade >= 1 && grade <=3 ) && grade%0.25 === 0))) || letterChecker.test(grade));
}

const isValidGWA = (GWA) => {
    return (!isNaN(GWA) && (GWA >= 1 && GWA <=3 ));
}

// formats GWA -> limits digit to 5 decimal places
const formatGWA = (GWA) => {
    const GWARegex = /(\d(\.\d{1,5})?)\d*/;
    return GWA.match(GWARegex)[1];
}

const isValidCourseUnits = (units) => {
    const unitsChecker = /^(\(\d+\))?\s?\d+$/;
    return unitsChecker.test(units);
}

// helper function for all subcheckers and formatters
exports.formatVerifier = (data) => {
    // if name is valid, format
    if (isValidName(data.name.last) && isValidName(data.name.last)){
        data.name.last = formatName(data.name.last);
        data.name.first = formatName(data.name.first);
    } else {
        return {success: false, errors:{err:"[Formatting Error] Invalid Name Format.", course: null, sem: null, year: null}, data: {}};
    }

    // if course is valid, format
    if (isValidCourse(data.course)){
        data.course = formatCourse(data.course);
    } else {
        return {success: false, errors:{err:"[Formatting Error] Course entered is not a valid CAS course.", course: null, sem: null, year: null}, data:{}};
    }

    // if student number is valid, format
    if (isValidStudentNo(data.studentNo)){
        data.studentNo = formatStudentNo(data.studentNo);
    } else {
        return {success: false, errors:{err:"[Formatting Error] Invalid student number format. Expecting: 20XX-XXXXX", course: null, sem: null, year: null}, data:{}};
    }

    // check validity of total units taken
    if (!isValidNumericValue(data.totalUnitsTaken)){
        return {success: false, errors:{err:"[Formatting Error] Invalid Total Units Taken.", course: null, sem: null, year: null}, data:{}};
    }

    // check validity of total units required
    if (!isValidNumericValue(data.totalUnitsRequired)){
        return {success: false, errors:{err:"[Formatting Error] Invalid Total Units Required.", course: null, sem: null, year: null}, data:{}};
    }

    // if gwa is valid, format
    if (isValidGWA(data.GWA)){
        data.GWA = formatGWA(data.GWA);
    } else {
        return {success: false, errors:{err:"[Formatting Error] Invalid GWA.",course: null, sem: null, year: null}, data:{}};
    }
    
    // for every semester
    for (var i = 0; i < data.records.length; i++) {
        var semester = data.records[i];

        // check if sem number is valid
        if (!isValidSem(semester.sem)){
            return {success: false, errors:{err:"[Formatting Error] Invalid semester. Expecting: 1, 2, or M", course: null, sem: semester.sem, year: semester.year}, data:{}};
        }

        // check if year is valid
        if (!isValidYear(semester.year)){
            return {success: false, errors:{err:"[Formatting Error] Invalid year. Expecting: XXXX-XXXX", course: null, sem: semester.sem, year: semester.year}, data:{}};
        }

        // check if total units is valid
        if (!isValidNumericValue(semester.units)){
            return {success: false, errors:{err:"[Formatting Error] Invalid units.", course: null, sem: semester.sem, year: semester.year}, data:{}};
        }

        // checks if status is valid
        if (!isValidStatus(semester.status)){
            return {success: false, errors:{err:"[Formatting Error] Invalid status. Expecting: ENROLLED, LOA or AWOL", course: null, sem: semester.sem, year: semester.year}, data:{}};
        }

        // for every subject in a sem
        for (var j = 0; j < semester.subjects.length; j++){
            var subject = semester.subjects[j];

            // if course code is valid, format 
            if (isValidCourseCode(subject[0])){
                data.records[i].subjects[j][0] = formatCourseCode(subject[0]);
            } else {
                return {success: false, errors:{err:"[Formatting Error] Invalid Course Code", course: subject[0], sem: semester.sem, year: semester.year}, data:{}};
            }

            if (isValidGrade(subject[1])){
                data.records[i].subjects[j][1] = subject[1].toUpperCase();
            } else{
                return {success: false, errors:{err:"[Formatting Error] Invalid Grade", course: subject[0], sem: semester.sem, year: semester.year}, data:{}};
            }

            if (isValidCourseUnits(subject[2])){
                data.records[i].subjects[j][2] = subject[2].replace(/\s/g,'');
            } else{
                return {success: false, errors:{err:"[Formatting Error] Invalid Unit Count", course: subject[0], sem: semester.sem, year: semester.year}, data:{}};
            }

            if (!isValidNumericValue(subject[3])){
                return {success: false, errors:{err:"[Formatting Error] Invalid Weighted Grade", course: subject[0], sem: semester.sem, year: semester.year}, data:{}};
            }

            if (!isValidNumericValue(subject[4])){
                return {success: false, errors:{err:"[Formatting Error] Invalid Running Total", course: subject[0], sem: semester.sem, year: semester.year}, data:{}};
            }

        }
    }
    return {success: true, errors:null, data:data}
}



