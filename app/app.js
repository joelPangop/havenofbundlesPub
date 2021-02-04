/** *************Angular app JS*********************/
"use strict";
const app = angular.module('contactApp', []);
angular.UNSAFE_restoreLegacyJqLiteXHTMLReplacement();

const devUrl= "http://localhost:4000";
const prodUrl= "https://havenofbundleservices.herokuapp.com";

app.controller("MailController",[ "$scope", "$http", function($scope, $http) {

    const token = window.localStorage['token'];

    if (token) {
        $scope.user = JSON.parse(window.localStorage['user']);
    } else {
        $scope.user = {
            email: '',
            username: 'guest',
            type: undefined
        }
    }

    $scope.isLogged = $scope.user.type === "admin" || $scope.user.type === "superadmin"

    const headers = {'Content-Type': 'application/json'};
    $http.get(prodUrl+'/users' || devUrl+ '/users', headers).then(function (response) {
        $scope.users = response.data.users;
    });

    $scope.resend = function (index) {
        $("#sendSpan").hide();
        $("#loadId").append('<div class="loader"></div>')
        console.log($scope.users[index]);
        const url = prodUrl+'/mail';
        const data = {email: $scope.users[index].email};
        const headers = {'Content-Type': 'application/json'};
        $http.post(url, data, headers).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                $scope.users[index] = response.data.user;
                $("#sendSpan").show();
                $("#loadId").empty();
            }, function errorCallback(response) {
                console.log(response);
                $("#sendSpan").show();
                $("#loadId").empty();
                // called asynchronously if an error occurs
            });
    }

    $scope.loginMe = function () {
        console.log($scope.user);
        const url = prodUrl+'/login';
        const headers = {'Content-Type': 'application/json'};
        const user = {email: $scope.email, password: $scope.password}
        $http({
            method: 'POST',
            url: url,
            data: {user: user},
            error: function (data) {
                console.log(data);
            },
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                if (response.data.status === "success") {
                    window.localStorage['token'] = response.data.access_token;
                    window.localStorage['user'] = JSON.stringify(response.data.user);
                    $scope.user = response.data.user;
                    $scope.isLogged = $scope.user.type === "admin" || $scope.user.type === "superadmin"
                    window.location.href = '/';
                }
            }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.logoutMe = function () {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        $scope.user = {
            email: '',
            username: 'guest',
            type: undefined
        }
        // $('#loginCloseId').click();
        window.location.href = '/';
        $scope.isLogged = $scope.user.type === "admin" || $scope.user.type === "superadmin"
    }

    $scope.notifyMe = function(){
        // Default options.
        const settings = $.extend({
            // Error and success message strings
            msgError404: "Service is not available at the moment. Please check your internet connection or try again later.",
            msgError503: "Oops. Looks like something went wrong. Please try again later.",
            msgErrorValidation: "This email address looks fake or invalid. Please enter a real email address.",
            msgErrorFormat: "Your e-mail address is incorrect.",
            msgSuccess: "Congrats! You are in list.",
        });

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

        // Test if the value of input is actually an email
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test($scope.notify)) {

            icon.removeClass();
            icon.addClass(iconProcess);
            $(this).removeClass("error success");
            message.text("");
            note.show();
            $http({
                method: 'POST',
                url: prodUrl +'/user',
                data: {email: $scope.notify, firstname: $scope.firstname, lastname: $scope.lastname},
                error: function (data) {
                    console.log(data);
                },
            }).then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response);
                    // Hide note
                    note.hide();

                    if (response.data.status === "success") {
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
                }, function errorCallback(response) {
                    console.log(response);
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
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
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
    }

}]);
