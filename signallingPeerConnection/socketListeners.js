socket.on("availableOffers", (offers) => {
  createOfferEls(offers);
});

socket.on("newOfferAwaiting", (offers) => {
  createOfferEls(offers);
});

function createOfferEls(offers) {
  const answerEl = document.querySelector("#answer");
  offers.forEach((o) => {
    console.log(o);
    const newOfferEl = document.createElement("div");
    newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`;
    newOfferEl.addEventListener("click", () => answerOffer(o));
    answerEl.appendChild(newOfferEl);
  });
}
