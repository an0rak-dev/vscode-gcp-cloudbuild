/**
 * List of all the available (ie. supported by the plugin) status for a 
 * CloudBuild job.
 */
export enum JobStatus {
   SUCCESS,
   FAILURE,
   PENDING, 
   RUNNING
}

/**
 * Job represents a Cloudbuild job in the plugin's source code. It will contains
 * only the revelant datas for the plugin and will not reflect all the datas 
 * returned by Cloudbuild.
 * 
 * An instance of this object is immutable and represent a Job at a given 
 * moment.
 */
export class Job {
   /** Returns the status of the calling Job. */
   public readonly status : JobStatus;
   /** 
    * Returns the start time of the current pipeline (ie. registered time in
    * Cloudbuild.) 
    */
   public readonly startTime : Date;

   /**
    * Creates a new Job with the given values.
    * 
    * @param stts the status of the wanted Job at a given time
    * @param strtTm the startTime, ie. the time when the job was registered in 
    *               CloudBuild.
    */
   constructor(stts  : JobStatus, strtTm : Date) {
      this.status = stts;
      this.startTime = strtTm;
   }

   /**
    * Translate a JSON representation of a Job (given by `gcloud`) into a 
    * Job object.
    * 
    * @param json the JSON representation of a Job
    */
   static fromJSONObject(jsonObj: any) : Job {
      if (!jsonObj.status || !jsonObj.createTime) {
         return new Job(JobStatus.PENDING, new Date(0));
      }
      let status = JobStatus.PENDING;
      if (jsonObj.status === "FAILURE") { status = JobStatus.FAILURE; }
      else if (jsonObj.status === "SUCCESS") { status = JobStatus.SUCCESS; }
      return new Job(status, new Date(jsonObj.createTime));
   }
}
