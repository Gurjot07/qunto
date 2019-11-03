let express = require("express");
let app = express();
let router = express.Router();
let bcrypt = require("bcrypt"); // to hash (advanced thrn encryption) password for security
let faker = require("faker"); // to generate fake user accounts tan jo site test hove te bhari bhari lagge
let userModel = require("../model/userModel");

// route to generato fake
router.get("/faker", (req, res)=> { // to generate users data nothing to wry about
  for (let i = 0; i < 100; i++) {
    let newUser = new userModel({
      username: faker.internet.userName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      passwordHash: "1234",
      country: faker.address.country(),
      imageurl: faker.image.avatar(),
      bio: faker.lorem.lines(),
      website: faker.internet.url()
    });
    newUser
      .save()
      .then(result => {
        res.send("New users created successfully.")
      },(err)=>{
        res.send(err)
      })
     
  }
});

// route for all users view  with pagination
router.get("/users/:page", (req, res)=> {
  let perPage = 18;
  let page = req.params.page || 1;
  userModel
    .find()
    .sort({_id:-1})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then((users) =>{
      userModel.countDocuments().then((count) =>{
          res.render("users", {
            title: "page " + req.params.page,
            users: users,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      },
      err => {
        res.send(err);
      }
    );
});
//route for get single user  view
router.get("/user/:username", (req, res) =>{
  userModel.findOne({ username: req.params.username }).then(
    user => {
      if (user) {
        res.render("user_wall_public", {
          title: req.params.username,
          user: user
        });
      } else {
        res.send("user not found");
      }
    },
    err => {
      res.send(err);
    }
  );
});

//route to view login page
router.get("/login", (req, res)=> {
  if (req.session.user) {
   return res.redirect("/dashboard");
  }
  res.render("login", { title: "Login Account"});
});

//route to view register page
router.get("/register", (req, res)=> {
  res.render("register", { title: "register user", message: "" });
});
// route to register user
router.post("/users/register", (req, res) => {
  let firstname = req.body.fname.charAt(0).toUpperCase() + req.body.fname.slice(1); // ih sab first letter capital bnon lai
  let lastname = req.body.lname.charAt(0).toUpperCase() + req.body.lname.slice(1);
  userModel.findOne({ username: req.body.username }).then(  //regex must be applied on req.body.username for strict username check
    username => {
      if (username) { // check username exist or not
        res.render("register", {
          title: "Sign Up",
          message: "User name allready exist"
        });
      } else {

          let newUser = new userModel({
            username: req.body.username,
            firstname: firstname,
            lastname: lastname,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10), //10 is salt for security reasons
            country: req.body.country
          });
          newUser
            .save() //unique error must be thrown oveer here
            .then(result => {
              res.render("login", {title: "Login Into Continue ", message: "Registered Successfully Please Log in to continue."
              })},(err => {
                res.render("register", { title: "register user", message: err });
            }))
      }
    },
    err => {
     res.send("error while checking username", err);
    }
  );
});
router.post("/users/login",(req, res)=> {
  console.log("body",req.body);
  
  userModel.findOne({username:req.body.username}).then((result)=>{
    console.log("result",result);
    
      if(result && bcrypt.compareSync(req.body.password,result.passwordHash)){
        console.log("login successfullty");
        req.session.user = result.username    //setting username in session for session managemnet
        req.session._id = result._id
        return  res.redirect('/dashboard')
      }
      else{
       return res.render("login",{title:"Login ",message:"Username or Password is incorrect."})
      }
  },(err)=>{res.send(err)})
  }
);
router.get("/dashboard", (req, res) => {
  userModel.findOne({ username: req.session.user }).then(
    user => {
      console.log("dashboard: " + user);
     if(user){
      res.render("dashboard", {
        title: "Well Come " + user.firstname,
        user: user
      });
     }
     else{
       res.send("Something went  wrong")
     }
    },
    err => {
      console.log(err);
    }
  );
});
router.post("/user/update", (req, res)=> {
  let skills = req.body.skills.split(",");

  let body = req.body;
  userModel.findOneAndUpdate(
    { username: req.session.user },
    {
      username: body.username,
      firstname: body.fname,
      lastname: body.lname,
      email: body.email,
      country: body.country,
      skills: skills,
      bio: body.bio,
      website: body.website
    },
    { new: true },
    doc => {
      console.log(doc);
      res.redirect("/dashboard");
    }
  );
});
// ajax request to check username .. reduced extra overhead speed matters
/*
router.get('/username',function (req,res) {
    let result =[];
    user.find({username:req.query.username}).then((user)=>{
        if(user.length>0){
            user.push("user already exist") ;
            res.send(user);
        }
        else {
            user.push("valid username") ;
            res.send(user);
        }
    }).catch((err)=>{
        console.log(err)
    })
    res.send(req.query.username);
})
*/

router.get("/delete/:username", function(req, res) {
  if (req.params.username === req.session.user) {
    userModel.findOneAndDelete({ username: req.params.username }).then(user => {
      req.session.destroy();
      res.redirect("/");
      console.log("user deleted succesfuly");
    });
  }
  console.log("auth required to delete your account");
  res.redirect("/");
});
module.exports = router;
