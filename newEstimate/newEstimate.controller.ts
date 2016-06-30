declare var ymaps: any;
namespace App {
    'use strict';
    var marksJSON;

    export class NEstimateController {

        static $inject = ['$http'];

        constructor(private $http: any) {



            $http.get('mark2.json').success(function (data) {
                console.log(data + '3');
                marksJSON = data;
                console.log(data+'3');
                console.log(marksJSON);
            });

            ymaps.ready(init);
            var myMap;
            function init() {

                var map: any = new ymaps.Map("map_container", {
                        center: [55.73, 37.58],
                        zoom: 10
                    }),
                    CustomControlClass: any = function (options): void {
                        CustomControlClass.superclass.constructor.call(this, options);
                        this._$content = null;
                        this._geocoderDeferred = null;
                    };

                ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
                    onAddToMap: function (map) {
                        CustomControlClass.superclass.onAddToMap.call(this, map);
                        this._lastCenter = null;
                        this.getParent().getChildElement(this).then(this._onGetChildElement, this);
                    },

                    onRemoveFromMap: function (oldMap) {
                        this._lastCenter = null;
                        if (this._$content) {
                            this._$content.remove();
                            this._mapEventGroup.removeAll();
                        }
                        CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
                    },

                    _onGetChildElement: function (parentDomContainer) {
                        var templateWindowFeatures: any;
                        this._$content = templateWindowFeatures.appendTo(parentDomContainer);
                        this._mapEventGroup = this.getMap().events.group();

                        var myWindow = $("#window"),
                            features = $("#features"),
                            mapContainer = $("#map_container");

                        var cache = myWindow.html();

                        features.click(function () {
                            myWindow.data("kendoWindow").open();
                            features.fadeOut();
                        });

                        myWindow.on('click', '#refreshFeatures', function () {
                            myWindow.html(cache);
                        });

                        mapContainer.click(function () {
                            if (features.css('display') == "none") {
                                myWindow.data("kendoWindow").close();
                            }
                        });

                        function defaultFeatures() {
                            var vals = $('.k-radio').map(function (i, el) {

                                if ($(el).prop('checked')) {
                                    return $(el).val();
                                }

                            }).get();

                            this.featuresList = vals;
                        }

                        myWindow.on('click', '#sendFeatures', function () {
                            defaultFeatures();
                            map.geoObjects.removeAll();
                            this.markNum = 0;
                            this.putMarks(map);
                        });

                        function onClose() {
                            features.fadeIn();
                        }

                        myWindow.kendoWindow({
                            visible: false,
                            title: "Задать характеристики для отображения меток",
                            actions: [
                                "Close"
                            ],
                            close: onClose
                        }).data("kendoWindow");

                        defaultFeatures();
                        this.putMarks(map);
                    }

                });

                var buttonControl = new CustomControlClass();
                map.controls.add(buttonControl, {
                    float: 'right',
                    position: {
                        top: 50,
                        right: 10
                    }
                });
                myMap = map;
            }


            this.putMarks(myMap);

        }

        /* private marksJSON: any = {};*/
        private idList: string[] = [];
        private counterList: string[] = [];
        private chosenFeatures: string[] = [];
        private featuresList: string[] = [];

        private INEXACT_COORD = 0;
        private COLOUR_MARK = 1;
        private NUMBER_VALUE = 2;
        private CHART = 3;
        private SPEC_EVENT = 4;

        /*private request(): void {
         let req = new XMLHttpRequest();
         req.open("GET", "mark2.json", true);
         req.addEventListener("load", function () {
         this.marksJSON = req;
         });
         req.send(null);
         console.log("htyut");
         }*/

        private putMarks(map) {
            console.log(marksJSON);
            let marksCount: any = marksJSON.houses;
            let markNum: number = 0;
            let specEvents: Object = {};
            let greyBorders: Object = {};
            console.log(marksCount);
            for (let i = 0; i < marksCount.length; i++) {

                this.bindFeatures(marksCount[i]);

                let id: string = marksCount[i].mark_id;
                let coords: any = marksCount[i].mark_coords;
                let counter: string = this.chosenFeatures[this.NUMBER_VALUE];
                let colour = this.chosenFeatures[this.COLOUR_MARK];

                specEvents[id] = this.chosenFeatures[this.SPEC_EVENT];
                greyBorders[id] = this.chosenFeatures[this.INEXACT_COORD];

                this.idList[i] = id;
                this.counterList[i] = this.chosenFeatures[this.CHART];

                var chartBuild = function (): void {
                    markLayout.superclass.build.call(this);

                    let markId: string = "#id_" + this.idList[markNum];
                    let borderId: string = "#br_" + this.idList[markNum];
                    let pinId: string = "#vs_" + this.idList[markNum];
                    let currentMark: any = $(markId);
                    let greyBorder: any = $(borderId);
                    let pinBorder: any = $(pinId);
                    let chart = new MarkChart(this.idList[markNum]);

                    chart.chartType = "ring";
                    chart.data = [+this.counterList[markNum], 8 - this.counterList[markNum]];
                    chart.colors = ['#0FFF2B', '#00ffff'];
                    chart.draw();

                    if (currentMark.data('id') == this.idList[markNum]) {
                        let specEvent: string;

                        for (let key in specEvents) {
                            if (key == this.idList[markNum]) {
                                specEvent = specEvents[key];
                            }
                        }
                        specEvent == "1" ? currentMark.css('visibility', 'visible') : currentMark.css('visibility', 'hidden');
                    }

                    if (greyBorder.data('id') == this.idList[markNum]) {
                        let uncoords: boolean;

                        for (let key in greyBorders) {
                            if (key == this.idList[markNum]) {
                                uncoords = greyBorders[key];
                            }
                        }
                        if (uncoords) {
                            greyBorder.css('box-shadow', '#ad9c94 0 0 0 2px');
                            pinBorder.css('visibility', 'visible');
                        }
                    }

                    (markNum < marksJSON.houses.length + 1) ? markNum++ : markNum = 0;
                };
                var getMarkTemplate: any;
                var markLayout = ymaps.templateLayoutFactory.createClass(getMarkTemplate(marksCount[i].type, id), {
                    build: chartBuild
                });

                // var balloonLayout = '';

                var polygonPlacemark = new ymaps.Placemark(
                    [coords.x, coords.y], {
                        // balloonContent: balloonLayout,
                        name: 'my name',
                        chartCount: counter,
                        colour: colour
                    }, {
                        iconLayout: markLayout
                    }
                );

                polygonPlacemark.events.add('contextmenu', function (e) {
                    console.log("Показать балун");
                    //polygonPlacemark.balloon.open(e.get('coords'), 'asd');
                });

                map.geoObjects.add(polygonPlacemark);
            }

        }

        private putChosenFeatures(data: Object, features: Object, i: number): void {

            for (let key in data) {
                if (key == features[i]) {
                    this.chosenFeatures[++i] = data[key];
                }
            }
        }

        private bindFeatures(dataMark: Object): void {
            let features: Object = this.featuresList;
            let position: number = 0;

            for (let key in dataMark) {

                if (key != "mark_coords" && key != "mark_id" && key != "type" && key != "mark_uncoords") {
                    this.putChosenFeatures(dataMark[key], features, position);
                    position++;
                }

                if (key == "mark_uncoords") {
                    this.chosenFeatures[this.INEXACT_COORD] = dataMark[key];
                }
            }
        }



    }

}

angular
    .module('app')
    .controller('NEstimateController', App.NEstimateController);