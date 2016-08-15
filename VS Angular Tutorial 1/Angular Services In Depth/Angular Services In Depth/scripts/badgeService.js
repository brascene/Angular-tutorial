(function () {

    angular.module("app")
      .value("badgeService", {
          retrieveBadge: retrieveBadge
      });

    function retrieveBadge(minutes) {
        var badge = null;

        switch (true) {
            case (minutes > 5000):
                badge = "Reading worm";
                break;
            case (minutes > 2500):
                badge = "Page turner";
                break;
            default:
                badge = "Getting stargetd";
        }

        return badge;
    };

}());