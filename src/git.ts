import * as path from 'path';
import * as fs from 'fs';

const HEAD_TAG = 'ref: refs/heads/';

export class GitRepo {
   private readonly _gitPath : string;
   constructor(pth: string) {
      this._gitPath = path.join(pth, '.git');
   }

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
