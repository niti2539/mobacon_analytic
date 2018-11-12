import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class Billing {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: string;

    @Column()
    key: string;

    @Column()
    value: string;

    @Column()
    createdDate: Date;
}