/********* create variables *********/
// useful variables might be: the cost per day, the number of days selected, and elements on the screen that will be clicked or will need to be modified.
// Do any of these variables need to be initialized when the page is loaded?
// When do they need to be reset or updated?
let costPerDay = 3500;
let dayCounter = 0;
const monday = document.getElementById("monday");
const tuesday = document.getElementById("tuesday");
const wednesday = document.getElementById("wednesday");
const thursday = document.getElementById("thursday");
const friday = document.getElementById("friday");
const clearButton = document.getElementById("clear-button");
const halfDayButton = document.getElementById("half");
const fullDayButton = document.getElementById("full");
const calculatedCostElement = document.getElementById("calculated-cost");
const memberLoginButton = document.getElementById("member-login");
const memberVideoContainer = document.getElementById("member-video-container");
const myVideo = document.getElementById("myVideo");

if (memberLoginButton && memberVideoContainer) {
  memberLoginButton.addEventListener("click", () => {
    memberLoginButton.style.display = "none";
    memberVideoContainer.classList.add("show");
    if (myVideo) {
      myVideo.play().catch(() => {
        // autoplay may be blocked by browser, user can start manually
      });
    }
  });
}
/********* colour change days of week *********/
// when the day buttons are clicked, we will apply the "clicked" class to that element, and update any other relevant variables. Then, we can recalculate the total cost.
// added challenge: don't update the dayCounter if the same day is clicked more than once. hint: .classList.contains() might be helpful here!
monday.addEventListener("click", () => {
  if (!monday.classList.contains("clicked")) {
    monday.classList.add("clicked");
    dayCounter += 1;
    recalculateTotalCost();
  }
});
tuesday.addEventListener("click", () => {
  if (!tuesday.classList.contains("clicked")) {
    tuesday.classList.add("clicked");
    dayCounter += 1;
    recalculateTotalCost();
  }
});
wednesday.addEventListener("click", () => {
  if (!wednesday.classList.contains("clicked")) {
    wednesday.classList.add("clicked");
    dayCounter += 1;
    recalculateTotalCost();
  }
});
thursday.addEventListener("click", () => {
  if (!thursday.classList.contains("clicked")) {
    thursday.classList.add("clicked");
    dayCounter += 1;
    recalculateTotalCost();
  }
});
friday.addEventListener("click", () => {
  if (!friday.classList.contains("clicked")) {
    friday.classList.add("clicked");
    dayCounter += 1;
    recalculateTotalCost();
  }
});
/********* clear days *********/
// when the clear-button is clicked, the "clicked" class is removed from all days, any other relevant variables are reset, and the calculated cost is set to 0.
clearButton.addEventListener("click", () => {
  monday.classList.remove("clicked");
  tuesday.classList.remove("clicked");
  wednesday.classList.remove("clicked");
  thursday.classList.remove("clicked");
  friday.classList.remove("clicked");
  dayCounter = 0;
  recalculateTotalCost();
});
/********* change rate *********/
// when the half-day button is clicked, set the daily rate to $20, add the "clicked" class to the "half" element, remove it from the "full" element, and recalculate the total cost.
halfDayButton.addEventListener("click", () => {
  costPerDay = 1600;
  halfDayButton.classList.add("clicked");
  fullDayButton.classList.remove("clicked");
  recalculateTotalCost();
});
// when the full-day button is clicked, the daily rate is set back to $35, the clicked class is added to "full" and removed from "half", and the total cost is recalculated.
fullDayButton.addEventListener("click", () => {
  costPerDay = 3500;
  fullDayButton.classList.add("clicked");
  halfDayButton.classList.remove("clicked");
  recalculateTotalCost();
});
/********* calculate *********/
// when a calculation is needed, set the innerHTML of the calculated-cost element to the appropriate value
function recalculateTotalCost() {
  const totalCost = costPerDay * dayCounter;
  calculatedCostElement.innerHTML = totalCost;
}
