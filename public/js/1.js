$(document).ready(function()  {
    console.log("Hello");

    $('#signin').click(function(){
        var username = $("#u").val();
        var password = $("#p").val();

        console.log(username+"\n"+password);

        $.ajax(
            {
                type: "POST",
                url: "http://localhost:8080/login",
                data: {
                    "user_id": username,
                    "user_pass": password,
                },
                success: function (response) {
                    if(response == 'Ok')
                    window.location.href = "http://localhost:8080/final";
                    console.log(response);
                }
            });
        return 0;
    });

    $('#signup').click(function(){
        var username = $("input[name='user_reg']").val();
        var password = $("input[name='pass_reg']").val();
        var first = $("input[name='first']").val();
        var mid = $("input[name='mid']").val();
        var last = $("input[name='last']").val();
        var mob = $("input[name='mob']").val();
        var email = $("input[name='email']").val();
        var bday = $("input[name='bday']").val();

        console.log(username+"\n"+password);

        $.ajax(
            {
                type: "POST",
                url: "http://localhost:8080/signup",
                data: {
                    "user_id": username,
                    "user_pass": password,
                    "email": email,
                    "first_name": first,
                    "middle_name": mid,
                    "last_name": last,
                    "mobile": mob,
                    "dob": bday,
                },
                success: function (response) {
                    alert(response);
                }
            });
        return 0;
    });
});