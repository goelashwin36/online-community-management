const express = require("express");
const router = express.Router();
var cookieParser = require('cookie-parser');

var User = require('../models/user');
var Ques = require('../models/ques');
var Posted_art = require('../models/posted_articles');
var Req_art = require('../models/req_articles');

router.post("/signup", function (req, res) {
    var {user_id, user_pass, email, first_name, middle_name, last_name, mobile, dob} = req.body;
    var user = {
        user_id, user_pass, email, first_name, middle_name, last_name, mobile, dob
    };
    console.log(user);
    new User(user).save((err, docs) => {
        if (err) {
            res.send("User already exists");
            console.log(err);
            console.log(docs);
        }
        else {
            res.send("User created!");
        }
    })
});

router.post('/login', function (req, res) {
    var {user_id, user_pass} = req.body;
    console.log("\n\n" + user_id + "\n\n");
    User.find({user_id: user_id}).exec(function(err, docs){
        // res.send("err: \n" + err + "\n\n" + "docs: \n" + docs);
        console.log(req.body);
        console.log(docs);
        console.log(docs[0].user_pass);
        console.log(user_pass);
        if(err){
            res.send("Some error occurred");
            console.log(err);
        }
        else if(docs.length===0){
            res.send("User not found");
        }
        else{
            if(docs[0].user_pass == user_pass) {
                console.log(docs);
                res.cookie("login_id", user_id + "," + user_pass + "," + docs[0]._id).send("Ok");
            }
            else if(docs[0].user_pass != user_pass){
                res.send("Invalid Password")
            }
            }
    });

});

router.post('/requestArticle', function (req, res) {
    var {user_id, description} = req.body;
    var article = {
        user_id, description
    };
    new Req_art(article).save((err) => {
        if (err) {
            res.send("Error");
            console.log(err);
        }
        else {
            res.send("Article requested.");
        }
    })
});

router.post('/post_question', function (req, res) {
    var {user_id, question, date, answers} = req.body;
    var newQuestion = {
        user_id: user_id,
        question: question,
        date: date
    };
    console.log(newQuestion);
    console.log(req.body);
    new Ques(newQuestion).save((err, docs) => {
        if (err) {
            res.send("Error");
            console.log(err);
            console.log(docs);
        }
        else {

            res.send(docs);
        }
    })
});


router.post('/post_comment', function (req, res) {
    var {user_id, ques_id, answer, upVotes, downVotes, date} = req.body;
    console.log(req.body);
    var ObjectID = require('mongodb').ObjectID;
    Ques.findById(ques_id, function(err, docs){

        console.log(docs);
    })

    Ques.findByIdAndUpdate(ques_id, {$push: {answers: {_id: new ObjectID(), user_id: user_id, answer: answer, date: date, upVotes: [], downVotes: []}}}, function(err, response){
        if(err){
            res.send("Error");
            console.log(err);

        }
        else{
            Ques.findById(ques_id, function(err, docs){
                res.send(docs);
            })
        }
    });
});


router.post('/post_article', function(req, res){
    var {topic, article, date} = req.body;

    var newArticle = {
        topic, article, date
    };
    Posted_art(newArticle).save(function(err, docs){
       if(err){
           res.send("Error occurred");
           console.log(err);
       }
       else{
           res.send("Article created");
       }
    });
});


//-----------------------------------------------EDIT
router.post('/upVotes', function(req, res){
    var {ques_id, ans_id, user_id} = req.body;
    var y;
    console.log(req.body);

    Ques.findById(ques_id, function(err, docs) {
        if (err){
            console.log(err);
            res.send("Error");
        }
            else{
                console.log("\n\n Docs: "+docs);
                console.log("docs.ans.length: ", docs.answers.length);
               for(i=0; i<docs.answers.length; i++){
                   console.log("1");
                   console.log(docs.answers[i]._id, ans_id);
                  if(docs.answers[i]._id == ans_id){
                      console.log("\n\n2\n\n");
                      y=i;
                var u = docs.answers[y].upVotes;
                var d = docs.answers[y].downVotes;
                console.log("\n\nu: "+u);
                console.log("\n\nd: "+d);
                console.log("d.indexOf(user_id): ",d.indexOf(user_id));
                console.log("u.indexOf(user_id): ",u.indexOf(user_id));
                if(d.indexOf(user_id) !== -1){
                    console.log("\n\n3\n\n");

                    docs.answers[y].downVotes.splice(u.indexOf(user_id),1);
                    docs.answers[y].upVotes.push(user_id);
                    console.log("\n\nu: "+docs.answers[y].upVotes);
                    console.log("\n\nd: "+docs.answers[y].downVotes);
                    docs.markModified("answers");
                    docs.save(function(err, newDocs){
                        console.log("err: ",err);
                        console.log("newDocs- "+ newDocs.answers[y]);
                        res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                    });
                }
                else if(u.indexOf(user_id) === -1){
                    console.log("\n\n4\n\n");

                    docs.answers[y].upVotes.push(user_id);
                    console.log("\n\nu: "+docs.answers[y].upVotes);
                    console.log("\n\nd: "+docs.answers[y].downVotes);
                    docs.markModified("answers");

                    docs.save(function(err, newDocs){

                        console.log(err);
                        console.log("newDocs- "+ newDocs);
                        console.log("newDocs.answers[0].up.length- "+ newDocs.answers[0].upVotes.length);
                        console.log("y: ",y);

                        res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                       // console.log("up-"+(newDocs.answers[y].upVotes.length-1)+"-down-"+(newDocs.answers[y].downVotes.length-1));

                    });
                }
                else{
                    console.log("\n\n5\n\n");

                    docs.answers[y].upVotes.splice(d.indexOf(user_id),1);
                    console.log("\n\nu: "+docs.answers[y].upVotes);
                    console.log("\n\nd: "+docs.answers[y].downVotes);
                    docs.markModified("answers");
                    docs.save(function(err, newDocs){
                        console.log(err);
                        console.log("newDocs- "+ newDocs.answers[y]);

                        res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                        //console.log("up-"+(newDocs.answers[y].upVotes.length-1)+"-down-"+(newDocs.answers[y].downVotes.length-1));

                    });
                }}
        }}


    });

});

router.post('/downVotes', function(req, res){
    var {ques_id, ans_id, user_id} = req.body;
    var y=0;
    console.log(req.body);

    Ques.findById(ques_id, function(err, docs) {
        if (err){
            res.send("Error");
        }
        else{
            console.log("\n\n Docs: "+docs);
            console.log("docs.ans.length: ", docs.answers.length);
            for(i=0; i<docs.answers.length; i++){
                console.log("1");
                console.log(docs.answers[i]._id, ans_id);

                if(docs.answers[i]._id == ans_id){
                    y=i;
                    var u = docs.answers[y].upVotes;
                    var d = docs.answers[y].downVotes;
                    console.log("\n\n"+u);
                    console.log("\n\n"+d);
                    console.log("d.indexOf(user_id): ",d.indexOf(user_id));
                    console.log("u.indexOf(user_id): ",u.indexOf(user_id));

                    if(u.indexOf(user_id) !== -1){
                        console.log("\n\n3\n\n");

                        docs.answers[y].upVotes.splice(d.indexOf(user_id),1);
                        docs.answers[y].downVotes.push(user_id);
                        console.log("\n\nup: "+docs.answers[y].upVotes);
                        console.log("\n\ndn: "+docs.answers[y].downVotes);
                        docs.markModified("answers");
                        docs.save(function(err, newDocs){
                            console.log("err: ",err);
                            console.log("newDocs- "+ newDocs.answers[y]);
                            res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                        });
                    }
                    else if(d.indexOf(user_id) === -1){
                        console.log("\n\n4\n\n");

                        docs.answers[y].downVotes.push(user_id);
                        console.log("\n\nup: "+docs.answers[y].upVotes);
                        console.log("\n\ndn: "+docs.answers[y].downVotes);
                        docs.markModified("answers");
                        docs.save(function(err, newDocs){
                            console.log("newDocs- "+ newDocs);
                            console.log("y: ",y);

                            res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                        });
                    }
                    else{
                        console.log("\n\n5\n\n");

                        docs.answers[y].downVotes.splice(u.indexOf(user_id),1);
                        console.log("\n\nup: "+docs.answers[y].upVotes);
                        console.log("\n\ndn: "+docs.answers[y].downVotes);
                        docs.markModified("answers");
                        docs.save(function(err, newDocs){
                            console.log(err);
                            console.log("newDocs- "+ newDocs.answers[y]);
                            res.send("up-"+(newDocs.answers[y].upVotes.length)+"-down-"+(newDocs.answers[y].downVotes.length));
                        });
                        break;
                    }}
            }}
    });
});


router.post('/delete_question', function (req, res) {
    var {ques_id} = req.body;
    var user_id = req.cookies.login_id.split(',')[0];
    console.log(ques_id, user_id);
    Ques.findById(ques_id, function(err, docs){
        if(docs.user_id === user_id){
            Ques.deleteOne({_id: ques_id}, function(err, newDocs){
                console.log(newDocs);
                if(err){
                    res.send("Error Occurred");
                }
                else{
                    res.send("Question deleted");
                }
            })
        }
    });

});

router.post('/delete_comment', function (req, res) {
    var {ques_id, ans_id} = req.body;
     var user_id = req.cookies.login_id.split(',')[0];
     console.log("User_id: ", user_id);
    console.log(ques_id, user_id);
    Ques.findById(ques_id, function(err, docs){
        console.log(docs);
        for(i=0; i<docs.answers.length; i++){
            var ans = docs.answers[i];
            console.log("ans.user_ix: ", ans.user_id);

            if (docs.answers[i].user_id === user_id){
                var y = i;
                console.log("Same");
                docs.answers.splice(y,1);
                docs.save(function(err, newDocs){
                    if(err){
                        console.log(err);
                        res.send("Error");
                    }
                    else{
                        res.send("Comment Deleted");
                    }
                });
            }
        }
    });
});


router.post('/updatePass', function(req, res){
    var {user_id, old_pass, new_pass} = req.body;
    console.log(req.body);
    User.findById(user_id, function(err, docs){
        console.log("docs: ",docs);
        console.log("docs.user_pass: ",docs.user_pass == old_pass);

        if(err){
            console.log(err);
        }
        else if(docs.user_pass == old_pass){
            docs.user_pass = new_pass;
            console.log("new docs: ", docs);
            docs.save(function(err, newDocs){
                if(err){
                    console.log(err);
                    res.send("Error");
                }
                else{
                  //  res.clearCookie('login_id', {path: '/'}).status(200).send('Ok.');
                    res.cookie("login_id", newDocs.user_id+","+newDocs.user_pass+","+newDocs._id).send("Password Successfully Updated");
                    console.log("Cookie set");
                }
            })
        }
        else{
            res.send("Wrong Password");
        }
    });

    });


module.exports = router;

