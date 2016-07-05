namespace MarkChart {

    export class MarkChart {
        canvasElementId: string;
        chartType: string;
        data = [];
        colors = [];
        constructor(elementId, chartType, data, colors) {
            this.canvasElementId = elementId;
            this.chartType = chartType;
            this.data = data;
            this.colors = colors;
        }

        // draw Chart
        drawChart() {
            var BorderWidth = 2.0;
            var Total = null;
            var canvas: any = document.getElementById(this.canvasElementId);
            var context = canvas.getContext('2d');
            context.lineCap = 'round';

            var width = context.canvas.width;
            var height = context.canvas.height;
            var marginTop = 10;
            var marginBottom = 10;
            var marginLeft = 10;
            var marginRight = 10;

            var labelMargin = 10;
            var dataValueMargin = 2;

            var StrokeStyle = '#fff';

            var Start = 150;
            context.lineWidth = BorderWidth;

            var dataSum = 0,
                dataSumForStartAngle = 0,
                dataLen = this.data.length;

            for (var i = 0; i < dataLen; i++) {
                dataSumForStartAngle += this.data[i];
                if (this.data[i] < 0) {
                    return;
                }
            }
            if (Total == null) {
                dataSum = dataSumForStartAngle;
            } else {
                dataSum = Total;
            }

            var AreaWidth = width - marginLeft - marginRight;
            var AreaHeight = height - marginTop - marginBottom;

            var centerX = width / 2;
            var centerY = marginTop + (AreaHeight / 2);

            var doublePI = 2 * Math.PI;
            var radius = (Math.min(AreaWidth, AreaHeight) / 2);

            var maxLabelWidth = 0;

            radius = radius - maxLabelWidth - labelMargin;

            var startAngle = Start * doublePI / dataSumForStartAngle;
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
                    context.fillStyle = '#0FFF2B';
                }
                context.fill();

                context.strokeStyle = StrokeStyle;
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
