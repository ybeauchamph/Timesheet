import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    root(): string {
        return 'Hello world!';
    }
}
