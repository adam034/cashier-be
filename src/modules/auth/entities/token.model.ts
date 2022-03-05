import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
@Table({ tableName: 'CSH_TB_R_TOKEN'})
export class Token extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    ID: number

    @Column
    USER_ID: string

    @Column
    TOKEN: string
    
}