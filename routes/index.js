let express = require('express');
let router = express.Router();
let ObjectId = require('mongoose').Types.ObjectId
let questionsModel = require('../model/questionsModel');


router.get('/', function (req, res) {
  res.render('index', { title: 'Qunto Home' });
});
router.get('/ask', function (req, res) {
  if(!req.session.user){         // with session we set on login time
    return res.redirect('/login')
  }
  questionsModel.find().limit(10).sort('-_id').then((recent)=>{  // questions toshow in sidebar
    res.render('ask', { title: 'Ask Question', user: req.user,recent });
  })
});
router.get('/tags', function (req, res) {
  questionsModel.find().sort("-_id").then((questions) => {
    res.render('tags', { title: "All tags", questions: questions });
  },(err) => {
    res.send("couldn't get tags");
  })
});
router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});
// route for single question view
router.get('/question/:questionId', (req, res) => {
  let id = req.params.questionId;
  if (ObjectId.isValid(id)) {
    console.log("ip address could be used to count unique views but for simplicity im counting page hits","ihde nal hou uh",req.connection.remoteAddress);
    questionsModel.findByIdAndUpdate(id,{$inc:{ views:1}}).populate({path:"answers",modelName:"answers"}).then((question) => {
      if (question) {
        questionsModel.find().limit(10).sort('-_id').then((recent)=>{
          res.render('question_view', { title: question.title, question: question,recent })
        })
      }
    }, (err) => {
      res.send(err);
    })
  }
  else {
    res.send("Question not found");
  }

})
module.exports = router;
