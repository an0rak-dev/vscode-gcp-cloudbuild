import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let buildChecker = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(buildChecker);
}

// this method is called when your extension is deactivated
export function deactivate() {}
