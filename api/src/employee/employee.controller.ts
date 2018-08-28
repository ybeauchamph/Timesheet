import { Controller, Get, Param } from '@nestjs/common';
import { Authenticated } from '../authentication/authenticated.decorator';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from '../entity';

@Controller('employee')
@Authenticated()
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService
    ) { }

    @Get(':id')
    getById(@Param('id') id: number): Promise<EmployeeEntity | undefined> {
        return this.employeeService.getById(id);
    }
}