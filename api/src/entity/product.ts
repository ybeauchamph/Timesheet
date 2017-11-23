import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectEntity } from './project';
import { TimeDataEntity } from './time-data';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @OneToMany(() => ProjectEntity, project => project.product)
    projects: Array<ProjectEntity>;

    @OneToMany(() => TimeDataEntity, timeData => timeData.project)
    timeDatas: TimeDataEntity;
}
