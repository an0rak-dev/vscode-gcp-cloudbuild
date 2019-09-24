import * as path from 'path';
import * as fs from 'fs';

const HEAD_TAG = 'ref: refs/heads/';

/**
 * GitRepo represents a Git Repository in the local filesystem.
 */
export class GitRepo {
   private readonly _gitPath : string;
   /**
    * Create a new instance of GitRepo which points to the git repository
    * at the given path (the root where lives the `.git` folder).
    * 
    * @param pth the path of the git repository
    */
   constructor(pth: string) {
      this._gitPath = path.join(pth, '.git');
   }

   /**
    * Return the current branch of the calling Git Repository.
    * 
    * @returns a Promises which resolves to the branch name's or send an 
    * error if the path of this GitRepo doesn't points to an actual repository.
    */
   getCurrentBranch() : Promise<string> {
      return new Promise((resolve, reject) => {
         let headPath = path.join(this._gitPath, 'HEAD');
         fs.readFile(headPath, "utf-8", (err, data) => {
            if (err) { reject(err); } 
            else { resolve(data.replace(HEAD_TAG, '').replace('\n', ''));}
         });     
      });
   }
}
