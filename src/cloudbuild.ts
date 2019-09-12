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

   get status() : JobStatus {
      return this._status;
   }

   get startTime(): Date {
      return this._startTime;
   }
}

export function fetchBuilds(branchName: string, callback: (jobs:Array<Job>) => void) {
   let cmd = `${GCP_BUILDS} list `;
   cmd += `--filter "source.repoSource.branchName=${branchName}" `;
   cmd += `--format json`;

   childprocess.exec(cmd, (err: Error, stdout: string, stderr: string) => {
      if (err) {
         // TODO Treat error
         console.error("Unable to call the gcloud command : ", err);
         callback([]);
         return;
      }
      let jobs = JSON.parse(stdout);
      let result = [];
      for (let idx in jobs) {
         let job = jobs[idx];
         let status = JobStatus.PENDING;
         if (job.status === "FAILURE") { status = JobStatus.FAILURE; }
         else if (job.status === "SUCCESS") { status = JobStatus.SUCCESS; }
         result.push(new Job(
            status,
            new Date(job.createTime)
         ));
      }
      callback(result);
   });
}
