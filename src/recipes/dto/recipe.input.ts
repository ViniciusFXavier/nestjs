import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class RecipeInput {
  @ApiProperty()
  @Field(() => String)
  title: string;

  @ApiProperty()
  @Field({ nullable: true })
  description?: string;

  @ApiProperty()
  @Field(() => [String])
  ingredients: string[];
}
