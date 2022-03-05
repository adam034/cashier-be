import { ApiProperty } from "@nestjs/swagger";
export class CreateCategoryDto {
    @ApiProperty()
    public name: string

    @ApiProperty()
    public photo: string
}
