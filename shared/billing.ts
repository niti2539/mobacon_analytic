import { Entity, ObjectIdColumn, Column, ObjectID, Index } from 'typeorm';

@Entity()
export class Billing {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @Index()
    userId: string;

    @Column()
    data: any;

    @Column()
    createdDate: Date;
}