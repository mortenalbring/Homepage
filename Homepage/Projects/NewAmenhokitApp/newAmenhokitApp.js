var app = angular.module("NewAmenhokit", ['ui.router']);
app.controller("HomeController", HomeController);
app.controller("SessionsController", SessionsController);
app.controller("PlayerController", PlayerController);
app.service("DataService", DataService);
app.config(NewAmenhokitRouting);

app.filter('titlecase', function () {
    return function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    };
});