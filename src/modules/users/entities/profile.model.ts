import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'CSH_TB_M_PROFILES'
})
export class Profile extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    ID: number

    @Column
    USERS_ID: number

    @Column
    FULL_NAME: string

    @Column
    ADDRESS: string

    @Column
    PHONE: string

    @Column
    PHOTO: string
}