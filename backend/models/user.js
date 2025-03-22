const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Add unique ID field
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobNum: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  dob: { type: Date, required: true },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;