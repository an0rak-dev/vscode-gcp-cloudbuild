import {Job} from './datas/job';
import {GCloudChildProcess} from './impls/gcloud';
import { GitFileSystemRepository } from './impls/git';

/**
 * ServicesFactory exposes methods to retrieve all the services.
 * 
 * A Service is a class which provides access to an external tool, lib or third
 * party code. For example the `GCloud` service provides access to the Google
 * Cloud Platform tool.
 * 
 * Please use this as most as possible to make the different part of the code 
 * independant and facilitate maintainability. In case of a feature flipping 
 * process due to an enhancement, it can be easily achieved here and controlled.
 */
export class ServicesFactory {
   /**
    * Return a GCloud implementation.
    */
   getGCloud() : GCloud {
      return new GCloudChildProcess();
   }

   /**
    * Return a GitRepository implementation which points to the given path
    * 
    * @param gitPath the path of the wanted GitRepository
    */
   getGitRepo(gitPath : string) : GitRepository {
      return new GitFileSystemRepository(gitPath);
   }
}

/**
 * GCloud exposes designed methods to interact with Google Cloud and CloudBuild.
 */
export interface GCloud {
   /**
    * Fetch the last Cloudbuild job made on the given branch name for the 
    * currently configured Google Cloud project.
    * 
    * @param branchName the branch name of the wanted job
    * @returns A promise which will resolves on the job if it exists, or reject
    *          it if an error occurs while fetching or there is no job for the 
    *          wanted branch on the current Google Cloud project.
    */
   fetchLastBuildOf(branchName: string) : Promise<Job>;
}

/**
 * GitRepository exposes access methods to interact with a Git repository.
 */
export interface GitRepository {
   /**
    * Return the current branch of the calling Git Repository.
    * 
    * @returns a Promises which resolves to the branch name's or send an 
    * error if the path of this GitRepo doesn't points to an actual repository.
    */
   getCurrentBranch() : Promise<string>;
}
