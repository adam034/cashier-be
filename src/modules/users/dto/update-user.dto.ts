import { ApiProperty } from "@nestjs/swagger";
export class UpdateProfileDto {
    @ApiProperty()
    public full_name: string

    @ApiProperty()
    public address: string

    @ApiProperty()
    public phone: string

    @ApiProperty()
    public photo: string
}
export class UpdateUserDto {
    @ApiProperty()
    public role: string

    @ApiProperty()
    public profile: UpdateProfileDto
}
