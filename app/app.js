/** *************Angular app JS*********************/
"use strict";
const app = angular.module('contactApp', []);

const devUrl= "http://localhost:4000";
const prodUrl= "https://havenofbundleservices.herokuapp.com";

app.controller("MailController",["$scope", "$http", function($scope, $http) {

    const token = window.localStorage['token'];
    $scope.message = "";

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
    $http.get(devUrl+ '/users', headers).then(function (response) {
        $scope.users = response.data.users;
    });

    $scope.resend = function (index) {
        $("#sendSpan").hide();
        $("#loadId").append('<div class="loader"></div>')
        console.log($scope.users[index]);
        const url = devUrl+'/mail';
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
        const url = devUrl+'/login';
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
            msgErrorExists: "Your e-mail address is already saved, stay tuned",
            msgSuccess: "Congrats! You are in list.",
        });

        const $this = $(this);
        const emailInput = $(this).find("input[name=email]");
        const firstnameInput = $(this).find("input[name=firstname]");
        const lastnameInput = $(this).find("input[name=lastname]");
        const btnDiv = $(this).find("div[name=btnDiv]");
        $scope.message = "";
        const action = $(this).attr("action");
        const note = $(this).find(".note");
        const icon = $("<i></i>");
        const iconProcess = "fa fa-spinner fa-spin";
        const iconSuccess = "fa fa-check-circle";
        const iconError = "fa fa-exclamation-circle";

        // Test if the value of input is actually an email
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test($scope.notify)) {

            icon.removeClass();
            icon.addClass(iconProcess);
            $(this).removeClass("error success");
            note.show();
            $http({
                method: 'POST',
                url: devUrl +'/user',
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

                        $scope.notify = "";
                        $scope.firstname = "";
                        $scope.lastname = "";

                        // $scope.message = settings.msgSuccess;

                        $("#modalId").find(".pop-inner").find(".resultMsg").append(settings.msgSuccess);
                        $(".pop-outer").fadeIn("slow");
                    } else {
                        // Add error class to form
                        $this.addClass("error");
                        // Change the icon to error
                        icon.removeClass();
                        icon.addClass(iconError);

                        if (response.data.type === "ValidationError") {
                            $scope.message = settings.msgErrorValidation;
                            // $('input').val("");
                        } else if (response.data.type === "ValidationExists") {
                            $scope.message = settings.msgErrorExists;
                        } else {
                            $scope.message = settings.msgError503;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    // Add error class to form
                    if (response.data.type === "ValidationError") {
                        $scope.message = settings.msgErrorValidation;
                        // $('input').val("");
                    } else if (response.data.type === "ValidationExists") {
                        $scope.message = settings.msgErrorExists;
                    } else {
                        $scope.message = settings.msgError503;
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
            $scope.message = settings.msgErrorFormat;
        }
    }
}]);
