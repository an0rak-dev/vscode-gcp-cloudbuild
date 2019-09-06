module.exports = {
   transform: {'^.+\\.ts?$': 'ts-jest'},
   testEnvironment: 'node',
   testRegex: '/tests/.*\\.test\\.(ts|tsx)$',
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
 };
