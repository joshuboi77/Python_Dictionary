const vscode = require('vscode');

// Import built-in definitions (embedded from Python_Dictionary.md)
const BUILT_IN_DEFINITIONS = require('./built-in-definitions.js');
// Import embedded dictionary content
const PY_DICTIONARY = require('./python-dictionary.js');

let analyzer = null;

class PythonTokenAnalyzer {
    constructor() {
        this.tokenDefinitions = new Map();
        this.diagnostics = vscode.languages.createDiagnosticCollection('python-token-analyzer');
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    }

    async activate(context) {
        console.log('Python Token Analyzer extension is now active!');

        // Load token definitions
        await this.loadTokenDefinitions();

        // Register commands
        const showTokenInfoCommand = vscode.commands.registerCommand('python-token-analyzer.showTokenInfo', () => {
            this.showTokenInfo();
        });

        const analyzeFileCommand = vscode.commands.registerCommand('python-token-analyzer.analyzeFile', () => {
            this.analyzeCurrentFile();
        });

        const showDictionaryCommand = vscode.commands.registerCommand('python-token-analyzer.showDictionary', () => {
            this.showDictionary();
        });

        const showTokenDefinitionCommand = vscode.commands.registerCommand('python-token-analyzer.showTokenDefinition', (token) => {
            this.showTokenDefinition(token);
        });

        // Register hover provider
        const hoverProvider = vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'python' },
            {
                provideHover: (document, position, token) => {
                    return this.provideHover(document, position);
                }
            }
        );

        // Register document change listener
        const changeListener = vscode.workspace.onDidChangeTextDocument(event => {
            this.onDocumentChange(event);
        });

        // Register cursor change listener
        const cursorChangeListener = vscode.window.onDidChangeTextEditorSelection(event => {
            this.onCursorChange(event);
        });

        // Register tree data provider
        this.tokenAnalysisProvider = new TokenAnalysisProvider();
        const treeDataProvider = vscode.window.registerTreeDataProvider(
            'python-token-analyzer',
            this.tokenAnalysisProvider
        );

        // Update status bar
        this.statusBarItem.text = "$(symbol-keyword) Py Tokens";
        this.statusBarItem.tooltip = "Python Token Analyzer - Hover over tokens for definitions";
        this.statusBarItem.show();

        context.subscriptions.push(
            showTokenInfoCommand,
            analyzeFileCommand,
            showDictionaryCommand,
            showTokenDefinitionCommand,
            hoverProvider,
            changeListener,
            cursorChangeListener,
            treeDataProvider,
            this.diagnostics,
            this.statusBarItem
        );
    }

    loadTokenDefinitions() {
        // Load token definitions from embedded Python dictionary
        console.log(`Loading ${BUILT_IN_DEFINITIONS.length} token definitions from embedded dictionary...`);
        for (const definition of BUILT_IN_DEFINITIONS) {
            this.tokenDefinitions.set(definition.token, definition);
        }
        console.log(`Loaded ${this.tokenDefinitions.size} token definitions`);
    }

    determineTokenType(token) {
        const definition = this.tokenDefinitions.get(token);
        return definition ? definition.type : 'identifier';
    }

    async provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) return undefined;
        const token = document.getText(wordRange);
        const definition = this.tokenDefinitions.get(token);
        if (definition) {
            const hoverText = new vscode.MarkdownString();
            hoverText.appendMarkdown(`**${definition.token}** - ${definition.type}\n\n`);
            hoverText.appendMarkdown(`${definition.description}\n\n`);
            if (definition.example) {
                hoverText.appendMarkdown(`**Example:**\n\`\`\`python\n${definition.example}\n\`\`\``);
            }
            return new vscode.Hover(hoverText, wordRange);
        }
        return undefined;
    }

    showTokenInfo() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'python') {
            vscode.window.showInformationMessage('Please open a Python file first.');
            return;
        }
        const position = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(position);
        if (!wordRange) {
            vscode.window.showInformationMessage('No token at cursor position.');
            return;
        }
        const token = editor.document.getText(wordRange);
        const definition = this.tokenDefinitions.get(token);
        if (definition) {
            vscode.window.showInformationMessage(`${definition.token}: ${definition.description}`, { modal: false });
        } else {
            vscode.window.showInformationMessage(`Token "${token}" not found in dictionary.`);
        }
    }

    analyzeCurrentFile() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'python') {
            vscode.window.showInformationMessage('Please open a Python file first.');
            return;
        }
        const document = editor.document;
        const tokens = this.tokenizeDocument(document);
        this.tokenAnalysisProvider.updateTokens(tokens);
        vscode.window.showInformationMessage(`Analyzed ${tokens.length} tokens in current file.`);
        const tokenCounts = {};
        tokens.forEach(token => {
            tokenCounts[token.type] = (tokenCounts[token.type] || 0) + 1;
        });
        let summary = 'Token Summary:\n';
        for (const [type, count] of Object.entries(tokenCounts)) {
            summary += `${type}: ${count}\n`;
        }
        vscode.window.showInformationMessage(summary);
    }

    tokenizeDocument(document) {
        const tokens = [];
        const text = document.getText();
        // Simple tokenizer: words and operators. Python-specific tweaks: include underscores in identifiers
        const tokenRegex = /[A-Za-z_][A-Za-z_0-9]*|[^\w\s]/g;
        let match;
        while ((match = tokenRegex.exec(text)) !== null) {
            const token = match[0];
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + token.length);
            tokens.push({
                token,
                type: this.determineTokenType(token),
                description: this.tokenDefinitions.get(token)?.description || 'Unknown token',
                position: startPos,
                range: new vscode.Range(startPos, endPos)
            });
        }
        return tokens;
    }

    onDocumentChange(event) {
        if (event.document.languageId === 'python') {
            setTimeout(() => {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document === event.document) {
                    const tokens = this.tokenizeDocument(event.document);
                    this.statusBarItem.text = `$(symbol-keyword) ${tokens.length} tokens`;
                    this.tokenAnalysisProvider.updateTokens(tokens);
                }
            }, 500);
        }
    }

    onCursorChange(event) {
        if (event.textEditor.document.languageId === 'python') {
            const position = event.selections[0].active;
            const wordRange = event.textEditor.document.getWordRangeAtPosition(position);
            if (wordRange) {
                const token = event.textEditor.document.getText(wordRange);
                const definition = this.tokenDefinitions.get(token);
                if (definition) {
                    this.statusBarItem.text = `$(symbol-keyword) ${token}: ${definition.type}`;
                } else {
                    this.statusBarItem.text = `$(symbol-keyword) ${token}: unknown`;
                }
            }
        }
    }

    showDictionary() {
        const panel = vscode.window.createWebviewPanel(
            'pythonDictionary',
            'Python Language Dictionary',
            vscode.ViewColumn.Two,
            { enableScripts: true, retainContextWhenHidden: true }
        );
        panel.webview.html = this.generateDictionaryHTML();
    }

    showTokenDefinition(token) {
        let tokenInfo = null;
        for (const section of PY_DICTIONARY.sections) {
            for (const item of section.items) {
                if (item.token === token) {
                    tokenInfo = item;
                    break;
                }
            }
            if (tokenInfo) break;
        }
        if (tokenInfo) {
            const panel = vscode.window.createWebviewPanel(
                'pythonTokenDefinition',
                `${token} - Python Definition`,
                vscode.ViewColumn.Two,
                { enableScripts: true, retainContextWhenHidden: true }
            );
            panel.webview.html = this.generateTokenDefinitionHTML(tokenInfo);
        } else {
            vscode.window.showInformationMessage(`Token "${token}" not found in dictionary.`);
        }
    }

    generateDictionaryHTML() {
        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Language Dictionary</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); line-height: 1.6; }
        .header { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: var(--vscode-textLink-foreground); }
        .search-box { margin: 20px 0; padding: 10px; border: 1px solid var(--vscode-input-border); border-radius: 4px; background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); width: 100%; box-sizing: border-box; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 1.5em; font-weight: bold; margin-bottom: 15px; color: var(--vscode-textLink-foreground); border-bottom: 2px solid var(--vscode-textLink-foreground); padding-bottom: 5px; }
        .token-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .token-item { padding: 10px; border: 1px solid var(--vscode-panel-border); border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        .token-item:hover { background-color: var(--vscode-list-hoverBackground); }
        .token-name { font-weight: bold; color: var(--vscode-textLink-foreground); }
        .token-type { font-size: 0.9em; color: var(--vscode-descriptionForeground); margin-top: 5px; }
        .token-description { font-size: 0.85em; margin-top: 8px; color: var(--vscode-textPreformat-foreground); }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🐍 Python Language Dictionary</h1>
        <p>Reference for Python keywords, operators, and builtins</p>
        <input type="text" class="search-box" placeholder="Search tokens..." id="searchBox">
    </div>
`;
        for (const section of PY_DICTIONARY.sections) {
            html += `
    <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="token-grid">
`;
            for (const item of section.items) {
                html += `
            <div class="token-item" onclick="showTokenDetail('${item.token}', '${item.type}', '${(item.description || '').replace(/'/g, "\\'")}', '${item.example ? item.example.replace(/'/g, "\\'").replace(/\n/g, "\\n") : ""}')">
                <div class="token-name">${item.token}</div>
                <div class="token-type">${item.type}</div>
                <div class="token-description">${(item.description || '').substring(0, 100)}${(item.description || '').length > 100 ? '...' : ''}</div>
            </div>
`;
            }
            html += `
        </div>
    </div>
`;
        }
        html += `
    <script>
        const searchBox = document.getElementById('searchBox');
        const tokenItems = document.querySelectorAll('.token-item');
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            tokenItems.forEach(item => {
                const tokenName = item.querySelector('.token-name').textContent.toLowerCase();
                const tokenDesc = item.querySelector('.token-description').textContent.toLowerCase();
                if (tokenName.includes(searchTerm) || tokenDesc.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
        function showTokenDetail(token, type, description, example) {
            // Create a modal-like display instead of alert
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; ' +
                'background: rgba(0,0,0,0.8); z-index: 1000; display: flex; ' +
                'align-items: center; justify-content: center; padding: 20px;';
            
            const content = document.createElement('div');
            content.style.cssText = 'background: var(--vscode-editor-background); ' +
                'border: 1px solid var(--vscode-panel-border); ' +
                'border-radius: 8px; padding: 30px; max-width: 600px; ' +
                'max-height: 80vh; overflow-y: auto; position: relative;';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = 'position: absolute; top: 10px; right: 15px; ' +
                'background: none; border: none; font-size: 24px; ' +
                'color: var(--vscode-editor-foreground); cursor: pointer;';
            closeBtn.onclick = () => document.body.removeChild(modal);
            
            const title = document.createElement('h2');
            title.style.cssText = 'margin: 0 0 15px 0; color: var(--vscode-textLink-foreground);';
            title.textContent = token;
            
            const typeEl = document.createElement('div');
            typeEl.style.cssText = 'color: var(--vscode-descriptionForeground); margin-bottom: 20px; font-size: 1.1em;';
            typeEl.textContent = type;
            
            const descEl = document.createElement('div');
            descEl.style.cssText = 'margin-bottom: 20px; line-height: 1.6;';
            descEl.textContent = description;
            
            content.appendChild(closeBtn);
            content.appendChild(title);
            content.appendChild(typeEl);
            content.appendChild(descEl);
            
            if (example) {
                const exampleTitle = document.createElement('h3');
                exampleTitle.style.cssText = 'color: var(--vscode-textLink-foreground); margin: 20px 0 10px 0;';
                exampleTitle.textContent = 'Example:';
                
                const exampleEl = document.createElement('pre');
                exampleEl.style.cssText = 'background: var(--vscode-textCodeBlock-background); ' +
                    'padding: 15px; border-radius: 4px; overflow-x: auto; ' +
                    'border: 1px solid var(--vscode-panel-border);';
                exampleEl.textContent = example;
                
                content.appendChild(exampleTitle);
                content.appendChild(exampleEl);
            }
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };
        }
    </script>
</body>
</html>
`;
        return html;
    }

    generateTokenDefinitionHTML(tokenInfo) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tokenInfo.token} - Python Definition</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 30px; background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); line-height: 1.6; }
        .header { border-bottom: 2px solid var(--vscode-textLink-foreground); padding-bottom: 20px; margin-bottom: 30px; }
        .token-name { font-size: 2.5em; font-weight: bold; color: var(--vscode-textLink-foreground); margin: 0; }
        .token-type { font-size: 1.2em; color: var(--vscode-descriptionForeground); margin-top: 10px; }
        .description { font-size: 1.1em; margin: 30px 0; padding: 20px; background-color: var(--vscode-textBlockQuote-background); border-left: 4px solid var(--vscode-textLink-foreground); }
        .example { margin-top: 30px; }
        .example h3 { color: var(--vscode-textLink-foreground); margin-bottom: 15px; }
        pre { background-color: var(--vscode-textCodeBlock-background); padding: 20px; border-radius: 4px; overflow-x: auto; border: 1px solid var(--vscode-panel-border); }
        code { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="token-name">${tokenInfo.token}</h1>
        <div class="token-type">${tokenInfo.type}</div>
    </div>
    <div class="description">
        <strong>Description:</strong><br>
        ${tokenInfo.description || ''}
    </div>
    ${tokenInfo.example ? `
    <div class="example">
        <h3>Example:</h3>
        <pre><code>${tokenInfo.example}</code></pre>
    </div>
    ` : ''}
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--vscode-panel-border);">
        <p><em>From the Python Language Dictionary - ${PY_DICTIONARY.title}</em></p>
    </div>
</body>
</html>
`;
    }
}

function activate(context) {
    analyzer = new PythonTokenAnalyzer();
    analyzer.activate(context);
}

function deactivate() {
    if (analyzer) {
        analyzer = null;
    }
}

class TokenAnalysisProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.tokens = [];
    }

    updateTokens(tokens) {
        this.tokens = tokens;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            const groups = {};
            this.tokens.forEach(token => {
                if (!groups[token.type]) groups[token.type] = [];
                groups[token.type].push(token);
            });
            const rootItems = [];
            for (const [type, tokens] of Object.entries(groups)) {
                rootItems.push(new TokenGroupItem(type, tokens.length));
            }
            return rootItems.sort((a, b) => a.label.localeCompare(b.label));
        } else if (element instanceof TokenGroupItem) {
            const groupTokens = this.tokens.filter(token => token.type === element.type);
            return groupTokens.map(token => new TokenItem(token));
        }
        return [];
    }
}

class TokenGroupItem extends vscode.TreeItem {
    constructor(type, count) {
        super(type, vscode.TreeItemCollapsibleState.Collapsed);
        this.type = type;
        this.description = `${count} tokens`;
        this.contextValue = 'tokenGroup';
        switch (type) {
            case 'keyword': this.iconPath = new vscode.ThemeIcon('symbol-keyword'); break;
            case 'operator': this.iconPath = new vscode.ThemeIcon('symbol-operator'); break;
            case 'builtin': this.iconPath = new vscode.ThemeIcon('symbol-function'); break;
            case 'identifier': this.iconPath = new vscode.ThemeIcon('symbol-variable'); break;
            case 'literal': this.iconPath = new vscode.ThemeIcon('symbol-numeric'); break;
            case 'string': this.iconPath = new vscode.ThemeIcon('symbol-string'); break;
            default: this.iconPath = new vscode.ThemeIcon('symbol-misc');
        }
    }
}

class TokenItem extends vscode.TreeItem {
    constructor(tokenInfo) {
        super(tokenInfo.token, vscode.TreeItemCollapsibleState.None);
        this.tokenInfo = tokenInfo;
        const line = tokenInfo.position.line + 1;
        const col = tokenInfo.position.character + 1;
        this.description = `L${line}:C${col}`;
        this.tooltip = tokenInfo.description;
        this.contextValue = 'token';
        switch (tokenInfo.type) {
            case 'keyword': this.iconPath = new vscode.ThemeIcon('symbol-keyword'); break;
            case 'operator': this.iconPath = new vscode.ThemeIcon('symbol-operator'); break;
            case 'builtin': this.iconPath = new vscode.ThemeIcon('symbol-function'); break;
            case 'identifier': this.iconPath = new vscode.ThemeIcon('symbol-variable'); break;
            case 'literal': this.iconPath = new vscode.ThemeIcon('symbol-numeric'); break;
            case 'string': this.iconPath = new vscode.ThemeIcon('symbol-string'); break;
            default: this.iconPath = new vscode.ThemeIcon('symbol-misc');
        }
        this.command = {
            command: 'python-token-analyzer.showTokenDefinition',
            title: 'Show Token Definition',
            arguments: [tokenInfo.token]
        };
    }
}

module.exports = { activate, deactivate };


