import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    // MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material';

const modules = [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule
];

@NgModule({
    imports: modules,
    exports: modules,
    providers: [
        // {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: 'fill'}
    ]
})
export class MaterialModule { }
