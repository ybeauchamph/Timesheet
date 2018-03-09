import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'ts-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['./header-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBarComponent implements OnInit {

    constructor() { }

    ngOnInit() {

    }
}
