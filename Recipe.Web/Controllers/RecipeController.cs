using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recipe.Data;
using Recipe.Web.ViewModels;
using System.Text.Json;

namespace Recipe.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly string _connectionString;

        public RecipeController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
        }

        [HttpGet("getmycategories")]
        public object GetMyCategories()
        {
            var user = GetCurrentUser();
            var repo = new RecipeRepository(_connectionString);
            if (user.Categories == null || user.Categories.Length == 0)
            {
                return null;
            }
            return repo.GetCategoryCount(user.Id, JsonSerializer.Deserialize<List<string>>(user.Categories));
        }

        [HttpGet("getmyrecipes")]
        public object GetMyRecipes()
        {
            var user = GetCurrentUser();
            var repo = new RecipeRepository(_connectionString);
            return repo.GetRecipesByUser(user.Id);
        }

        [AllowAnonymous]
        [HttpGet("getrecent")]
        public object GetRecent()
        {
            var repo = new RecipeRepository(_connectionString);
            return repo.MostRecent();
        }

        [HttpPost]
        [Route("addrecipe")]
        public void AddRecipe(RecipeItemViewModel vm)
        {
            var image = ConvertFromBase64(vm.ImageBase64Data);
            var fileName = $"{Guid.NewGuid()}";
            vm.ImageBase64Data = fileName;
            System.IO.File.WriteAllBytes($"uploads/{fileName}.jpg", image);
            var repo = new RecipeRepository(_connectionString);
            var user = GetCurrentUser();
            RecipeItem recipe = new()
            {
                Title = vm.Title,
                UserId = user.Id,
                Share = vm.Share,
                Category = vm.Category,
                Steps = JsonSerializer.Serialize(vm.Steps),
                Ingredients = JsonSerializer.Serialize(vm.Ingredients),
                Image = vm.ImageBase64Data
            };
            repo.AddRecipe(recipe);
        }

        [HttpPost]
        [Route("deleterecipe")]
        public void DeleteRecipe(int id)
        {

            Console.WriteLine($"Delete {id}");
            var repo = new RecipeRepository(_connectionString);
            repo.DeleteRecipe(id);
        }

        [HttpPost]
        [Route("addcategory")]
        public void AddCategory(string newCategory)
        {
            var user = GetCurrentUser();
            var repo = new UserRepository(_connectionString);
            List<string> categories = new();
            if (user.Categories != null && user.Categories.Length > 0)
            {
                categories.AddRange(JsonSerializer.Deserialize<List<string>>(user.Categories));
            }
            categories.Add(newCategory);
            var c = JsonSerializer.Serialize(categories);
            repo.UpdateCategory(user.Id, c);
        }

        private User GetCurrentUser()
        {
            var userRepo = new UserRepository(_connectionString);
            var user = userRepo.GetByEmail(User.Identity.Name);
            return user;
        }

        [HttpGet("ViewImage")]
        public IActionResult ViewImage(string imageUrl)
        {
            var bytes = System.IO.File.ReadAllBytes($"Uploads/{imageUrl}.jpg");
            return File(bytes, "image/jpeg");
        }

        private byte[] ConvertFromBase64(string data)
        {
            int indexOfComma = data.IndexOf(',');
            string base64 = data.Substring(indexOfComma + 1);
            return Convert.FromBase64String(base64);
        }
    }
}

