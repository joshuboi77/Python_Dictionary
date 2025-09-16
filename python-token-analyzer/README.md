# Python Token Analyzer

A VSCode extension that provides live Python token analysis with definitions from your comprehensive Python dictionary.

## Features

- **Live Hover Information**: Hover over Python tokens to see definitions and usage
- **Visual Token Analysis Panel**: View all tokens organized by type with positions and descriptions
- **Status Bar Integration**: See current token information in the status bar
- **Comprehensive Dictionary**: Uses your Python reference dictionary for accurate definitions
- **Real-time Analysis**: Updates as you type

## How to Use

1. **Install the Extension**: Copy the extension folder to your VSCode extensions directory
2. **Open a Python File**: The extension activates automatically when you open `.py` files
3. **Hover for Definitions**: Hover over any token (keywords, operators, identifiers) to see definitions
4. **View Token Panel**: Check the "Python Token Analysis" panel in the Explorer view
5. **Click Tokens**: Click any token in the panel to open its detailed definition
6. **Browse Dictionary**: Use "Show Python Dictionary" command to browse all Python tokens
7. **Command Palette**: Use `Ctrl+Shift+P` and search for "Python Token Analyzer" commands

## Commands

- `Python Token Analyzer: Show Token Information` - Shows info for token at cursor
- `Python Token Analyzer: Analyze Current File` - Analyzes all tokens in current file
- `Python Token Analyzer: Show Python Dictionary` - Opens the complete Python Dictionary
- `Python Token Analyzer: Show Token Definition` - Shows detailed definition for a specific token

## Requirements

- VSCode 1.74.0 or higher
- **No external files needed** - Definitions are embedded

## Installation

### Method 1: Using VSIX Package (Recommended)

#### For Windows:

1. **Download the Extension:**
   - Locate the `python-token-analyzer-0.0.3.vsix` file in the project directory

2. **Install via VS Code:**
   - Open Visual Studio Code
   - Press `Ctrl+Shift+X` to open the Extensions view
   - Click the ellipsis (`...`) in the top-right corner
   - Select "Install from VSIX..." from the dropdown menu
   - Browse to and select the `python-token-analyzer-0.0.3.vsix` file
   - Click "Open" to install the extension

3. **Alternative - Command Line:**
   ```powershell
   code --install-extension python-token-analyzer-0.0.3.vsix
   ```

#### For macOS:

1. **Download the Extension:**
   - Locate the `python-token-analyzer-0.0.3.vsix` file in the project directory

2. **Install via VS Code:**
   - Open Visual Studio Code
   - Press `Cmd+Shift+P` to open the Command Palette
   - Type "Extensions: Install from VSIX..." and select it
   - Navigate to and select the `python-token-analyzer-0.0.3.vsix` file
   - Click "Open" to install the extension

3. **Alternative - Command Line:**
   ```bash
   code --install-extension python-token-analyzer-0.0.3.vsix
   ```

### Method 2: Using Shell Script (macOS/Linux)

1. **Make the script executable:**
   ```bash
   chmod +x install_extension.sh
   ```

2. **Run the installation script:**
   ```bash
   ./install_extension.sh
   ```

3. **The script will:**
   - Create the extensions directory if it doesn't exist
   - Copy the extension files to the correct location
   - Clean up temporary files
   - Display installation status

### Method 3: Manual Installation

1. **Copy the extension folder to your VSCode extensions directory:**
   - Windows: `%USERPROFILE%\.vscode\extensions\`
   - macOS: `~/.vscode/extensions/`
   - Linux: `~/.vscode/extensions/`

2. **Rename the folder to include the version:**
   - Rename `python-token-analyzer` to `python-token-analyzer-0.0.3`

3. **Restart VSCode or reload the window:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Developer: Reload Window" and select it

4. **Open a Python file to activate the extension**

### Verification

After installation, verify the extension is working:

1. **Check Extensions Panel:**
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
   - Search for "Python Token Analyzer"
   - Verify it shows as "Installed" and "Enabled"

2. **Test Functionality:**
   - Open any Python file (`.py`)
   - Hover over Python keywords like `def`, `class`, `print`
   - You should see detailed definitions with examples
   - Check the "Python Token Analysis" panel in the Explorer sidebar

3. **Command Palette Test:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Python Token" to see available commands

## Development

To modify or extend the extension:

1. **Edit the extension files:**
   - `extension.js` - Main extension logic
   - `package.json` - Extension metadata and commands
   - `built-in-definitions.js` - Auto-generated from `Python_Dictionary.md`
   - `python-dictionary.js` - Auto-generated from `Python_Dictionary.md`

2. **Regenerate definition files (if needed):**
   ```bash
   python generate_python_dictionary_js.py --source Python_Dictionary.md --out-dir python-token-analyzer
   ```

3. **Package the extension:**
   ```bash
   cd python-token-analyzer
   vsce package --allow-missing-repository --skip-license
   ```

4. **Install the updated extension:**
   - Windows: `code --install-extension python-token-analyzer-0.0.3.vsix`
   - macOS/Linux: `code --install-extension python-token-analyzer-0.0.3.vsix`

5. **Reload VSCode window:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Developer: Reload Window" and select it

### File Structure

```
python-token-analyzer/
├── extension.js              # Main extension logic
├── package.json              # Extension metadata
├── built-in-definitions.js   # Auto-generated token definitions
├── python-dictionary.js      # Auto-generated dictionary structure
├── README.md                 # This file
└── python-token-analyzer-0.0.3.vsix  # Packaged extension
```

### Dependencies

- **Node.js** - For `vsce` packaging tool
- **Python 3** - For generating definition files from markdown
- **VS Code 1.74.0+** - Extension runtime environment


