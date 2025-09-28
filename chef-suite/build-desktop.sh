#!/bin/bash

# Chef Suite Desktop App Build Script
# Creates a professional desktop installer for Windows

set -e

echo "🏗️  Building Chef Suite Desktop Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "chef-suite/frontend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

cd chef-suite/frontend

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building React application...${NC}"
npm run build

echo -e "${YELLOW}📱 Building Electron application...${NC}"
npm run dist

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📁 Output files are located in: chef-suite/frontend/dist/"
echo ""
echo "🎯 To create an installer:"
echo "   1. Run: npm run dist"
echo "   2. The installer will be created in the 'dist' folder"
echo "   3. Double-click the .exe file to install"
echo ""
echo "🚀 Installation includes:"
echo "   - Desktop shortcut"
echo "   - Start menu entry"
echo "   - Automatic updates (when implemented)"
echo "   - Uninstaller"