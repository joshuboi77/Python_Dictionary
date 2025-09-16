#!/bin/bash

# Python Token Analyzer Extension Installer (single-purpose)
echo "Installing Python Token Analyzer VSCode Extension..."

# Determine the VSCode extensions directory
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    EXTENSIONS_DIR="$HOME/.vscode/extensions"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    EXTENSIONS_DIR="$HOME/.vscode/extensions"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    EXTENSIONS_DIR="$USERPROFILE/.vscode/extensions"
else
    echo "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Create extensions directory if it doesn't exist
mkdir -p "$EXTENSIONS_DIR"

# Copy the extension (expects python-token-analyzer directory at repo root or under Example_Folder)
EXTENSION_NAME="python-token-analyzer"

SOURCE_DIR=""
if [ -d "python-token-analyzer" ]; then
  SOURCE_DIR="python-token-analyzer"
elif [ -d "Example_Folder/python-token-analyzer" ]; then
  SOURCE_DIR="Example_Folder/python-token-analyzer"
else
  echo "Could not find $EXTENSION_NAME directory. Ensure it exists in the repository."
  exit 1
fi

TARGET_DIR="$EXTENSIONS_DIR/$EXTENSION_NAME"

echo "Copying extension from: $SOURCE_DIR to: $TARGET_DIR"

# Remove existing installation if it exists
if [ -d "$TARGET_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$TARGET_DIR"
fi

# Copy the extension
cp -r "$SOURCE_DIR" "$TARGET_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Extension installed successfully!"
    echo ""
    echo "To complete the installation:"
    echo "1. Restart VSCode or reload the window (Ctrl+Shift+P → 'Developer: Reload Window')"
    echo "2. Open a Python (.py) file to activate the extension"
    echo "3. Hover over Python tokens to see definitions!"
    echo ""
    echo "The extension will automatically:"
    echo "- Show hover information for Python tokens"
    echo "- Display token analysis in the Explorer panel"
    echo "- Update the status bar with current token info"
    echo "- Load definitions from the embedded dictionary"
else
    echo "❌ Installation failed!"
    exit 1
fi


