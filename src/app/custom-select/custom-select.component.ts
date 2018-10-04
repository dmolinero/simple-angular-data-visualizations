import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  @ViewChild('customSelect') customSelect: ElementRef;

  public selectedOption: any;

  public options = [
  	{
  		label: 'bob',
  		value: '1'
  	},
  	{
  		label: 'jim',
  		value: '2'
  	},
  	{
  		label: 'jip',
  		value: '3'
  	},
  ]

  constructor() { }

  ngOnInit() {
  	this.selectedOption = this.options[0];
  }

  updateSelection(selection) {
  	this.selectedOption = selection;
  }

  focusOptionEl(option) {
  	// Clear existing tab indecies
  	const els = this.customSelect.nativeElement.querySelectorAll('li');
  	for (let i = 0; i < els.length; i++) {
  		els[i].tabIndex = -1;
  	}
  	// Assign the tab index to only the new focused element
  	const el = this.customSelect.nativeElement.querySelector('li[value="' + option.value + '"]');
  	el.tabIndex = 0;
  	el.focus();
  }

  tabIndex(option) {
  	return option.value === this.selectedOption.value ? 0 : -1;
  }

  moveDown(e, option) {
  	e.preventDefault();
  	let nextOptionIndex = this.options.indexOf(option) + 1;
  	if (nextOptionIndex > this.options.length - 1) {
  		nextOptionIndex = 0;
  	}
  	this.focusOptionEl(this.options[nextOptionIndex]);
  }

  moveUp(e, option) {
  	e.preventDefault();
  	let previousOptionIndex = this.options.indexOf(option) - 1;
  	if (previousOptionIndex < 0) {
  		previousOptionIndex = this.options.length - 1;
  	}
  	this.focusOptionEl(this.options[previousOptionIndex]);
  }

  openSelectMenu() {
  	// this.focusOptionEl(this.options[0]);
  }

}
