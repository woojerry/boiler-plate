const mongoose = require('mongoose'); // mongoose 가져오기
const bcrypt = require('bcrypt');
const saltRounds = 10; // saltRounds 몇글자인지
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    // 저장하기 전에 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234568 암호화된 비밀번호 $2b$10$RfDtiHU39rsAFi/xRVc8WeLeFFuc1OocmnW4hpMegOBLbYrBJP6zG
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err); // 비밀번호 다를 때
    cb(null, isMatch); // 비밀번호 같을 때
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token을 생성하기

  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user.id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // user.id + '' = token;
  // token을 decode 한다.
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema); // Schema를 model로 감싸주기

module.exports = { User };
