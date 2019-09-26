/*
Copyright 2019 by Sylvain Nieuwlandt
   
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
