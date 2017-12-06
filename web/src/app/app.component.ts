import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'ts-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'ts';
}
