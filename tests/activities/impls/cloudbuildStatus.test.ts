import * as vscode from 'vscode';
import { LastJobCloudbuildStatus } from "../../../src/activities/impls/cloudbuildStatus";
import { CloudbuildStatus } from '../../../src/activities/activities';
import { MockServicesFactory } from '../../__mocks__/services';
import { ServicesFactory } from '../../../src/services/services';

describe('LastJobCloudbuildStatus', () => {
   describe('constructor', () => {
      test('should create the status bar item', () => {
         // Given
         vscode.window.createStatusBarItem = jest.fn().mockImplementation((align, prio) => {
            return {alignment : align, priority : prio};
         });
         // When
         const sut = new LastJobCloudbuildStatus(new MockServicesFactory());
         // Then
         expect(sut.getItem()).toBeDefined();
         expect(sut.getItem().alignment).toBe(vscode.StatusBarAlignment.Left);
         expect(sut.getItem().priority).toBeGreaterThan(500);
      });

      test('should disable the ticker', () => {
         // When
         const sut = new LastJobCloudbuildStatus(new MockServicesFactory());
         // Then
         expect(sut.isAutoRefreshStarted()).toBeFalsy();
      });
   });

   describe('ticker', () => { 
      let sut : CloudbuildStatus;
      const timerTick = 1000;
      let serviceMock: MockServicesFactory;

      beforeEach(() => {
         serviceMock = new MockServicesFactory();
         sut = new LastJobCloudbuildStatus(serviceMock);
         jest.useFakeTimers();
      });

      afterEach(() => {
         if (sut.isAutoRefreshStarted()) {
            sut.stopAutoRefresh();
         }
      });

      test('should call gcloud when new commits are pushed', () => {
         // Given
         const oldCommitId = 'edeff9383593eaad3';
         const newCommitId = 'aaabedd4392258bbac';
         const branch = 'feat/something';
         serviceMock.getGitRepo('').getCurrentBranch = jest.fn().mockImplementation(() => {
            return new Promise((res, rej) => { res(branch); });
         });
        /*
         serviceMock.getGitRepo('').getRemoteHeads = jest.fn().mockImplementation((branch) => {
            return new Promise((res, rej) => { res([oldCommitId]); });
         });
         serviceMock.getGitRepo('').getCurrentHead = jest.fn().mockImplementation((branch) => {
            return new Promise((res, rej) => { res(newCommitId); });
         });
         */
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
