const APIKEY = 'f072cab30026eef4f4afd90008af95b3';
const APIURL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=f072cab30026eef4f4afd90008af95b3&language=en-US';
const IMGPATH = 'https://image.tmdb.org/t/p/original/';
const POSTERPATH = 'https://image.tmdb.org/t/p/w500';
const GENRE = 'https://api.themoviedb.org/3/genre/movie/list?api_key=f072cab30026eef4f4afd90008af95b3&language=en-US';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/tv?api_key=f072cab30026eef4f4afd90008af95b3&query=';
const BASE_URL = 'https://api.themoviedb.org/3';

const LATEST = 'https://api.themoviedb.org/3/movie/latest?api_key=f072cab30026eef4f4afd90008af95b3&language=en-US';
const TRENDING = 'https://api.themoviedb.org/3/trending/all/day?api_key=f072cab30026eef4f4afd90008af95b3&language=en-US';
const UPCOMING = 'https://api.themoviedb.org/3/movie/upcoming?api_key=f072cab30026eef4f4afd90008af95b3&language=en-US&page=1'

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPage = 100;


//Viljum fá movies umleið
getMovies(APIURL);

async function getMovies(url){
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    function clearPage(){
      document.getElementById("title-text").style.display = "none";
    }   

    fetch(url).then(res => res.json()).then(movies => {
      console.log("Results:",movies.results)
      if(movies.results.length !== 0){
          const el = document.createElement('div');
          const image = document.createElement('img');
          image.src = POSTERPATH + movies.poster_path;

          showMovies(movies.results);
          currentPage = movies.page;
          nextPage = currentPage + 1;
          prevPage = currentPage - 1;
          totalPages = movies.total_pages;

          current.innerText = currentPage;

          if(currentPage <= 1){
            prev.classList.add('disabled');
            next.classList.remove('disabled')
          }else if(currentPage>= totalPages){
            prev.classList.remove('disabled');
            next.classList.add('disabled')
          }else{
            prev.classList.remove('disabled');
            next.classList.remove('disabled')
          }
          
      //Nothing found, error page
      }else{
        clearPage();
          main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
      }
    })

    console.log(respData);

    showMovies(respData.results);
  
    return respData;
}

//Format the website
function showMovies(movies){
  main.innerHTML = '';

  movies.forEach((movie) => {
    const{poster_path,name,vote_average, first_air_date,id,overview,backdrop_path } = movie;

    const movieEl = document.createElement('div');

    movieEl.classList.add('movie');
    

    movieEl.innerHTML = `
    <div class="movies" id="moviebright">
      <p>${vote_average}</p>
      <div class="movie-play" class="overview">
        <img id="movie" src="${POSTERPATH + poster_path}">
        <div class="overview">
          <button id="${id}"></button>
        </div>
      </div>
      <div class="movie-info" id="movie-info">
        <h2>${name}</h2>
        <div id="tags">
          <h3 class="tag">${first_air_date.substr(0,4)}</h3>
       </div>
      </div>
    </div>
    `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener('click', () => {
    console.log(id)
      openNav(movie)
    })
  });

}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;

  fetch(BASE_URL + '/tv/'+id+'/videos?'+'api_key='+APIKEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "70%";
      document.getElementById("main").style.filter= 'brightness(20%)';
      document.getElementById("title-result").style.filter = 'brightness(20%)'
      document.getElementById("title-text").style.filter= 'brightness(20%)';
      document.getElementById("pagenation1").style.filter= 'brightness(20%)';
      if(videoData.results.length > 0){
        var embed = [];
        videoData.results.forEach((video) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="534" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed_hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `)

          }
        })

        console.log(movie)
        
        var content = `
        <div class="overview_content">
          <div class="overview_image">
            <img id="backdrop" src="${IMGPATH + movie.backdrop_path}">
            <img id="poster" src="${POSTERPATH + movie.poster_path}">
          </div> 
          <div class="overview_description">
            <h1 class="no-results">${movie.original_name}</h1>
            <p class="no-results">${movie.overview}</p>
          </div>
          <h2>Trailers:</h2>
        </div>
        <br/>
        
        ${embed.join('')}
        <br/>
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        document.getElementById("closebtn").style.top= '20px';
      }
    }
  })
}

var modal = document.getElementById("myNav");

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  document.getElementById("main").style.filter= 'brightness(100%)';
  document.getElementById("title-text").style.filter= 'brightness(100%)';
  document.getElementById("title-result").style.filter= 'brightness(100%)';
  document.getElementById("pagenation1").style.filter= 'brightness(100%)';  
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.width = "0%";
  }
}

//Page Flips
function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');

  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}

//Previous Page
prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
    main.scrollIntoView({behavior : 'smooth'})
  }
})

//Next Page
next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
    main.scrollIntoView({behavior : 'smooth'})
  }
})

//Search
form.addEventListener('submit', (e) =>{
  e.preventDefault();

  const searchTerm = search.value;

  if(searchTerm){
    console.log(searchTerm);
    getMovies(SEARCHAPI + searchTerm);
    search.append(SEARCHAPI + searchTerm);
    search.value = '';
    document.getElementById("title-text").innerHTML = "Results for "+searchTerm;
    document.getElementById("title-text").style.color = "gray";
    document.getElementById("title-text").style.fontSize = "larger";

    document.getElementById("title-result").style.display = "flex";
    document.getElementById("title-result").style.justifyContent = "center";  
  }else{
    getMovies(APIURL);
  }
});


//Sidebar
function openSlideMenu(){
  document.getElementById("menu").style.width = '250px';
  document.getElementById("content").style.marginLeft = '250px';

  document.getElementById("main").style.filter= 'brightness(100%)';
  document.getElementById("menu").style.display = "block";
}

function closesSlideMenu(){
  document.getElementById("menu").style.width = '0';
  document.getElementById("content").style.marginLeft = '0';

  document.getElementById("main").style.filter= 'brightness(100%)';
}


/* Hide sidepage when scrolling, Working! */
/* JSQuery */ 

$(window).scroll(function() {
  if($(window).scrollTop() <= 10) {
    document.getElementById("menu").style.width = '0';
    document.getElementById("content").style.marginLeft = '0';
    $('.nav').fadeIn();

  }
  else {
    document.getElementById("menu").style.width = '0';
    document.getElementById("content").style.marginLeft = '0';
    $('.nav').fadeOut();
  }
});


/*
$('.overlay').plate();

$('.overlay').plate({
    // inverse animation
    inverse:false,
    // transformation perspective in pixel
    perspective: 500,
    // maximum rotation in degrees
    maxRotation: 10,
    // duration in millisecond
    animationDuration: 200
  });
*/

console.log("click")

const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
    console.log("click")
})