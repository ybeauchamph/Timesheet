import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimeDataEntity } from './time-data';

@Entity()
export class EmployeeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column({ length: 8 })
    alias: string;

    @Column({ length: 200 })
    name: string;

    @Column({ length: 256 })
    password: string;

    @OneToMany(() => TimeDataEntity, timeData => timeData.employee)
    timeDatas: Array<TimeDataEntity>;
}
