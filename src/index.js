import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';


const searchFormVal = document.querySelector(".search-form");
const textInput = document.querySelector('input[name="searchQuery"]');
const loadBtn = document.querySelector(".load-more");
const galleryVal = document.querySelector(".gallery");
let currentPage = 1;




let API_KEY = "43905093-a9b307c0db4be00f1dc7fbc13";
let URL = `https://pixabay.com/api/?`;


searchFormVal.addEventListener('submit', event => {
    currentPage = 1;
    event.preventDefault();

    if(!loadBtn.classList.contains("hide")){
        loadBtn.classList.toggle("hide");
    }

    // console.log("made it here");

    while(galleryVal.hasChildNodes()) {
        galleryVal.removeChild(galleryVal.firstChild);
    }

    // console.log("and here");
    axios
    .get(URL+getQueryParams(textInput.value))
    .then((response) =>
    {return response})
    .then((data) => {
        // console.log(data);
        if(data.data.total == 0) {
            if(!loadBtn.classList.contains("hide")){
                loadBtn.classList.toggle("hide");
            }
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            fillGallery(data.data.hits);
            if(loadBtn.classList.contains("hide")){
                loadBtn.classList.toggle("hide");
            }
            Notiflix.Notify.success();
        }
    })
    .catch(function(error) {
        
        console.log(error);
    });
});

loadBtn.addEventListener('click', event => {
    currentPage += 1;
    // console.log("made it to this one");
    axios
    .get(URL+getQueryParams(textInput.value))
    .then((response) =>
    {return response})
    .then((data) => {
        // console.log(data);
        if(data.data.total == 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            fillGallery(data.data.hits);
            Notiflix.Notify.success();
        }
    })
    .catch(function(error) {
        
        console.log(error);
    });
})



function getQueryParams(searchQuery) {
    return new URLSearchParams({
        key: API_KEY,
        q: searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: false,
        page: currentPage,
        per_page: 40
    })
}

function loadMore(){
    currentPage += 1;
    axios
    .get(URL)
    .then((response) =>
    {return response})
    .then((data) => {
        console.log(data);
        if(data.data.total == 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            fillGallery(data.data.hits);
            Notiflix.Notify.success();
        }
    })
    .catch(function(error) {
        
        console.log(error);
    });
}

function fillGallery(values) {
    const imagesDone = [];
    for(let i = 0; i < values.length; i += 1){
        const imageElement = document.createElement("li");
        imageElement.classList.add("gallery__item");
        imageElement.innerHTML = 
        `
        <div class="photo-card">
        <a class="gallery__link" href="${values[i].largeImageURL}">
        <img src="${values[i].previewURL}" alt="" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${values[i].likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${values[i].views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${values[i].comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${values[i].downloads}
          </p>
        </div>
      </div>`;
      imagesDone.push(imageElement);
    }
    galleryVal.append(...imagesDone);
    lightbox.refresh();
}

const lightbox = new SimpleLightbox(".gallery a", {
    captions: true,
    captionsDelay: 250,
    captionSelector: "img",
    captionType: "attr",
    captionPosition: "bottom",
    captionsData: "alt",
});
