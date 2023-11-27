import { getProfiles, getProfile } from "../../../js/api/profiles/read";
import { logInUser } from "../../../js/api/auth/login";
import { updateMyAvatar } from "../../../js/api/profiles/updateAvatar";
import { getMyListings } from "../../../js/api/profiles/listings";
import { getMyBids } from "../../../js/api/profiles/bids";
import { getMyCredits } from "../../../js/api/profiles/credits";

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
  it("changes avatar", async () => {
    const updatedUserAvatar = await updateMyAvatar(
      userInfo.accessToken,
      userInfo.name,
      userInfo.avatar,
    );
    expect(updatedUserAvatar).toBeTruthy();
    expect(updatedUserAvatar.avatar).toMatch(userInfo.avatar);
  });
  it("shows profile's listings", async () => {
    const userListings = await getMyListings(
      userInfo.accessToken,
      userInfo.name,
    );
    expect(userListings).toBeTruthy();
  });
  it("shows profile's bids", async () => {
    const userListings = await getMyBids(userInfo.accessToken, userInfo.name);
    expect(userListings).toBeTruthy();
  });
  it("shows profile's credits", async () => {
    const userListings = await getMyCredits(
      userInfo.accessToken,
      userInfo.name,
    );
    expect(userListings).toBeTruthy();
  });
});
