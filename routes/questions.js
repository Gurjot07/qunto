var express = require('express');
var router = express.Router();

let questionsModel = require('../model/questionsModel');
let answersModel = require('../model/answersModel');

//  route for hot questions view
router.get('/hot', (req, res)=> {
    questionsModel.find().limit(30).populate({path:"totalanswers"}).sort('-views')  // populate.. for getting data from multiple tables or models
        .then((questions)=> {
                res.render('questions', {
                    title:"Hot! Questions",
                    questions: questions,
                    message:"Hot! Questions",
                    unanswered:false,
                })
        })
});
//  route for unanswered  questions view
router.get('/unanswered/:page', (req, res)=> {
    questionsModel.find().limit(20).populate({path:"totalanswers"})
        .then((questions)=> {
            let unanswered=[]
                      questions.forEach((q)=>{
                           if(q.totalanswers==0)  unanswered.push(q)
                       })
                questionsModel.find().limit(10).sort('-_id').then((recent)=>{
                    res.render('questions', {
                    title:"Unanswered Questions " + req.params.page,
                    questions: unanswered,
                    message:"Unanswered Questions",
                    unanswered:true,
                    recent:recent
                }) })
        })
});

//  route for adding questions
router.post('/ask',(req,res)=>{
    let askedBy="Anonymous";
    if(req.session.user){
        askedBy = req.body.askedby;
    }
    let body = req.body
    let title = body.title.charAt(0).toUpperCase() + body.title.slice(1)
    let newQuestion = new questionsModel({
            title:title,
            category:body.category,
            description:body.description,
            tags:body.q_tags.split(","),
            askedby:askedBy
        }
    );
    newQuestion.save()
        .then((doc)=>{
            res.redirect('/questions/1');
        },(err)=>{
            console.log(err);
        })
});

//  route for adding answere
router.post('/ans',(req,res)=>{
console.log("req",req.body)
 let answer = new answersModel({
     text:req.body.text,
     question_id:req.body.question_id,
 })
 answer.save((err,result)=>{
     if(err) return res.send(err)
    res.redirect(`/question/${req.body.question_id}`)
 })
})
// route for get all questions view
router.get('/:page', (req, res)=> {
    let perPage = 18;
    let page = req.params.page || 1;
    questionsModel
        .find().sort('-_id').populate({path:"totalanswers"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then((questions)=> {
            questionsModel.countDocuments().then((count) =>{
                questionsModel.find().limit(10).sort('-_id').then((recent)=>{
                    res.render('questions', {
                        title:"Questions " + req.params.page,
                        questions: questions,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        message:"All Questions",
                        unanswered:false,
                        recent
                    })
                })
            })
        })
});
module.exports = router;
