const vscode = require('./__mocks__/vscode');
const cloudbuild = require('./__mocks__/cloudbuild');
import {activate, statusBar, deactivate} from '../src/extension';
import { StatusBarAlignment } from 'vscode';

describe('extension', () => {
   let context: any;

   beforeEach(() => {
      vscode.commands.registerCommand.mockReset();
      vscode.window.createStatusBarItem.mockReset();
      vscode.window.createStatusBarItem.mockImplementation((align:StatusBarAlignment, prio:number) => {
         return {
            alignment: align,
            priority: prio,
            text: '',
            tooltip: '',
            show: jest.fn()
         };
      });
      cloudbuild.fetchBuilds.mockReset();
      context = {
         subscriptions: {
            push: jest.fn()
         }
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
         expect(vscode.window.createStatusBarItem.mock.calls).toHaveLength(1);
         expect(vscode.window.createStatusBarItem.mock.calls[0][0]).toBe(vscode.StatusBarAlignment.Left);
         expect(vscode.window.createStatusBarItem.mock.calls[0][1]).toBeGreaterThanOrEqual(1000);
         expect(statusBar).toBeDefined();
      });

/* TODO: Finish thoses
      test('should periodically fetch the builds', () => {});
      test('should display the good status bar label depending the job\'s status', () => {});
      test('should set the tooltip of the status bar with the time elapsed since last job', () => {});
*/
   });

   describe('deactivate', () => {
/* TODO: Finish thoses
      test('should unset the statusbar', () => {});
      test('should stop the ping interval', () => {});
*/
   });
});
