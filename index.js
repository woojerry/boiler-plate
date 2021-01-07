const express = require('express'); // express 가져오기
const app = express(); // express앱 만들기
const port = 5000; // port번호

// mongoose를 이용해 application과 mongodb 연결하기
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://woojery:lwj429@boilerplate.vyuwt.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
