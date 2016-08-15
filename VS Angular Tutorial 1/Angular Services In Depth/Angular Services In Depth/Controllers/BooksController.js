(function () {

    angular.module("app")
           .controller("BooksController",
           ["books", "dataService", "logger", "badgeService", "$q",
           "$cookies", "$cookieStore", "$http", "constants", "$route",
           "currentUser","BooksResourse","$log", BooksController]);

    function BooksController(books, dataService, logger, badgeService, $q,
        $cookies, $cookieStore, $http, constants, $route, currentUser, BooksResourse, $log) {
        var vm = this;
        vm.appName = books.appName;

        dataService.getUserSummary()
        .then(getUserSummarySuccess);

        function getUserSummarySuccess(summaryData) {
            console.log(summaryData);
            
            vm.summaryData = summaryData;
            $log.log("All summary data has been successfully receieved!");
        }

        var bookPromise = dataService.getAllBooks()
        //.then(getBooksSuccess,null,getBooksNotification)
        //.catch(errorCallback)
        //.finally(getAllBooksComplete);

        function getBooksSuccess(books) {
            //throw "error in success handler";
            vm.allBooks = books;
           
        }
        function getAllBooksComplete() {
            console.log("Get all books complete");
        }

        function getBooksError(reason) {
            console.log(reason);
        }
        function errorCallback(errMsg) {
            console.log("Error message: " + errMsg);
        }
        function getBooksNotification(notification) {
            console.log(notification);
        }

        var readerPromise = dataService.getAllReaders();
        //.then(getReadersSuccess)
        //.catch(errorCallback)
        //.finally(getAllReadersComplete);

        // function getReadersSuccess(readers){
        //vm.allReaders=readers;
        //}
        //function getAllReadersComplete(){
        //console.log("All readers get completed.");
        //}

        $q.all([bookPromise, readerPromise])
          .then(getAllDataSuccess)
          .catch(getAllDataError)
          .finally(msg);

        function getAllDataSuccess(dataArray) {
            vm.allBooks = dataArray[0];
            vm.allReaders = dataArray[1];
           
        }
        function getAllDataError(err) {
            console.log("Error happened: " + err);
        }
        function msg() {
            console.log("All data callbacks completed");
        }

        //delete book
        vm.deleteBook = function(bookID){
            dataService.deleteBook(bookID)
            .then(deleteBookSuccess)
            .catch(deleteBookError)
        };

        function deleteBookSuccess(response){
            $log.info(response);
            $route.reload();
        }
        function deleteBookError(response){
            $log.error(response);
        }

        vm.getBadge = badgeService.retrieveBadge;

        //vm.favouriteBook = $cookieStore.get("lastEdited");
        vm.favouriteBook = currentUser.lastBookEdited;

    }

}());