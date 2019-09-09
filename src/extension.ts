import * as vscode from 'vscode';

/**
 * Activate is called whenever the current workspace contains a 
 * "cloudbuild.yaml" file.
 * 
 * After activation, the extension will periodically (1000ms) call the `gcloud` 
 * command to get the list of all the builds for the current branch, then it 
 * will display the most recent build status in the status bar (and as a tooltip
 * the timestamp of the build).
 * 
 * @param context the execution context of the calling VSCode instance.
 */
export function activate(context: vscode.ExtensionContext) {
	// Register the new command
	let buildChecker = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	
	// Create the status bar item & position it

	// Add the new command to the subscriptions.
	context.subscriptions.push(buildChecker);
}

/**
 * Deactivate is called whenever the extensions is disabled or uninstalled.
 * 
 * It will also remove the interval function which pings `gcloud`.
 */
export function deactivate() {}
