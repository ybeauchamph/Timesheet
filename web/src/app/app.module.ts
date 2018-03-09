import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MaterialModule } from './material';
import { CovalentModule } from './covalent';

import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login';
import { HeaderBarModule } from './header-bar/header-bar.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MaterialModule,
        CovalentModule,

        AppRoutingModule,
        LoginModule,
        HeaderBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
