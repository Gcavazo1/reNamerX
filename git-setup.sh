#!/bin/bash
# reNamerX Git Setup Script
# Run this script to initialize and configure git for the reNamerX project

# Make script executable with: chmod +x git-setup.sh

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo -e "${GREEN}Initializing git repository...${NC}"
    git init
else
    echo -e "${YELLOW}Git repository already initialized.${NC}"
fi

# Configure git with your information
# Uncomment and modify these lines with your information
# git config user.name "Gabriel Cavazos"
# git config user.email "your.email@example.com"

# Add all files to git
echo -e "${GREEN}Adding files to git...${NC}"
git add .

# Display status
echo -e "\n${CYAN}Current git status:${NC}"
git status

echo -e "\n${GREEN}Next steps:${NC}"
echo -e "1. Verify the files being tracked in the status above"
echo -e "2. Make your first commit: git commit -m 'Initial commit of reNamerX v1.0.0'"
echo -e "3. Add your remote repository: git remote add origin <your-repo-url>"
echo -e "4. Push to your repository: git push -u origin main"
echo -e "\n${YELLOW}Note: Don't forget to uncomment and update the git config lines in this script with your information.${NC}" 