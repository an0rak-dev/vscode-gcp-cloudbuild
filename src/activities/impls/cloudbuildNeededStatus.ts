import * as vscode from 'vscode';
import { ServicesFactory, GCloud, GitRepository } from '../../services/services';
import { Job, JobStatus } from '../../services/datas/job';

/**
 * LastJobCloudbuildStatus retrieves and display only the status of the last 
 * cloudbuild job for the branch of the vscode instance's workspace (if it 
 * exists).
 * 
 * Implementation of the CloudbuildStatus interface.
 * 
 * @see CloudbuildStatus
 */
export class LastJobIfNeededStatus {
   private readonly nativeStatusBar : vscode.StatusBarItem;
   private readonly gcloud : GCloud;
   private readonly gitRepo : GitRepository | undefined;
   private ticker : NodeJS.Timeout | undefined;
   private branchAnalyzed : { [id:string] : string};

   /**
    * Create a new LastJobCloudbuildStatus with an auto-refresh property 
    * disabled by default.
    */
   constructor() {
      this.nativeStatusBar = vscode.window
         .createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
      let services = new ServicesFactory();
      this.gcloud = services.getGCloud();
      if (vscode.workspace.rootPath) {
         this.gitRepo = services.getGitRepo(vscode.workspace.rootPath);
      }
      this.ticker = undefined;
      this.branchAnalyzed = {};
   }

   /**
    * @see CloudbuildStatus.getItem
    */
   getItem() : vscode.StatusBarItem {
      return this.nativeStatusBar;
   }

   /**
    * Note: This implementaion's auto refresh rate is 1 every seconds.
    * 
    * @see CloudbuildStatus.startAutoRefresh
    */
   startAutoRefresh() : void {
      this.ticker = setInterval(() => {
         // If no repo, then cloudbuild is used locally which is not supported yet.
         if (this.gitRepo) { 
            const git = this.gitRepo;
            let currentBranch = 'master';
            git.getCurrentBranch()
            .then(branch => currentBranch = branch)
            .then(() => git.fetch(currentBranch, 'origin'))
            .then(commitId => this.callGCPIfNedded(commitId, currentBranch));
         }
      }, 1000);
   }

   /**
    * @see CloudbuildStatus.stopAutoRefresh
    */
   stopAutoRefresh() : void {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = undefined;
      }
   }

   /**
    * @see CloudbuildStatus.isAutoRefreshStarted
    */
   isAutoRefreshStarted() : boolean {
      return undefined !== this.ticker;
   }

   private callGCPIfNedded(lastCommitPushed: string, branchName: string) {
      const lastCommitAnalyzed = this.branchAnalyzed[branchName];
      if (!lastCommitAnalyzed || lastCommitAnalyzed !== lastCommitPushed) {
         this.gcloud.fetchLastBuildOf(branchName)
            .then(job => this.refreshStatusBar(job))
            .then(job => this.memorizeCommit(job, branchName, lastCommitPushed));
      }
   }

   private memorizeCommit(job : Job, branchName: string, commitId : string) {
      // Only update if the received job is completed to force the
      // refresh of the status bar if the job is in RUNNING or PENDING
      if (job.status === JobStatus.FAILURE || job.status === JobStatus.SUCCESS) {
         this.branchAnalyzed[branchName] = commitId;
      }
   }

   private refreshStatusBar(job: Job) : Job {
      if (!this.nativeStatusBar) {return job;}
      if (!job) { 
         this.nativeStatusBar.text = 'CloudBuild : $(circle-slash)';
         this.nativeStatusBar.tooltip = 'No build for the current branch yet.';
      } else {
         this.nativeStatusBar.tooltip = 'Builded ';
         if (job.status === JobStatus.SUCCESS) {
            this.nativeStatusBar.text = 'CloudBuild : $(check)';
         } else if (job.status === JobStatus.FAILURE) {
            this.nativeStatusBar.text = 'CloudBuild : $(x)';
         } else {
            this.nativeStatusBar.tooltip = 'Started ';
            this.nativeStatusBar.text = 'CloudBuild : $(repo-sync~spin)';
         }
         let lastBuildDate = this.differenceBetween(job.startTime, new Date());
         this.nativeStatusBar.tooltip += this.normalizeMinutesAmount(lastBuildDate);
      }
      this.nativeStatusBar.show();
      return job;
   }

   private differenceBetween(date1: Date, date2: Date): number {
      const oneMinuteInMs = 60000;
      const lastRun = date2.getTime() - date1.getTime();
      return Math.round(lastRun / oneMinuteInMs);
   }

   private normalizeMinutesAmount(minutes: number): string {
      let result = '';
      const mins = Math.floor(minutes % 60);
      const onlyHours = Math.floor(minutes / 60);
      const hours = Math.floor(onlyHours % 24);
      const onlyDays = Math.floor(onlyHours / 24);
      const days = Math.floor(onlyDays % 30);
      const months = Math.floor(onlyDays / 30);
    
      if (months > 0) {
        result += months + ' month' + ((months > 1) ? 's ' : ' ');
      }
      if (days > 0) {
        result += days + ' day' + ((days > 1) ? 's ' : ' ');
      }
      if (hours > 0) {
        result += hours + ' hour' + ((hours > 1) ? 's ' : ' ');
      }
      result += mins + ' minute' + ((mins > 1) ? 's ' : ' ');
    
      result += 'ago.';
      return result;
    }
}
