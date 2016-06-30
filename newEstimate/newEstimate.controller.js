var App;
(function (App) {
    'use strict';
    var NEstimateController = (function () {
        /*static $inject = ['$http'];*/
        function NEstimateController() {
            this.idList = [];
            this.counterList = [];
            this.chosenFeatures = [];
            this.featuresList = [];
            this.INEXACT_COORD = 0;
            this.COLOUR_MARK = 1;
            this.NUMBER_VALUE = 2;
            this.CHART = 3;
            this.SPEC_EVENT = 4;
            this.request();
            ymaps.ready(init);
            var myMap;
            function init() {
                myMap = new ymaps.Map("map_container", {
                    center: [55.73, 37.58],
                    zoom: 10
                });
            }
        }
        NEstimateController.prototype.request = function () {
            var req = new XMLHttpRequest();
            req.open("GET", "mark2.json", true);
            req.addEventListener("load", function () {
                this.marksJSON = req;
            });
            req.send(null);
            console.log("htyut");
        };
        NEstimateController.prototype.putMarks = function (map) {
            var marksCount = this.marksJSON.houses;
            var markNum = 0;
            var specEvents = {};
            var greyBorders = {};
            for (var i = 0; i < marksCount.length; i++) {
                this.bindFeatures(marksCount[i]);
                var id = marksCount[i].mark_id;
                var coords = marksCount[i].mark_coords;
                var counter = this.chosenFeatures[this.NUMBER_VALUE];
                var colour = this.chosenFeatures[this.COLOUR_MARK];
                specEvents[id] = this.chosenFeatures[this.SPEC_EVENT];
                greyBorders[id] = this.chosenFeatures[this.INEXACT_COORD];
                this.idList[i] = id;
                this.counterList[i] = this.chosenFeatures[this.CHART];
                var chartBuild = function () {
                    markLayout.superclass.build.call(this);
                    var markId = "#id_" + this.idList[markNum];
                    var borderId = "#br_" + this.idList[markNum];
                    var pinId = "#vs_" + this.idList[markNum];
                    var currentMark = $(markId);
                    var greyBorder = $(borderId);
                    var pinBorder = $(pinId);
                    var chart = new MarkChart(this.idList[markNum]);
                    chart.chartType = "ring";
                    chart.data = [+this.counterList[markNum], 8 - this.counterList[markNum]];
                    chart.colors = ['#0FFF2B', '#00ffff'];
                    chart.draw();
                    if (currentMark.data('id') == this.idList[markNum]) {
                        var specEvent = void 0;
                        for (var key in specEvents) {
                            if (key == this.idList[markNum]) {
                                specEvent = specEvents[key];
                            }
                        }
                        specEvent == "1" ? currentMark.css('visibility', 'visible') : currentMark.css('visibility', 'hidden');
                    }
                    if (greyBorder.data('id') == this.idList[markNum]) {
                        var uncoords = void 0;
                        for (var key in greyBorders) {
                            if (key == this.idList[markNum]) {
                                uncoords = greyBorders[key];
                            }
                        }
                        if (uncoords) {
                            greyBorder.css('box-shadow', '#ad9c94 0 0 0 2px');
                            pinBorder.css('visibility', 'visible');
                        }
                    }
                    (markNum < this.marksJSON.houses.length + 1) ? markNum++ : markNum = 0;
                };
                var markLayout = ymaps.templateLayoutFactory.createClass(getMarkTemplate(marksCount[i].type, id), {
                    build: chartBuild
                });
                // var balloonLayout = '';
                var polygonPlacemark = new ymaps.Placemark([coords.x, coords.y], {
                    // balloonContent: balloonLayout,
                    name: 'my name',
                    chartCount: counter,
                    colour: colour
                }, {
                    iconLayout: markLayout
                });
                polygonPlacemark.events.add('contextmenu', function (e) {
                    console.log("Показать балун");
                    //polygonPlacemark.balloon.open(e.get('coords'), 'asd');
                });
                map.geoObjects.add(polygonPlacemark);
            }
        };
        NEstimateController.prototype.putChosenFeatures = function (data, features, i) {
            for (var key in data) {
                if (key == features[i]) {
                    this.chosenFeatures[++i] = data[key];
                }
            }
        };
        NEstimateController.prototype.bindFeatures = function (dataMark) {
            var features = this.featuresList;
            var position = 0;
            for (var key in dataMark) {
                if (key != "mark_coords" && key != "mark_id" && key != "type" && key != "mark_uncoords") {
                    this.putChosenFeatures(dataMark[key], features, position);
                    position++;
                }
                if (key == "mark_uncoords") {
                    this.chosenFeatures[this.INEXACT_COORD] = dataMark[key];
                }
            }
        };
        return NEstimateController;
    }());
    App.NEstimateController = NEstimateController;
})(App || (App = {}));
angular
    .module('app')
    .controller('NEstimateController', App.NEstimateController);
