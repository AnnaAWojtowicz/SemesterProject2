import { registerNewUser } from "../../../js/api/auth/register";

describe("AuthTest", () => {
  it.skip("register new user", async () => {
    try {
      const user = getRandomString();
      const data = await registerNewUser(
        user,
        `${user}@stud.noroff.no`,
        avatar,
        "JegLikerKrem",
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });
});

function getRandomString() {
  return (Math.random() + 1).toString(36).substring(2);
}

const avatar =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Red-eyed_Tree_Frog_-_Litoria_chloris_edit1.jpg/640px-Red-eyed_Tree_Frog_-_Litoria_chloris_edit1.jpg";
