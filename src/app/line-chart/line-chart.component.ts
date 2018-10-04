import {Component, OnInit, Input, NgZone, ViewChild, ElementRef, HostListener, Renderer2} from '@angular/core';

@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

	@ViewChild('lineChartContainer') containerEl: ElementRef;
	@ViewChild('lineChart') lineChartEl: ElementRef;
	@ViewChild('lineChartCanvas') canvasEl: ElementRef;
	@ViewChild('lineChartDataBG') lineChartDataBG: ElementRef;
	@ViewChild('lineChartData') chartDataEl: ElementRef;

	// The width and height of the chart
	// These will be updated every time the page is resized
	w: number;
	h: number;

	tooltipPadding = 16;
	tooltipWidth = 200;
	tooltipHeight = 100;
	arrowWidth = 8;
	hiddenClass = 'hidden';
	tipDataClass = 'tip-data';

	public data = [
		{
			label: 'program 1/12',
			percent: 70,
			info: 'Sample Info'
		},
		{
			label: 'program 1/12',
			percent: 20,
			info: 'Sample Info'
		},
		{
			label: 'program 1/12',
			percent: 90,
			info: 'Sample Info'
		},
		{
			label: 'program 1/12',
			percent: 30,
			info: 'Sample Info'
		}
	];

	constructor(private renderer: Renderer2) {
	}

	ngOnInit() {
		this.renderLineChart();
	}

	/*
	 * Renders the line chart to the DOM
	 *
	 * Canvas is used for the line
	 * Vanilla HTML is used for the data points
	 */
	private renderLineChart(): void {

		// Set up the canvas at the correct width
		this.w = this.lineChartEl.nativeElement.clientWidth;
		this.h = this.lineChartEl.nativeElement.clientHeight;
		this.canvasEl.nativeElement.width = this.w;
		this.canvasEl.nativeElement.height = this.h;
		this.lineChartDataBG.nativeElement.addEventListener('click', function() {
			this.clearOpenTooltips();
		}.bind(this));
		const ctx: CanvasRenderingContext2D = this.canvasEl.nativeElement.getContext('2d');

		// Clear the previous iteration of the chart
		ctx.clearRect(0, 0, this.w, this.h);
		this.chartDataEl.nativeElement.innerHTML = null;

		// Initialize render values
		const sectionWidth: number = this.w / this.data.length;
		ctx.beginPath();
		ctx.moveTo(0, this.h);

		// Loop over data to render the line and points
		for (let key = 0; key < this.data.length; key++) {
			const x = (key + 1) * sectionWidth;
			const y = this.h - (this.data[key].percent / 100) * this.h;
			ctx.lineTo(x, y);
			this.renderDataPoint(x, y, key);
			this.renderTooltip(x, y, key, this.data[key]);
			this.renderArrow(x, y, key);
		}

		// Draw the chart stroke
		ctx.stroke();
	}

	/*
	 * Renders the data point to the DOM
	 */
	private renderDataPoint(x: number, y: number, key: number) {
		const point: any = this.renderer.createElement('div');
		point.style.left = x + 'px';
		point.style.top = y + 'px';
		point.classList.add('line-chart-data-point');

		// Handle the showing and hiding of the tooltips
		point.addEventListener('click', function() {
			this.clearOpenTooltips();
			const dataElements = this.chartDataEl.nativeElement.querySelectorAll('.dp-' + key);
			for (let key = 0; key < dataElements.length; key++ ) {
				dataElements[key].classList.toggle(this.hiddenClass);
			}
		}.bind(this));

		this.renderer.appendChild(this.chartDataEl.nativeElement, point);
	}

	/*
	 * Renders the tooltip to the DOM
	 */
	private renderTooltip(x: number, y: number, key: number, dp: any) {
		const tt = this.renderer.createElement('div');
		tt.classList.add(this.tipDataClass);
		tt.classList.add(this.hiddenClass);
		tt.classList.add('dp-' + key);
		tt.style.left = this.tooltipX(x) + 'px';
		tt.style.top = this.tooltipY(y) + 'px';
		tt.classList.add('line-chart-tooltip');
		this.renderer.appendChild(this.chartDataEl.nativeElement, tt);
	}

	/*
	 * Renders the arrow to the DOM
	 */
	private renderArrow(x: number, y: number, key: number) {
		const arrow = this.renderer.createElement('div');
		arrow.classList.add(this.tipDataClass);
		arrow.classList.add(this.hiddenClass);
		arrow.classList.add('dp-' + key);
		arrow.classList.add('arrow');
		arrow.style.top = y + 'px';
		if (!this.tooltipCanFitRight(x) && this.tooltipCanFitLeft(x)) {
			arrow.classList.add('arrow-right');
			arrow.style.left = x - this.tooltipPadding + 'px';
		} else {
			arrow.classList.add('arrow-left');
			arrow.style.left = x + this.arrowWidth + 'px';
		}
		this.renderer.appendChild(this.chartDataEl.nativeElement, arrow);
	}

	/*
	 * Returns the x position for the tooltip
	 *
	 * It will attempt to put the tooltip on the right,
	 * but will put it on hte left if there is not room on the right
	 */
	private tooltipX(x: number): number {
		if (!this.tooltipCanFitRight(x) && this.tooltipCanFitLeft(x)) {
			 return x - this.tooltipPadding - this.tooltipWidth;
		} else {
			return x + this.tooltipPadding;
		}
	}

	/*
	 * Returns the y position for the tooltip
	 *
	 * It will attempt to vertically center the tooltip
	 * but will put it wherever it has room
	 */
	private tooltipY(y: number): number {
		if (!this.tooltipCanFitTop(y)) {
			return 0;
		} else if (!this.tooltipCanFitBottom(y)) {
			return this.h - this.tooltipHeight;
		} else {
			return y - this.tooltipHeight / 2;
		}
	}

	private tooltipCanFitTop(y: number) {
		return this.tooltipHeight / 2 < y;
	}

	private tooltipCanFitRight(x: number) {
		return x + this.tooltipPadding + this.tooltipWidth < this.w;
	}

	private tooltipCanFitBottom(y: number) {
		return this.tooltipHeight / 2 < this.h - y;
	}

	private tooltipCanFitLeft(x: number) {
		return this.tooltipPadding + this.tooltipWidth < x;
	}

	/*
	 * Clears all the open tooltips
	 */
	private clearOpenTooltips(): void {
		const dataElements = this.chartDataEl.nativeElement.querySelectorAll('.' + this.tipDataClass);
		for (let key = 0; key < dataElements.length; key++) {
			dataElements[key].classList.add(this.hiddenClass);
		}
	}

	/*
	 * Because canvas is not responsive,
	 * the chart is re-rendered on resize.
	 */
	@HostListener('window:resize', ['$event'])
	onResize(event) {
			this.renderLineChart();
	}




}
