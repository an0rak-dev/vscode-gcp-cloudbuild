import { GitRepository } from "../../../src/services/services";
import { GitFileSystemRepository } from "../../../src/services/impls/git";
import * as path from 'path';

const fs = require('fs');
jest.mock('fs');

describe('GitFileSystemRepository', () => {
    let sut : GitRepository;
    let gitPath: string;

    beforeEach(() => {
        gitPath = '/tmp';
        sut = new GitFileSystemRepository(gitPath);
        fs.readFile.mockReset();
    });

    describe('getCurrentBranch', () =>{
        test('should return the name of the current branch', async () => {
            // Given
            let branchName = 'feat/something_new';
            fs.readFile.mockImplementation((p:string, enc: string, cb :any) => {
                cb(undefined, `ref: refs/heads/${branchName}\n`);
            });
            // When
            let result = await sut.getCurrentBranch();
            // Then
            expect(fs.readFile).toHaveBeenCalled();
            expect(fs.readFile.mock.calls[0][0]).toBe(path.join(gitPath, '.git/HEAD'));
            expect(result).toBe(branchName);
        });

        test('should reject if the path isn\'t a Git repo', async () => {
             // Given
             fs.readFile.mockImplementation((p:string, enc: string, cb :any) => {
                 cb(new Error(`Unknown file ${gitPath}/.git/HEAD`), '');
             });
             // When
             try {
                await sut.getCurrentBranch();
                fail('should reject promise if the path isn\'t a git repo');
             } catch (e) {
                expect(e.message).toBe(`Unknown file ${gitPath}/.git/HEAD`);
             }
        });
    });
});
