import * as path from 'path';
import * as fs from 'fs';

const HEAD_TAG = 'ref: refs/heads/';

/**
 * GitFileSystemRepository is an implementation of the GitRepository service's 
 * interface designed to represent and access a Git Repository located in the 
 * local file system.
 */
export class GitFileSystemRepository {
    private readonly path : string;

    /**
     * Create a new GitFileSystemRepository linked to the given path.
     * 
     * @param pth the path to the git project (the folder which contains the 
     * .git)
     */
    constructor(pth : string) {
        this.path = path.join(pth, '.git');
    }

    /**
     * Note: This implementation supposed that the host system's encoding is
     * UTF-8.
     * 
     * @see GitRepository.getCurrentBranch
     */
    getCurrentBranch() : Promise<string> {
        return new Promise((resolve, reject) => {
            let headPath = path.join(this.path, 'HEAD');
            fs.readFile(headPath, "utf-8", (err, data) => {
               if (err) { reject(err); } 
               else { resolve(data.replace(HEAD_TAG, '').replace('\n', ''));}
            });     
         });
    }

    fetch(branchName: string, remoteName: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            let refPath = path.join(this.path, 'refs', 'remotes', remoteName);
            refPath = path.join(refPath, branchName);
            fs.readFile(refPath, "utf-8", (err, data) => {
                if (err) { reject(err); }
                else { resolve(data.replace('\n', '')); }
            });
        });
    }
}
