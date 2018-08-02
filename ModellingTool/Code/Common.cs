using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Web.Mvc;
using System.IO;
using System.Web.Optimization;

namespace OpenConfigurator.ModellingTool.WebUI.Common
{

    public class JsonNetResult : ActionResult
    {
        public Encoding ContentEncoding { get; set; }
        public string ContentType { get; set; }
        public object Data { get; set; }
        public JsonSerializerSettings SerializerSettings { get; set; }
        public Formatting Formatting { get; set; }
        public JsonNetResult()
        {
            SerializerSettings = new JsonSerializerSettings();
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            HttpResponseBase response = context.HttpContext.Response;

            response.ContentType = !string.IsNullOrEmpty(ContentType) ? ContentType : "application/json";
            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            if (Data != null)
            {
                JsonTextWriter writer = new JsonTextWriter(response.Output) { Formatting = Formatting };
                JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
                serializer.Serialize(writer, Data);
                writer.Flush();
            }
        }

    }

    public class NonOrderingBundleOrderer : IBundleOrderer
    {
        public IEnumerable<FileInfo> OrderFiles(BundleContext context, IEnumerable<FileInfo> files)
        {
            return files;
        }
    }

    public static class Helpers
    {
        public static string RenderViewToString(string viewPathAndName, ControllerContext controllerContext)
        {
            // Render the view to a string
            string viewAsString = null;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindView(controllerContext, viewPathAndName, null);
                if (viewResult.View != null)
                {
                    var viewContext = new ViewContext(controllerContext, viewResult.View, new ViewDataDictionary(), new TempDataDictionary(), sw);
                    viewResult.View.Render(viewContext, sw);
                    viewResult.ViewEngine.ReleaseView(controllerContext, viewResult.View);
                    viewAsString = sw.GetStringBuilder().ToString();
                }
            }
            return viewAsString;
        }

        public static string GetJSFileAsString(string filePathAndName)
        {
            StringBuilder sb = new StringBuilder();
            using (StreamReader sr = new StreamReader(filePathAndName))
            {
                String line;
                // Read and display lines from the file until the end of 
                // the file is reached.
                while ((line = sr.ReadLine()) != null)
                {
                    sb.AppendLine(line);
                }
            }
            string allines = sb.ToString();

            return allines;
        }
    }
}