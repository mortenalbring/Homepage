var app = angular.module("NewAmenhokit", ['ui.router']);
app.controller("HomeController", HomeController);
app.controller("SessionsController", SessionsController);
app.controller("PlayerController", PlayerController);
app.service("DataService", DataService);
app.config(NewAmenhokitRouting);