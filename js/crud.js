const formEl = document.getElementById('movie-form');
const movieList = document.getElementById('movie-list');

// Filmek
var movies = [
    { id: 1, title: 'A sötét lovag', release: 2008, genre: 'Akció', rating: 9.0 },
    { id: 2, title: 'A remény rabjai', release: 1994, genre: 'Dráma', rating: 9.3 },
    { id: 3, title: 'Harcosok klubja', release: 1999, genre: 'Thriller', rating: 8.8 },
    { id: 4, title: 'Mátrix', release: 1999, genre: 'Sci-fi', rating: 8.7 },
];

// A következő ID
var nextId = 5;

// Mentés gomb
document.getElementById('save').addEventListener('click', () => {
    if (formEl.reportValidity()) {
        let movieId = document.getElementById("movie-id").value;

        if (movieId.length > 0) {
            update(movieId);
        } else {
            create();
        }
    }
});

function resetId() {
    document.getElementById("movie-id").value = "";
}

// Rendezés
var activeSorting = '';
var sortingAsc = true;
document.querySelectorAll('.sorting').forEach(elem => {
    elem.addEventListener('click', () => {
        let sort = elem.getAttribute('data-sort');

        if (activeSorting == sort) {
            if (sortingAsc) {
                sortingAsc = false;
            } else {
                sortingAsc = true;
            }
        } else {
            sortingAsc = true;
        }

        activeSorting = sort;

        drawTable();
    });
});

function sortingElements() {
    switch (activeSorting) {
        case 'title':
            sortingAsc ? movies.sort((a, b) => a.title.localeCompare(b.title)) : movies.sort((a, b) => b.title.localeCompare(a.title));
            break;

        case 'release':
            sortingAsc ? movies.sort((a, b) => a.release - b.release) : movies.sort((a, b) => b.release - a.release);
            break;

        case 'genre':
            sortingAsc ? movies.sort((a, b) => a.genre.localeCompare(b.genre)) : movies.sort((a, b) => b.genre.localeCompare(a.genre));
            break;

        case 'rating':
            sortingAsc ? movies.sort((a, b) => a.rating - b.rating) : movies.sort((a, b) => b.rating - a.rating);
            break;
    }
}

function drawTable() {
    // Táblázat sorainak törlése
    movieList.innerHTML = '';

    // Elemek rendezése
    sortingElements();

    // Elemek megjelenítése
    movies.forEach(movie => {
        var tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.release}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>
            <td>
                <a href="#" onclick="loadMovie(${movie.id})">Szerkesztés</a> /
                <a href="#" onclick="remove(${movie.id})">Törlés</a>
            </td>
        `;

        movieList.appendChild(tr);
    });
}

// Elem létrehozása
function create() {
    movies.push({
        id: nextId,
        title: document.getElementById("title").value,
        release: document.getElementById("release").value,
        genre: document.getElementById("genre").value,
        rating: document.getElementById("rating").value,
    });

    nextId++;

    document.getElementById("movie-id").value = "";
    formEl.reset();
    drawTable();
}

// Elem betöltése a formba
function loadMovie(id) {
    let currentMovie = movies.find(movie => movie.id == id);

    document.getElementById("movie-id").value = id;
    document.getElementById("title").value = currentMovie.title;
    document.getElementById("release").value = currentMovie.release;
    document.getElementById("genre").value = currentMovie.genre;
    document.getElementById("rating").value = currentMovie.rating;
}

// Elem szerkesztése
function update(id) {
    // Megkeresi az elem indexét
    const movieIndex = movies.findIndex(movie => movie.id == id);

    if (movieIndex !== -1) {
        let newData = {
            id: id,
            title: document.getElementById("title").value,
            release: document.getElementById("release").value,
            genre: document.getElementById("genre").value,
            rating: document.getElementById("rating").value,
        };

        // Elmentjük (felülírjuk) a régi elemet
        movies[movieIndex] = { ...movies[movieIndex], ...newData };
    }

    document.getElementById("movie-id").value = "";
    formEl.reset();
    drawTable();
}

// Elem törlése
function remove(id) {
    const confirmDelete = confirm('Biztosan törölni szeretnéd ezt a filmet?');

    if (confirmDelete) {
        movies = movies.filter(movie => movie.id != id);
        drawTable();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    drawTable();
});
