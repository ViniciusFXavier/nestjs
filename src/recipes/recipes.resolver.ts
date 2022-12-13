import {
  Controller,
  Get,
  Body,
  NotFoundException,
  Param,
  Post,
  Query as RestQuery,
  Delete,
  Patch,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PubSub } from 'graphql-subscriptions';

import { RecipeInput } from './dto/recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';
import { RecipesService } from './recipes.service';

const pubSub = new PubSub();

@ApiTags('recipes')
@Controller('recipes')
@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Get(':id')
  @Query(() => Recipe)
  @ApiResponse({ status: 200, type: Recipe })
  @ApiResponse({ status: 404 })
  async recipe(
    @Args('id') gqlId: string,
    @Param('id') restId: string,
  ): Promise<Recipe> {
    const id = gqlId || restId;
    const recipe = await this.recipesService.findOneById(id);
    if (!recipe) throw new NotFoundException(id);
    return recipe;
  }

  @Get()
  @Query(() => [Recipe])
  @ApiResponse({ status: 200, type: [Recipe] })
  @ApiQuery({ name: 'skip', type: 'integer' })
  @ApiQuery({ name: 'take', type: 'integer' })
  recipes(
    @RestQuery() restArgs: RecipesArgs,
    @Args() gqlArgs: RecipesArgs,
  ): Promise<Recipe[]> {
    return this.recipesService.findAll({ ...gqlArgs, ...restArgs });
  }

  @Post()
  @Mutation(() => Recipe)
  @ApiResponse({ status: 200, type: Recipe })
  async addRecipe(
    @Body() restBody: RecipeInput,
    @Args('body') gqlBody: RecipeInput,
  ): Promise<Recipe> {
    const recipe = await this.recipesService.create(gqlBody || restBody);
    pubSub.publish('recipeAdded', { recipeAdded: recipe });
    return recipe;
  }

  @Patch(':id')
  @Mutation(() => Recipe)
  @ApiResponse({ status: 200, type: Recipe })
  async updateRecipe(
    @Args('id') gqlId: string,
    @Param('id') restId: string,
    @Body() restBody: RecipeInput,
    @Args('body') gqlBody: RecipeInput,
  ) {
    const id = gqlId || restId;
    const recipe = await this.recipesService.update(id, gqlBody || restBody);
    if (!recipe) throw new NotFoundException(id);
    pubSub.publish('recipeUpdated', { recipeUpdated: recipe });
    return recipe;
  }

  @Delete(':id')
  @Mutation(() => Recipe)
  @ApiResponse({ status: 200, type: Recipe })
  async removeRecipe(@Args('id') gqlId: string, @Param('id') restId: string) {
    const id = gqlId || restId;
    const recipe = await this.recipesService.remove(id);
    if (!recipe) throw new NotFoundException(id);
    pubSub.publish('recipeRemoved', { recipeRemoved: recipe });
    return recipe;
  }

  @Subscription(() => Recipe)
  recipeAdded() {
    return pubSub.asyncIterator('recipeAdded');
  }

  @Subscription(() => Recipe)
  recipeUpdated() {
    return pubSub.asyncIterator('recipeUpdated');
  }

  @Subscription(() => Recipe)
  recipeRemoved() {
    return pubSub.asyncIterator('recipeRemoved');
  }
}
