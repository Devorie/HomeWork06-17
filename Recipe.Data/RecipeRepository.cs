using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Recipe.Data
{
    public class RecipeRepository
    {
        private readonly string _connectionString;

        public RecipeRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void DeleteRecipe(int id)
        {
            using var context = new RecipeDataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"DELETE FROM Recipes WHERE Id = {id}");
        }

        public void AddRecipe(RecipeItem recipe)
        {
            using var context = new RecipeDataContext(_connectionString);
            recipe.Date = DateTime.Now;
            context.Recipes.Add(recipe);
            context.SaveChanges();
        }

        public List<Category> GetCategoryCount(int userId, List<string> categories)
        {
            using var context = new RecipeDataContext(_connectionString);
            List<RecipeItem> recipes = context.Recipes.Where(r => r.UserId == userId).ToList();
            var categoriesList = new List<Category>();
            foreach (string c in categories)
            {
                categoriesList.Add(new Category()
                {
                    Name = c,
                    Count = recipes.Where(r => r.Category == c).Count()
                });
            };

            return categoriesList;
        }
        public List<RecipeItemView> MostRecent()
        {
            using var context = new RecipeDataContext(_connectionString);
            List<RecipeItem> recipeItem = context.Recipes.Where(rcp => rcp.Share == true).OrderByDescending(r => r.Date).Take(9).ToList();
            var recipes = new List<RecipeItemView>();
            foreach(RecipeItem r in recipeItem)
            {
                recipes.Add(new RecipeItemView()
                {
                    Id = r.Id,
                    Title = r.Title,
                    Category = r.Category,
                    Ingredients = JsonSerializer.Deserialize<string[]>(r.Ingredients),
                    Steps = JsonSerializer.Deserialize<string[]>(r.Steps),
                    Image = r.Image,
                    Share = r.Share,
                    UserId = r.UserId,
                    Date = r.Date
                });
            }
            return recipes;
        }



        public List<RecipeItemView> GetRecipesByUser(int userId)
        {
            using var context = new RecipeDataContext(_connectionString);
            List<RecipeItem> recipeItems = context.Recipes.Where(r => r.UserId == userId).ToList();

            var recipes = new List<RecipeItemView>();
            foreach (RecipeItem r in recipeItems)
            {
                recipes.Add(new RecipeItemView()
                {
                    Id = r.Id,
                    Title = r.Title,
                    Category = r.Category,
                    Ingredients = JsonSerializer.Deserialize<string[]>(r.Ingredients),
                    Steps = JsonSerializer.Deserialize<string[]>(r.Steps),
                    Image = r.Image,
                    Share = r.Share,
                    UserId = r.UserId,
                    Date = r.Date
                });
            }
            return recipes;
        }
    }
}
