import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'app/material';
import { HeaderBarComponent } from './header-bar/header-bar.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        HeaderBarComponent
    ],
    declarations: [HeaderBarComponent]
})
export class HeaderBarModule {
}
