import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType({ description: 'recipe ' })
export class Recipe {
  @Field(() => ID)
  @ApiProperty()
  id: string;

  @Field()
  @ApiProperty()
  title: string;

  @Field({ nullable: true })
  @ApiProperty()
  description?: string;

  @Field({ nullable: true })
  @ApiProperty()
  creationDate: Date;

  @Field(() => [String])
  @ApiProperty()
  ingredients: string[];
}
