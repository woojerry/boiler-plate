const mongoose = require('mongoose'); // mongoose 가져오기

// Model: Schema를 감싸주는 것
// Schema: DB내에 어떤 구조로 데이터가 저장되는가를 나타내는 데이터베이스 구조

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // space 없애기
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // role 지정
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    // token 유효기간
    type: Number,
  },
});

const User = mongoose.model('User', userSchema); // Schema를 model로 감싸주기

module.exports = { User };
