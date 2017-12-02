import { injectable } from 'inversify';
import { EntityManager } from 'typeorm';

import { EmployeeEntity } from '../entity';

@injectable()
export class EmployeeService {
    constructor(
        private entityManager: EntityManager
    ) { }

    getById(id: number): Promise<EmployeeEntity> {
        return this.entityManager.findOneById(EmployeeEntity, id);
    }

    getByEmail(email: string): Promise<EmployeeEntity> {
        return this.entityManager.findOne(EmployeeEntity, { email: email });
    }
}
