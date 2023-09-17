import { introduceMyself} from "../index";

describe("introduceMyself", () => {
    it("should introduce me", () => {
        expect(typeof introduceMyself("John", "Doe")).toEqual("string");
        expect(introduceMyself("John", "Doe")).toEqual("Hello John Doe");
    });
    });

