declare var ymaps: any;
namespace App {
    'use strict';

    export class NEstimateController {
        constructor() {
            ymaps.ready(MapTempl.MapFactory.init);
        }
    }
}

angular
    .module('app')
    .controller('NEstimateController', App.NEstimateController);