const mongoose = require("mongoose");

const User = require("../models/regular-user");
const Record = require("../models/student-record");
const Log = require("../models/log");

/*
Returns a string containing the current date and time.
*/
const getCurrentTime = () => {
    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+' '+time;
    return dateTime;
}

/*
Returns an array of existing logs in the system.
*/
const logsCountHelper = async() => {
    try {
        const allLogs = Log.find();
        return Promise.all([allLogs]);
    } catch (e) {
        throw e;
    }
}

exports.logCount = logsCountHelper;

/*
Given an email, return a string containing the first and last name of the user.
*/
findUserName = async(email) => {
    let name = "";
    let toFind = await User.findOne({ "user.email": email });
    name += toFind.first + " " + toFind.last;
    return name;
}

/*
Delete oldest 250 (countDeleted) logs.
*/
const deleteOldLogs = async () => { 
    try {
        let countDeleted = 250;
        let toDelete = await Log.find({}, {_id : 1}).limit(countDeleted).sort({})
        let buffer = await Log.deleteMany({_id: {$in: toDelete}});
        return true; 
    } catch (e) {
        throw e;
    }
    
}

/*
When the system reaches 500 logs (threshold), call deleteOldLogs()
*/
const autoDeleteHelper = async () => {
    let threshold = 500;
    const logs = await logsCountHelper();
    if(logs[0].length > threshold) {
        await deleteOldLogs();
        return "deleted";
    }else{
        return "did not delete";
    }
}

/*
Given the current time, type of action*, student number, and email of a user, save the log.
Also checks if the system needs to delete old logs.

* Examples of action types: view/edit/delete student record, view summary
*/
const saveLogHelper = async (currentTime, msg, studNum, email) => {
    try{
        
        let newLog = {
            time: currentTime,
            description: msg,
            recordNumber: studNum,
            editorEmail: email
        }

        const logDocument = new Log(newLog);
        await logDocument.save();  
        await autoDeleteHelper();

        return true;
    }
    catch (e){
        console.log(e);
        return false
    }
}

exports.saveLog = saveLogHelper;

/*
Returns all logs in the system
*/
exports.viewAllLogs = async () => {
    try {
        const logs = await Log.find();
        let formattedLogs = [];
        for (i in logs) {
            log = {
                time: logs[i].time,
                description: logs[i].description,
                recordNumber: logs[i].recordNumber,
                editorName: logs[i].editorEmail
            }
            formattedLogs.push(log);
        }
        return formattedLogs;
    }
    catch(e) {
        console.log(e);
        return false;
    }    
}

/*
Deletes all logs. Admin only function.
*/
exports.delAllLogs = async(email) => {
    try {
        const logs = await logsCountHelper();
        const toDelete = await Log.deleteMany();
        if (toDelete.deletedCount == logs[0].length) {
            await saveLogHelper(getCurrentTime(), "Cleared Previous Logs", "N/A", email);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        throw e;
    }
}