import { ApiProperty } from "@nestjs/swagger";
export class CreateProfileDto {
    @ApiProperty()
    public full_name: string

    @ApiProperty()
    public address: string

    @ApiProperty()
    public phone: string

    @ApiProperty()
    public photo: string
}
export class CreateUserDto {
    @ApiProperty()
    public username: string

    @ApiProperty()
    public password: string

    @ApiProperty()
    public is_active?: boolean

    @ApiProperty()
    public role: number

    @ApiProperty()
    public profile: CreateProfileDto
}
