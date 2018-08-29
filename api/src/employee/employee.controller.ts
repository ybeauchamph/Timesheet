import { Controller, Get, Param, Req } from '@nestjs/common';
import { Authenticated } from '../authentication/authenticated.decorator';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from '../entity';
import { BaseController, IntPipe } from '../common';

@Controller('employee')
@Authenticated()
export class EmployeeController extends BaseController {
    constructor(
        private readonly employeeService: EmployeeService
    ) { super(); }

    @Get(':id')
    getById(
        @Req() request,
        @Param('id', IntPipe) id: number
    ): Promise<EmployeeEntity | undefined> {
        const userId = request.user.sub;
        if (userId !== id) {
            return this.unauthorized();
        }

        return this.toResult(this.employeeService.getById(id));
    }
}