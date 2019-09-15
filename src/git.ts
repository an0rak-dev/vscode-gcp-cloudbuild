import * as path from 'path';
import * as fs from 'fs';

export class GitRepo {
   private readonly _gitPath : string;
   constructor(pth: string) {
      this._gitPath = path.join(pth, '.git');
   }

   getCurrentBranch(callback : (branch: string) => void) {
      fs.readFile(path.join(this._gitPath,  'HEAD'), "utf-8", (err, data) => {
         if (err) {
            // TODO Treat error
            return;
         }
         let branch = data.replace('ref: refs/heads/', '').replace('\n', '');
         callback(branch);
      });     
   }
}
