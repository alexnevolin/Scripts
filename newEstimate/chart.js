/*namespace App {
    'use strict';

    export class NewEstimateChart {

        public MarkChart(canvasElementId: string): void {
            // set properties of chart
            var canvas = document.getElementById(canvasElementId);
            this.ctx = canvas.getContext('2d');
            this.width = this.ctx.canvas.width;
            this.height = this.ctx.canvas.height;

            this.marginTop = 10;
            this.marginBottom = 10;
            this.marginLeft = 10;
            this.marginRight = 10;

            this.labelMargin = 10;
            this.dataValueMargin = 2;

            this.data = [];
            this.colors = [];

            this.StrokeStyle = '#fff';
            this.BorderWidth = 2.0;

            this.Start = 150;
            this.Total = null;

            this.draw = function () {
                var context = this.ctx;
                context.lineCap = 'round';
                var minFactor = Math.min(this.widthSizeFactor, this.heightSizeFactor);

                this.drawChart(true);
            };

            // draw Chart
            this.drawChart = function () {
                var context = this.ctx;
                context.lineWidth = this.BorderWidth;

                var dataSum = 0,
                    dataSumForStartAngle = 0,
                    dataLen = this.data.length;

                for (var i = 0; i < dataLen; i++) {
                    dataSumForStartAngle += this.data[i];
                    if (this.data[i] < 0) {
                        return;
                    }
                }
                if (this.Total == null) {
                    dataSum = dataSumForStartAngle;
                } else {
                    dataSum = this.Total;
                }

                var AreaWidth = this.width - this.marginLeft - this.marginRight;
                var AreaHeight = this.height - this.marginTop - this.marginBottom;

                var centerX = this.width / 2;
                var centerY = this.marginTop + (AreaHeight / 2);

                var doublePI = 2 * Math.PI;
                var radius = (Math.min(AreaWidth, AreaHeight) / 2);

                var maxLabelWidth = 0;

                radius = radius - maxLabelWidth - this.labelMargin;

                var startAngle = this.Start * doublePI / dataSumForStartAngle;
                var currentAngle = startAngle;
                var endAngle = 0;
                var incAngleBy = 0;

                // draw chart in canvas
                for (var i = 0; i < dataLen; i++) {
                    context.beginPath();
                    incAngleBy = this.data[i] * doublePI / dataSum;
                    endAngle = currentAngle + incAngleBy;

                    context.moveTo(centerX, centerY);
                    context.arc(centerX, centerY, radius, currentAngle, endAngle, false);
                    context.lineTo(centerX, centerY);

                    currentAngle = endAngle;

                    if (this.colors[i]) {
                        context.fillStyle = this.colors[i];
                    } else {
                        context.fillStyle = this.FillStyle;
                    }
                    context.fill();

                    context.strokeStyle = this.StrokeStyle;
                    context.stroke();
                }

                var ringCenterRadius = radius / 2;

                // "cut" the central part from chart
                context.save();

                context.beginPath();
                context.moveTo(centerX + ringCenterRadius, centerY);
                context.arc(centerX, centerY, ringCenterRadius, 0, doublePI, false);

                context.globalCompositeOperation = 'destination-out';
                context.fillStyle = '#000';
                context.fill();

                context.restore();
            }
        }

    }
}

angular
    .module('app')
    .controller('NewEstimateController', App.NewEstimateController);*/ 
