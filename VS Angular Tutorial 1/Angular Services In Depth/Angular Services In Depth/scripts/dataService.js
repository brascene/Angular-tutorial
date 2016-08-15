(function () {

    angular.module("app")
      .factory("dataService", ["$q", "$timeout", "$http",
      "constants", "$routeParams","$cacheFactory", dataService]);

    function dataService($q, $timeout, $http, constants, $routeParams, $cacheFactory) {

        return {
            getAllBooks: getAllBooks,
            getAllReaders: getAllReaders,
            getBookById: getBookById,
            updateBook: updateBook,
            addBook: addBook,
            getUserSummary:getUserSummary
        };

        //Get user summary data
        function getUserSummary() {

            var deffered = $q.defer();

            var dataCache = $cacheFactory.get("bookLoggerCache");
            if (!dataCache) {
                dataCache = $cacheFactory("bookLoggerCache");
            }

            var summaryFromCache = dataCache.get("summary");
            if (summaryFromCache) {
                console.log("returning summary from cache");
                deffered.resolve(summaryFromCache);
            }
            else {
                console.log("Getting new summary data");

                var bookPremise = getAllBooks();
                var readerPromise = getAllReaders();

                $q.all([bookPremise, readerPromise])
                    .then(function (bookLoggerData) {
                        var allBooks = bookLoggerData[0];
                        var allReaders = bookLoggerData[1];

                        //ukupne minute citanja od svi readera
                        var grandTotalMinutes = 0;
                        allReaders.forEach(function (currentReader, index, array) {
                            grandTotalMinutes += currentReader.totalMinutesRead;
                        });

                        var summaryData = {
                            bookCount: allBooks.length,
                            readerCount: allReaders.length,
                            grandTotalMinutes: grandTotalMinutes
                        };

                        dataCache.put("summary", summaryData);
                        deffered.resolve(summaryData);
                    });
            }        
            return deffered.promise;
        }

        //delete cache
        function deleteSummaryFromCache() {
            var dataCache = $cacheFactory.get("bookLoggerCache");
            dataCache.remove("summary"); 
        }

        //Get all books
        function getAllBooks() {
            return $http({
                method: "GET",
                url: "books.json",
                headers: {
                    "PS-BookLogger-Version": constants.APP_VERSION
                },
                transformResponse: transformGetBooks,
                cache:true
            }).
            then(sendResponseData)
            .catch(getBookRetrieveError);
        }

        function deleteAllBooksResponseFromCache() {
            var httpCache = $cacheFactory.get("$http");
            httpCache.remove("books.json");
        }

        function transformGetBooks(data, headersGetter) {
            var transformed = angular.fromJson(data);
            transformed.forEach(function (currentValue, index, array) {
                currentValue.dateDownloaded = new Date();
            });
            console.log(transformed);
            return transformed;
        }

        function sendResponseData(response) {
            return response.data;
        }
        function sendResponseData1(response) {
            var books = response.data;
            var res = books.filter(function (item) {
                return item.book_id == $routeParams.bookID;
            })[0];
            return res;
        }
        function getBookRetrieveError(response) {
            return $q.reject("Error while retrieving data. HTTP status: " + response.status);
        }

        //Get book by id
        function getBookById(bookID) {
            return $http({
                method: "GET",
                url: "books.json"
            })
            .then(sendResponseData1)
            .catch(getBookRetrieveError);
        }

        //Update book
        function updateBook(book) {
            return $http({
                method: "PUT",
                url: "books.json",
                data: book
            })
            .then(updateBookSuccess)
            .catch(updateBookError);
        }
        function updateBookSuccess(response) {
            return "Book updated: " + response.config.data.title;
        }
        function updateBookError(response) {
            return $q.reject("Error while updating book. HTTP status: " + response.status);
        }

        //Add new book
        function addBook(newBook) {
            return $http({
                method: "POST",
                url: "unknown",
                data: newBook
            })
            .then(addBookSuccess)
            .catch(addBookError);
        }
        function addBookSuccess(response) {
            return "Book added: " + response.config.data.title;
        }
        function addBookError(response) {
            return $q.reject("Error while adding new book. HTTP status: " + response.status);
        }

        //Delete book
        function deleteBook(bookID) {
            return $http({
                method: "DELETE",
                url: "ne kontam"
            })
            .then(deleteBookSuccess)
            .catch(deleteBookError);
        }
        function deleteBookSuccess(message) {
            $log.info(message);
            $location.path("/");
        }
        function deleteBookError(message) {
            $log.error(message);
        }

        //Get all readers
        function getAllReaders() {
            readersArray = [{
                reader_id: 1,
                name: "Reader 1",
                weeklyReadingGoal: 300,
                totalMinutesRead: 5000
            }, {
                reader_id: 2,
                name: "Reader 2",
                weeklyReadingGoal: 400,
                totalMinutesRead: 2000
            }, {
                reader_id: 3,
                name: "Reader 3",
                weeklyReadingGoal: 200,
                totalMinutesRead: 1000
            }];

            var deffered = $q.defer();

            $timeout(function () {
                deffered.resolve(readersArray);
            }, 500);

            return deffered.promise;
        }
    }

}());