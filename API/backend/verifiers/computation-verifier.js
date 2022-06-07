//checks if grade in parameter is invalid given some restriction
invalidNumericGrade = (grade, withNum) =>{
    if (withNum === 1) return (!isNaN(grade) && !(((grade % (0.25) == 0) && grade <= 3 && grade >=1) || grade == '5' || grade == '4'));
    else if (withNum === 2) return (!isNaN(grade) && !(((grade % (0.25) == 0) && grade <= 3 && grade >=1) || grade == '5'));
    else return (!isNaN(grade) && !(((grade % (0.25) == 0) && grade <= 3 && grade >=1)));
}

//returns true if course is in array, else false
checkCourseInArray = (subjects, course) => {
    for (let i=0; i < subjects.length; i++){
        if (subjects[i] == course) return true;
    }return false;
}

//removes specific course in array
//removal of element in array: https://www.geeksforgeeks.org/remove-elements-from-a-javascript-array/
removeCourseFromArray = (subjects, course) => {
    for (let i=0; i < subjects.length; i++){
        if (subjects[i] === course){
            subjects.splice(i, 1);
            break;
        }
    }
}

exports.computationVerifier = async (student) => {
    let totalThesisCourseUnitsTaken = 0, totalSPCourseUnitsTaken = 0, terminalCourseUnitsTaken = 0, pendingUnits = 0;
    let runningTotal = 0, unitsCompleted = 0, unitsTaken = 0, HK1213UnitsCompleted = 0, unitsGPATaken = 0;
    let terminalCourseDone = false, withS = false, incorrectRunningTotal = false, invalidThesisGrade = false, invalidSPGrade = false;
    let errors = [];
    let coreGEs = ['PI 10', 'COMM 10', 'STS 1', 'ETHICS 1', 'ARTS 1', 'HIST 1', 'KAS 1'];
    let nonGPACourses = ['NSTP 1', 'NSTP 2', 'HK 11', 'PE 1'];

    const terminalCourseRegex = /(\D200$)|(\D190$)/;
    const thesisRegex = /(\D200$)/;
    const SPRegex = /(\D190$)/;
    const seminarRegex = /(\D199$)/;

    //loop to access record of student per term
    for (let i=0; i < student.records.length; i++){
        const records = student.records;
        const sem = records[i].sem;
        const year = records[i].year;

        // prompt that student was LOA/AWOL in current sem
        if (records[i].status === 'LOA' || records[i].status === 'AWOL'){
            errors.push({err: "Student's status was " + records[i].status, course: null, sem, year});
            continue;
        }
        
        // check if underload
        if ((student.totalUnitsRequired-unitsCompleted-terminalCourseUnitsTaken-pendingUnits >= 12) && (records[i].units < 12) && sem != 'M')
            errors.push({err: 'Underload', course: null, sem, year});
        
        // loop to access the subjects taken by student in current term
        for (let j=0; j < records[i].subjects.length; j++){
            const subject = records[i].subjects[j], course = subject[0], grade = subject[1], units = subject[2], gradePoints = subject[3], gradePointsTotal = subject[4];
            let invalidGrade = false;

            //non-terminal course
            if (!terminalCourseRegex.test(course)){
                //if grade input is an invalid non-numeric grade or is an invalid non-numeric grade
                if (((isNaN(grade) && grade!='DRP' && grade!='P' && grade!='INC' && grade!='DFG') && !seminarRegex.test(course)) || invalidNumericGrade(grade, 1) || ((grade == 'P' || grade== 'DFG') && sem != 2 && year != '2019-2020') || (seminarRegex.test(course) && (grade != 'S' && grade != 'U'))){
                    errors.push({err: 'Invalid grade', course, sem, year});
                    invalidGrade = true;
                }//if student has not yet completed a certain subject
                else if (grade=='DFG' || grade=='INC' || grade=='4'){
                    pendingUnits += parseFloat(units);
                    errors.push({err: 'Pending for completion', course, sem, year});
                }

                //invalid units (not a number)
                if (isNaN(units) || units < 0)
                    errors.push({err: 'Invalid number of units', course, sem, year});

                //semester to be excluded or non-gpa courses
                if ((sem == 2 && year == '2019-2020') || course == 'HK 11' || course == 'HK 12' || course == 'HK 13' || course == 'PE 1' || course == 'PE 2' || course == 'PE 3' || course == 'NSTP 1' || course == 'NSTP 2' || isNaN(grade)){
                    if (gradePoints != 0)
                        errors.push({err: 'Incorrect grade points', course, sem, year});
                }else if (!isNaN(grade) && !invalidNumericGrade(grade, 2) && !invalidGrade){ //update runningTotal
                    runningTotal += parseFloat(grade) * parseFloat(units);
                    if ((!isNaN(grade) && grade != '4') && (parseFloat(grade) * parseFloat(units)) != parseFloat(gradePoints)) //grade points checker
                        errors.push({err: 'Incorrect grade points', course, sem, year});
                }                
                
                //if subject has a valid numeric grade (except 4) or P
                if (((!isNaN(grade) && !invalidNumericGrade(grade, 2)) || (grade == 'P' && sem == 2 && year == '2019-2020') || seminarRegex.test(course)) && !invalidGrade){
                    if (grade != '5' && grade != 'U'){ 
                        unitsCompleted += parseFloat(units); //student passed

                        //for checkers of non-GPA courses and core GEs
                        if (course == 'HK 12' || course == 'PE 2' || course == 'HK 13' || course == 'PE 3')
                            HK1213UnitsCompleted += 2;
                        else if (course == 'HK 11' || course == 'PE 1' || course == 'NSTP 1' || course == 'NSTP 2')
                            removeCourseFromArray(nonGPACourses, course);
                        else if (course == 'PI 10' || course == 'COMM 10' || course == 'KAS 1' || course == 'HIST 1' || course == 'ARTS 1' || course == 'ETHICS 1' || course == 'STS 1')
                            removeCourseFromArray(coreGEs, course);

                    }unitsTaken += parseFloat(units); //total units taken
                    
                    if (grade != 'P' && !(sem == 2 && year == '2019-2020') && !seminarRegex.test(course)) {
                        unitsGPATaken += parseFloat(units); //units for gwa
                    }
                }

                //if runningTotal computed is not the same as in record
                if ((runningTotal != gradePointsTotal) && !incorrectRunningTotal){
                    incorrectRunningTotal = true;
                    errors.push({err: 'Incorrect running total', course, sem, year});
                }
            
            //thesis course
            }else if (thesisRegex.test(course)){
                if (terminalCourseDone) terminalCourseDone = false;

                //update units taken for thesis course
                if (totalThesisCourseUnitsTaken < 6){ //for first 6 units of thesis
                    if ((units!=0 && totalThesisCourseUnitsTaken>0 && ((units!=3 && totalThesisCourseUnitsTaken%3==0) || (units!=2 && totalThesisCourseUnitsTaken%2==0) || units==6)) || (units>3 && units<6) || units>6) 
                        errors.push({err: 'Invalid number of units', course, sem, year});
                        
                    terminalCourseUnitsTaken += parseFloat(units);
                    totalThesisCourseUnitsTaken += parseFloat(units);
                }else if (totalThesisCourseUnitsTaken < 9){ //for succeeding takes of thesis
                    totalThesisCourseUnitsTaken++;
                    if (units!='(1)6') 
                        errors.push({err: 'Invalid number of units', course, sem, year});
                }
                
                //if student received an invalid grade
                if (((grade=='DFG' || grade == 'P') && sem!=2 && year!='2019-2020') || ((totalThesisCourseUnitsTaken == 3) && (grade!='S' && grade!='U' && grade!='DRP')) || ((totalThesisCourseUnitsTaken >= 6 && totalThesisCourseUnitsTaken < 9) && ((!isNaN(grade) && invalidNumericGrade(grade, 3)) ||
                (isNaN(grade) && (grade!='S' && grade!='U')) || (withS && grade=='U')) || (totalThesisCourseUnitsTaken == 9 && (isNaN(grade) || invalidNumericGrade(grade, 2))))){
                    errors.push({err: 'Invalid grade', course, sem, year});
                    invalidThesisGrade = true;
                }else if (grade=='S' && !withS) { //student has already received an S, update withS
                    withS = true;
                } else if (grade == 'DRP'){
                    totalThesisCourseUnitsTaken = 0;
                // student received a valid numeric grade for that take
                }else if (!isNaN(grade) && ((!invalidNumericGrade(grade, 2) && (totalThesisCourseUnitsTaken >= 6)) || (grade == 5 && totalThesisCourseUnitsTaken == 9)) && !invalidThesisGrade){
                    if (grade != 5){ //student passed
                        terminalCourseDone = true; //update values of variables
                        unitsCompleted += totalThesisCourseUnitsTaken;
                        if ((parseFloat(grade) * 6) != parseFloat(gradePoints)) //grade points checker
                            errors.push({err: 'Incorrect grade points', course, sem, year});
                    }
                    
                    unitsTaken += 6; //total units taken
                    totalThesisCourseUnitsTaken = 0;
                    runningTotal += parseFloat(grade) * 6;

                    if (grade != 'P' && !(sem == 2 && year == '2019-2020')) {
                        unitsGPATaken += 6; //units for gwa
                    }
                }

                // //if non-numeric grade but grade points is not 0
                if ((grade=='S' || grade=='U' || grade=='DRP' || grade=='DFG') && gradePoints!=0)
                    errors.push({err: 'Incorrect grade points', course, sem, year});

                
                
                //if runningTotal computed is not the same as in record
                if ((runningTotal != gradePointsTotal) && !incorrectRunningTotal){
                    incorrectRunningTotal = true;
                    errors.push({err: 'Incorrect running total', course, sem, year});
                }
            }else if (SPRegex.test(course)){
                if (terminalCourseDone) terminalCourseDone = false;

                //update units taken for terminal course
                if (totalSPCourseUnitsTaken < 3){ //for first 3 units of SP
                    if ((units!=0 && ((units==3 && totalSPCourseUnitsTaken > 0) || (units==1 && totalSPCourseUnitsTaken==1) || (units==2 && (totalSPCourseUnitsTaken==0 || totalSPCourseUnitsTaken==2)))) || units > 3)
                        errors.push({err: 'Invalid number of units', course, sem, year});
                    terminalCourseUnitsTaken += parseFloat(units);
                    totalSPCourseUnitsTaken += parseFloat(units);
                }else if (totalSPCourseUnitsTaken < 6){ //for succeeding takes of SP
                    totalSPCourseUnitsTaken++;
                    if (units!='(1)3') 
                        errors.push({err: 'Invalid number of units', course, sem, year});
                }
                
                //if student received an invalid grade
                if (((grade=='DFG' || grade == 'P') && sem!=2 && year!='2019-2020') || ((totalSPCourseUnitsTaken == 1) && grade!='S' && grade!='U' && grade!='DRP') || ((totalSPCourseUnitsTaken >= 3 && totalSPCourseUnitsTaken < 6) && ((!isNaN(grade) && invalidNumericGrade(grade, 3)) ||
                (isNaN(grade) && (grade!='S' && grade!='U')) || (withS && grade=='U')) || (totalSPCourseUnitsTaken == 6 && (isNaN(grade) || invalidNumericGrade(grade, 2))))){
                    errors.push({err: 'Invalid grade', course, sem, year});
                    invalidSPGrade = true;
                }// //student has already received an S, update withS
                else if (grade=='S' && !withS) {
                    withS = true;
                }else if (grade == 'DRP'){
                    totalSPCourseUnitsTaken = 0;
                // student received a valid numeric grade for that take
                }else if (!isNaN(grade) && ((!invalidNumericGrade(grade, 2) && (totalSPCourseUnitsTaken >= 3)) || (grade == 5 && totalSPCourseUnitsTaken == 6)) && !invalidSPGrade){
                    if (grade != 5){ //student passed
                        terminalCourseDone = true; //update values of variables
                        unitsCompleted += 3;
                        if ((parseFloat(grade) * 3) != parseFloat(gradePoints)) //grade points checker
                            errors.push({err: 'Incorrect grade points', course, sem, year});
                    }
                    
                    unitsTaken += 3;
                    totalSPCourseUnitsTaken = 0;
                    runningTotal += parseFloat(grade) * 3;

                    if (grade != 'P' && !(sem == 2 && year == '2019-2020')) {
                        unitsGPATaken += 3; //units for gwa
                    }
                }

                // //if non-numeric grade but grade points is not 0
                if ((grade=='S' || grade=='U' || grade=='DRP' || grade=='DFG') && gradePoints!=0)
                    errors.push({err: 'Incorrect grade points', course, sem, year});

                

                //if runningTotal computed is not the same as in record
                if ((runningTotal != gradePointsTotal) && !incorrectRunningTotal){
                    incorrectRunningTotal = true;
                    errors.push({err: 'Incorrect running total', course, sem, year});
                }
            }
        }
    }
    
    //checker if student completed required cpurses
    if (coreGEs.length > 1 || (coreGEs.length == 1 && !(checkCourseInArray(coreGEs, 'HIST 1') || checkCourseInArray(coreGEs, 'KAS 1')))){
        for (var i=0; i < coreGEs.length; i++){
            if (i != coreGEs.length-1 && (coreGEs[i] === 'KAS 1' && checkCourseInArray(coreGEs, 'HIST 1') || coreGEs[i] === 'HIST 1' && checkCourseInArray(coreGEs, 'KAS 1')))
                errors.push({err: 'Required GE not completed', course: 'HIST 1/KAS 1', sem: null, year: null});
            else if (coreGEs[i] != 'KAS 1' && coreGEs[i] != 'HIST 1')
                errors.push({err: 'Required GE not completed', course: coreGEs[i], sem: null, year: null});
        };
    }if (HK1213UnitsCompleted < 6){
        errors.push({err: 'Required units for non-GPA course not completed', course: 'HK 12/13'});
    }if (nonGPACourses.length > 1 || (nonGPACourses.length == 1 && !(checkCourseInArray(nonGPACourses, 'HK 11') || checkCourseInArray(nonGPACourses, 'PE 1')))){
        for (var i=0; i < nonGPACourses.length; i++){
            if (i != nonGPACourses.length-1 && (nonGPACourses[i] === 'PE 1' && checkCourseInArray(nonGPACourses, 'HK 11') || nonGPACourses[i] === 'HK 11' && checkCourseInArray(coreGEs, 'PE 1')))
                errors.push({err: 'Required units for non-GPA course not completed', course: 'HK 11/PE 1', sem: null, year: null});
            else if (nonGPACourses[i] != 'PE 1' && nonGPACourses[i] != 'HK 11')
                errors.push({err: 'Required units for non-GPA course not completed', course: nonGPACourses[i], sem: null, year: null});
        };
    }if (terminalCourseDone == false)
        errors.push({err: 'Terminal course not yet completed', course: null, sem: null, year: null});
    
    //verify if total units taken in record is the same as total units counted
    if (student.totalUnitsTaken != unitsTaken)
        errors.push({err: 'Incorrect total number of units taken', course: null, sem: null, year: null});

    //verify if units completed meets total units required
    if (student.totalUnitsRequired > unitsCompleted)
        errors.push({err: 'No. of units taken did not meet minimum requirements', course: null, sem: null, year: null});

    //verify if GWA in record is the same as GWA computed
    const GWARegex = /(\d+(\.\d{1,5})?)\d*/;
    
    if (unitsGPATaken != 0 && student.GWA != String(runningTotal/unitsGPATaken).match(GWARegex)[1])
        errors.push({err: 'Incorrect GWA', course: null, sem: null, year: null});

    return errors;
}