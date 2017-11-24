import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ClientEntity } from './client';
import { EmployeeEntity } from './employee';
import { ProductEntity } from './product';
import { ProjectEntity } from './project';

@Entity('TimeData')
export class TimeDataEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => EmployeeEntity, employee => employee.timeDatas, { nullable: false })
    employee: EmployeeEntity;

    @ManyToOne(() => ProjectEntity, project => project.timeDatas, { nullable: true })
    project: ProjectEntity;

    @ManyToOne(() => ClientEntity, client => client.timeDatas, { nullable: true })
    client: ClientEntity;

    @ManyToOne(() => ProductEntity, product => product.timeDatas, { nullable: true })
    product: ProductEntity;
}