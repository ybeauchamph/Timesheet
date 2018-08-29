import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

import { Partial } from '@timesheet/common';

import { EmployeeEntity } from '../entity';

@Injectable()
export class EmployeeService {
    private employeeRepo: Repository<EmployeeEntity>;

    constructor(
        readonly connection: Connection
    ) {
        this.employeeRepo = connection.getRepository(EmployeeEntity);
    }

    getById(id: number): Promise<EmployeeEntity | undefined> {
        return this.employeeRepo.findOne(id);
    }

    getByEmail(email: string): Promise<EmployeeEntity | undefined> {
        return this.employeeRepo.findOne(<Partial<EmployeeEntity>>{ email2: email });
    }
}