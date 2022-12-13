import { Injectable } from '@nestjs/common';
import { RecipeInput } from './dto/recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';

const recipes = {};

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: RecipeInput): Promise<Recipe> {
    const id = Math.floor(Math.random() * 11);
    recipes[id] = {
      ...data,
      id,
    };
    return recipes[id] as Recipe;
  }

  async findOneById(id: string): Promise<Recipe> {
    return recipes[id] as Recipe;
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return Object.values(recipes) as Recipe[];
  }

  async update(id: string, data: RecipeInput): Promise<Recipe> {
    recipes[id] = { ...recipes[id], ...data };
    return recipes[id];
  }

  async remove(id: string): Promise<Recipe> {
    const recipe = recipes[id];
    delete recipes[id];
    return recipe;
  }
}
