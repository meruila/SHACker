const comp = require("./computation-verifier");
const sem = require("./semester-verifier");

exports.verify = async (student, curriculum) => {
    try{
        const compResult = comp.computationVerifier(student);
        const semResult = sem.semesterVerifier(student, curriculum);
        return Promise.all([compResult, semResult]); 
    }catch(e){
        throw e;
    }
    
}