import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectEntity } from './project';
import { TimeDataEntity } from './time-data';

@Entity()
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 8 })
    alias: string;

    @Column({ length: 100 })
    name: string;

    @OneToMany(() => ProjectEntity, project => project.product)
    projects: Array<ProjectEntity>;

    @OneToMany(() => TimeDataEntity, timeData => timeData.client)
    timeDatas: TimeDataEntity;
}
