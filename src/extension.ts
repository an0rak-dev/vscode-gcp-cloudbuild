import * as vscode from 'vscode';
import { fetchBuilds, JobStatus } from './cloudbuild';

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
	// Create the status bar item & position it
	let statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
	fetchBuilds("master", (jobs) => {
		if (jobs.length < 1) {
			statusBar.text = 'CloudBuild : $(circle-slash)';
			statusBar.tooltip = 'No build for the current branch yet.';	
		} else {
			let lastJob = jobs[0];
			statusBar.tooltip = 'Builded ';
			if (lastJob.status === JobStatus.SUCCESS) {
				statusBar.text = 'CloudBuild : $(check)';
			} else if (lastJob.status === JobStatus.FAILURE) {
				statusBar.text = 'CloudBuild : $(x)';
			} else {
				statusBar.tooltip = 'Started ';
				statusBar.text = 'CloudBuild : $(repo-sync~spin)';
			}
			let lastRunned = new Date().getTime() - lastJob.startTime.getTime(); 
			// FIXME Bad time in tooltip (38minutes ago for something last built 
			// more than 8days ago...)
			// TODO Use revelant scale (don't use 11520 minutes when 8days does the job)
			statusBar.tooltip += new Date(lastRunned).getMinutes() + ' minutes ago.';
		}
		statusBar.show();
	});
}

/**
 * Deactivate is called whenever the extensions is disabled or uninstalled.
 * 
 * It will also remove the interval function which pings `gcloud`.
 */
export function deactivate() {}
