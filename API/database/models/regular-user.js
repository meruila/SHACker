const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const RegularUserSchema = new mongoose.Schema({
  // -- Start user info subdocument
  user: {
    name: {
      fname: { type: String, required: true, trim: true },
      lname: { type: String, required: true, trim: true },
    },
    email: { type: String, unique: true, required: true, trim: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
  },
  // -- end subdocument
  managedRecords: [ { type: mongoose.ObjectId, ref: 'Student-Record' } ]
},
  { collection : 'user' }
);

// Middleware to be used when an regularUser gets created
RegularUserSchema.pre('save', function (next) {
  const regularUser = this;
  if(!regularUser.isModified("user.password")) {
    return next();
  } 
  
  return bcrypt.genSalt((saltError, salt) =>{
    if (saltError) {return next(saltError);}
    
    return bcrypt.hash(regularUser.user.password, salt, (hashError, hash) => {
      
      if (hashError) {return next(hashError); }

      regularUser.user.password = hash;
      
      return next();
    });
  });
 });

 RegularUserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.user.password, callback);
}

module.exports = mongoose.model("Regular-User", RegularUserSchema);