async function showMovieDay() {

    const response = await api.get('movie/436969?language=pt-BR')
    const movieDay = response.data

    const highlightVideo = document.querySelector('.highlight__video');
    const titleMovieDay = document.querySelector('.highlight__title');
    const ratingMovieDay = document.querySelector('.highlight__rating');
    const descriptionMovieday = document.querySelector('.highlight__description');
    const genresMovieDay = document.querySelector('.highlight__genres');
    const dateMovieDay = document.querySelector('.highlight__launch');


    highlightVideo.style.backgroundImage = `url(${movieDay.backdrop_path})`;
    highlightVideo.style.backgroundSize = 'cover';

    titleMovieDay.textContent = movieDay.title;
    ratingMovieDay.textContent = movieDay.vote_average.toFixed(1);
    descriptionMovieday.textContent = movieDay.overview;
    genresMovieDay.textContent = movieDay.genres.map((genres) => genres.name).join(', ') + ' /';
    dateMovieDay.textContent = new Date(movieDay.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const videoLink = document.querySelector('.highlight__video-link');
    const trailer = await api.get('movie/436969/videos?language=pt-BR');
    const video = trailer.data.results[1];
    videoLink.href = `https://www.youtube.com/watch?v=${video.key}`;

}

showMovieDay()

async function showMovieModal(id) {
    const response = await api.get(`movie/${id}?language=pt-BR`)
    const movie = response.data;

    const divModal = document.querySelector('.modal');
    const modalTitle = document.querySelector('.modal__title');
    const modalDescription = document.querySelector('.modal__description');
    const modalAverage = document.querySelector('.modal__average');
    const modalImg = document.querySelector('.modal__img');
    const modal = document.querySelector('.modal')
    const btnCloseModal = document.querySelector('.modal__close')

    divModal.classList.remove('hidden');

    modalTitle.textContent = movie.title;
    modalDescription.textContent = movie.overview;
    modalAverage.textContent = movie.vote_average.toFixed(1);
    modalImg.setAttribute('src', movie.backdrop_path);


    function closeModal() {
        modal.classList.add('hidden')
    }

    btnCloseModal.addEventListener('click', closeModal);
    modal.addEventListener('click', closeModal);

    const modalGenres = document.querySelector(".modal__genres");
    modalGenres.innerHTML = '';
    movie.genres.forEach((genre) => {
        const html = `<span class="modal__genre">${genre.name}</span>`;
        modalGenres.insertAdjacentHTML("beforeend", html);
    });
}



async function loadMovies() {

    async function queryMovies(query) {
        const url = query ? `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${query}` : 'discover/movie?language=pt-BR&include_adult=false'
        const response = await api.get(url)
        const movies = response.data.results.slice(0, 18);
        return movies
    }


    const movies = await queryMovies()

    function showMovies(movies, page = 0) {
        const moviesDiv = document.querySelector('.movies')

        moviesDiv.innerHTML = '';
        movies.slice((page * 6), ((page + 1) * 6)).forEach((movie) => {
            const html = `
                <div class="movie" style="background-image: url(${movie.poster_path})" onClick="showMovieModal(${movie.id})">
                    <div class="movie__info">
                    <span class="movie__title">${movie.title}</span>
                    <span class="movie__rating">
                        ${movie.vote_average.toFixed(1)}
                        <img src="./assets/estrela.svg" alt="Estrela">
                    </span>
                    </div>
                </div>
            `;
            moviesDiv.insertAdjacentHTML("beforeend", html);
        });
    };

    showMovies(movies)

    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');

    var sliderPage = 0;

    prevButton.addEventListener('click', function () {
        if (sliderPage === 0) {
            sliderPage = 2
        } else {
            sliderPage -= 1
        }

        showMovies(movies, sliderPage)
    });

    nextButton.addEventListener('click', function () {
        sliderPage += 1

        if (sliderPage === 3) {
            sliderPage = 0
        }

        showMovies(movies, sliderPage)
    });


    const searchInput = document.querySelector('.input')

    searchInput.addEventListener("keyup", async event => {
        if (event.key === "Enter") {
            const value = event.target.value;
            sliderPage = 0

            if (value) {
                const movies = await queryMovies(event.target.value)
                showMovies(movies, sliderPage)
                searchInput.value = ''
            } else {
                showMovies(movies, sliderPage)

            }
        }
    })
}

loadMovies()


const btnTheme = document.querySelector(".btn-theme");

btnTheme.addEventListener("click", () => {
    const root = document.querySelector(":root");
    const logo = document.querySelector('img[alt="Logo"]');
    const btnTheme = document.querySelector(".btn-theme");
    const btnPrev = document.querySelector(".btn-prev");
    const btnNext = document.querySelector(".btn-next");
    const btnClose = document.querySelector(".modal__close");
    const backgroundColor = root.style.getPropertyValue("--background");


    if (!backgroundColor || backgroundColor == "#FFFFF") {
        root.style.setProperty("--background", '#1B2028');
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--text-color", "#FFFFFF");
        root.style.setProperty("--bg-secondary", "#2d3440");
        root.style.setProperty("--bg-modal", "#2D3440");
        root.style.setProperty("--input-background", "#3E434D");
        root.style.setProperty("--text-input-color", "#FFFFFF");
        logo.setAttribute("src", "./assets/logo.svg");
        btnTheme.setAttribute("src", "./assets/dark-mode.svg");
        btnPrev.setAttribute("src", "./assets/arrow-left-light.svg");
        btnNext.setAttribute("src", "./assets/arrow-right-light.svg");
        btnClose.setAttribute("src", "./assets/close.svg");

        return;
    }
    root.style.setProperty("--background", "#FFFFF");
    root.style.setProperty("--input-color", "#979797");
    root.style.setProperty("--text-color", "#1b2028");
    root.style.setProperty("--bg-secondary", "#EDEDED");
    root.style.setProperty("--bg-modal", "#EDEDED");
    root.style.setProperty("--input-background", "#FFFFFF");
    root.style.setProperty("--text-input-color", "#000000");
    logo.setAttribute("src", "./assets/logo-dark.png");
    btnTheme.setAttribute("src", "./assets/light-mode.svg");
    btnPrev.setAttribute("src", "./assets/arrow-left-dark.svg");
    btnNext.setAttribute("src", "./assets/arrow-right-dark.svg");
    btnClose.setAttribute("src", "./assets/close-dark.svg");
});

