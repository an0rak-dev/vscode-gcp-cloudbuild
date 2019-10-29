import * as vscode from 'vscode';
import {LastJobCloudbuildStatus} from './impls/cloudbuildStatus';
import { ServicesFactory } from '../services/services';

/**
 * ActivitiesFactory exposes methods to retrieve all the activities.
 * 
 * An activity is an object which add a use-case behavior. For example, the 
 * Activity `CloudbuildStatus` add the "Cloudbuild's status display" use-case 
 * in the StatusBar.
 * 
 * Please use this as most as possible to make the different part of the code 
 * independant and facilitate maintainability. In case of a feature flipping 
 * process due to an enhancement, it can be easily achieved here and controlled.
 */
export class ActivitiesFactory {
   getCloudbuildStatus() : CloudbuildStatus {
      return new LastJobCloudbuildStatus(new ServicesFactory());
   }
}

/**
 * CloudbuildStatus purpose is to display at least one status of a Cloudbuild
 * element (job, trigger...) into the status bar.
 */
export interface CloudbuildStatus {
   /**
    * Returns the StatusBarItem to integrate in the current instance of VSCode.
    * 
    * @returns the StatusBarItem with the autonomous behaviour 
    */
   getItem() : vscode.StatusBarItem;

   /**
    * Enable the auto-refresh property of this implementation which will 
    * automatically retrive the Cloudbuild informations and refresh the status
    * bar item's display value.
    */
   startAutoRefresh() : void;

   /**
    * Stop the auto-refresh property of this implementation
    * 
    * @see startAutoRefresh
    */
   stopAutoRefresh() : void;

   /**
    * Returns true if and only if the auto-refresh property of this 
    * implementation is started.
    * 
    * @see startAutoRefresh
    */
   isAutoRefreshStarted() : boolean;
}
