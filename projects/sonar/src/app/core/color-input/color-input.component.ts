// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ColorPicker } from 'primeng/colorpicker';
import { ColorPickerChangeEvent } from 'primeng/types/colorpicker';
import { InputText } from 'primeng/inputtext';

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

@Component({
  selector: 'sonar-color-input',
  template: `
    <div class="ui:flex ui:items-center ui:gap-2">
      <p-colorpicker
        [formControl]="colorControl"
        [inputId]="field.id + '-picker'"
        [appendTo]="'body'"
        format="hex"
        (onChange)="onColorChange($event)"
      />
      <input
        pInputText
        class="ui:w-40 ui:font-mono ui:uppercase"
        type="text"
        maxlength="7"
        placeholder="#RRGGBB"
        [formControl]="colorControl"
        [formlyAttributes]="field"
        (blur)="normalize()"
      />
    </div>
  `,
  imports: [ColorPicker, FormlyModule, InputText, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent extends FieldType<FormlyFieldConfig> {
  get colorControl(): FormControl<string | null> {
    return this.formControl as FormControl<string | null>;
  }

  /** Normalize values selected through PrimeNG's color picker. */
  onColorChange(event: ColorPickerChangeEvent): void {
    if (typeof event.value === 'string' && HEX_COLOR_PATTERN.test(event.value)) {
      this.formControl.setValue(event.value.toUpperCase());
      this.formControl.markAsDirty();
    }
  }

  /** Preserve partial text while typing, but normalize valid values on blur. */
  normalize(): void {
    const value = this.formControl.value;
    if (typeof value === 'string' && HEX_COLOR_PATTERN.test(value)) {
      this.formControl.setValue(value.toUpperCase());
    }
  }
}
