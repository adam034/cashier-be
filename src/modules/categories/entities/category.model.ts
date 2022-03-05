import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
@Table({ tableName: 'CSH_TB_M_CATEGORIES'})
export class Category extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    ID: number

    @Column
    NAME: string

    @Column
    PHOTO: string
}
