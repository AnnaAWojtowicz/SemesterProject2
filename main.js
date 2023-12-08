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

let params = new URLSearchParams(window.location.search);
let listingsId = params.get("listingsId");

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
      window.location.reload();
      document.getElementById("header1").style.display = "block";
      document.getElementById("header2").style.display = "none";
    }
  });

if (listingsId !== null) {
  showAuctionsCardDetails(listingsId);
  console.log(listingsId);
} else {
  showAuctionsCards();
}

let containerHtmlCard = document.getElementById("singleCard");
let containerHtmlCardDetails = document.getElementById("singleCardDetails");

// window.onload = showAuctionsCards();

/**
 * Shows cards with listings sent from API;
 */
async function showAuctionsCards() {
  document.getElementById("singleCardDetails").style.display = "none";
  const cards = await getListings();

  containerHtmlCard.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    let formattedDate = new Date(cards[i].updated).toLocaleDateString();
    let formattedTime = new Date(cards[i].updated).toLocaleTimeString();

    containerHtmlCard.innerHTML += `
        
  <div class="col">
            <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style="
                    background-image: url(${cards[i].media[0]});
                  ">
              <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                  ${cards[i].title}
                </h3>
                <ul class="d-flex list-unstyled mt-auto">
                  <li class="me-auto">
                    <button type="button" class="btn aboutBtn" id="${cards[i].id}"><a href="?listingsId=${cards[i].id}">About</a></button>
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

  containerHtmlCardDetails.innerHTML += `
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
        <li class="list-group-item">Seller:  ${cardDetails.seller.name}</li>
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
