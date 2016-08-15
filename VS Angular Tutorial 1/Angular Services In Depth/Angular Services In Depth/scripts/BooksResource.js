(function () {

    angular.module("app")
    .factory("BooksResourse", ["$resource", BooksResource]);

    function BooksResource($resource) {
        
        return $resource(
            "/api/books/:book_id",  //url
            {
                book_id:"@book_id"  //data
            },
            {
                "update": { method: "PUT" }   //method
            });
    }

})();