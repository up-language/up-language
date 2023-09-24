#! /usr/bin/env bash
set -uvx
set -e
gh auth login --hostname github.com --git-protocol https --web
appName=om-dnet
cwd=`pwd`
ts=`date "+%Y.%m%d.%H%M.%S"`
version=${ts}
sed -i -e "s/<Version>.*<\/Version>/<Version>${version}<\/Version>/g" ${appName}.csproj
rm -rf obj bin ${appName}.zip
dotnet build -c Release
cd bin/Release/net462
7z a -r -tzip $cwd/${appName}.zip *
cd $cwd
gh release create --repo javacommons/binary --generate-notes windows-64bit || true
url="https://github.com/javacommons/binary/releases/download/windows-64bit/${appName}.zip"
gh release upload windows-64bit "${appName}.zip" --repo javacommons/binary --clobber
echo "Uploaded to ${url}"
