# reNamerX Git Setup Script
# Run this script to initialize and configure git for the reNamerX project

# Initialize git repository if not already done
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Green
    git init
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
}

# Configure git with your information
# Uncomment and modify these lines with your information
# git config user.name "Gabriel Cavazos"
# git config user.email "your.email@example.com"

# Add all files to git
Write-Host "Adding files to git..." -ForegroundColor Green
git add .

# Display status
Write-Host "`nCurrent git status:" -ForegroundColor Cyan
git status

Write-Host "`nNext steps:" -ForegroundColor Green
Write-Host "1. Verify the files being tracked in the status above" -ForegroundColor White
Write-Host "2. Make your first commit: git commit -m 'Initial commit of reNamerX v1.0.0'" -ForegroundColor White
Write-Host "3. Add your remote repository: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "4. Push to your repository: git push -u origin main" -ForegroundColor White
Write-Host "`nNote: Don't forget to uncomment and update the git config lines in this script with your information." -ForegroundColor Yellow 