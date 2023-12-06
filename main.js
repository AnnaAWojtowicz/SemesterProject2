// import './style.css'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.js";
import "./style.scss";

// import javascriptLogo from "./javascript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.js";

import { getListings } from "./src/js/api/listings/read";

let containerHtmlCard = document.getElementById("singleCard");

window.onload = showAuctionsCards();

/**
 * Shows cards with listings sent from API;
 */
async function showAuctionsCards() {
  const cards = await getListings();

  containerHtmlCard.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    let formattedDate = new Date(cards[i].updated).toLocaleDateString();
    let formattedTime = new Date(cards[i].updated).toLocaleTimeString();
    console.log(cards[i].media[0]);

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
                    <button type="button" class="btn">About</button>
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
