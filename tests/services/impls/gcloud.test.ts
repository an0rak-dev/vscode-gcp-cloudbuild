import { GCloudChildProcess } from "../../../src/services/impls/gcloud";
import { stringLiteral } from "@babel/types";
import { JobStatus } from "../../../src/services/datas/job";
const childprocess = require('child_process');
jest.mock('child_process');


const JSON_RESPONSE=`[
    {
        "buildTriggerId": "ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
        "createTime": "2019-09-02T14:06:52.171187623Z",
        "finishTime": "2019-09-02T14:06:52.171187623Z",
        "id": "ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
        "logUrl": "https://console.cloud.google.com/gcr/builds/ffffffff-0000-3232-bbbb-aaaaaaaaaaaa?project=000000000000",
        "options": { "logging": "LEGACY" },
        "projectId": "prj",
        "source": {
          "repoSource": {
            "branchName": "master",
            "projectId": "prj",
            "repoName": "prj-repo"
          }
        },
        "startTime": "2019-09-02T14:06:52.171187623Z",
        "status": "FAILURE",
        "statusDetail": "failed unmarshalling build config cloudbuild.yaml: yaml: line 2: found character that cannot start any token",
        "tags": [
          "event-ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
          "trigger-ffffffff-0000-3232-bbbb-aaaaaaaaaaaa"
        ]
      },
      {
        "buildTriggerId": "aaaaaaaa-1111-6666-ffff-ffffffffffff",
        "createTime": "2018-12-25T00:00:00.000166600Z",
        "finishTime": "2018-12-25T00:00:00.000166600Z",
        "id": "aaaaaaaa-1111-6666-ffff-ffffffffffff",
        "logUrl": "https://console.cloud.google.com/gcr/builds/ffffffff-0000-3232-bbbb-aaaaaaaaaaaa?project=000000000000",
        "options": { "logging": "LEGACY" },
        "projectId": "prj",
        "source": {
          "repoSource": {
            "branchName": "master",
            "projectId": "prj",
            "repoName": "prj-repo"
          }
        },
        "startTime": "2018-12-25T00:00:00.000166600Z",
        "status": "SUCCESS",
        "statusDetail": "",
        "tags": [
          "event-aaaaaaaa-1111-6666-ffff-ffffffffffff",
          "trigger-aaaaaaaa-1111-6666-ffff-ffffffffffff"
        ]
      }
]`;

describe('GCloudChildProcess', () => {
    let sut : GCloudChildProcess;

    beforeEach(() => {
        sut = new GCloudChildProcess();
        childprocess.exec.mockReset();
    });

    describe('fetchBuildsOf', () => {
        test('should fetch the last job', async () => {
            // Given
            childprocess.exec.mockImplementation((cmd: string, cb: any) => {
                cb(undefined, JSON_RESPONSE, '');
            });
            let expectedCmd = 'gcloud builds list ';
            expectedCmd += '--filter "source.repoSource.branchName=master" ';
            expectedCmd += '--format json';
            // When
            let result = await sut.fetchLastBuildOf('master');
            // Then
            expect(childprocess.exec).toHaveBeenCalledTimes(1);
            expect(childprocess.exec.mock.calls[0][0]).toBe(expectedCmd);
            expect(result).toBeDefined();
            expect(result.status).toBe(JobStatus.FAILURE);
            expect(result.startTime).toEqual(new Date('2019-09-02T14:06:52.171187623Z'));
        });

        test('should fetch the last job on the current branch', async () => {
            // Given
            let branchName="feat/something";
            childprocess.exec.mockImplementation((cmd: string, cb: any) => {
                cb(undefined, JSON_RESPONSE, '');
            });
            let expectedCmd = 'gcloud builds list ';
            expectedCmd += `--filter "source.repoSource.branchName=${branchName}" `;
            expectedCmd += '--format json';
            // When
            let result = await sut.fetchLastBuildOf(branchName);
            // Then
            expect(childprocess.exec).toHaveBeenCalledTimes(1);
            expect(childprocess.exec.mock.calls[0][0]).toBe(expectedCmd);
            expect(result).toBeDefined();
        });

        test('should resolve undefined if the current branch has no job', async () => {
            // Given
            let branchName = "feat/something";
            childprocess.exec.mockImplementation((cmd: string, cb: any) => {
                cb(undefined, '[]', '');
            });
            // When
            let result = await sut.fetchLastBuildOf(branchName);
            expect(childprocess.exec).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });

        test('should reject if an error occurs with childprocess', async () => {
            // Given
            let branchName = "feat/something";
            childprocess.exec.mockImplementation((cmd: string, cb: any) => {
                cb(new Error('Unknown command "gcloud"'), '', '');
            });
            // When
            try {
                let result = await sut.fetchLastBuildOf(branchName);
                fail('The result should be rejected if child process fails');
            } catch (e) {
                // Then
                expect(e.message).toBe('Unknown command "gcloud"');
            }
        });

        test('should reject if an error occurs with gcloud', async () => {
            // Given
            let branchName = "feat/something";
            childprocess.exec.mockImplementation((cmd: string, cb: any) => {
                cb(undefined, '', 'You don\'t have right to access this.');
            });
            // When
            try {
                let result = await sut.fetchLastBuildOf(branchName);
                fail('The result should be rejected if child process fails');
            } catch (e) {
                // Then
                expect(e.message).toBe('You don\'t have right to access this.');
            }
        });
    });
});
