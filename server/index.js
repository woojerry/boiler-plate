const express = require('express'); // express 가져오기
const app = express(); // express앱 만들기
const port = 5000; // port번호
const bodyParser = require('body-parser'); // bodyParser 가져오기
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User'); // User 가져오기

// application/x-www-from-url encoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

// mongoose를 이용해 application과 mongodb 연결하기
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! ~ 안녕하세요..');
});

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요');
});

app.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다.
  const user = new User(req.body);

  // save전에 mongoose를 이용해 비밀번호 암호화
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); // error일 때 json 형식으로 error 메세지와 함께 전달
    return res.status(200).json({
      success: true, // 성공했을 때 전달
    });
  }); // monodb method
});

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 DB에 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 요청된 이메일이 DB에 있다면, 비밀번호도 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
          password: req.body.password,
        });
      // 비밀번호까지 맞다면 Token을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키? ,로컬스토리지 중 하나 여기선 쿠키
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// Auth 기능, // auth는 미들웨어
// role 0이면 일반유저 , 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
