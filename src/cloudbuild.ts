export enum JobStatus {
   SUCCESS,
   FAILURE,
   PENDING,
   RUNNING
};

export class Job {
   getStatus() : JobStatus {
      return JobStatus.PENDING;
   }

   getStartTime(): Date {
      return new Date();
   }
};

export function fetchBuilds(branchName: string) : Array<Job> {
   return [];
}
