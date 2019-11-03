let express = require('express');
let router = express.Router();
let questionModel = require('../model/questionsModel');

// /search route to  for live search
router.post('/', (req, res) => {
    console.log("query", req.body.search);
    var regexs = new RegExp(req.body.search, 'i');
    questionModel.find({ title: regexs }).populate({path:"answers",model:"answers"}).then((questions) => {
        res.render('questions', { questions, title: "Search results",message:"Search results" });
    }, (err) => {
        console.log(err);
    })
})
// /search route to  for on search click search
router.get('/', (req, res) => {
    var regexs = new RegExp(req.query.search, 'i');
    let q = [];
    questionModel.find({ title: regexs }).limit(9).then((questions) => {
        if (questions) {
            for (i = 0; i < questions.length; i++) {
                q.push(questions[i]._id.toString());
                q.push(questions[i].title);
            }
            res.send(q)
        }
    }, (err) => {
        console.log(err);
    })
})

module.exports = router;
