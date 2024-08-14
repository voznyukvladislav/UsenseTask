import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {

  @ViewChild('input') inputBlock!: ElementRef;

  public value: number = 0;
  public isDisabled: boolean = false;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  writeValue(number: number): void {
    this.value = number;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  updateValue(newValue: string) {
    let number = Number(newValue);
    if (number < 0) {
      this.value = 0;
      this.inputBlock.nativeElement.value = this.value;
    } 
    else this.value = number;

    this.onChange(this.value);
    this.onTouch();
  }
}
