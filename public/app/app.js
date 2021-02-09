/** *************Angular app JS*********************/
"use strict";
const app = angular.module('contactApp', ['ngRoute']);

// const rest_url = "http://localhost:4000";
const rest_url = "https://havenofbundleservices.herokuapp.com";

// app.config(function ($routeProvider) {
//
//     $routeProvider.when('/', {
//         templateUrl: '/index.html',
//         controller: 'MainController'
//     }).when('/list', {
//         templateUrl: '/list.html',
//         controller: 'ListController'
//     }).otherwise({
//         redirectTo: "/"
//     });
// });
// app.controller("MailController", ["$scope", "$http", function ($scope, $http) {
//     $scope.template = {url: "/havenofbundlespub/public/index.html"};
//
//     $scope.navigate = function (section) {
//         switch (section) {
//             case "LIST":
//                 $scope.template = {url: "havenofbundlespub/public/list.html"};
//                 break;
//         }
//     }
//
// }]);
app.controller("MainController", ["$scope", "$http", function ($scope, $http) {

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

    $scope.list = function () {
        window.location.href = '/list'
    }

    $scope.loginMe = function () {
        console.log($scope.user);
        const url = rest_url + '/login';
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

    $scope.notifyMe = function () {
        // Default options.
        const settings = $.extend({
            // Error and success message strings
            msgError404: "Service is not available at the moment. Please check your internet connection or try again later.",
            msgError503: "Oops. Looks like something went wrong. Please try again later.",
            msgErrorValidation: "This email address looks fake or invalid. Please enter a real email address.",
            msgErrorFormat: "Your e-mail address is incorrect.",
            msgErrorExists: "Your e-mail address is already saved, stay tuned",
            msgErrorNotFound: "Your e-mail address is have not been found",
            msgSuccess: "Congrats! You are in list.",
        });

        const $this = $(this);
        $scope.message = "";
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
                url: rest_url + '/user',
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

                        $("#modalId").find(".pop-inner").find(".resultMsg").append(settings.msgSuccess);
                        $(".pop-outer").fadeIn("slow");
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    // Add error class to form
                    if (response.data.type === "ValidationError") {
                        $scope.message = settings.msgErrorValidation;
                        // $('input').val("");
                    } else if (response.data.type === "ValidationExists") {
                        $scope.message = settings.msgErrorExists;
                    } else if (response.data.type === "ValidationNotFound") {
                        $scope.message = settings.msgErrorNotFound;
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

app.controller("ListController", ["$scope", "$http", function ($scope, $http) {
    const headers = {'Content-Type': 'application/json'};
    $http.get(rest_url + '/users', headers).then(function (response) {
        $scope.users = response.data.users;
        let nb = [];
        let nb1 = [];
        let dataSets = [];
        let i = 0;
        while ($scope.users.length - i >= 3) {
            i += 3;
            nb.push(i);
            nb1.push(i);
        }

        const pair = i;
        const pair1 = i;
        if ($scope.users.length - i < 3) {
            nb.push(pair + $scope.users.length - i)
            nb1.push(pair1 + $scope.users.length - i)
        }

        nb.push(-1);
        nb1.push("All");

        for (let data of $scope.users) {
            let sets = [];
            sets.push(data.firstname);
            sets.push(data.lastname);
            sets.push(data.email);
            const sent = data.isSent;
            sets.push(sent ? "<div id=\"sendSpan\"><i id=\"iconId\" ng-show= \"true\" class=\"fa fa-check-circle\"\n" +
                "                                                   style=\"font-size: 2em; color: #449d44\"></i>" :
                "<i id=\"iconId\" ng-show=\"false\" class=\"fa fa-times\"\n" +
                "                                                   style=\"font-size: 2em; color: #ac2925\"></i>&#160;" +
                "<a id=\"sentEmailId\" ng-if=\"false\" \n" +
                "                                                   style=\"text-decoration: underline; color: #ab924d\">Resend</a>" +
                "<div id=\"loadId\"></div><div id=\"sendSpan\">");
            dataSets.push(sets);
        }

        let table = $('#table').DataTable({
            // "pagingType": "full_numbers",
            data: dataSets,
            columns: [
                {title: "Firstname"},
                {title: "Lastname"},
                {title: "Email"},
                {title: "Sent"},
            ],
            // columnDefs: [ {
            //     targets: -1,
            //     data: null,
            //     defaultContent: "<button>Click!</button>"
            // } ],
            lengthMenu: [nb, nb1]
        });

        $('#table tbody').on('click', 'a', function () {
            const index = table.row($(this).parents('tr')).data();
            $("#sendSpan").hide();
            $("#loadId").append('<div class="loader"></div>')
            console.log(index[2]);
            const url = rest_url + '/mail';
            const data = {email: index[2]};
            const headers = {'Content-Type': 'application/json'};
            $http.post(url, data, headers).then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response);
                    // $scope.users[index] = response.data.user;
                    // table.row($(this).parents('tr')).data()[3] = "";
                    // table.row($(this).parents('tr')).data()[3] = "<div id=\"sendSpan\"><i id=\"iconId\" ng-show= \"true\" class=\"fa fa-check-circle\"\n" +
                    //     "                                                   style=\"font-size: 2em; color: #449d44\"></i>";
                    // return Promise.resolve(response.data.user);
                    $("#sendSpan").show();
                    $("#loadId").empty();
                }, function errorCallback(response) {
                    console.log(response);
                    $("#sendSpan").show();
                    $("#loadId").empty();
                    // called asynchronously if an error occurs
                });


            // resend(data).then((res) => {
            //     table.row($(this).parents('tr')).data()[3] = "";
            //     table.row($(this).parents('tr')).data()[3] = "<div id=\"sendSpan\"><i id=\"iconId\" ng-show= \"true\" class=\"fa fa-check-circle\"\n" +
            //         "                                                   style=\"font-size: 2em; color: #449d44\"></i>";
            // });
        });
    });

    function resend(index) {
        $("#sendSpan").hide();
        $("#loadId").append('<div class="loader"></div>')
        console.log(index[2]);
        const url = rest_url + '/mail';
        const data = {email: index[2]};
        const headers = {'Content-Type': 'application/json'};
        $http.post(url, data, headers).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                // $scope.users[index] = response.data.user;
                return Promise.resolve(response.data.user);
                $("#sendSpan").show();
                $("#loadId").empty();
            }, function errorCallback(response) {
                console.log(response);
                $("#sendSpan").show();
                $("#loadId").empty();
                // called asynchronously if an error occurs
            });
    }
}]);
// });
