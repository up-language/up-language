set -uvx
set -e
dotnet new sln --force
dotnet sln add *.csproj
dotnet sln add C:/ProgramData/.repo/home/common/.csharp/Global/Global.csproj
