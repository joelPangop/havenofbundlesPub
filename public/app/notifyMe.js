/*
 notifyMe.js v1.0.0
 Copyright (c)2014 Sergey Serafimovich
*/

(function ($) {
    "use strict";

    $.fn.notifyMe = function (options) {

        // Default options.
        const settings = $.extend({
            // Error and success message strings
            msgError404: "Service is not available at the moment. Please check your internet connection or try again later.",
            msgError503: "Oops. Looks like something went wrong. Please try again later.",
            msgErrorValidation: "This email address looks fake or invalid. Please enter a real email address.",
            msgErrorFormat: "Your e-mail address is incorrect.",
            msgSuccess: "Congrats! You are in list.",
        }, options);

        const $this = $(this);
        const emailInput = $(this).find("input[name=email]");
        const firstnameInput = $(this).find("input[name=firstname]");
        const lastnameInput = $(this).find("input[name=lastname]");
        const btnDiv = $(this).find("div[name=btnDiv]");

        const action = $(this).attr("action");
        const note = $(this).find(".note");
        const message = $("<div class='col-lg-12 align-center' style='color: #ab924d' id='message'></div>").appendTo($(this));
        const icon = $("<i></i>");
        const iconProcess = "fa fa-spinner fa-spin";
        const iconSuccess = "fa fa-check-circle";
        const iconError = "fa fa-exclamation-circle";

        $(this).click(() => {
            $("#modalId").find(".pop-inner").find(".resultMsg").empty();
            $(".pop-outer").fadeOut("slow");
        });

        $(".close").click(function () {
            $("#modalId").find(".pop-inner").find(".resultMsg").empty();
            $(".pop-outer").fadeOut("slow");
        });

        // btnDiv.after(icon);
        $(this).on("submit", function (e) {
            e.preventDefault();
            // Get value of input
            const firstname = firstnameInput.val();
            const lastname = lastnameInput.val();
            const email = emailInput.val();
            console.log($(this).notify);

            // Test if the value of input is actually an email
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (re.test(email)) {

                icon.removeClass();
                icon.addClass(iconProcess);
                $(this).removeClass("error success");
                message.text("");
                note.show();

                $.ajax({
                    type: "POST",
                    url: action,
                    data: {email: email, firstname: firstname, lastname: lastname, },
                    dataType: "json",
                    error: function (data) {
                        // Add error class to form
                        $this.addClass("error");

                        note.hide();
                        // Change the icon to error
                        icon.removeClass();
                        icon.addClass(iconError);

                        // Determine the status of response and display the message
                        if (data.status === 404) {
                            message.text(settings.msgError404);
                        } else {
                            message.text(settings.msgError503);
                        }
                    },

                }).done(function (data) {
                    // Hide note
                    note.hide();

                    if (data.status === "success") {
                        // Add success class to form
                        $this.addClass("success");
                        // Change the icon to success
                        icon.removeClass();
                        icon.addClass(iconSuccess);
                        emailInput.val("");
                        firstnameInput.val("");
                        lastnameInput.val("");
                        emailInput.trigger('input');
                        message.text(settings.msgSuccess);
                        $("#modalId").find(".pop-inner").find(".resultMsg").append(settings.msgSuccess);
                        $(".pop-outer").fadeIn("slow");
                        // window.location.href = '/'
                    } else {
                        // Add error class to form
                        $this.addClass("error");
                        // Change the icon to error
                        icon.removeClass();
                        icon.addClass(iconError);

                        if (data.type === "ValidationError") {
                            message.text(settings.msgErrorValidation);
                            $('input').val("");
                        } else {
                            message.text(settings.msgError503);
                        }
                    }

                });

            } else {
                $('input').val("");
                // Add error class to form
                $(this).addClass("error");
                // Hide note
                note.hide();
                // Change the icon to error
                icon.removeClass();
                icon.addClass(iconError);
                // Display the message
                message.text(settings.msgErrorFormat);
            }
        });
    };
}(jQuery));
