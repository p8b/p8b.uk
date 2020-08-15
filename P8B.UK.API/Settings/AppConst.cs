using System;
using System.IO;
using System.Reflection;

using Newtonsoft.Json;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

namespace P8B.UK.API
{
   public class AppConst : CoreConst
   {
      /// <summary>
      /// Get the information from the appSettings json file
      /// </summary>
      public static Settings Settings
      {
         get
         {
            /// Get the directory of the app settings.json file
            var jsonFilePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\Settings\Settings.json";
            /// If above file does not exists check the android path.
            if (!File.Exists(jsonFilePath))
               jsonFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Settings\Settings.json");
            /// Read the json file from that directory
            /// de-serialise the json string into an object of AppSettings and return it
            return JsonConvert.DeserializeObject<Settings>(File.ReadAllText(jsonFilePath));
         }
      }

   }
}
