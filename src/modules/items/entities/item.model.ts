import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
@Table({ tableName: 'CSH_TB_M_ITEMS'})
export class Item extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    ID: number

    @Column
    CATEGORY_ID: number

    @Column
    NAME: string

    @Column
    PRICE: number

    @Column
    DESC: string

    @Column
    PHOTO: string
}
