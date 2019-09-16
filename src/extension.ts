import * as vscode from 'vscode';
import { fetchBuilds, Job, JobStatus } from './cloudbuild';
import { GitRepo } from './git';


var refreshTicker: NodeJS.Timeout;
var statusBar: vscode.StatusBarItem;

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
	statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
	refreshTicker = setInterval(() => {
		if (!vscode.workspace.rootPath) {
			fetchBuilds("master", (jobs) => refreshStatusBar(jobs));
		} else {
			let repo = new GitRepo(vscode.workspace.rootPath);
			repo.getCurrentBranch((branch) => {
				fetchBuilds(branch, (jobs) => {
					refreshStatusBar(jobs);
				});
			});
		}
	}, 1000);
}

function refreshStatusBar(jobs: Array<Job>) {
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
		let lastBuildDate = differenceBetween(lastJob.startTime, new Date());
		statusBar.tooltip += lastBuildDate + ' minutes ago.';
	}
	statusBar.show();
}

/**
 * Deactivate is called whenever the extensions is disabled or uninstalled.
 * 
 * It will also remove the interval function which pings `gcloud`.
 */
export function deactivate() {
	clearInterval(refreshTicker);

}

function differenceBetween(date1: Date, date2: Date): number {
	let oneMinuteInMs = 60000;
	let lastRunned = date2.getTime() - date1.getTime(); 
	return Math.round(lastRunned / oneMinuteInMs);
}
