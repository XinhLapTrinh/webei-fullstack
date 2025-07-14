const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Email không hợp lệ'],
  },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, enum: ['user', 'editor','admin'], default: 'user' },
  provider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if(this.provider !== 'local') return false
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
