import { ApiProperty } from "@nestjs/swagger";
export class CreateItemDto {
    @ApiProperty()
    public category_id: number

    @ApiProperty()
    public name: string

    @ApiProperty()
    public price: number

    @ApiProperty()
    public desc: string

    @ApiProperty()
    public photo: string
    
}
