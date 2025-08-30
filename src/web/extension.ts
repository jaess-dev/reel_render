// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as shiki from 'shiki';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "reelrender" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('reelrender.preview', async () => {
		const panel = vscode.window.createWebviewPanel(
			'rustShortsPreview',
			'Rust Shorts Preview',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		if (vscode.window.activeTextEditor) {
			const editor = vscode.window.activeTextEditor;
			const code = editor.document.getText();
			const highlighted = await renderRust(code);
			panel.webview.html = getWebviewContent2(highlighted);
		}

		vscode.workspace.onDidChangeTextDocument(async event => {
			if (event.document === vscode.window.activeTextEditor?.document) {
				const highlighted = await renderRust(event.document.getText());
				panel.webview.html = getWebviewContent2(highlighted);
			}
		});
	});


	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }

async function renderRust(code: string) {
	const highlighter = await shiki.getHighlighter({
		theme: 'vscode-dark-plus'
	});
	return highlighter.codeToHtml(code, { lang: 'rust' });
}


function getWebviewContent(): string {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                margin: 0;
                padding: 1rem;
                font-family: 'Fira Code', monospace;
                background: #111;
                color: #eee;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            pre {
                width: 608px; /* narrow 9:16 style */
                white-space: pre-wrap;
                word-wrap: break-word;
                line-height: 1.6;
                font-size: 20px;
                background: #1e1e1e;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                overflow: hidden;
            }
        </style>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
		<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>
    </head>
    <body>
		<pre><code class="language-rust" id="code"></code></pre>
		<script>
		window.addEventListener('message', event => {
			const codeBlock = document.getElementById('code');
			codeBlock.textContent = event.data;
			Prism.highlightElement(codeBlock);
		});
		</script>
    </body>
    </html>`;
}

function getWebviewContent2(highlightedCode: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                margin: 0;
                padding: 1rem;
                font-family: 'Fira Code', monospace;
                background: #111;
                color: #eee;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            pre {
                width: 608px; /* narrow 9:16 style */
                line-height: 1.6;
                font-size: 20px;
                background: #1e1e1e;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                overflow: hidden;
            }
        </style>
    </head>
    <body>
        ${highlightedCode}
    </body>
    </html>`;
}
