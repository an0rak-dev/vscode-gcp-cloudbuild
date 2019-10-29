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
const vscode = require('./__mocks__/vscode');
import * as cloudBuild from '../src/cloudbuild';
import {activate, statusBar, deactivate, refreshTicker} from '../src/extension';
import {StatusBarAlignment} from 'vscode';
import {GitRepo} from '../src/git';
import {JobStatus} from '../src/types';

describe('extension', () => {
  let context: any;
  let fetchBuildSpy: any;
  let getCurrentBranchSpy: any;

  beforeEach(() => {
    vscode.commands.registerCommand.mockReset();
    vscode.window.createStatusBarItem.mockReset();
    vscode.window.createStatusBarItem.mockImplementation((align: StatusBarAlignment, prio: number) => {
      return {
        alignment: align,
        priority: prio,
        text: '',
        tooltip: '',
        show: jest.fn(),
      };
    });
    fetchBuildSpy = jest.spyOn(cloudBuild, 'fetchBuilds').mockResolvedValue([]);
    getCurrentBranchSpy = jest.spyOn(GitRepo.prototype, 'getCurrentBranch').mockResolvedValue('master');
    context = {
      subscriptions: {
        push: jest.fn(),
      },
    };
  });

  afterEach(() => {
    deactivate();
  });

  describe('activate', () => {
    test('should set the status bar', () => {
      // When
      activate(context);
      // Then
      const statusItemCalls = vscode.window.createStatusBarItem.mock.calls;
      expect(statusItemCalls).toHaveLength(1);
      expect(statusItemCalls[0][0]).toBe(vscode.StatusBarAlignment.Left);
      expect(statusItemCalls[0][1]).toBeGreaterThanOrEqual(1000);
      expect(statusBar).toBeDefined();
    });

    test('should periodically fetch the builds with folders in workspace', async () => {
      getCurrentBranchSpy = jest.spyOn(GitRepo.prototype, 'getCurrentBranch').mockResolvedValue('develop');
      jest.useFakeTimers();
      activate(context);
      await jest.runOnlyPendingTimers();
      expect(fetchBuildSpy).toHaveBeenCalledWith('develop');
    });

    test('should periodically fetch the builds when no opened folder', () => {
      vscode.workspace = {};
      jest.useFakeTimers();
      activate(context);
      jest.runOnlyPendingTimers();
      expect(fetchBuildSpy).toHaveBeenCalledWith('master');
    });

    describe('should display the good status bar label depending the job\'s status', () => {
      test('should periodically fetch the builds with SUCCESS Job', () => {
        const job = new cloudBuild.Job(JobStatus.SUCCESS, new Date());
        fetchBuildSpy = fetchBuildSpy.mockResolvedValue([job]);
        jest.useFakeTimers();
        activate(context);
        jest.runOnlyPendingTimers();
        expect(fetchBuildSpy).toHaveBeenCalledWith('master');
        expect(statusBar).toBeTruthy();
      });

      test('should periodically fetch the builds with FAILURE Job', () => {
        const job = new cloudBuild.Job(JobStatus.FAILURE, new Date());
        fetchBuildSpy = fetchBuildSpy.mockResolvedValue([job]);
        jest.useFakeTimers();
        activate(context);
        jest.runOnlyPendingTimers();
        expect(fetchBuildSpy).toHaveBeenCalledWith('master');
        expect(statusBar).toBeTruthy();
      });

      test('should periodically fetch the builds with PENDING Job', () => {
        const job = new cloudBuild.Job(JobStatus.PENDING, new Date());
        fetchBuildSpy = fetchBuildSpy.mockResolvedValue([job]);
        jest.useFakeTimers();
        activate(context);
        jest.runOnlyPendingTimers();
        expect(fetchBuildSpy).toHaveBeenCalledWith('master');
        expect(statusBar).toBeTruthy();
      });
    });

    /* TODO: current specs are running all branches of the `extension` script.
             They are missing checks for `statusBar` due to the keeping variable
             in a global state.
    */
  });

  describe('deactivate', () => {
    test('should unset the statusbar and clear Interval', () => {
      const clearSpy = spyOn(global, 'clearInterval').and.callThrough();
      activate(context);
      expect(statusBar).toBeTruthy();
      deactivate();
      expect(statusBar).toBeFalsy();
      expect(clearSpy).toHaveBeenCalledWith(refreshTicker);
    });
  });
});
