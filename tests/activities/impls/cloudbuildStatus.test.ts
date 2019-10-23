import * as vscode from 'vscode';
import { LastJobCloudbuildStatus } from "../../../src/activities/impls/cloudbuildStatus";

describe('LastJobCloudbuildStatus', () => {
   describe('constructor', () => {
      test('should create the status bar item', () => {
         // Given
         vscode.window.createStatusBarItem = jest.fn().mockImplementation((align, prio) => {
            return {alignment : align, priority : prio};
         });
         // When
         const sut = new LastJobCloudbuildStatus();
         // Then
         expect(sut.getItem()).toBeDefined();
         expect(sut.getItem().alignment).toBe(vscode.StatusBarAlignment.Left);
         expect(sut.getItem().priority).toBeGreaterThan(500);
      });

      test('should disable the ticker', () => {
         // When
         const sut = new LastJobCloudbuildStatus();
         // Then
         expect(sut.isAutoRefreshStarted()).toBeFalsy();
      });
   });
});
