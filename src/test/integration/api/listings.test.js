import { getListings } from "../../../js/api/listings/read";

describe("getAllListings", () => {
  it("returns all listings", async () => {
    const data = await getListings();
    console.log(data);
  });
});
