using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Model
{
    public class AjaxModel
    {

    }

    public enum Status
    {
        Success,
        Failure
    }

    public class AjaxResult
    {
        public object Result { get; set; }

        public string Message { get; set; }

        private Status status = Status.Success;

        public Status Status
        {
            get
            {
                return status;
            }

            set
            {
                status = value;
            }
        }

    }
}
