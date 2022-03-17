let slideIndex = 1;

function changeHeartState() {
  let heartArr = document.querySelectorAll('#liked')
  heartArr.forEach((heart) => {
    heart.classList.toggle('fa-regular');
    heart.classList.toggle('fa-solid');
    heart.classList.toggle('liked');
  })
}

//-------------TAB FUNCTIONS---------------

function changeTab(evt, tabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab-button-container");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.target.parentElement.className += " active";
}

//--------------------Quantity change------------

function changeQuantity(change) {
  let quantityElement = document.querySelector('#quantity');
  let newQuantity = parseInt(quantityElement.value) + change

  if (newQuantity > 0 && newQuantity < 11) {
    quantityElement.value = newQuantity;
  }
}

window.addEventListener('load', (event) => {

  //Get data from json
  fetch('./product.json')
    .then(response => response.json())
    .then(data => {
      renderSlider(data.options[0]);
      rednderProductPage(data);
      renderPicturesList(data.options[0]);

      let dotsArr = document.querySelectorAll('.dot');
      dotsArr.forEach((element, index) => {
        element.addEventListener('click', function () {
          slideIndex = index + 1;
          showDivs(slideIndex);
        })
      })

      //#region Swipe and Slideshow controls
      //-----------------------SWIPE HANDLE-----------------
      let touchstartX = 0;
      let touchendX = 0;

      const slider = document.querySelector('.product-images-slider')
      function handleSwipe() {
        if (touchendX < touchstartX) { //Left Swipe
          plusDivs(-1);
        }
        if (touchendX > touchstartX) {// Right Swipe
          plusDivs(1);
        }
      }

      slider.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
      })

      slider.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
      })
    })
    .catch(error => console.log(error));

  //-----------------Slideshow-------------------
  let slideIndex = 1;
  showDivs(slideIndex);

  function plusDivs(n) {
    showDivs(slideIndex += n);
  }

  function showDivs(n) {
    let imagesArr = document.getElementsByClassName("slide-image");
    let dotsArr = document.querySelectorAll('.dot');
    if (imagesArr.length > 0) {

      if (n > imagesArr.length) { slideIndex = 1 }
      if (n < 1) { slideIndex = imagesArr.length }
      for (let i = 0; i < imagesArr.length; i++) {
        imagesArr[i].style.display = "none";
      }
      let selectedIndex = slideIndex - 1;
      imagesArr[slideIndex - 1].style.display = "block";
      dotsArr.forEach((element, index) => {
        if (index == selectedIndex)
          element.classList.add('selected');
        else {
          element.classList.remove('selected');
        }
      })
    }
  }
  //#endregion

  function rednderProductPage(product) {
    let minPrice, maxprice;
    let isFirstOption = true;
    let productHeader = document.querySelector(".product-header").querySelector('h2');
    productHeader.innerHTML = product.header
    let productName = document.querySelector("#product-name").querySelector('h1');
    productName.innerHTML = product.title;
    let productDescription = document.querySelector(".product-description").querySelector('p');
    productDescription.innerHTML = product.description;

    let optionsListElement = document.querySelector(".product-options-list");
    let itemOptions = product.options;
    itemOptions.forEach((option) => {
      if (isFirstOption) {
        minPrice = option.price;
        maxprice = option.price;
        isFirstOption = false;
      }
      else {
        if (option.price < minPrice)
          minPrice = option.price;
        if (option.price > maxprice)
          maxprice = option.price
      }
      let itemElement = document.createElement("div");
      itemElement.classList.add("product-options-item");

      let spanElement = document.createElement("span");
      spanElement.classList.add("opion-item-description");

      let pDescriptionElement = document.createElement("p");
      pDescriptionElement.innerHTML = option.title;

      spanElement.append(pDescriptionElement);
      itemElement.append(spanElement);

      let spanPriceElement = document.createElement("span");
      spanPriceElement.classList.add("option-item-price");

      let pPriceElement = document.createElement("p");
      pPriceElement.innerHTML = option.price;

      spanPriceElement.append(pPriceElement);
      itemElement.append(spanPriceElement);

      optionsListElement.append(itemElement);
      itemElement.addEventListener("click", () => {
        let allItemOptions = document.querySelectorAll(".product-options-item");
        if (!itemElement.classList.contains("not-in-stock")) {
          allItemOptions.forEach((element) => {
            element.classList.remove("selected");
          })
          itemElement.classList.add("selected");
          let priceLabelElement = document.querySelector("#priceLabel");
          let itemPriceElement = itemElement.querySelector(".option-item-price").querySelector('p');
          priceLabelElement.innerHTML = itemPriceElement.innerHTML;
          renderSlider(option);
          renderPicturesList(option);
        }
      });
      itemElement.classList.remove("selected");
      if (!option.isInStock)
        itemElement.classList.add('not-in-stock');
    })
    let priceLabel = document.querySelector("#priceLabel");
    priceLabel.innerHTML = ` &#8362; ${minPrice} - &#8362; ${maxprice}`

  }
  //-------ALL SLIDER RENDERING FUNCTIONS-----------------

  //#region slider rendering
  function renderSlider(productOption) {
    let sliderElement = document.querySelector(".product-images-slider");
    sliderElement.innerHTML = '';
    renderArrows(sliderElement);
    let isFirst = true;
    productOption.pictures.forEach((picture) => {
      let imgElement = document.createElement("img");
      imgElement.classList.add("slide-image");
      imgElement.style.width = "100%";
      if (isFirst) {
        imgElement.style.display = "block";
        isFirst = false;
      }
      else {
        imgElement.style.display = "none";
      }
      imgElement.src = picture;
      sliderElement.append(imgElement);

    })
    renderDots(sliderElement, productOption);
  }

  function renderArrows(sliderElement) {
    let rightArrowElement = document.createElement('button');
    rightArrowElement.innerHTML = '&gt;';
    rightArrowElement.classList.add('btn');
    rightArrowElement.classList.add('right-arrow');
    let leftArrowElement = document.createElement('button');
    leftArrowElement.innerHTML = '&lt;';
    leftArrowElement.classList.add('btn');
    leftArrowElement.classList.add('left-arrow');

    addOnClickToArrow(rightArrowElement, 1);
    addOnClickToArrow(leftArrowElement, -1);
    sliderElement.append(rightArrowElement);
    sliderElement.append(leftArrowElement);
  }

  function addOnClickToArrow(element, x) {
    element.addEventListener('click', function () {
      plusDivs(x);
    })
  }

  function renderDots(sliderElement, productOption) {
    let dotsDiv = document.createElement('div');
    dotsDiv.classList.add('dots');
    dotsDiv.style.textAlign = "center";
    let isFirst = true;
    productOption.pictures.forEach((picture, index) => {
      let dotsElement = document.createElement("span");
      dotsElement.classList.add("dot");
      if (isFirst) {
        dotsElement.classList.add("selected");
        isFirst = false;
      }
      dotsDiv.append(dotsElement);
    })
    sliderElement.append(dotsDiv);
  }
  //#endregion

  function renderPicturesList(productOption) {
    let picturesListElement = document.querySelector('.product-images-list');
    picturesListElement.innerHTML = '';
    productOption.pictures.forEach((picture) => {
      let liElement = document.createElement('li');
      liElement.classList.add('product-image-item');
      let imgElement = document.createElement('img');
      imgElement.src = picture;
      liElement.append(imgElement);
      picturesListElement.append(liElement);
    })

  }

})




