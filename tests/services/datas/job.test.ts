import * as jobDatas from '../../../src/services/datas/job';

const JSON_GCB_RESULT = `{
   "buildTriggerId": "ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
   "createTime": "2019-09-02T14:06:52.171187623Z",
   "finishTime": "2019-09-02T14:06:52.171187623Z",
   "id": "ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
   "logUrl": "https://console.cloud.google.com/gcr/builds/ffffffff-0000-3232-bbbb-aaaaaaaaaaaa?project=000000000000",
   "options": { "logging": "LEGACY" },
   "projectId": "prj",
   "source": {
     "repoSource": {
       "branchName": "master",
       "projectId": "prj",
       "repoName": "prj-repo"
     }
   },
   "startTime": "2019-09-02T14:06:52.171187623Z",
   "status": "FAILURE",
   "statusDetail": "failed unmarshalling build config cloudbuild.yaml: yaml: line 2: found character that cannot start any token",
   "tags": [
     "event-ffffffff-0000-3232-bbbb-aaaaaaaaaaaa",
     "trigger-ffffffff-0000-3232-bbbb-aaaaaaaaaaaa"
   ]
 }`;

describe('Job', () => {
   test('constructor should set the given values', () => {
      // Given
      let status = jobDatas.JobStatus.PENDING;
      let start = new Date();
      // When
      let sut = new jobDatas.Job(status, start);
      // Then
      expect(sut.status).toBe(status);
      expect(sut.startTime).toBe(start);
   });

   describe('fromJSONObject', () => {
      test('should return the Job from the json', () => {
         // When
         let sut = jobDatas.Job.fromJSONObject(JSON.parse(JSON_GCB_RESULT));
         // Then
         expect(sut.status).toBe(jobDatas.JobStatus.FAILURE);
         expect(sut.startTime).toEqual(new Date('2019-09-02T14:06:52.171187623Z'));
      });

      test('should return a Pending Job without date if str is invalid', () => {
         // When
         let sut = jobDatas.Job.fromJSONObject(JSON.parse('{}'));
         // Then
         expect(sut.status).toBe(jobDatas.JobStatus.PENDING);
         expect(sut.startTime).toEqual(new Date(0));
      });
   });
});
