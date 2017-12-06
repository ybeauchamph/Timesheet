import { NgModule } from '@angular/core';

import {
    CovalentLayoutModule
} from '@covalent/core';

const modules = [
    CovalentLayoutModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CovalentModule { }
