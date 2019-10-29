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
jest.mock('path');
jest.mock('fs');
import {GitRepo} from '../src/git';

const fs = require('fs');

describe('extension', () => {
  let gitRepo: any;

  beforeEach(() => {
    gitRepo = new GitRepo('path_to_repository');
    fs.readFile = jest.fn().mockImplementation((file, option, cb) => cb(null, 'ref: refs/heads/\nmaster'));
  });

  describe('getCurrentBranch', () => {
    test('should return branch name', async () => {
      // When
      const branch = await gitRepo.getCurrentBranch();
      // Then
      expect(fs.readFile).toHaveBeenCalled();
      expect(branch).toBe('master');
    });

    test('should reject Promise with an error', async () => {
      // When
      fs.readFile = jest.fn().mockImplementation((file, option, cb) => cb('error', 'ref: refs/heads/\nmaster'));
      await expect(gitRepo.getCurrentBranch()).rejects.toEqual('error');
    });
  });
});
