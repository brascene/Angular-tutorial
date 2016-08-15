// Code goes here

(function () {

    var app = angular.module("app", ["ngRoute", "ngCookies","ngResource"]);

    //kreiranje servisa pomocu "provider"-a
    app.provider("books", ["constants", function (constants) {
        this.$get = function () {

            var appName = constants.APP_TITLE;
            var appDesc = constants.APP_DESCRIPTION;

            var version = constants.APP_VERSION;
            if (includeVersionInTitle) {
                appName += " " + version;
            }

            return {
                appName: appName,
                appDesc: appDesc
            };
        };

        var includeVersionInTitle = false;
        this.setIncludeVersionInTitle = function (value) {
            includeVersionInTitle = value;
        };

    }]);

    //config za app
    app.config(["booksProvider", "constants", "$routeProvider","$httpProvider","$logProvider","$provide",
        function (booksProvider, constants, $routeProvider, $httpProvider, $logProvider, $provide) {
            $provide.decorator("$log", ["$delegate", "books", logDecorator]);
        booksProvider.setIncludeVersionInTitle(true);
        $logProvider.debugEnabled(true);

        $httpProvider.interceptors.push("bookLoggerInterceptor");

        $routeProvider
          .when("/", {
              templateUrl: "books.html",
              controller: "BooksController",
              controllerAs: "books"
          })
          .when("/AddBook", {
              templateUrl: "addBook.html",
              controller: "AddBookController",
              controllerAs: "bookAdder"
          })
          .when("/EditBook/:bookID", {
              templateUrl: "editBook.html",
              controller: "EditBookController",
              controllerAs: "bookEditor",
              //resolve: {
              //books: function(dataService) {
              // return dataService.getAllBooks();
              // }
              // }
          })
          .otherwise("/");
        }]);

    function logDecorator($delegate, books) {
        function log(message) {
            message += " - " + new Date() + " (" + books.appName + ")";
            $delegate.log(message);
        }
        function info(message) {
            $delegate.info(message);
        }
        function warn(message) {
            $delegate.warn(message);
        }
        function error(message) {
            $delegate.error(message);
        }
        function debug(message) {
            $delegate.debug(message);
        }

        return {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug:debug
        };
    }

    //Logiranje promjene rute u console
    app.run(["$rootScope", function ($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            console.log("Route changed successfully");
        });

        $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
            console.log("Error while changing routes");
            console.log(event);
            console.log(current);
            console.log(previous);
            console.log(rejection);
        });
    }]);

}());