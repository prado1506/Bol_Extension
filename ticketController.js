var app = angular.module("ticket", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'view/test.html',
        controller  : 'test'
    })
});

app.controller("test", function($scope){

});