using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipe.Data
{
    public class RecipeItemView
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string[] Ingredients { get; set; }
        public string[] Steps { get; set; }
        public string Image { get; set; }
        public bool Share { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
    }
}
