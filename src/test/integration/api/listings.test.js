import { getListings } from "../../../js/api/listings/read";

describe("getAllListings", () => {
  it("returns all listings", async () => {
    const data = await getListings();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].id).toBeTruthy();
  });
});
