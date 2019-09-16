const childprocess = require('child_process');

const GCP_BUILDS="gcloud builds";

export enum JobStatus {
   SUCCESS,
   FAILURE,
   PENDING,
   RUNNING
}

export class Job {
   private _status: JobStatus;
   private _startTime: Date;

   constructor(status: JobStatus, start: Date) {
      this._status = status;
      this._startTime = start;
   }

   static fromJSONObject(json: any) : Job {
      if (!json.status || !json.createTime) {
         return new Job(JobStatus.PENDING, new Date(0));
      }
      let status = JobStatus.PENDING;
      if (json.status === "FAILURE") { status = JobStatus.FAILURE; }
      else if (json.status === "SUCCESS") { status = JobStatus.SUCCESS; }
      return new Job(status, new Date(json.createTime));
   }

   get status() : JobStatus {
      return this._status;
   }

   get startTime(): Date {
      return this._startTime;
   }
}

export function fetchBuilds(branchName: string) : Promise<Array<Job>> {
   let cmd = `${GCP_BUILDS} list `;
   cmd += `--filter "source.repoSource.branchName=${branchName}" `;
   cmd += `--format json`;

   return new Promise((resolve, reject) => {
      childprocess.exec(cmd, (err: Error, stdout: string, stderr: string) => {
         if (err) { reject(err); } 
         else {
            let jobs = JSON.parse(stdout);
            let result = [];
            for (let idx in jobs) {
               result.push(Job.fromJSONObject(jobs[idx]));
            }
            resolve(result);
         }
      });
   });
}
