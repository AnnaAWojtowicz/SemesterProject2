// import './style.css'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.js";
import "./style.scss";

// import javascriptLogo from "./javascript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.js";

import { getListings } from "./src/js/api/listings/read";
import { getListingById } from "./src/js/api/listings/listingID";
import { logInUser } from "./src/js/api/auth/login";
import { registerNewUser } from "./src/js/api/auth/register";
import { getProfile } from "./src/js/api/profiles/read";
import { newListing } from "./src/js/api/listings/listingNew";
import { deleteListing } from "./src/js/api/listings/delete";
import { updateMyAvatar } from "./src/js/api/profiles/updateAvatar";
import { newBid } from "./src/js/api/listings/bid";
import { getMyBids } from "./src/js/api/profiles/bids";

let params = new URLSearchParams(window.location.search);
let listingsId = params.get("listingsId");
let profileName = params.get("profileName");
let token = localStorage.getItem("accessToken");

let containerHtmlCard = document.getElementById("singleCard");
let containerHtmlCardDetails = document.getElementById("singleCardDetails");
let myBidsHtml = document.getElementById("myBids");

// if (listingsId !== null) {
//     showAuctionsCardDetails(listingsId);
//     console.log(listingsId);
// } else {
//     showAuctionsCards();
// }

if (listingsId === null && profileName === null) {
  showAuctionsCards();
}

/**
 * Resolving top-level await issue in GitHub actions
 */
(async () => {
  if (listingsId !== null) {
    await showAuctionsCardDetails(listingsId);
    addDeleteBtnEventListener();
  }
})();

if (profileName !== null) {
  showUserProfile(profileName);
}

// Gets the values of name, email adress, password and avatar when user register
document
  .getElementById("submitBtn2")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const formRegister = document.getElementById("formRegister");
    const nameRegister = formRegister.elements[0];
    const mailRegister = formRegister.elements[1];
    const passwordRegister = formRegister.elements[2];
    const avatarRegister = formRegister.elements[3];

    const userName = nameRegister.value;
    const userEmail = mailRegister.value;
    const userPassword = passwordRegister.value;
    const userAvatar = avatarRegister.value;

    const userData = await registerNewUser(
      userName,
      userEmail,
      userPassword,
      userAvatar,
    );
    if (userData.name === userName) {
      window.location.reload();
      document.getElementById("header1").style.display = "block";
      document.getElementById("header2").style.display = "none";
    }
  });

// Gets the values of email address and password when the user logs in
document
  .getElementById("submitBtn1")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const formLogin = document.getElementById("formLogin");
    const mailLogin = formLogin.elements[0];
    const passwordLogin = formLogin.elements[1];

    const userEmail = mailLogin.value;
    const userPassword = passwordLogin.value;

    const userData = await logInUser(userEmail, userPassword);

    if (userData.email === userEmail) {
      window.location.href = `./index.html?profileName=${userData.name}`;
    }
  });

/**
 * Shows profile with user's data
 */
async function showUserProfile(name) {
  const profile = await getProfile(token, name);
  const myBids = await getMyBids(token, name);
  localStorage.setItem("profile", JSON.stringify(profile));

  let userCardContainer = document.getElementById("contUsersCardBody");
  userCardContainer.innerHTML = `
<div class="card mb-3 border rounded-4" id="usersCardBody">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${profile.avatar}" class="img-fluid" id="profileImg"
              alt="..." />
          </div>
          <div class="col-md-8">
            <div class="card-body" id="cardBody">
              <h1 class="card-title my-4">${profile.name}</h1>
              <h4 class="card-text my-4 details">Your Credits: ${profile.credits}</h4>
              <button class="btn btn-primary my-4 me-2" type="submit" data-bs-toggle="modal" data-bs-target="#newAuctionModal">
                New Auction
              </button>
              <button class="btn btn-primary my-4 me-2" type="submit">
                Your Bids
              </button>
              <button class="btn btn-primary my-4 me-2" id="updateAvatarBtn" type="submit" data-bs-toggle="modal" data-bs-target="#updateModal">
                Change Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
`;
  showUserCreditsHeader(profile);
  showUserListings(profile.listings);
  showUsersBids(myBids);
}

/**
 * Updates user's img
 */
// function updateUserData(token, userName, userAvatar) {
document
  .getElementById("updateBtn")
  .addEventListener("click", async (event) => {
    let userName = JSON.parse(localStorage.getItem("profile")).name;
    const userAvatar = document.getElementById("InputAvatar3").value;
    event.preventDefault();
    await updateMyAvatar(token, userName, userAvatar);
    window.location.href = `./index.html?profileName=${userName}`;
  });
//}

/**
 * Validates and creates new listing form when before modal closes
 * https://getbootstrap.com/docs/5.2/components/modal/#events
 */
const formNewListing = document.getElementById("formNewListing");
// const newListingModal = document.getElementById("newAuctionModal");
const newListingModalBtn = document.getElementById("postBtn");
// newListingModal.addEventListener("hide.bs.modal", function (event) {
newListingModalBtn.addEventListener("click", function (event) {
  const titleListing = formNewListing.elements[0];
  const endDateListing = formNewListing.elements[4];
  const descriptionListing = formNewListing.elements[1];
  const tagsListing = formNewListing.elements[3];
  const mediaListing = formNewListing.elements[2];

  const inputs = {
    title: titleListing.value,
    description: descriptionListing.value,
    tags: tagsListing.value,
    media: mediaListing.value,
    date: endDateListing.value,
  };

  if (!validateNewListingForm(inputs)) {
    event.preventDefault();
  } else {
    createNewListing(inputs);
  }
});

const regexNewListing = {
  title: /^[A-Za-z\s]{0,29}$/,
  media:
    /^(https?:\/\/.*\.(?:png|jpg|jpeg))(,\s*https?:\/\/.*\.(?:png|jpg|jpeg)){0,2}$/,
  tags: /^(\b\w+\b\s*(,\s*)?){1,10}$/,
  date: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4}$/,
};

/**
 * Creates a new listing.
 * @param {Object} inputs - The inputs for the new listing.
 */
async function createNewListing(inputs) {
  try {
    const result = await newListing(
      token,
      inputs.title,
      convertInputDateToIsoDate(inputs.date),
      inputs.description,
      inputs.tags.split(","),
      inputs.media.split(","),
    );
    window.location.href = `./index.html?listingsId=${result.id}`;
  } catch (error) {
    alert(error);
  }
}

/**
 * Validates the new listing form.
 * @param {Object} inputs - The inputs object containing the form data.
 * @returns {boolean} - Returns true if the form is valid, false otherwise.
 */
function validateNewListingForm(inputs) {
  if (inputs.title === "" || !regexNewListing.title.test(inputs.title)) {
    alert("Enter a title with max 30 characters");
    return false;
  }

  if (inputs.description === "") {
    alert("Description is required");
    return false;
  }

  if (inputs.media === "" || !regexNewListing.media.test(inputs.media)) {
    alert("Media is required");
    return false;
  }

  if (inputs.tags === "" || !regexNewListing.tags.test(inputs.tags)) {
    alert("Tags are required");
    return false;
  }

  if (inputs.date === "" || !regexNewListing.date.test(inputs.date)) {
    alert("Date is required and must be in format dd.mm.yyyy");
    return false;
  }

  return true;
}

/**
 * Changes the date format to ISOdate
 * expected format: "31.12.2023"
 * @param {*} date
 * @returns
 */
function convertInputDateToIsoDate(dateString) {
  let parts = dateString.split(".");
  let date = new Date(parts[2], parts[1] - 1, parts[0]);

  let formattedDate = date.toISOString();
  return formattedDate;
}

/**
 * Shows users listings
 */
function showUserListings(listings) {
  document.getElementById("carouselIntro").style.display = "none";
  containerHtmlCard.innerHTML = "";
  for (let i = 0; i < listings.length; i++) {
    let formattedDate = new Date(listings[i].updated).toLocaleDateString();
    let formattedTime = new Date(listings[i].updated).toLocaleTimeString();

    containerHtmlCard.innerHTML += `
        <div class="col">
            <div class="card border rounded-4" style="height: 450px">
                <img src="${listings[i].media[0]}" class="card-img-top card-img" alt="..." style="height: 300px">
                <div class="card-body cardBodyRounded d-flex-column align-items-start mb">
                    <h3 class="card-title details p-2">${listings[i].title}</h3>
                    <div class="mb-auto p-2">
                        <div class="d-flex justify-content-between align-items-center ">
                            <a href="?listingsId=${listings[i].id}" class=""><button type="button" class="btn aboutBtn btn-primary"
                            id="${listings[i].id}">About</button></a>
                            <small class="details ">${formattedDate} ${formattedTime}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  `;
  }
}

function showUsersBids(bids) {
  myBidsHtml.innerHTML = "";
  for (let i = 0; i < bids.length; i++) {
    let formattedDate = new Date(bids[i].created).toLocaleDateString();
    let formattedTime = new Date(bids[i].created).toLocaleTimeString();

    myBidsHtml.innerHTML += `
        <div class="col">
            <div class="card border rounded-4" style="height: 450px">
                <img src="${bids[i].listing.media[0]}" class="card-img-top card-img" alt="..." style="height: 300px">
                <div class="card-body cardBodyRounded d-flex-column align-items-start mb">
                    <h3 class="card-title details p-2">${bids[i].listing.title}</h3>
                    <div class="mb-auto p-2">
                        <div class="d-flex justify-content-between align-items-center ">
                            <a href="?listingsId=${bids[i].listing.id}" class=""><button type="button" class="btn aboutBtn btn-primary"
                            id="${bids[i].listing.id}">About</button></a>
                            <small class="details ">${formattedDate} ${formattedTime}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  `;
  }
}

/**
 * Deletes user's auction
 */
function addDeleteBtnEventListener() {
  document
    .getElementById("deleteBtn")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const deleteResult = await deleteListing(token, listingsId);

      if (deleteResult) {
        window.location.href = `./index.html?profileName=${localStorage.getItem(
          "name",
        )}`;
      } else {
        alert("Error deleting listing");
      }
    });
}

/**
 * Edits users auction
 */

/**
 * Gets users data (credits in header when logged in
 */
function showUserCreditsHeader(profile) {
  document.getElementById("header1").style.display = "block";
  document.getElementById("header2").style.display = "none";
  document.getElementById("carouselIntro").style.display = "none";
  let creditsContainer = document.getElementById("header1");
  creditsContainer.innerHTML = "";
  creditsContainer.innerHTML = `
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-center">
        <a href="index.html"><img src="./img/logowinsLogo (1).png" aria-label="Wins logo" width="40" height="auto"
            class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none" /></a>

        <ul class="d-flex nav col-12 col-lg-auto me-lg-auto mb-2 align-items-baseline mb-md-0">
          <li class="px-4 justify-self-end" id="usersCredits">
            <h5>Your credits: ${profile.credits}</h5>
          </li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search" />
        </form>

        <div class="dropdown text-end">
          <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="${profile.avatar}" alt="mdo" width="32" height="32" class="rounded-circle" />
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#newAuctionModal">New Auction</a></li>
            <li><a class="dropdown-item" href="#">Your Bids</a></li>
            <li><a class="dropdown-item" href="./index.html?profileName=${profile.name}">Your Profile</a></li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li><a class="dropdown-item" href="#" id="signOut">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
`;
  document.getElementById("signOut").addEventListener("click", signOut);
}

/**
 * Signs out user and removes all data from local storage
 */
function signOut() {
  localStorage.removeItem("name");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");
  window.location.href = "./index.html";
}

/**
 * Shows cards with listings sent from API;
 */
async function showAuctionsCards() {
  if (token !== null) {
    showUserCreditsHeader(JSON.parse(localStorage.getItem("profile")));
  }

  document.getElementById("singleCardDetails").style.display = "none";
  const cards = await getListings();

  containerHtmlCard.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    let formattedDate = new Date(cards[i].updated).toLocaleDateString();
    let formattedTime = new Date(cards[i].updated).toLocaleTimeString();

    containerHtmlCard.innerHTML += `
        <div class="col">
        <div class="card border rounded-4" style="height: 450px">
        <img src="${cards[i].media[0]}" class="card-img-top card-img" alt="..." style="height: 300px">
        <div class="card-body cardBodyRounded d-flex-column align-items-start mb">
          <h3 class="card-title details p-2">${cards[i].title}</h3>
         <div class="mb-auto p-2">
          <div class="d-flex justify-content-between align-items-center ">
                <a href="?listingsId=${cards[i].id}" class=""><button type="button" class="btn aboutBtn btn-primary"
                id="${cards[i].id}">About</button></a>
                <small class="details ">${formattedDate} ${formattedTime}</small>
              </div>
              </div>
        </div>
      </div>
        </div>
  `;
  }
}

/**
 * Gets details of an auction and shows it as single card without a possibility to do the bid
 */
async function showAuctionsCardDetails(id) {
  document.getElementById("carouselIntro").style.display = "none";
  const cardDetails = await getListingById(id);

  containerHtmlCardDetails.innerHTML = "";

  let formattedDateEnd = new Date(cardDetails.endsAt).toLocaleDateString();
  let formattedTimeEnd = new Date(cardDetails.endsAt).toLocaleTimeString();

  containerHtmlCardDetails.innerHTML = `
        <div class="card rounded-top-4 border">
        <div class="card-img-top border-bottom">
         
          <div id="carouselExampleIndicators" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active "
                aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" class=""
                aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" class=""
                aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner rounded-top-4">
              <div class="carousel-item active">
                <img src="${
                  cardDetails.media[0]
                }" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src="${
                  cardDetails.media[1]
                }" class="d-block w-100 carousel-img"
                  alt="..." />
              </div>
              <div class="carousel-item">
                <img src="${
                  cardDetails.media[2]
                }" class="d-block w-100 carousel-img" alt="..." />
              </div>
            </div>
            <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next " type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div class="card-body">
          <h5 class="card-title details">${cardDetails.title}</h5>
          <p class="card-text details">
          ${cardDetails.description}
          </p>
        </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item details">Seller:  <a href="./index.html?profileName=${
          cardDetails.seller.name
        }">${cardDetails.seller.name}</a></li>
          <li class="list-group-item details">Tags:  ${cardDetails.tags}</li>
          <li class="list-group-item details">Auction ends at: ${formattedDateEnd} ${formattedTimeEnd}</li>
          <li class="list-group-item details">Bids: ${
            cardDetails._count.bids
          }</li>
        </ul>

        <div class="list-group" id="allBids">
          ${bidsToHtml(cardDetails.bids)}
        </div>
        <div class="card-body">
          <button type="button" class="btn btn-primary" id="backBtn">Go back</button>
          <button type="button" class="btn btn-primary" id="showBidsBtn">Show bids</button>
          <button type="button" class="btn btn-primary" id="bidBtn" data-bs-toggle="modal" data-bs-target="#yourBidModal">Bid</button>
          <button type="button" class="btn btn-primary" id="editBtn">Edit</button>
          <button type="button" class="btn btn-primary" id="deleteBtn">Delete</button>
        </div>
      </div>
      `;
}

/**
 * Shows all bids that has been made
 * @param {} bids
 * @returns
 */
function bidsToHtml(bids) {
  bids.sort((a, b) => new Date(b.created) - new Date(a.created));
  let bidsHtml = "";

  for (let i = 0; i < bids.length; i++) {
    let formattedDateBid = new Date(bids[i].created).toLocaleDateString();
    let formattedTimeBid = new Date(bids[i].created).toLocaleTimeString();
    bidsHtml += `
        <div class="list-group-item list-group-item-action d-flex gap-3 py-3" >
            <div class="d-flex gap-2 w-100 justify-content-between details">
              <div>
                <h6 class="mb-0">${bids[i].bidderName}</h6>
                <p class="mb-0 opacity-75 details">${bids[i].amount}</p>
              </div>
              <small class="opacity-50 text-nowrap details">${formattedDateBid} ${formattedTimeBid}</small>
            </div>
          </div>`;
  }
  return bidsHtml;
}

// document.getElementById("showBidsBtn").addEventListener("click", () => {
//   document.getElementById("allBids").style.display = "block";
// });

/**
 * Places bid
 */
document.getElementById("placeBid").addEventListener("click", async () => {
  let bidInput = document.getElementById("inputUserBid").value;
  try {
    const bidResult = await newBid(token, listingsId, bidInput);
    window.location.href = `./index.html?listingsId=${bidResult.id}`;
  } catch (error) {
    alert(error);
  }
});
