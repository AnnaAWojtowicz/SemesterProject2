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

let params = new URLSearchParams(window.location.search);
let listingsId = params.get("listingsId");
let profileName = params.get("profileName");
let token = localStorage.getItem("accessToken");

let containerHtmlCard = document.getElementById("singleCard");
let containerHtmlCardDetails = document.getElementById("singleCardDetails");
// if (listingsId !== null) {
//     showAuctionsCardDetails(listingsId);
//     console.log(listingsId);
// } else {
//     showAuctionsCards();
// }

if (listingsId === null && profileName === null) {
  showAuctionsCards();
}

if (listingsId !== null) {
  showAuctionsCardDetails(listingsId);
}

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
              <h4 class="card-text my-4">Your Credits: ${profile.credits}</h4>
              <button class="btn btn-primary my-4 me-2" type="submit">
                New Auction
              </button>
              <button class="btn btn-primary my-4 me-2" type="submit">
                Your Bids
              </button>
              <button class="btn btn-primary my-4 me-2" type="submit">
                Change Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
`;
  showUserCreditsHeader(profile);
  showUserListings(profile.listings);
}

/**
 * Shows users listings
 */

function showUserListings(listings) {
  containerHtmlCard.innerHTML = "";
  for (let i = 0; i < listings.length; i++) {
    let formattedDate = new Date(listings[i].updated).toLocaleDateString();
    let formattedTime = new Date(listings[i].updated).toLocaleTimeString();

    containerHtmlCard.innerHTML += `
        
  <div class="col">
            <div class="border card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style="
                    background-image: url(${listings[i].media[0]});
                  ">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  ${listings[i].title}
                </h3>
                <ul class="d-flex list-unstyled mt-auto">
                  <li class="me-auto">
                    <a href="?listingsId=${listings[i].id}"><button type="button" class="btn aboutBtn" id="${listings[i].id}">About</button></a>
                  </li>
                  <li class="d-flex align-items-center">
                    <i class="bi me-2 ms-2 bi-calendar3"></i>
                    <small>${formattedDate} ${formattedTime}</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
  `;
  }
}

/**
 * Gets users data (credits in header when logged in
 */
function showUserCreditsHeader(profile) {
  document.getElementById("header1").style.display = "block";
  document.getElementById("header2").style.display = "none";
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
            <li><a class="dropdown-item" href="#">Your Auctions</a></li>
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
            <div class="border card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style="
                    background-image: url(${cards[i].media[0]});
                  ">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  ${cards[i].title}
                </h3>
                <ul class="d-flex list-unstyled mt-auto">
                  <li class="me-auto">
                    <a href="?listingsId=${cards[i].id}"><button type="button" class="btn aboutBtn" id="${cards[i].id}">About</button></a>
                  </li>
                  <li class="d-flex align-items-center">
                    <i class="bi me-2 ms-2 bi-calendar3"></i>
                    <small>${formattedDate} ${formattedTime}</small>
                  </li>
                </ul>
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
  const cardDetails = await getListingById(id);

  containerHtmlCardDetails.innerHTML = "";

  let formattedDateEnd = new Date(cardDetails.endsAt).toLocaleDateString();
  let formattedTimeEnd = new Date(cardDetails.endsAt).toLocaleTimeString();

  containerHtmlCardDetails.innerHTML = `
        <div class="card rounded-top-4 border">
        <div class="card-img-top border-bottom">
         
          <div id="carouselExampleIndicators" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner rounded-top-4">
              <div class="carousel-item active">
                <img src="${cardDetails.media[0]}" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src="${cardDetails.media[1]}" class="d-block w-100 carousel-img"
                  alt="..." />
              </div>
              <div class="carousel-item">
                <img src="${cardDetails.media[2]}" class="d-block w-100 carousel-img" alt="..." />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div class="card-body">
          <h5 class="card-title">${cardDetails.title}</h5>
          <p class="card-text">
          ${cardDetails.description}
          </p>
        </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">Seller:  <a href="./index.html?profileName=${cardDetails.seller.name}">${cardDetails.seller.name}</a></li>
          <li class="list-group-item">Tags:  ${cardDetails.tags}</li>
          <li class="list-group-item">Auction ends at: ${formattedDateEnd} ${formattedTimeEnd}</li>
          <li class="list-group-item">Bids: ${cardDetails._count.bids}</li>
        </ul>
        <div class="card-body">
          <button type="button" class="btn" id="backBtn">Back to Auctions</button>
          <button type="button" class="btn" id="bidBtn">Place your Bid</button>
        </div>
      </div>
      `;
}
