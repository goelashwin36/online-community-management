$(document).ready(function()  {

    var x = decodeURIComponent(document.cookie);
    var y = x.split("=")[1].split(","); //y is an array of username and password
    function appendComment(response){
        var i;
        console.log(response);
        for(i=0; i<response.length; i++) {

            var id= response[i]._id;
            var quesDate = response[i].date;
            var question = response[i];
            var ques_user_id = response[i].user_id;
            var Answer = response[i].answers;
            var ans = "";

            for (j = 0; j < response[i].answers.length; j++) {
                console.log("Comment");
                ans +="<div id=\""+ Answer[j]._id +"\">\n" +
                    "                    <div class=\"w3-container w3-card w3-white w3-round w3-margin\"><br>\n" +
                    "<i class=\"fa fa-close w3-right\" id=\"" + "del-" + id + "-" + Answer[j]._id + "\" onclick=\"javascript: delComm(this.id)\" style=\"font-size:24px\"></i><br>"+

                    "                <span class=\"w3-right w3-opacity\">"+ Answer[j].date +"</span>\n" +

                    "                    <h4>" + Answer[j].user_id + "</h4>\n" +
                    "                    <hr class=\"w3-clear\">\n" +
                    "                    <p>" + Answer[j].answer + "</p>\n" +
                    "\n" +
                    "                    <button type=\"button\" class=\"w3-button w3-theme-d1 w3-margin-bottom\"  onclick=\"javascript: vote(this.id)\" id=\"" + "up-" + question._id + "-" + Answer[j]._id + "\"><i class=\"fa fa-thumbs-up\"></i>" + (Answer[j].upVotes.length) + "</button>\n" +
                    "                    <button type=\"button\" class=\"w3-button w3-theme-d1 w3-margin-bottom\"  onclick=\"javascript: vote(this.id)\" id=\"" + "down-" + question._id + "-" + Answer[j]._id + "\"><i class=\"fa fa-thumbs-down\"></i>" + (Answer[j].downVotes.length) + "</button>\n" +
                    "                </div>\n"+
                "            </div>\n"

            }
            if(ans !== ""){
                $("#"+id+" " + ".comment").append(ans);
            }
        }
    }

    function appendQues(response){
        for(i=0; i<response.length; i++){

            var id= response[i]._id;
            var quesDate = response[i].date;
            var question = response[i].question;
            var ques_user_id = response[i].user_id;


            $('#ques_section').append("<div id=\""+ id +"\">\n" +
                "            <div class=\"w3-container w3-card w3-white w3-round w3-margin\"><br>\n" +
                "<i class=\"fa fa-close w3-right\" id=\"" + "del-" +  id + "\" onclick=\"javascript: delQues(this.id)\" style=\"font-size:24px\"></i>"+
                "                <img src=\"https://www.w3schools.com/w3images/avatar2.png\" alt=\"Avatar\" class=\"w3-left w3-circle w3-margin-right\" style=\"width:60px\">\n" +
                "                <br><span class=\"w3-right w3-opacity\">"+ quesDate +"</span>\n" +
                "                <h4>"+ ques_user_id +"</h4><br>\n" +
                "                <hr class=\"w3-clear\">\n" +
                "                <p>"+ question +"</p>\n" +

                "\n" +
                "                <div class=\"comment\">\n" +
                // ans +
                "\n" +
                "\n" +
                "                </div>\n" +
                "                <div class=\"w3-row-padding\">\n" +
                "                    <div class=\"w3-col m12\">\n" +
                "                        <div class=\"w3-card w3-round w3-white\">\n" +
                "                            <div class=\"w3-container w3-padding\">\n" +
                "                                <input style=\"width: 500px\" class=\"w3-border w3-padding\" id=\""+ "input-"+ id + "\">\n" +
                "                                <button type=\"button\" class=\"w3-button w3-theme postComment\"   onclick=\"javascript: postComm(this.id)\" id=\""+ "postComment-" + id +"\"><i class=\"fa fa-pencil postComment\"></i> �Post</button>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div><br>\n" +
                "            </div>\n" +
                "            </div>");
        }
            appendComment(response);
            }

    $.ajax(
        {
            type: "GET",
            url: "http://localhost:8080/getScience",


            success: function (response) {
                appendQues(response);
            }
        });

    $.ajax(
        {
            type: "GET",
            url: "http://localhost:8080/getArticles",
            success: function (response) {
                for(i=0; i<response.length; i++){
                    $("#article_section").append(" <div class=\"w3-container w3-card w3-white w3-round w3-margin\"><br>\n" +
                        "                                <span class=\"w3-right w3-opacity\">"+ response[i].date +"</span>\n" +
                        "                                <h4>"+ response[i].topic +"</h4>\n" +
                        "                                <hr class=\"w3-clear\">\n" +
                        "                                <p>"+ response[i].article +"</p>\n" +
                        "                            </div>");
                }

            }
        });
    function toTitleCase(str) {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    $.ajax(
        {
            type: "GET",
            url: "http://localhost:8080/getUserInfo",

            success: function (response) {
                console.log(response);
                var name = response[0].first_name + ' ' + response[0].last_name;
                var email = response[0].email;
                var mobile = response[0].mobile;
                var dob = response[0].dob;
                console.log("" + name+email+mobile+dob);
                $('#user_name').append(toTitleCase(name));
                $('#user_email').append(email);
                $('#user_mobile').append(mobile);
                $('#user_dob').append(dob);

            }
        });

    $("#btn_postques").click(function(){
        var ques = $("#new_q").val();
        var date = new Date;

        $.ajax(
            {
                type: "POST",
                url: "http://localhost:8080/post_question",
                data: {
                    "user_id": y[0],
                    "question": ques,
                    "date": date.getDate()+"-"+(date.getMonth()+1)+"-" + date.getFullYear() ,
                    "answers": []
                },
                success: function (response) {
                    if(response==="Error"){
                        $("#new_q").val("");
                        console.log(y[0]);
                        alert("Some error occurred");

                    }
                    else {
                        appendQues([response]);
                        $("#new_q").val("");
                    } },
                fail: function () {
                    console.log(y[0]);
                    alert("Some error occurred!");
                }
            });
    });

    $('#btnReqArticle').click(function(){
       var input = $('#requestQues');

        $.ajax(
            {
                type: "POST",
                url: "http://localhost:8080/requestArticle",
                data: {
                    "user_id": y[0],
                    "description": input.val()
                },


                success: function (response) {
                    console.log(response);
                    input.val("");
                    $("#artRequested").css('display','block');

                }
            });
    });

    $("#logout").click(function(){

        console.log("log");
        $.ajax(
            {
                type: "GET",
                url: "http://localhost:8080/logOut",

                success: function (response) {
            window.location.href = "/";
        }

    });
    });

    $('#update_pass').click(function() {
        var old_pass = $("input[name='old_pass']").val();
        var new_pass = $("input[name='new_pass']").val();
        console.log("Update Password");
        $.ajax(
            {
                type: "POST",
                url: "http://localhost:8080/updatePass",
                data: {
                    "user_id": y[2],
                    "old_pass": old_pass,
                    "new_pass": new_pass
                },


                success: function (response) {
                    $("input[name='old_pass']").val("");
                    $("input[name='new_pass']").val("");
                    alert(response);

                }
            });



    });



});