# push.ps1
# Usage: ./push.ps1 "commit message"
param (
    [string]$message = "update"
)

git add .
git commit -m $message
git push origin master
