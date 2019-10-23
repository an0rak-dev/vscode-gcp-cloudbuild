import {Job} from '../datas/job';
const childprocess = require('child_process');

const GCP_BUILDS="gcloud builds";
/**
 * GCloudChildProcess is an implementation of the GCloud interface designed to
 * use child process, to call the `gcloud` command of the host's system.
 */
export class GCloudChildProcess {
   /**
    * Note : This implementation will use the configured project of the `gcloud`
    * command of the host's system.
    * 
    * @see GCloud.fetchLastBuildOf
    */
   fetchLastBuildOf(branchName: string) : Promise<Job> {
      let cmd = `${GCP_BUILDS} list `;
      cmd += `--filter "source.repoSource.branchName=${branchName}" `;
      cmd += `--format json`;

      return new Promise((resolve, reject) => {
         childprocess.exec(cmd, (e: Error, stdout: string, stderr: string) => {
            if (e) { reject(e); } 
            else if (stderr.length > 0) { reject(new Error(stderr)); }
            else {
               let jobs = JSON.parse(stdout);
               if (0 === jobs.length) {
                  resolve(undefined);
               }
               resolve(Job.fromJSONObject(jobs[0]));
            }
         });
      });
   }
}
