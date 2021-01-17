const express = require('express'); // express 가져오기
const app = express(); // express앱 만들기
const port = 5000; // port번호
const bodyParser = require('body-parser'); // bodyParser 가져오기

const config = require('./config/key');

const { User } = require('./models/User'); // User 가져오기

// application/x-www-from-url encoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

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
  res.send('Hello World! ~ 안녕하세요.');
});

app.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); // error일 때 json 형식으로 error 메세지와 함께 전달
    return res.status(200).json({
      success: true, // 성공했을 때 전달
    });
  }); // monodb method
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
