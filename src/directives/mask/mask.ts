import { Directive, Attribute, ElementRef } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';
import * as masker from 'vanilla-masker';

/**
* Generated class for the MaskDirective directive.
*
* See https://angular.io/api/core/Directive for more info on Angular
* Directives.
*/
@Directive({
	selector: '[mask]', // Attribute selector
	host: {
		'(keydown)': 'onInputChange($event)',
	},
	providers: [FormControlName]
})
export class MaskDirective {

	pattern: string;

    constructor(
    	public elem: ElementRef,
        public formControlName: FormControlName,
        @Attribute('mask') pattern: string){

    	console.log('Mask Directive is running');
        this.pattern = pattern;
    }

    onInputChange(event) {
        let value = event.target.value;

        let key = event.keyCode;
    	console.log(key);
        let pattern = this.pattern;
        if (value.length >= this.pattern.length) {
        	event.preventDefault();
        	// value = value.substring(0, this.pattern.length);
        }else{
        }
    	value = masker.toPattern(value, pattern);
        this.formControlName.control.setValue(value);
    }

}
