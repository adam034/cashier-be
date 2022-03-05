import { ApiProperty } from '@nestjs/swagger';

export class RefreshToken {
    @ApiProperty()
    public token: string;
}