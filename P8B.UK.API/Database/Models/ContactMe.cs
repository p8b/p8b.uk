using System.ComponentModel.DataAnnotations;

namespace P8B.UK.API.Database.Models
{
   public class ContactMe
   {
      [Required(AllowEmptyStrings = false, ErrorMessage = "Name is required")]
      public string Name { get; set; }
      [Required(AllowEmptyStrings = false, ErrorMessage = "Email is required")]
      public string Email { get; set; }
      public string Subject { get; set; }
      [Required(AllowEmptyStrings = false, ErrorMessage = "Message is required")]
      public string Messege { get; set; }
   }
}
