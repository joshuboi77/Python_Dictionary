## 🐍 Python Token Analyzer

A VS Code extension that provides live Python token analysis with definitions from your comprehensive Python dictionary.

### Features
- **Live Hover Information**: Hover over Python tokens to see definitions and usage
- **Visual Token Analysis Panel**: View all tokens organized by type with positions and descriptions
- **Status Bar Integration**: See current token information in the status bar
- **Comprehensive Dictionary**: Uses your Python reference dictionary for accurate definitions
- **Real-time Analysis**: Updates as you type
- **Interactive Dictionary**: Clickable token squares with search functionality
- **Examples Included**: Every token includes working Python code examples

### Installation

#### Method 1: Using VSIX Package (Recommended)

**For Windows:**
1. Locate the `python-token-analyzer-0.0.3.vsix` file
2. Open VS Code → Extensions (`Ctrl+Shift+X`)
3. Click ellipsis (`...`) → "Install from VSIX..."
4. Select the `.vsix` file

**For macOS:**
1. Locate the `python-token-analyzer-0.0.3.vsix` file
2. Open VS Code → Command Palette (`Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX..." and select it
4. Select the `.vsix` file

#### Method 2: Using Shell Script (macOS/Linux)
```bash
chmod +x install_extension.sh
./install_extension.sh
```

#### Method 3: Command Line
```bash
# Windows
code --install-extension python-token-analyzer-0.0.3.vsix

# macOS/Linux
code --install-extension python-token-analyzer-0.0.3.vsix
```

### Usage
1. Open any Python file (`.py`)
2. Hover over Python keywords like `def`, `class`, `print` to see definitions
3. Check the "Python Token Analysis" panel in the Explorer sidebar
4. Use `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (macOS) and search "Python Token" for commands


## 📁 Project Structure

```
Language_Token_Analyzers/
├── python-token-analyzer/           # Python Token Analyzer Extension
│   ├── extension.js                 # Main extension logic
│   ├── package.json                 # Extension metadata
│   ├── built-in-definitions.js      # Auto-generated token definitions
│   ├── python-dictionary.js         # Auto-generated dictionary structure
│   ├── README.md                    # Python extension documentation
│   └── python-token-analyzer-0.0.3.vsix  # Packaged extension
├── Python_Dictionary.md             # Python language definitions
├── generate_python_dictionary_js.py # Python dictionary generator
└── install_extension.sh             # Installation script for macOS/Linux
```

## 🛠️ Development

### Python Token Analyzer

1. **Edit extension files:**
   - `python-token-analyzer/extension.js` - Main extension logic
   - `python-token-analyzer/package.json` - Extension metadata

2. **Regenerate definition files:**
   ```bash
   python generate_python_dictionary_js.py --source Python_Dictionary.md --out-dir python-token-analyzer
   ```

3. **Package the extension:**
   ```bash
   cd python-token-analyzer
   vsce package --allow-missing-repository --skip-license
   ```

4. **Install the updated extension:**
   ```bash
   code --install-extension python-token-analyzer-0.0.3.vsix
   ```

## 📋 Requirements

- **VS Code 1.74.0 or higher**
- **Node.js** - For `vsce` packaging tool (Python extension)
- **Python 3** - For generating definition files from markdown (Python extension)
- **No external files needed** - All definitions are embedded in the extensions

## 🎯 Key Features

### Includes:
- **Live hover tooltips** with detailed definitions
- **Interactive token panels** in the Explorer sidebar
- **Real-time analysis** as you type
- **Comprehensive dictionaries** with hundreds of token definitions
- **Command palette integration** for easy access
- **Status bar integration** showing current token info
- **Working code examples** for every token
- **Interactive dictionary view** with search functionality
- **Clickable token squares** with modal dialogs
- **104 token definitions** covering keywords, builtins, and operators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

