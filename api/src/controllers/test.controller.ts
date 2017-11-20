import { Request } from 'restify';
import { Controller, HttpGet } from '@nmd-timesheet/ts-api-lib';

@Controller('test')
export class TestController {
    @HttpGet('~/hello/:name')
    hello(req: Request) {
        console.log(arguments);
        return 'Hello ' + req.params.name;
    }

    @HttpGet('')
    test(req: Request) {
        return 'Test';
    }
}
