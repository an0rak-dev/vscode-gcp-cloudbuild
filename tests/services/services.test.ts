import { ServicesFactory, GCloud } from "../../src/services/services";
import { GCloudChildProcess } from "../../src/services/impls/gcloud";
import { GitFileSystemRepository } from "../../src/services/impls/git";

describe('ServiceFactory', () => {
    let sut : ServicesFactory;

    beforeEach(() => {
        sut = new ServicesFactory();
    });

    test('getGCloud should return an instance of GCloudChildProcess', () => {
        // When
        let result = sut.getGCloud();
        // Then
        expect(result).toBeInstanceOf(GCloudChildProcess);
    });

    test('getGitRepo should return an instance of GitFileSystemRepository', () => {
        // When
        let result = sut.getGitRepo('/tmp/');
        // Then
        expect(result).toBeInstanceOf(GitFileSystemRepository);
    });
});