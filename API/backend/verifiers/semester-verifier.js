//removes specific course in array
//removal of element in array: https://www.geeksforgeeks.org/remove-elements-from-a-javascript-array/
removeCourseObjFromArray = (subjects, geElectives, course, units, sem, year, errors) =>{
    let result = {success: false, err: null, units: null};

    //remove course from geElectives array
    for (let i=0; i < geElectives.length; i++){
        if (geElectives[i].code === course){
            result.success = true;
            if (geElectives[i].units != units){
                errors.push({err: 'Incorrect number of units', course, sem, year});
            }
            result.units = geElectives[i].units;
            geElectives.splice(i, 1);
            break;
        }
    }

    //if course not in geElectives, remove course if it is in subjects array
    if (!result.success){
        for (let i=0; i < subjects.length; i++){
            for (let j=0; j < subjects[i].code.length; j++){
                if (subjects[i].code[j] === course){
                    result.success = true;
                    if (subjects[i].units != units){
                        errors.push({err: 'Incorrect number of units', course, sem, year});
                    }
                    result.units = subjects[i].units;
                    subjects.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    return result; //return object with success value, error array, and units value
}

//checker if there are still non-GE/non-specialization and GPA courses are not yet taken
checkIfAllCoursesCompleted = (coursesNotCompleted) => {
    for (let i=0; i < coursesNotCompleted.length; i++){
        if (coursesNotCompleted[i].code != 'HK 11' && coursesNotCompleted[i].code != 'HK 12' && coursesNotCompleted[i].code != 'HK 13' && coursesNotCompleted[i].code != 'NSTP 1' && coursesNotCompleted[i].code != 'NSTP 2' && coursesNotCompleted[i].code != 'PI 10'
        && coursesNotCompleted[i].code != 'COMMM 10' && coursesNotCompleted[i].code != 'ETHICS 1' && coursesNotCompleted[i].code != 'STS 1' && coursesNotCompleted[i].code != 'HIST 1' && coursesNotCompleted[i].code != 'KAS 1' && coursesNotCompleted[i].code != 'ARTS 1')
            return false;
    }return true;
}

exports.semesterVerifier = (student, degreeReqsList) => {
    var resultList = [];
    const thesisRegex = /(\D200$)/;
    const spRegex = /(\D190$)/;
    const seminarRegex = /(\D199$)/;

    //access every version of curriculum of degree program
    for (let i=0; i < degreeReqsList.length; i++){
        const AYRegex = /^\d{4}/;
        let specializationUnits = 0;
        let curiErrors = [];
        let coursesNotCompleted = degreeReqsList[i].subjects.slice(); //clone of array: https://stackoverflow.com/questions/7486085/copy-array-by-value
        //ge electives array
        let geElectives = [{code: 'HUM 3', units: 3}, {code: 'KAS 4', units: 3}, {code: 'MATH 10', units: 3}, {code: 'PHILARTS 1', units: 3}, {code: 'PHLO 1', units: 3}, {code: 'PS 21', units: 3}, {code: 'SAS 1', units: 3}, {code: 'SCIENCE 10', units: 3}, {code: 'SCIENCE 11', units: 3}, {code: 'SOSC 3', units: 3}, {code: 'WIKA 1', units: 3}];
        let spUnitsTaken = 0;
        let thesisUnitsTaken = 0;
        let result;

        const firstAY = (student.records[0].year).match(AYRegex)[0]; //AY of student's first enrolment

        //out-of-scope curriculum
        if (firstAY < 2018){
            return([{err: "The curriculum of the student record is out of scope.", course: null, sem: null, year: null}]);
        }else{

            for (let j=0; j < student.records.length; j++){
                const records = student.records;
                const sem = records[j].sem;
                const year = records[j].year;
                
                for (let k=0; k < records[j].subjects.length; k++){
                    const subject = records[j].subjects[k];
                    const course = subject[0];
                    const grade = subject[1];
                    const units = subject[2];
                    
                    //if student passed the course or course is a terminal course
                    if ((!isNaN(grade) && ((grade % (0.25) == 0) && grade <= 3 && grade >=1) && !seminarRegex.test(course)) || (thesisRegex.test(course) || spRegex.test(course)) || (grade == 'P' && sem == 2 && year == '2019-2020') || (seminarRegex.test(course) && grade == 'S')){
                        if (!thesisRegex.test(course) && !spRegex.test(course)) //not a terminal course, try to remove from geElectives or courseNotCompleted
                            result = removeCourseObjFromArray(coursesNotCompleted, geElectives, course, units, sem, year, curiErrors, 0);
                        else {
                            //update counter of terminal units taken
                            if (thesisRegex.test(course)) 
                                if (units === "(1)6")
                                    thesisUnitsTaken++;
                                else
                                    thesisUnitsTaken += parseFloat(units);
                            else{
                                if (units === "(1)3")
                                    spUnitsTaken++;
                                else
                                    spUnitsTaken += parseFloat(units);
                            }

                            if (thesisRegex.test(course) && thesisUnitsTaken <= 9){
                                //student received numerical grade and took at least 6 units for thesis, remove course from array and reset counter
                                if (thesisUnitsTaken >= 6 && ((!isNaN(grade) && ((grade % (0.25) == 0) && grade <= 3 && grade >=1)) || grade == 'P')){
                                    result = removeCourseObjFromArray(coursesNotCompleted, geElectives, course, 6, sem, year, curiErrors);
                                    thesisUnitsTaken = 0;
                                //student failed and took 9 units of thesis, reset counter
                                }else if (thesisUnitsTaken == 9 && grade == 5)
                                    thesisUnitsTaken = 0;
                            }else if (spRegex.test(course) && spUnitsTaken <= 6){
                                //student received numerical grade and took at least 3 units for SP, remove course from array and reset counter
                                if (spUnitsTaken >= 3 && ((!isNaN(grade) && ((grade % (0.25) == 0) && grade <= 3 && grade >=1)) || grade == 'P')){
                                    result = removeCourseObjFromArray(coursesNotCompleted, geElectives, course, 3, sem, year, curiErrors);
                                    spUnitsTaken = 0;
                                //student failed and took 6 units of SP, reset counter
                                }else if (spUnitsTaken == 6 && grade == 5)
                                    spUnitsTaken = 0;
                            }
                        }

                        //current course is a specialization course, update counter
                        if (!result.success && !(course==='HK 11' || course==='HK 12' || course==='HK 13'|| course==='NSTP 1'|| course==='NSTP 2' || spRegex.test(course) || thesisRegex.test(course))) {
                            specializationUnits += parseFloat(units);
                        }

                        //push new error to errors array
                        if (result.err !== null)
                            errors.push(result.err);
                    }
                }
            }
        }
        
        //checker for other possible errors
        if (geElectives.length > 8 || specializationUnits < degreeReqsList[i].specializationUnits || !checkIfAllCoursesCompleted(coursesNotCompleted)){
            //student did not complete enough GE Electives
            if (geElectives.length > 8)
                curiErrors.push({err: 'Required number of GE Elective units not completed', course: null, sem: null, year: null});
            //student did not complete enough specialization courses
            if (specializationUnits < degreeReqsList[i].specializationUnits)
                curiErrors.push({err: 'Required number of Specialization units not completed', course: null, sem: null, year: null});
            //student did not complete all courses specified in the curriculum
            if (!checkIfAllCoursesCompleted(coursesNotCompleted))
                curiErrors.push({err: 'Required courses not completed', course: null, sem: null, year: null});
        }else{
            return(curiErrors);
        }
        resultList.push(curiErrors);
    }

    //if degree program only has one curriculum version, return all errors
    if (resultList.length === 1)
        return(resultList[0]);
    //return general error
    else
        return([{err: 'Not all courses in curriculum completed', course: null, sem: null, year: null}]);
}