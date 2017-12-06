import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatCardModule,
    MatToolbarModule
} from '@angular/material';

const modules = [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule { }
