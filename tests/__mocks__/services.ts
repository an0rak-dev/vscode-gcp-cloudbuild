import { GCloud, GitRepository } from "../../src/services/services";

export class MockServicesFactory {
    getGCloud() : GCloud {
        return {
            fetchLastBuildOf: jest.fn()
        };
    }

    getGitRepo(gitPath : string) : GitRepository {
        return {
            getCurrentBranch: jest.fn()
        };
    }
}