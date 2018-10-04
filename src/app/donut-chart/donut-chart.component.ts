import {Component, OnInit, Input, NgZone, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-donut-chart',
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

    @ViewChild('canvas') canvas: ElementRef;

    @Input() strokeWidth: number;

    @Input() size: number;

    @Input() percent: number;

    @Input() color: string;

    fillArcOpts: ArcOpts;

    ctx: any;

    animationIncrement: number;

    constructor(private ngZone: NgZone) {
    }

    ngOnInit() {
        this.setupChart();
        this.renderChartBackground();
        this.renderChart(0);
        this.animateIn(0);
    }

    setupChart(): void {

        /* Because canvas is blurry,
         * we make this twice as big as it needs to be and scale it to 0.5
         */
        this.size *= 2;
        this.strokeWidth *= 2;
        this.canvas.nativeElement.width = this.size;
        this.canvas.nativeElement.height = this.size;
        this.canvas.nativeElement.style.marginTop = (this.size / 4) * -1 + 'px';
        this.canvas.nativeElement.style.marginRight = (this.size / 4) * -1 + 'px';
        this.canvas.nativeElement.style.marginBottom = (this.size / 4 + 3) * -1 + 'px';
        this.canvas.nativeElement.style.marginLeft = (this.size / 4) * -1 + 'px';

        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.lineWidth = this.strokeWidth.toString();

        this.animationIncrement = this.percent / 20;

        this.fillArcOpts = new ArcOpts(
            this.size / 2,
            this.size / 2,
            this.size / 2 - this.strokeWidth / 2,
            0,
            0
        );
    }

    renderChartBackground(): void {
        this.ctx.beginPath();
        this.ctx.arc(
            this.fillArcOpts.x,
            this.fillArcOpts.y,
            this.fillArcOpts.radius,
            this.fillArcOpts.sAngle,
            2 * Math.PI
        );
        this.ctx.strokeStyle = 'rgba(0,0,0,0.04)';
        this.ctx.stroke();
        this.ctx.closePath();
    }

    renderChart(percent): void {
        this.ctx.beginPath();
        this.fillArcOpts.eAngle = percent * 0.01 * 2 * Math.PI;
        this.ctx.arc(
            this.fillArcOpts.x,
            this.fillArcOpts.y,
            this.fillArcOpts.radius,
            this.fillArcOpts.sAngle,
            this.fillArcOpts.eAngle
        );
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    animateIn(percent): void {
        const incrementer = 0.97;
        if (percent < this.percent) {
            this.animationIncrement *= incrementer;
            percent += this.animationIncrement;
            this.fillArcOpts.eAngle = percent * 0.01 * 2 * Math.PI;
            this.clearChart();
            this.renderChartBackground();
            this.renderChart(percent);

            this.ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    this.animateIn(percent);
                });
            });
        }
    }

    clearChart(): void {
        this.ctx.clearRect(0, 0, this.size, this.size);
    }

}

// Holds all the arguments needed to draw a circle on the canvas
class ArcOpts {
    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public sAngle: number,
        public eAngle: number
    ) {}
}