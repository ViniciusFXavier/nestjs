import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ArgsType()
export class RecipesArgs {
  @Type(() => Number)
  @Field(() => Int)
  skip = 0;

  @Type(() => Number)
  @Field(() => Int)
  take = 25;
}
