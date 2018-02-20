import { injectable } from 'inversify';
import { EntityManager } from 'typeorm';

import { EmployeeEntity } from '../entity';

@injectable()
export class EmployeeService {
    constructor(
        private entityManager: EntityManager
    ) { }

    getById(id: number): Promise<EmployeeEntity> {
        return this.entityManager.findOne(EmployeeEntity, id);
    }

    getByEmail(email: string): Promise<EmployeeEntity> {
        return this.entityManager.findOne(EmployeeEntity, { email: email });
    }

    save(employee: EmployeeEntity): Promise<boolean> {
        return this.entityManager.save(employee)
            .then(() => true)
            .catch(() => false);
    }
}
