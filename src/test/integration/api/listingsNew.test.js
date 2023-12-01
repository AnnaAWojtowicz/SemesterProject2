import { newListing } from "../../../js/api/listings/listingNew";
import { logInUser } from "../../../js/api/auth/login";
import { getListingById } from "../../../js/api/listings/listingID";
import { updateListing } from "../../../js/api/listings/update";

describe("ListingTests", () => {
  //  const endsAtDate = new Date(endsAt).toLocaleDateString();
  let listing = undefined;
  let listingId = undefined;
  let userInfo = undefined;

  beforeAll(async () => {
    userInfo = await logInUser("bng7ctddzki@stud.noroff.no", "JegLikerKrem");
  });

  describe("new listing", () => {
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
      // console.log(auctionData);
      expect(auctionData.title).toBeTruthy();
      expect(auctionData.title).toMatch(title);
      expect(auctionData.endsAt).toBeTruthy();
      expect(auctionData.description).toBeTruthy();
      expect(auctionData.tags).toBeTruthy();
      expect(auctionData.media).toBeTruthy();

      listingId = auctionData.id;
    });
  });
  describe("listings with id", () => {
    it("get listing by id", async () => {
      listing = await getListingById(listingId);
      // console.log("get listing by ID", listing);
      expect(listing.id).toMatch(listingId);
    });

    it("update listing", async () => {
      const newTitle = "a beautiful mug";
      const updatedAuctionData = await updateListing(
        userInfo.accessToken,
        listing.id,
        newTitle,
        listing.description,
        listing.tags,
        listing.media,
      );
      console.log("updated auction data", updatedAuctionData);
    });
    // it("", async () => {})
  });
});