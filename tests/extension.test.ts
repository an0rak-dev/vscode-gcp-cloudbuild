const vscode = require('./__mocks__/vscode');
const cloudbuild = require('./__mocks__/cloudbuild');
import {activate} from '../src/extension';
import { StatusBarAlignment } from 'vscode';

describe('activate', () => {
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
/*
   test('should register the gcp.cloudbuild.fetch command', () => {
      // When
      activate(context);
      // Then
      let calls = vscode.commands.registerCommand.mock.calls;
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe('gcp.cloudbuild.fetch');
   });
*/
   test('should create the status bar item with all the informations', () => {
      // When
      activate(context);
      // Then
      let calls = vscode.window.createStatusBarItem.mock.calls;
      let results = vscode.window.createStatusBarItem.mock.results;
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe(StatusBarAlignment.Left);
      expect(calls[0][1]).toBeGreaterThan(500);
      expect(results[0].value.text).toBe('CloudBuild : $(check)');
      expect(results[0].value.tooltip).toBe('Builded 5 minutes ago.');

   });
/*
   test('should add the new command to the context\'s subscriptions', () => {
      // Given
      vscode.commands.registerCommand.mockImplementation(
         (cmdName: string, callback: any) => { return cmdName; }
      );
      // When
      activate(context);
      // Then
      let calls = context.subscriptions.push.mock.calls;
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe('gcp.cloudbuild.fetch');
   });
*/
});
