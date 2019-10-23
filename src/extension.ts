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
import { CloudbuildStatus, ActivitiesFactory } from './activities/activities';

let gcbStatus : CloudbuildStatus | undefined;

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
    const activities = new ActivitiesFactory();
    gcbStatus = activities.getCloudbuildStatus();
    gcbStatus.startAutoRefresh();
}

/**
 * Deactivate is called whenever the extensions is disabled or uninstalled.
 *
 * It will remove the status bar item and the interval function which pings `gcloud`.
 */
export function deactivate() {
  if (undefined !== gcbStatus && gcbStatus.isAutoRefreshStarted()) {
    gcbStatus.stopAutoRefresh();
  }
  gcbStatus = undefined;
}
