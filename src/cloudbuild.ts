const childprocess = require('child_process');

const GCP_BUILDS="gcloud builds";

/**
 * The different status of a Cloudbuild job in an enumeration.
 */
export enum JobStatus {
   SUCCESS,
   FAILURE,
   PENDING,
   RUNNING
}

/**
 * Represents a Cloudbuild job with its start time and its status
 */
export class Job {
   private _status: JobStatus;
   private _startTime: Date;

   /**
    * Create a new Job object with the given status and start time.
    * 
    * @param status the status of the Job
    * @param start the start time of the Job
    */
   constructor(status: JobStatus, start: Date) {
      this._status = status;
      this._startTime = start;
   }

   /**
    * Translate a JSON representation of a Job (given by `gcloud`) into a 
    * Job object.
    * 
    * @param json the JSON representation of a Job
    */
   static fromJSONObject(json: any) : Job {
      if (!json.status || !json.createTime) {
         return new Job(JobStatus.PENDING, new Date(0));
      }
      let status = JobStatus.PENDING;
      if (json.status === "FAILURE") { status = JobStatus.FAILURE; }
      else if (json.status === "SUCCESS") { status = JobStatus.SUCCESS; }
      return new Job(status, new Date(json.createTime));
   }

   /**
    * Returns the current status of the calling Job.
    * 
    * @returns the current status
    */
   get status() : JobStatus {
      return this._status;
   }

   /**
    * Returns the start time of the calling Job
    * 
    * @returns the start time
    */
   get startTime(): Date {
      return this._startTime;
   }
}

/**
 * fetchBuilds will calls the `gcloud` command to get the list of all
 * the builds in the current project (configured by a `gcloud config set project`)
 * and for the given branch.
 * 
 * @param branchName the branch of the wanted jobs
 * @returns a Promise which returns a list of Job objects (from the most recent to the
 * oldest one), or the error received from `gcloud`.
 */
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
