import { getProfiles, getProfile } from "../../../js/api/profiles/read";
import { logInUser } from "../../../js/api/auth/login";

describe("profilesTests", () => {
  let userInfo = undefined;
  beforeAll(async () => {
    userInfo = await logInUser("bng7ctddzki@stud.noroff.no", "JegLikerKrem");
  });
  it("list all profiles", async () => {
    const profiles = await getProfiles(userInfo.accessToken);
    // console.log(profiles);
    expect(profiles).toBeTruthy();
    expect(profiles.length).toBeGreaterThan(0);
  });
  it("list profile", async () => {
    const profile = await getProfile(userInfo.accessToken, userInfo.name);
    // console.log(profile);
    expect(profile).toBeTruthy();
    expect(profile.name).toMatch(userInfo.name);
  });
});
