import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimeDataEntity } from './time-data';

@Entity('Employee')
export class EmployeeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 254 })
    email: string;

    @Column()
    number: number;

    @Column({ length: 8 })
    alias: string;

    @Column({ length: 200 })
    name: string;

    @Column({ length: 64 })
    salt: string;

    @Column({ length: 128 })
    password: string;

    @OneToMany(() => TimeDataEntity, timeData => timeData.employee)
    timeDatas: Array<TimeDataEntity>;
}
