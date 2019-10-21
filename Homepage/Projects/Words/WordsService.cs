using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Serialization;

namespace Homepage.Projects.Words
{
    public class WordsService
    {
        public WordOutput GetWordOutput(string search)
        {
            var result = DeSerializeObject<WordOutput>("C:\\temp\\hp\\Homepage\\Content\\EnglishGeneralClusterJsonSerial.xml");
            var filteredResult = new WordOutput();
filteredResult.nodes = new HashSet<WordNode>();
filteredResult.links = new HashSet<WordEdge>();
            try
            {
                var matchLinks = result.links.Where(e => e.source.Contains(search) || e.target.Contains(search)).ToList();

                foreach (var l in matchLinks)
                {
                    filteredResult.links.Add(l);
                    
                    var sourceExists = filteredResult.nodes.FirstOrDefault(e => e.id == l.source);
                    if (sourceExists == null)
                    {
                        var sourceNode = result.nodes.FirstOrDefault(e => e.id == l.source);
                        filteredResult.nodes.Add(sourceNode);
                    }
                    var targetExists = filteredResult.nodes.FirstOrDefault(e => e.id == l.target);
                    if (targetExists == null)
                    {
                        var targetNode = result.nodes.FirstOrDefault(e => e.id == l.target);
                        filteredResult.nodes.Add(targetNode);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return filteredResult;
        }
        
        
        /// <summary>
        /// Deserializes an xml file into an object list
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public T DeSerializeObject<T>(string fileName)
        {
            if (string.IsNullOrEmpty(fileName)) { return default(T); }

            T objectOut = default(T);

            try
            {
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.Load(fileName);
                string xmlString = xmlDocument.OuterXml;

                using (StringReader read = new StringReader(xmlString))
                {
                    Type outType = typeof(T);

                    XmlSerializer serializer = new XmlSerializer(outType);
                    using (XmlReader reader = new XmlTextReader(read))
                    {
                        objectOut = (T)serializer.Deserialize(reader);
                    }
                }
            }
            catch (Exception ex)
            {
                //Log exception here
            }

            return objectOut;
        }

        public class WordNode
        {
            public string id { get; set; }

            public string Group { get; set; }
        }



        public class WordEdge
        {
            public string source { get; set; }

            public string target { get; set; }
        }

        public class WordOutput
        {
            public HashSet<WordNode> nodes { get; set; }
            public HashSet<WordEdge> links { get; set; }
        }
        
    }
}