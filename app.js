const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp();

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
  res.render("login.html");
});

app.get("/signup", function (req, res) {
  res.render("signup.html");
});

app.get("/profile", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render("profile.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/", function (req, res) {
  res.render("index.html");
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});











































































// const express = require("express")

// const csrf = require("csurf")

// const bodyParser = require("body-parser")

// const admin = require("firebase-admin")

// const cookieParser = require("cookie-parser")

// const app = express()



// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://authn-b37f4.firebaseio.com"
// });

// const csrfMiddlevar = csrf({cookie:true});

// app.engine("html" , require("ejs").renderFile);
// app.use(express.static("static"));


// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(csrfMiddlevar);


// app.all("*", (req,res,next) => {
//     res.cookie("XSRF-TOKEN",req.csrfToken());
//     next();
// })

// app.post('/sessionLogin', (req,res) => {
//     const idToken = req.body.idToken.toString()

//     const expiresIn = 60*60*24*5*1000;    

//     admin
//      .auth()
//      .createSessionCookie(idToken, {expiresIn})
//      .then(
//          (sessionCookie) => {
//              const options = {maxAge:expiresin,httpOnly:true};

//              res.cookie("session",sessionCookie,options)

//              res.end(JSON.stringify({status:"success"}))
//          },
//          (error) => {
//              res.status(401).send("UNAUTHORIZED REQUEST")
//          }
//      )

// })

// app.engine("html" ,require('ejs').renderFile )

// app.use(express.static("static"))

// app.get('/',(req,res) => {
//     res.render('index.html')
// })

// app.get('/profile' ,(req,res) => {
//     res.render('index.html')
// })

// app.listen(5000 , () => {
//     console.log("App is listening on port 5000")
// })