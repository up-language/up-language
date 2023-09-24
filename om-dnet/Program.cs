using System;
using System.Reflection;
using Global;
using static Global.Util;

using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;

namespace Global;

public static class Program
{
    [STAThread]
    public static void Main(string[] args)
    {
        try
        {
            Print(Environment.Version.ToString(), "Runtime Version");
            Print(Assembly.GetExecutingAssembly().GetName().Version.ToString(), "Assembly Version");
            Print(args, "args");
            //throw new Exception("Exception Test!");
            using (var engine = new V8ScriptEngine())
            {
                engine.AddHostObject("", HostItemFlags.GlobalMembers, new HostTypeCollection("mscorlib", "System.Core"));
                engine.Execute(@"System.Console.WriteLine(`Hello ${System.Environment.UserName}`);");
            }
        }
        catch (Exception e)
        {
            Log(e.ToString());
        }
    }
}