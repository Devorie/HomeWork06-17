namespace Recipe.Web.ViewModels
{
    public class RecipeItemViewModel
    {
        public string Title { get; set; }
        public string Category { get; set; }
        public List<string> Ingredients { get; set; }
        public List<string> Steps { get; set; }
        public string ImageBase64Data { get; set; }
        public bool Share { get; set; }
    }
}
