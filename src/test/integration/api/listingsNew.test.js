import { newListing } from "../../../js/api/listings/listingsNew";
import { logInUser } from "../../../js/api/auth/login";

describe("newListingTest", () => {
  //  const endsAtDate = new Date(endsAt).toLocaleDateString();
  let userInfo = undefined;
  beforeAll(async () => {
    userInfo = await logInUser("bng7ctddzki@stud.noroff.no", "JegLikerKrem");
  });
  it("create new auction", async () => {
    const title = "a mug";
    const auctionData = await newListing(
      userInfo.accessToken,
      title,
      "2023-12-30T21:44:59.545Z",
      "a nice coffe mug",
      ["blue", "duck"],
      ["https://upload.wikimedia.org/wikipedia/commons/1/1b/Entenbecher.jpg"],
    );
    console.log(auctionData);
    expect(auctionData.title).toBeTruthy();
    expect(auctionData.title).toMatch(title);
    expect(auctionData.endsAt).toBeTruthy();
    expect(auctionData.description).toBeTruthy();
    expect(auctionData.tags).toBeTruthy();
    expect(auctionData.media).toBeTruthy();
  });
});
