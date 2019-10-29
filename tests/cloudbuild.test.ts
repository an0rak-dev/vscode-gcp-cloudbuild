/*
Copyright 2019 by Jakub Kaluzka
   
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
import {fetchBuilds, Job} from '../src/cloudbuild';
import {JobStatus} from '../src/types';

jest.mock('child_process');

const childProcess = require('child_process');

describe('cloudbuild', () => {
  beforeEach(() => {
    childProcess.exec = jest.fn().mockImplementation((cmd, cb) => cb(null, '[]'));
  });

  describe('fetchBuilds', () => {
    test('should return empty array', async () => {
      const results = await fetchBuilds('master');

      expect(childProcess.exec).toHaveBeenCalled();
      expect(results).toEqual([]);
    });

    test('should return array with Jobs', async () => {
      const jobs = `[
        {"status": "FAILURE", "createTime": "1970-01-01 10:11:12"},
        {"status": "SUCCESS", "createTime": "1970-02-01 10:11:12"},
        {"status": "unknown", "createTime": "1970-03-01 10:11:12"},
        {"createTime": "1970-04-01"},
        {}
      ]`;
      childProcess.exec = jest.fn().mockImplementation((cmd, cb) => cb(null, jobs));
      const results = await fetchBuilds('master');

      expect(childProcess.exec).toHaveBeenCalled();
      expect(results.length).toBe(5);
      const expected: Job[] = [
        new Job(JobStatus.FAILURE, new Date('1970-01-01 10:11:12')),
        new Job(JobStatus.SUCCESS, new Date('1970-02-01 10:11:12')),
        new Job(JobStatus.PENDING, new Date('1970-03-01 10:11:12')),
        new Job(JobStatus.PENDING, new Date('1970-01-01')),
        new Job(JobStatus.PENDING, new Date('1970-01-01')),
      ];
      expect(results).toEqual(expected);
    });

    test('should reject Promise with an error', async () => {
      childProcess.exec = jest.fn().mockImplementation((cmd, cb) => cb('error', '[]'));

      await expect(fetchBuilds('master')).rejects.toEqual('error');
    });
  });
});
