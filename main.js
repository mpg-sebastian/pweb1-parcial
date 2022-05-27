import fetchData from "./utils/fetchData.js";
import errorCatcher from "./utils/errorCatcher.js";
import { createNode, append } from "./utils/domBuilder.js";

/* Pagination setup */
const pagination = {
  pageSize: 10,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
};

const previousPage = (callback) => {
  console.log("previous");
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
    if (callback) callback(pagination.currentPage);
  }
};

const nextPage = (callback) => {
  if (pagination.currentPage < pagination.totalPages) {
    pagination.currentPage++;
    if (callback) callback(pagination.currentPage);
  }
};

const resetPagination = (callback) => {
  pagination.currentPage = 0;
  if (callback) callback(pagination.currentPage);
};

function onDomLoaded() {
  let loading = false;
  const RANDOM_API = "https://randomuser.me/api/";
  let randoms = null;

  /* DOM Components */
  const divContent = document.querySelector("#root");
  const divContentPag = createNode("div");
  const divContentText = createNode("div");
  const textHeading = createNode("p");
  const spanPagInfo = createNode("span");
  const btnPrevious = createNode("button");
  const btnNext = createNode("button");

  textHeading.innerHTML = "Random Users Generator";
  btnPrevious.innerHTML = "<";
  spanPagInfo.innerHTML = `Página ${pagination.currentPage} de ${pagination.totalPages}`;
  btnNext.innerHTML = ">";
  divContent.innerHTML = "";
  divContentText.innerHTML = "";

  /* Set Attributes */
  textHeading.setAttribute("class", "text-center display-1 text-light");
  divContent.setAttribute("class", "container");
  divContentPag.setAttribute("id", "search-results-pagination");
  divContentPag.setAttribute(
    "class",
    "d-flex justify-content-center align-items-center"
  );
  spanPagInfo.setAttribute("id", "search-results-pagination-info");
  btnPrevious.setAttribute("id", "btn-prev-pag");
  btnNext.setAttribute("id", "btn-next-pag");

  /* Inner HTML */
  append(divContentText, textHeading);
  append(divContentPag, btnPrevious);
  append(divContentPag, spanPagInfo);
  append(divContentPag, btnNext);

  // /* Table */
  const tableData = createNode("table");
  append(divContent, divContentText);
  append(divContent, tableData);
  append(divContent, divContentPag);

  /* Get Elements from HTML*/
  const btnPrevPage = document.querySelector("#btn-prev-pag");
  btnPrevPage.setAttribute("class", "btn btn-dark");
  const btnNextPage = document.querySelector("#btn-next-pag");
  btnNextPage.setAttribute("class", "btn btn-dark");

  const divContentPagination = document.querySelector(
    "#search-results-pagination"
  );
  const spanPaginationInfo = document.querySelector(
    "#search-results-pagination-info"
  );
  spanPaginationInfo.setAttribute("class", "text-center px-4 text-light");

  // Set events
  btnPrevPage.addEventListener("click", () => {
    previousPage(getRandoms);
  });

  btnNextPage.addEventListener("click", () => {
    console.log("click");
    nextPage(getRandoms);
  });

  /* Loading Element */
  const loadingElement = createNode("p");
  loadingElement.setAttribute("id", "loading-randoms");
  loadingElement.textContent = "Cargando ...";

  function calculateTotalPages() {
    return Math.ceil(pagination.totalItems / pagination.pageSize);
  }

  //REVISAR DISPLAY NONE EN DIV CONTENT
  // function setLoading(value) {
  //   loading = value;
  //   tableData.innerHTML = "";
  //   if (!loading) {
  //     append(divContent, loadingElement);
  //     append(divContent, tableData);
  //     append(divContent, divContentPag);
  //     divContentPagination.style.display = "block";
  //   } else {
  //     divContentPagination.style.display = "none";
  //   }
  // }

  function removeTable() {
    if (tableData) tableData.innerHTML = "";
  }

  function buildTable(randomsData) {
    removeTable();
    const randomData = randomsData.results; // 34 results

    /* Table Building */
    tableData.setAttribute("id", "table-randoms");
    tableData.classList.add("table", "table-dark", "table-hover");

    /* Table Header */
    const tableHeader = createNode("thead");
    const trHead = createNode("tr");

    append(tableData, tableHeader);
    append(tableHeader, trHead);

    const headers = [
      "#",
      "Titulo",
      "Nombre",
      "Genero",
      "Edad",
      "Telefono",
      "Imagen",
    ];

    headers.forEach((header) => {
      const th = createNode("th");
      th.textContent = header;
      append(trHead, th);
    });

    /* Table Body */
    const tBody = createNode("tbody");
    append(tableData, tBody);

    /* slice in 10 results */
    randomData.slice(0, 10).forEach((random) => {
      const tr = createNode("tr");

      const tdId = createNode("td");
      tdId.textContent = randomData.indexOf(random) + 1;
      append(tr, tdId);

      const tdTitle = createNode("td");
      tdTitle.textContent = random.name.title;
      append(tr, tdTitle);

      const tdName = createNode("td");
      tdName.textContent = random.name.first;
      append(tr, tdName);

      const tdGender = createNode("td");
      tdGender.textContent = random.gender;
      append(tr, tdGender);

      const tdAge = createNode("td");
      tdAge.textContent = random.dob.age;
      append(tr, tdAge);

      const tdPhone = createNode("td");
      tdPhone.textContent = random.phone;
      append(tr, tdPhone);

      const tdPicture = createNode("td");
      const img = createNode("img");
      img.setAttribute("src", random.picture.thumbnail);
      img.setAttribute("alt", "Imagen");
      img.style.height = "60px";
      append(tdPicture, img);
      append(tr, tdPicture);

      append(tBody, tr);
    });
  }

  async function getRandoms(page) {
    const apiUrl = `${RANDOM_API}?results=34&page=${page}`;
    try {
      // setLoading(true);
      const randomsData = await fetchData(apiUrl);
      randoms = randomsData.results;
      pagination.totalItems = randomsData.info.results;
      pagination.totalPages = calculateTotalPages();
      spanPaginationInfo.textContent = `${pagination.currentPage} de ${pagination.totalPages}`;
      buildTable(randomsData);
    } catch (error) {
      errorCatcher(error);
    }
  }

  getRandoms(1);
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
