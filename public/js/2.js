$(document).ready(function()  {


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


});