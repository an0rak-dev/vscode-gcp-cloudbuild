/*
Copyright 2019 by Sylvain Nieuwlandt
   
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as vscode from 'vscode';
import {fetchBuilds, Job, JobStatus} from './cloudbuild';
import {GitRepo} from './git';
import * as time from './time';


export var refreshTicker: NodeJS.Timeout;
export var statusBar: vscode.StatusBarItem | undefined;

/**
 * Activate is called whenever the current workspace contains a
 * "cloudbuild.yaml" file.
 *
 * After activation, the extension will periodically (1000ms) call the `gcloud`
 * command to get the list of all the builds for the current branch, then it
 * will display the most recent build status in the status bar with :
 * - a $(circle-slash) if no build is found
 * - a $(check) if the most recent build is in success
 * - a $(x) if the most recent build is in failure
 * - a $(repo-sync) (spinning) if the most recent build is pending or running
 *
 * The status bar element will also have a tooltip with the time elapsed between
 * now and the last build.
 *
 * @param context the execution context of the calling VSCode instance.
 */
export function activate(context: vscode.ExtensionContext) {
  // Create the status bar item & position it
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
  refreshTicker = setInterval(() => {
    if (!vscode.workspace.rootPath) {
      fetchBuilds('master')
        .then(jobs => refreshStatusBar(jobs));
    } else {
      let repo = new GitRepo(vscode.workspace.rootPath);
      repo.getCurrentBranch()
        .then(branch => fetchBuilds(branch))
        .then(jobs => refreshStatusBar(jobs));
    }
  }, 1000);
}

/**
 * Deactivate is called whenever the extensions is disabled or uninstalled.
 *
 * It will remove the status bar item and the interval function which pings `gcloud`.
 */
export function deactivate() {
  clearInterval(refreshTicker);
  statusBar = undefined;
}

/**
 * Refresh the status bar with the state of the most recent job in the given job list
 * (usually the first one).
 *
 * Refresh the text of the status bar with :
 * - a circle-slash if no build is found
 * - a check if the most recent build is in success
 * - a x if the most recent build is in failure
 * - a repo-sync (spining) if the most recent build is pending or running
 *
 * Refresh the statusbar's tooltip with time elapsed between the most recent job start and now.
 *
 * @param jobs the Cloudbuild jobs list
 */
function refreshStatusBar(jobs: Array<Job>) {
  if (!statusBar) {return;}
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
    let lastBuildDate = time.differenceBetween(lastJob.startTime, new Date());
    statusBar.tooltip += time.normalizeMinutesAmount(lastBuildDate);
  }
  statusBar.show();
}
