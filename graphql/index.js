import * as utils from './utils.js'
import * as pie from './piechart.js'
import * as graph from './linegraph.js'

let form;

document.addEventListener("DOMContentLoaded", function () {
  form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await getData(form);
  });
});

async function getData(form ) {
  document.getElementById("error").innerText = "";
  let jwt = await processLogin(form);
  if(!jwt){
    document.getElementById("error").innerText = "unable to log in, please check your credentials";
    return;
  }
  await graphqlRequest(jwt, utils.query);
  // console.log('data', data);
}

async function processLogin(form) {
  let username = form.username.value;
  let password = form.password.value;
  let jwtRequestUrl = "https://01.kood.tech/api/auth/signin";
  let encodedAuth = btoa(username + ":" + password);

  let jwt = await fetch(jwtRequestUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + encodedAuth,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .catch((response) =>  response);
  return jwt;
}

async function graphqlRequest(jwt, query) {
  let dataRequestUrl = "https://01.kood.tech/api/graphql-engine/v1/graphql";
    await fetch(dataRequestUrl, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query})
  })
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    console.log("graphql request failed: ", response);
    throw response;
  })
  .then(data => {
    if(data.errors != undefined && data.errors.length > 0) {
      // console.log('data errors', data.errors);
      const errorMessage = data.errors[0].message;
      const pleaseCheck = `Please check your credentials!`;
      document.getElementById("error").innerHTML = `${errorMessage}<br>${pleaseCheck}`;
    } else {
      // console.log('data', data);
      createLogout();
      getTotalXP(data);
      displayBasicInfo(data.data);
      pie.cookPieChart(data.data);
      graph.drawLineGraph(data.data);
    }
  })
  .catch((response) => response);
}

function createLogout() {
  const logoutDiv = document.getElementById("logoutForm");
  const logoutButton = document.getElementById("logout-button");
  document.querySelector('.login').style.display = 'none';
  logoutDiv.style.display = 'block';
  logoutButton.addEventListener("click", () => {
    document.querySelector('.login').style.display = 'block';
    logoutDiv.style.display = 'none'
  })
}

function getTotalXP(data){
  const input = data.data.transaction;
  let totalxp = 0
  for(let i = 0; i < input.length; i++){
    totalxp += input[i].amount;
  }
  data.data.totalXP = totalxp;
}

function displayBasicInfo(data){
  if(!data){
    return
  }
  let basicInfo = data.user[0];
  let xpTotal = data.totalXP;
  // console.log('info', basicInfo, xpTotal)
  let ratio = basicInfo.auditRatio;
  document.getElementById("name").innerText = "Hello " + basicInfo.firstName + " " + basicInfo.lastName + "!"
  document.getElementById("userlogin").innerText = "Login: " + basicInfo.login
  document.getElementById("campus").innerText = "Campus: " + basicInfo.campus
  document.getElementById("acc-created").innerText = "Account created at: " + utils.formattedDate(basicInfo.createdAt);
  let currentUrl = window.location.href;
  document.getElementById("xp").innerText = "Total XP: " + utils.formatBytes(xpTotal) + " / Audit Ratio: " + ratio.toFixed(2);
}