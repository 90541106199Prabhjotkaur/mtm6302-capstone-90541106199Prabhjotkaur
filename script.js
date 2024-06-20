document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('date-form');
    const apodContainer = document.getElementById('apod-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const apiKey = 'fQ4YJCv0dpxe73QpUWeSZKwgLLFsJah4nu9iay66'; // Replace with your NASA API key

    // Set the max attribute of the date input to today's date
    document.getElementById('date').max = new Date().toISOString().split("T")[0];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        await fetchAPOD(date);
    });

    const fetchAPOD = async (date) => {
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
            const data = await response.json();
            if (data.media_type !== 'image') {
                apodContainer.innerHTML = '<p>Sorry, the APOD for this date is a video. Please choose another date.</p>';
            } else {
                displayAPOD(data);
            }
        } catch (error) {
            apodContainer.innerHTML = `<p>There was an error retrieving the APOD: ${error.message}</p>`;
        }
    };

    const displayAPOD = (data) => {
        const { date, explanation, hdurl, title, url } = data;
        apodContainer.innerHTML = `
            <div class="apod-item">
                <h3>${title}</h3>
                <p>${date}</p>
                <img src="${url}" alt="${title}" onclick="window.open('${hdurl}', '_blank')">
                <p>${explanation}</p>
                <button onclick="saveFavorite('${date}', '${title}', '${url}', '${hdurl}', '${explanation.replace(/'/g, "\\'")}')">Save as Favorite</button>
            </div>
        `;
    };

    const saveFavorite = (date, title, url, hdurl, explanation) => {
        const favorites = getFavorites();
        const favorite = { date, title, url, hdurl, explanation };
        favorites.push(favorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    };

    const getFavorites = () => {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    };

    const displayFavorites = () => {
        const favorites = getFavorites();
        favoritesContainer.innerHTML = favorites.map(favorite => `
            <div class="favorite-item">
                <h3>${favorite.title}</h3>
                <p>${favorite.date}</p>
                <img src="${favorite.url}" alt="${favorite.title}" onclick="window.open('${favorite.hdurl}', '_blank')">
                <button onclick="deleteFavorite('${favorite.date}')">Delete</button>
            </div>
        `).join('');
    };

    const deleteFavorite = (date) => {
        let favorites = getFavorites();
        favorites = favorites.filter(favorite => favorite.date !== date);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    };

    displayFavorites();
});
