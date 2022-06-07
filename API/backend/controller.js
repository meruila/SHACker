/*The hacker may not be able to use
 the frontend as an interface to "talk" to the server, but it's possible to "talk" directly to the
 server using programs that are similar to the fetch actions in the frontend program.
 THIS IS WHY WE NEED TO VALIDATE THE USER FOR EVERY ACTION USING THE AUTHTOKEN. This way, it adds an
 extra layer of security to our web application. THE HACKER MAY TRY TO SEND POST REQUESTS TO OUR ENDPOINTS,
 BUT WITHOUT THE AUTHTOKEN, IT WILL BE A CHALENGE FOR THE HACKER TO PERFORM MALICIOUS ACTIONS.*/

 // This is for the dotenv module. Make sure that we have the .env file that contains the secret string/s.
 require('dotenv').config(); // for using environment variables
 const mongoose = require("mongoose");
 
 // get models registered in Mongoose
 const RegUser = mongoose.model("Regular-User");
 const Admin = mongoose.model("Admin");
 
 // This is for generating passwords for newly created users.
 const generator = require('generate-password');
 
 // Put require statements here:
 const jwt = require("jsonwebtoken");
 
 // For invoking database methods
 const db = require("../database/helpers/auth-helper");
 const dbRecord = require("../database/helpers/record-helper");
 const dbCurriculum = require("../database/helpers/curriculum-helper");
 const dbLog = require("../database/helpers/log-helper");
 const dbInit = require("../database/helpers/init-database");

 // For verifiers
 const verifier = require("./verifiers/main-verifier");

 
 // Function for checking if user is logged in
 async function isLoggedIn (req) {
     if (!req.cookies || !req.cookies.authToken) {
         // Scenario 1: FAIL - No cookies / no authToken cookie sent
         return {success: false, note: "No cookie/token"};
       }
     
       // Token is present. Validate it
       return jwt.verify(
         req.cookies.authToken,
         `${process.env.JWT_SECRET_KEY}`,
         async (err, tokenPayload) => {
           if (err) {
             // Scenario 2: FAIL - Error validating token
             return {success: false, note: "Error in validating token"};
           }     
           // check if user exists
           let isExisting = await db.findUser(tokenPayload._email);
           if (isExisting){
               return {success: true, note: "User is logged in", tokenEmail: tokenPayload._email};
           }else{
             return {success: false, note: "User does not exist"};
           }
         });  
 }
 
 // Function for checking
 async function isAdmin (req) {
     if (!req.cookies || !req.cookies.authToken) {
         // Scenario 1: FAIL - No cookies / no authToken cookie sent
        //  console.log("No cookie/token");
         if(!req.cookies){
            console.log("No cookie");
         }else if(!req.cookies.authToken){
            console.log("No token");
         }
         return {success: false, note: "No cookie/token"};
       }
     
       // Token is present. Validate it
       return jwt.verify(
         req.cookies.authToken,
         `${process.env.JWT_SECRET_KEY}`,
         async (err, tokenPayload) => {
           if (err) {
            console.log("Something went wrong");
             // Scenario 2: FAIL - Error validating token
             return {success: false, note: "Error in validating token"};
           }     
           // check if user exists
           let isExisting = await db.findUser(tokenPayload._email);
           if (isExisting){
               // check if user is admin
               let isAdmin = await db.checkIfAdmin(tokenPayload._email);
               if(isAdmin){
                 return {success: true, loggedIn: true, note: "User is admin", tokenEmail: tokenPayload._email};
               }else {
                // console.log("Is NOT Admin");
                 return {success: false, loggedIn: true, note: "User is not admin", tokenEmail: tokenPayload._email}; 
               }
           }else{
            // console.log("Not Existing");
             return {success: false, note: "User does not exist"};
           }
         });  
 
 }

 exports.isUserAdmin = async (req,res) => { // for frontend purposes (requested by Gem)
    try {
      const adminStatus = await isAdmin(req);
      const isSuccess = adminStatus.success;

      if(isSuccess) {
          res.status(200);
          return res.send({success: true, isAdmin: true, note: "Verification done"});
      }else{
          res.status(200);
          return res.send({success: true, isAdmin: false, note: "Verification done"});
        }
    }catch {
        res.status(500);
        return res.send({success: false, isAdmin: false, note: "Something went wrong"});
    }
}
 
  exports.adminSignUp = async (req, res) => {
      try {
          // extract data
          const creds = {
              user: {
                  name: {
                      fname: req.body.firstName,
                      lname: req.body.lastName,                    
                  }, 
                  email: req.body.email,
                  role: "admin",
                  password: req.body.password                                  
              },
          };
  
          let status = await db.saveAdminUser(creds); // save super user/admin
          if(status){
              res.status(200);
              return res.send({success: true, note: "User saved"});
          }else{
              res.status(401);
              return res.send({success: false, note: "User was not saved"});
          }
      }
      catch(e) {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }
  } 
  
  exports.login = async (req, res) => {
      try {
          // extract data
          const email = req.body.email.trim();
          const password = req.body.password;
          
          const user = await db.getUser(email);
          if(user != false){
              // if user exists, compare passwords
              user.comparePassword(password, (err, passwordMatch) => {
                  if(passwordMatch){
                      // create token payload
                      const tokenPayload = {
                          _email:email
                      }
      
                  //use environment variables to hide the secret string
                  //const token = jwt.sign(tokenPayload, process.env.JWT_KEY); // before
                  const token = jwt.sign(tokenPayload, `${process.env.JWT_SECRET_KEY}`); // after
                  res.status(200); 
                  return res.send({success: true, token: token, note:"Login success"});
      
                  }else{
                      res.status(401);
                      return res.send({success: false, note: "Wrong password"});
                  }
              });
              
          }else {
              res.status(401);
              return res.send({success: false, note: "User does not exist"});
          }
      }
      catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }
  }//DONE!!!
  
  exports.addUser = async (req, res) => {
      try{
          const adminStatus = await isAdmin(req); 
          const isSuccess = adminStatus.success;
          if(!isSuccess) {
              res.status(401);
              return res.send({success: false, note: "User is not admin"});
          }
          const pw = generator.generate({
              length: 10,
              numbers: true,
              uppercase: true
          });
          const creds = {
              user: {
                  name: {
                    fname: req.body.firstName,
                    lname: req.body.lastName,
                  },
                  email: req.body.email,
                  role: "regular-user",
                  password: pw
                } 
          } 
          let status = await db.addRegularUser(creds);
          if(status){
              res.status(200);
              return res.send({success: true, generatedPassword:pw, note:"Regular user saved"});
              
          }else{
              res.status(401);
              return res.send({success: false, note:"Regular user was not saved"});
              
          }
      }catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }    
  }//DONE!!!
  
  exports.getAllUsers = async (req, res) => {
      try {         
          const loggedInStatus = await isLoggedIn(req);
          const isSuccess = loggedInStatus.success;
          if (!isSuccess) {
              res.status(401);
              return res.send({success: false, note: "User is not logged in."});            
          }
          let users = await db.findAllUsers();
          if (users) {
              res.status(200);
              return res.send({success: true, users: users, note:"List of users found."});
              
          }else{
              res.status(404);
              return res.send({success: false, note:"Users not found."});
              
          }
      } catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }
  }// DONE!!!
  
  exports.deleteUser = async (req, res) => {
      try {          
          const adminStatus = await isAdmin(req);
          const isSuccess = adminStatus.success; 
          if(!isSuccess) {
              res.status(401);
              return res.send({success: false, note: "Current user is not admin. Cannot delete another user."});
          } else { // request came from admin            
              let deleteStatus = await db.deleteRegularUser(req.body.email);
              if(deleteStatus){                  
                  res.status(200);
                  return res.send({success: true, note: "User was deleted."});
              }else{
                  res.status(404);
                  return res.send({success: false, note: "User cannot be deleted."});
              }         
          }      
      } catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong."});
      }
  } //DONE!!!
  
  exports.promoteUser = async (req, res) => {
      try{
          // check if request came from admin
          const adminStatus = await isAdmin(req);
          const isSuccess = adminStatus.success; 
          if(isSuccess) {
              // if admin, promote the new user
              const isPromoted = await db.promoteToAdmin(req.body.email);
              // if not promoted, send failure response
              if(!isPromoted){
                  res.status(403);
                  return res.send({success: false, note: "User not promoted"});
                  
              }else{
                  // if promoted, demote the other user
                  const isDemoted = await db.demoteToRegular(adminStatus.tokenEmail);
                  if(!isDemoted){
                      res.status(400);
                      return res.send({success: false, note: "Previous admin not demoted"});
                  }else{
                      res.status(200);
                      return res.send({success: true, note: "New admin promotion success"});
                  }
              }
          }else{
              res.status(403);
              return res.send({success: false, note: "User is not admin"});
          }
      }catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }    
  } // DONE!!!
  
  exports.viewProfile = async (req, res) => {
      try{
          const loginStatus = await isLoggedIn(req);
          // check if user is logged in
          if(!loginStatus.success){
              res.status(403);
              return res.send({success: false, note: "User not logged in"});
          }else{
              const profile = await db.getProfile(loginStatus.tokenEmail);
              if (profile == null){
                  res.status(400);
                  return res.send({success: false, note: "User not found"});
              }else{
                  res.status(200);
                  return res.send({success: true, profile: profile, note: "User found"});
              }
          }
      }catch {
          res.status(500);
          return res.send({success: false, note: "Something went wrong"});
      }    
  } //DONE
 
 exports.editProfile = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        // check if user is logged in
        if(!loginStatus.success){
            res.status(403);
            return res.send({success: false, note: "User not logged in"});
        }else{
            const updateStatus = await db.editUser(loginStatus.tokenEmail,req.body.firstName,req.body.lastName);
            if(updateStatus){
                res.status(200);
                return res.send({success: true, note: "User details updated"});
            }else{
                res.status(400);
                return res.send({success: false, note: "User details not updated"});
            }
        }
    }catch{
        res.status(500);
        return res.send({success: false, note: "Something went wrong"});
    }
 } //DONE!!!

 exports.addStudentRecord = async (req,res) => {  
    try{
        const loginStatus = await isLoggedIn(req); 
        const isSuccess = loginStatus.success;
        // check if request came from logged in user
        if(isSuccess) {
            // if user is logged in, add a student record
            const uploader = loginStatus.tokenEmail;
            const saveStatus = await dbRecord.saveRecord(req.body.formattedList,uploader); // dbRecord = record-helper
            const isSaved = (saveStatus.savedList.length > 0) ? true : false;
            if (isSaved) {
                res.status(200);
                return res.send({success: true, note: "At least one record was saved.", savedList: saveStatus.savedList, rejectedList: saveStatus.errList});
            } else {
                res.status(400);
                return res.send({success: false, note: "No records were saved", savedList: saveStatus, rejectedList: saveStatus.errList});
            }
        }else {
            res.status(403);
            return res.send({success: false, note: "User is not logged in.", savedList: [], rejectedList: []});
        }
    }catch (err) {
        res.status(500);
        console.log(err);
        return res.send({success: false, note: "Something went wrong", savedList: err.savedList, rejectedList: err.errList});
    }    
} // DONE!!!

exports.getStudentRecords = async (req,res) => {
    try{
        const records = await dbRecord.retrieveStudentRecords();
        res.status(200);
        res.send({success: true, records: records, note: "Ok"});
    }catch{
        return res.send({success: false, records: [], note: "Something went wrong"});
    }    
} // DONE!!!

exports.viewStudentRecord = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        const userEmail = loginStatus.tokenEmail;
        // check if request came from logged in user
        if(isSuccess){
            const rec = await dbRecord.viewStudentRecord(req.body.studentNo,userEmail);
            if(rec === null) { // no record found
                res.status(500);
                return res.send({success: false, studentObject: null, note: "For some reason, there was no record found."});
            }else{
                res.status(200);
                return res.send({success: true, studentObject: rec, note: "Record found"});
            }

        }else{
            res.status(403);
            return res.send({success: false, studentObject: null, note: "User is not logged in."});
        } 
    }catch{
        res.status(500);
        return res.send({success: false, studentObject: null, note: "Something went wrong."});
    }
} // DONE!!!

exports.updateStudentRecord = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        const userEmail = loginStatus.tokenEmail;
        // check if request came from logged in user
        if(isSuccess){
            const newDetails = req.body.updatedStudentObject;
            const updateStatus = await dbRecord.editStudentRecord(newDetails, userEmail);
            if(updateStatus){
                res.status(200);
                return res.send({success: true, note: "Record updated."});
            }else{
                res.status(500);
                return res.send({success: false, note: "Something went wrong."});
            }
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."}); 
        }
    }catch (e){
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE !!!

exports.deleteStudentRecord = async (req,res) => {
    try {
        const adminStatus = await isAdmin(req);
        const isSuccess = adminStatus.success;
        const email = adminStatus.tokenEmail;
        if(isSuccess){ // user is admin
            const deleteStatus = await dbRecord.delStudentRecord(req.body.studentNo, email);
            if(deleteStatus){
                res.status(200);
                return res.send({success: true, note: "Successfully deleted record"})
            }else{
                res.status(500);
        return res.send({success: false, note: "Something went wrong."});
            }
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not admin"});
        }
        
    }catch {
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!

exports.viewSummary = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        const userEmail = loginStatus.tokenEmail;
        // check if request came from logged in user
        if(isSuccess){
            const giveStatus = await dbRecord.showSummary(userEmail);
            res.status(200);
            return res.send({success: true, studentRecordsSummary: giveStatus, note: "Ok"});
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."}); 
        }
    }catch (e){
        res.status(500);        
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.checkForWarnings = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        // check if request came from logged in user
        if(isSuccess){
            const student = req.body.studentObject;
            const curriculum = await dbCurriculum.checkCurriculum(student.course);
            const warnings = await verifier.verify(student, curriculum);
            const warningCollection = [].concat(warnings[0],warnings[1]);
            res.status(200);
            return res.send({success: true, warnings: warningCollection, note: "Ok"});
            
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."});
        }
    }catch {
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.sign = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        // check if request came from logged in user
        if(isSuccess){
            const signStatus = await dbRecord.affixSign(req.body.studentNo, loginStatus.tokenEmail);
            if(signStatus){
                res.status(200);
                return res.send({success: true, note: "Signed."});
            }else{
                res.status(500);
                return res.send({success: false, note: "Record was not signed."});
            }

        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."});
        }
    }catch{
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.homeRecords = async (req,res) => {
    try{
        await dbInit.loadData();
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        // check if request came from logged in user
        if(isSuccess){
            const count = await dbRecord.recordsCount();
            return res.send({success: true, allCount: count[0], verifiedCount: count[1]});
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."});
        }
    }catch{
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.changePassword = async (req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        const email = loginStatus.tokenEmail;
        // check if request came from logged in user
        if(isSuccess){
            const user = await db.getUser(email);
            
            if(user != false){

                // if user exists, compare passwords
                user.comparePassword(req.body.oldPassword, async (err, passwordMatch) => {
                    if(passwordMatch){
                      // edit password here
                      const updateStatus = await db.editPassword(email, req.body.newPassword);
                      if(updateStatus){
                         res.status(200);
                         return res.send({success: true, note: "Password updated"});
                      } else{
                          res.status(500);
                          return res.send({success: false, note: "Update failed."});
                      }
        
                    }else{
                        res.status(401);
                        return res.send({success: false, note: "Wrong password"});
                    }
                });
  
              }else{
                res.status(500);
                return res.send({success: false, note: "Can't find user."});
              }


        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."});
        }
    }catch (e){
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
    
} // DONE!!!

exports.unsign = async (req,res) => {
    try{
        // step1: check if admin
        const adminStatus = await isAdmin(req);
        // step2.1: if yes, clear verified by []
        if(adminStatus.success){
           const wasRemoved = await dbRecord.adminRemoved(req.body.studentNo, adminStatus.tokenEmail);
           if(wasRemoved){
               res.status(200);
               return res.send({success: true, note: "Unsigned"});
           }else{
               res.status(500);
               return res.send({success: false, note: "Unsigning failed"});
           }
        } 
        // step2.2: else, check if user is a logged in a regular user        
        else if(adminStatus.loggedIn){ 
             // step3.1: if yes, check if he/she is the first verifier
            const wasRevoked = await dbRecord.removeSign(req.body.studentNo, adminStatus.tokenEmail);
            if(wasRevoked){
                res.status(200);
                return res.send({success: true, note: "Unsigned"});
            }else{
                res.status(403);
                return res.send({success: false, note: "You have no right to unsign this"});
            }
        }

        // step3.2: else, deny
        else{
            res.status(403);
            return res.send({success: false, note: "You are not logged in"});
        }
    }
    catch{
        res.status(500);
        return res.send({success: false, note: "Something went wrong"});
    }
}

exports.deleteAllRecords = async (req,res) => {
    try{
        const adminStatus = await isAdmin(req);
        const userEmail = adminStatus.tokenEmail;
        // check if request came from admin
        if(adminStatus.success){
            const user = await db.getUser(userEmail);
            
            if(user != false){

                // if user exists, compare passwords
                user.comparePassword(req.body.password, async (err, passwordMatch) => {
                    if(passwordMatch){
                      // edit password here
                      const wasDeleted = await dbRecord.delStudentRecords(userEmail);
                      if(wasDeleted){
                         res.status(200);
                         return res.send({success: true, note: "Successfully deleted"});
                      } else{
                          res.status(500);
                          return res.send({success: false, note: "Deletion failed."});
                      }
        
                    }else{
                        res.status(401);
                        return res.send({success: false, note: "Wrong password"});
                    }
                });
  
              }else{
                res.status(500);
                return res.send({success: false, note: "Can't find user."});
              }


        }else{
            res.status(403);
            return res.send({success: false, note: "User is not admin."});
        }
    }catch {
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
    
} // DONE!!!

exports.deleteAllLogs = async(req,res) => {
    try{
        const adminStatus = await isAdmin(req);
        const userEmail = adminStatus.tokenEmail;
        if(adminStatus.success){
            const user = await db.getUser(userEmail);
            if(user != false){

                // if user exists, compare passwords
                user.comparePassword(req.body.password, async (err, passwordMatch) => {
                    if(passwordMatch){
                        const wasCleared = await dbLog.delAllLogs(userEmail);
                        if(wasCleared){
                            res.status(200);
                            return res.send({success: true, note: "All logs were deleted"});
                        }else{
                            res.status(500);
                            return res.send({success: false, note: "Logs were not cleared"});
                        }
        
                    }else{
                        res.status(401);
                        return res.send({success: false, note: "Wrong password"});
                    }
                });

            }else{
                res.status(500);
                return res.send({success: false, note: "Can't find user."});
            }

            
        }else{ 
            res.status(403);
            return res.send({success: false, note: "User is not admin."});
        }
    }catch (e){
        console.log(e);
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.viewLogs = async(req,res) => {
    try{
        const loginStatus = await isLoggedIn(req);
        const isSuccess = loginStatus.success;
        // check if request came from logged in user
        if(isSuccess){
            const logs = await dbLog.viewAllLogs();
            res.status(200);
            return res.send({success: true, logs: logs, note: "Ok"});
        }else{
            res.status(403);
            return res.send({success: false, note: "User is not logged in."});
        }
    }catch{
        res.status(500);
        return res.send({success: false, note: "Something went wrong."});
    }
} // DONE!!!

exports.adminExists = async(req,res) => {
    try{
        const isThereAdmin = await db.adminInDB();
        return res.send({success: true, adminIsExisting: isThereAdmin, note: "Ok"});
    }catch{
        return res.send({success: false, note: "Something went wrong"});
    }
    
}