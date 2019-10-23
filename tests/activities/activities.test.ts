import { CloudbuildStatus, ActivitiesFactory } from "../../src/activities/activities";
import { LastJobCloudbuildStatus } from "../../src/activities/impls/cloudbuildStatus";

describe('ActivitiesFactory', () => {
   let sut : ActivitiesFactory;

   beforeEach(() => {
      sut = new ActivitiesFactory();
   });

   test('getCloudbuildStatus should return LastJobCloudbuildStatus', () => {
      // When
      const result = sut.getCloudbuildStatus();
      // Then
      expect(result).toBeInstanceOf(LastJobCloudbuildStatus);
   });
});
