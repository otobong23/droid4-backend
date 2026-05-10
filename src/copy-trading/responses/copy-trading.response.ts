import { ApiProperty } from "@nestjs/swagger";


export class getUserTradingDetails {

   @ApiProperty({
    example: 'bonifacemiracle@gmail.com',
  })
  email!: string;

  @ApiProperty({
    example: 1000,
  })
  balance!: number;
}