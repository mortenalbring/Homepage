var app = angular.module("NewAmenhokit", ['ui.router']);
app.controller("HomeController", HomeController);
app.controller("GraphController", GraphController);
app.controller("GraphD3Controller", GraphD3Controller);
app.controller("SessionsController", SessionsController);
app.controller("PlayerController", PlayerController);
app.controller("StatsController", StatsController);
app.service("DataService", DataService);
app.service("BowlingService", BowlingService);
app.config(NewAmenhokitRouting);

app.filter('titlecase', function () {
    return function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    };
});