(function () {

    angular.module("app")
           .service("logger", BookAppLogger);

    function LoggerBase() {

    };

    LoggerBase.prototype.output = function (message) {
        console.log("Logger Base:  " + message);
    };

    function BookAppLogger() {
        LoggerBase.call(this);
        this.logBook = function (book) {
            console.log("Book title: " + book.title);
        };
    };

    BookAppLogger.prototype = Object.create(LoggerBase.prototype);

}());