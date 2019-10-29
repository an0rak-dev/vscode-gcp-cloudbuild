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
export class LastJobCloudbuildStatus {
   private readonly nativeStatusBar : vscode.StatusBarItem;
   private readonly gcloud : GCloud;
   private readonly gitRepo : GitRepository | undefined;
   private ticker : NodeJS.Timeout | undefined;

   /**
    * Create a new LastJobCloudbuildStatus with an auto-refresh property 
    * disabled by default.
    */
   constructor(services : ServicesFactory) {
      this.nativeStatusBar = vscode.window
         .createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
      this.gcloud = services.getGCloud();
      if (vscode.workspace.rootPath) {
         this.gitRepo = services.getGitRepo(vscode.workspace.rootPath);
      }
      this.ticker = undefined;
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
         if (!this.gitRepo) {
           this.gcloud.fetchLastBuildOf('master')
             .then(job => this.refreshStatusBar(job));
         } else {
           this.gitRepo.getCurrentBranch()
             .then(branch => this.gcloud.fetchLastBuildOf(branch))
             .then(job => this.refreshStatusBar(job));
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

   private refreshStatusBar(job: Job) : void {
      if (!this.nativeStatusBar) {return;}
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
