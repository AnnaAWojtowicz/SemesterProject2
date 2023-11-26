import { getProfiles } from "../../../js/api/profiles/read";
import { logInUser } from "../../../js/api/auth/login";

describe("profilesTests", () => {
  let userInfo = undefined;
  beforeAll(async () => {
    userInfo = await logInUser("bng7ctddzki@stud.noroff.no", "JegLikerKrem");
  });
  it("list all profiles", async () => {
    const profiles = await getProfiles(userInfo.accessToken);
    console.log(profiles);
  });
});
