// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { ColorInputComponent } from './color-input.component';

@Component({
  template: `<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options" />`,
  imports: [FormlyModule, ReactiveFormsModule],
})
class TestHostComponent {
  readonly form = new FormGroup({});
  readonly model = { color: '#205078' };
  readonly options: FormlyFormOptions = {};
  readonly fields: FormlyFieldConfig[] = [{ key: 'color', type: 'color' }];
}

describe('ColorInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ColorInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        FormlyModule.forRoot({
          types: [{ name: 'color', component: ColorInputComponent }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(ColorInputComponent)).componentInstance;
  });

  it('normalizes a valid typed color on blur', () => {
    component.formControl.setValue('#abcdef');

    component.normalize();

    expect(component.formControl.value).toBe('#ABCDEF');
  });

  it('does not rewrite an incomplete typed value', () => {
    component.formControl.setValue('#abc');

    component.normalize();

    expect(component.formControl.value).toBe('#abc');
  });

  it('normalizes a color selected from the picker', () => {
    component.onColorChange({ originalEvent: new Event('change'), value: '#abcdef' });

    expect(component.formControl.value).toBe('#ABCDEF');
    expect(component.formControl.dirty).toBe(true);
  });
});
