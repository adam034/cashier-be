import { AutoIncrement, Column,Model, PrimaryKey, Table, Unique,HasOne } from "sequelize-typescript";
import { Profile } from './profile.model';
@Table({
    tableName: 'CSH_TB_M_USERS'
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    ID: number

    @Column
    USERNAME: string;

    @Column
    PASSWORD: string;

    @Column
    ROLE: number;

    @Column
    IS_ACTIVE: boolean;

    @HasOne(() => Profile, 'USERS_ID')
    profile: Profile
}
