var App;
(function (App) {
    'use strict';
    var NEstimateController = (function () {
        function NEstimateController() {
            ymaps.ready(MapTempl.MapFactory.init);
        }
        return NEstimateController;
    }());
    App.NEstimateController = NEstimateController;
})(App || (App = {}));
angular
    .module('app')
    .controller('NEstimateController', App.NEstimateController);
