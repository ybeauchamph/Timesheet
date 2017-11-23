import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ClientEntity } from './client';
import { ProductEntity } from './product';
import { TimeDataEntity } from './time-data';

@Entity()
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @ManyToOne(() => ProductEntity, product => product.projects, { nullable: false })
    product: ProductEntity;

    @ManyToOne(() => ClientEntity, client => client.projects, { nullable: false })
    client: ClientEntity;

    @OneToMany(() => TimeDataEntity, timeData => timeData.project)
    timeDatas: TimeDataEntity;
}
