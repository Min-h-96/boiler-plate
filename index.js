const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

const { User } = require("./models/user");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! test nodemon");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ succes: false, err });
    return res.status(200).json({
      succes: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 1. 요청된 이메일이 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucces: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSucces: false, message: "비밀번호가 틀렸습니다." });

      // 3. 비밀번호까지 맞다면 그 유저를 위한 Token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등
        // 여러가지 방법이 있지만 이번에는 쿠키에 저장함
        else return res.cookie("x_auth", user.token).status(200).json({ loginSucces: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
