import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';

const modules = [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule { }
