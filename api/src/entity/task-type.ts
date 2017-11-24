import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TaskType')
export class TaskTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column()
    tech: boolean;

    @Column()
    researchDevelopment: boolean;

    @Column()
    holiday: boolean;

    @Column()
    statutoryHoliday: boolean;
}
