import * as vscode from 'vscode';
import { LastJobCloudbuildStatus } from "../../../src/activities/impls/cloudbuildStatus";
import { CloudbuildStatus } from '../../../src/activities/activities';
import { ServicesFactory } from '../../../src/services/services';

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

   describe('ticker', () => { 
      let sut : CloudbuildStatus;
      const timerTick = 1000;
      let servicesFactoryMock : ServicesFactory;

      beforeEach(() => {
         sut = new LastJobCloudbuildStatus();
         jest.useFakeTimers();
      });

      afterEach(() => {
         if (sut.isAutoRefreshStarted()) {
            sut.stopAutoRefresh();
         }
      });

      test('should call gcloud when new commits are pushed', () => {
         // Given

         // When
         sut.startAutoRefresh();
         jest.advanceTimersByTime(timerTick);
         // Then
      });

      test('should call gcloud when new tags are pushed', () => {

      });
      
      test('should call gcloud if the current lastjob is still running', () => {

      });

      test('should call gcloud if the current lastjob is still pending', () => {

      });

      test('shouldn\'t call gcloud when no push and lastjob in success', () => {

      });

      test('shouldn\'t call gcloud when no push and lastjob in failure', () => {

      });
   });
});
