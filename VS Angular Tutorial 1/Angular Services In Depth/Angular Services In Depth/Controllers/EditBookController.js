(function() {

    angular.module("app")
      .controller("EditBookController", ["$routeParams", "books", "$cookies",
        "$cookieStore", "dataService", "$log", "$location","currentUser", EditBookController
      ]);

    function EditBookController($routeParams, books, $cookies,
      $cookieStore, dataService, $log, $location, currentUser) {
        var vm = this;

        dataService.getBookById($routeParams.bookID)
          .then(getBookSuccess)
          .catch(getBookError);

        function getBookSuccess(book) {
            vm.currentBook = book;
            // $cookieStore.put("lastEdited", vm.currentBook);
           
            currentUser.lastBookEdited = vm.currentBook;
        }

        function getBookError(reason) {
            $log.error(reason);
        }

        vm.saveBook = function () {
            dataService.updateBook(vm.currentBook)
        .then(updateBookSuccess)
        .catch(updateBookError);
        }


        function updateBookSuccess(message) {
            $log.info(message);
            $location.path("/");
        }

        function updateBookError(errorMsg) {
            $log.error(errorMsg);
        }

        vm.setAsFavourite = function () {
            $cookies.favouriteBook = vm.currentBook.title;
        }
    }


}());