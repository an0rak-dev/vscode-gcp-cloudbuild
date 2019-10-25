/*
Copyright 2019 by Jakub Kaluzka
   
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {differenceBetween, normalizeMinutesAmount} from '../src/time';

describe('time', () => {
  test('differenceBetween should return difference between two dates in minutes', () => {
    const date1 = new Date(2019, 1, 1, 10, 11, 0);
    const date2 = new Date(2019, 1, 1, 10, 24, 29);
    const date3 = new Date(2019, 1, 1, 10, 24, 31);
    expect(differenceBetween(date1, date2)).toBe(13);
    expect(differenceBetween(date1, date3)).toBe(14);
  });

  describe('normalizeMinutesAmount', () => {
    test('should normalize value to minute', () => {
      expect(normalizeMinutesAmount(1)).toBe('1 minute ago.');
    });

    test('should normalize value to time including hours', () => {
      expect(normalizeMinutesAmount(330)).toBe('5 hours 30 minutes ago.');
    });

    test('should normalize value to time including days', () => {
      expect(normalizeMinutesAmount(1500)).toBe('1 day 1 hour 0 minute ago.');
    });

    test('should normalize value to time including months', () => {
      expect(normalizeMinutesAmount(80000)).toBe('1 month 25 days 13 hours 20 minutes ago.');
    });

    test('should normalize value to time including months with longer period', () => {
      expect(normalizeMinutesAmount(100000)).toBe('2 months 9 days 10 hours 40 minutes ago.');
    });
  });
});
