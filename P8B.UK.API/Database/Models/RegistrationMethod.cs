using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using static P8B.Core.CSharp.CoreConst;

namespace P8B.UK.API.Database.Models
{
   public class RegistrationMethod
   {
      [Key]
      public int Id { get; set; }

      [Required(ErrorMessage = "Linked Id is Required \n")]
      public string ExternalLinkedId { get; set; }

      [Required(ErrorMessage = "Registration type is required \n")]
      public RegistrationTypes Type { get; set; }

      [DataType(DataType.Date)]
      public DateTime RegisteredDate { get; set; } = DateTime.Now;

      [ForeignKey("UserId")]
      [Newtonsoft.Json.JsonIgnore]
      public User User { get; set; }
   }
}
