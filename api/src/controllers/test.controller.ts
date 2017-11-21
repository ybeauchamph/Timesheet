import { Request } from 'restify';
import { Controller, HttpGet, ApiController, HttpMessage } from '@nmd-timesheet/ts-api-lib';

@Controller('test')
export class TestController extends ApiController {
    @HttpGet('~/hello/:name')
    hello(req: Request): HttpMessage {
        console.log(arguments);
        return this.ok('Hello ' + req.params.name);
    }

    @HttpGet('')
    test(req: Request): HttpMessage {
        return this.ok('Test');
    }
}
