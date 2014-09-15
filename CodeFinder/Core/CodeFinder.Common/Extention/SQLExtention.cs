using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Common.Extention
{
    public static class SQLExtention
    {
        public static T ReadValue<T>(this IDataReader dr, string columnName, T defaultvalue) {
            
            int index = dr.GetOrdinal(columnName);

            if (dr.IsDBNull(index))
            {
                return defaultvalue;
            }
            else
            {
                return (T)Convert.ChangeType(dr[columnName], typeof(T));
            }
        }

        public static T ReadValue<T>(this IDataReader dr, string columnName)
        {

            int index = dr.GetOrdinal(columnName);

            if (dr.IsDBNull(index))
            {
                return default(T);
            }
            else
            {
                return (T)Convert.ChangeType(dr[columnName], typeof(T));
            }
        }

        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (!object.Equals(dr[prop.Name], DBNull.Value))
                    {
                        prop.SetValue(obj, dr[prop.Name], null);
                    }
                }
                list.Add(obj);
            }
            return list;
        }

        public static IEnumerable<T> FromDataReader<T>(this IEnumerable<T> list, DbDataReader dr)
        {
            //Instance reflec object from Reflection class coded above
            Reflection reflec = new Reflection();
            //Declare one "instance" object of Object type and an object list
            Object instance;
            List<Object> lstObj = new List<Object>();

            //dataReader loop
            while (dr.Read())
            {
                //Create an instance of the object needed.
                //The instance is created by obtaining the object type T of the object
                //list, which is the object that calls the extension method
                //Type T is inferred and is instantiated
                instance = Activator.CreateInstance(list.GetType().GetGenericArguments()[0]);

                // Loop all the fields of each row of dataReader, and through the object
                // reflector (first step method) fill the object instance with the datareader values
                foreach (DataRow drow in dr.GetSchemaTable().Rows)
                {
                    reflec.FillObjectWithProperty(ref instance,
                            drow.ItemArray[0].ToString(), dr[drow.ItemArray[0].ToString()]);
                }

                //Add object instance to list
                lstObj.Add(instance);
            }

            List<T> lstResult = new List<T>();

            foreach (Object item in lstObj)
            {
                lstResult.Add((T)Convert.ChangeType(item, typeof(T)));
            }

            return lstResult;
        }


        public static DataTable ToDataTable<T>(this IEnumerable<T> collection, List<string> rejectedColumnName = null)
        {
            DataTable dt = new DataTable("DataTable");
            Type t = typeof(T);
            PropertyInfo[] pia = t.GetProperties();

            //Inspect the properties and create the columns in the DataTable
            foreach (PropertyInfo pi in pia)
            {
                if (rejectedColumnName != null && rejectedColumnName.Contains(pi.Name)) continue;

                Type ColumnType = pi.PropertyType;
                if ((ColumnType.IsGenericType))
                {
                    ColumnType = ColumnType.GetGenericArguments()[0];
                }
                dt.Columns.Add(pi.Name, ColumnType);
            }

            //Populate the data table
            foreach (T item in collection)
            {
                DataRow dr = dt.NewRow();
                dr.BeginEdit();
                foreach (PropertyInfo pi in pia)
                {
                    if (rejectedColumnName != null && rejectedColumnName.Contains(pi.Name)) continue;

                    if (pi.GetValue(item, null) != null)
                    {
                        dr[pi.Name] = pi.GetValue(item, null);
                    }
                }
                dr.EndEdit();
                dt.Rows.Add(dr);
            }
            return dt;
        }

     
    }

    public class Reflection
    {
        public void FillObjectWithProperty(ref object objectTo, string propertyName, object propertyValue)
        {
            Type tOb2 = objectTo.GetType();
            tOb2.GetProperty(propertyName).SetValue(objectTo, propertyValue);
        }
    }
}
