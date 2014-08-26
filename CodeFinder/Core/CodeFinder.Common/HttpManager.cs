using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net;
using System.IO;
using Newtonsoft.Json;


namespace CodeFinder.Common
{
    public static class HttpManager
    {
        public static T GetResult<T>(string url) {

            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
            request.Method = "GET";
            String result = String.Empty;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                result = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
            }

            return JsonConvert.DeserializeObject<T>(result);
        }
    }
}
