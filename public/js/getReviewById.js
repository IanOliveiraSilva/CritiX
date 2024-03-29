function generateStarRating(rating, additionalClass = '') {
    const maxRating = 5;
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('star-rating-review', additionalClass);

    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        ratingContainer.appendChild(star);
    }

    if (halfStar) {
        const halfStar = document.createElement('i');
        halfStar.classList.add('fas', 'fa-star-half-alt');
        ratingContainer.appendChild(halfStar);
    }

    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('i');
        star.classList.add('far', 'fa-star');
        ratingContainer.appendChild(star);
    }

    return ratingContainer;
}


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('reviewId');
    const username = localStorage.getItem('username');

    const reviewsContainer = document.getElementById('reviews');
    const titleContainer = document.getElementById('pageTitle')
    const movieContainer = document.createElement('div');


    try {
        // Requests
        const response = await fetch(`/api/reviewById/?id=${encodeURIComponent(id)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const reviewsData = await response.json();
        const movieResponse = await fetch(`/api/movie/id?imdbID=${encodeURIComponent(reviewsData[0].imdbid)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const movieData = await movieResponse.json();

        // Title
        const reviewTitle = document.createElement('p');
        reviewTitle.textContent = reviewsData[0].title + ' (' + reviewsData[0].year + ')';
        reviewTitle.classList.add('uppercase-text', 'movie-title');

        const hr = document.createElement('hr');

        titleContainer.appendChild(reviewTitle);
        titleContainer.appendChild(hr);

        // SpecialRating
        const movieGenre = `${reviewsData[0].genre}`;
        const specialRatingMap = new Map([
            ['Horror', 'Nivel de Medo'],
            ['Comedy', 'Nivel de Diversão'],
            ['Action', 'Nivel de Adrenalina'],
            ['Romance', 'Nivel de Amor'],
            ['Drama', 'Nivel de Drama'],
        ]);
        const getSpecialRating = (genre) => {
            const genreArray = genre.split(',');
            const firstGenre = genreArray[0];
            return specialRatingMap.get(firstGenre.trim());
        }
        const movieGenreMapped = getSpecialRating(movieGenre);

        // Body
        const posterContainer = document.createElement('div');
        posterContainer.id = 'poster-centralize';

        const movieLink = document.createElement('a');
        movieLink.href = '/getMovieByTitle';

        const posterImg = document.createElement('img');
        posterImg.src = movieData.body.movieData.Poster;
        posterImg.alt = movieData.body.movieData.Title;
        posterImg.classList.add('movie-poster');

        movieLink.addEventListener('click', function () {
            localStorage.setItem('movieTitle', movieData.body.movieData.Title);
            localStorage.setItem('movieimbdId', movieData.body.movieData.imdbID);
        });

        posterContainer.appendChild(posterImg)
        movieLink.appendChild(posterContainer);
        movieContainer.appendChild(movieLink);
        reviewsContainer.appendChild(movieContainer);

        const ratingCell = document.createElement('p');
        ratingCell.textContent = `Nota: `;
        ratingCell.classList.add('movie-title');

        if(reviewsData[0].review){
            const commentCell = document.createElement('span');
            commentCell.textContent = `${reviewsData[0].review}`;
            commentCell.classList.add('span-text', 'span-text-border');
            reviewsContainer.appendChild(commentCell);
        }
       
        reviewsContainer.appendChild(ratingCell);
        reviewsContainer.appendChild(generateStarRating(reviewsData[0].rating, 'movie-title'));
        const br = document.createElement('br');
        reviewsContainer.appendChild(br);

        if (reviewsData[0].specialrating !== null) {
            const specialRatingCell = document.createElement('p');
            specialRatingCell.textContent = `${movieGenreMapped}:`;
            specialRatingCell.classList.add('movie-title');
            reviewsContainer.appendChild(specialRatingCell);
            reviewsContainer.appendChild(generateStarRating(reviewsData[0].specialrating, 'movie-title'));
            reviewsContainer.appendChild(br);
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('text-center');

        if (username == reviewsData[0].username) {

            const editButton = document.createElement('a');
            editButton.innerHTML = `<i class="fas fa-pencil-alt" style="color: #000000; font-size: 30px;"></i>`;
            editButton.classList.add('edit-button');
            editButton.href = '/updateReview';
            editButton.addEventListener('click', () => {
                localStorage.setItem('reviewId', reviewsData[0].id);
                localStorage.setItem('rating', reviewsData[0].rating);
                localStorage.setItem('review', reviewsData[0].review);
                localStorage.setItem('specialRating', reviewsData[0].specialrating);
            });

            const deleteButton = document.createElement('a');
            deleteButton.innerHTML = '<i class="fas fa-trash" style="color: #000000; font-size: 30px;"></i> ';
            deleteButton.classList.add('delete-button');
            deleteButton.href = '/getAllReviews'
            deleteButton.addEventListener('click', () => {
                const confirmDelete = confirm('Tem certeza que deseja excluir a review?');
                if (confirmDelete) {
                    const response = fetch(`/api/review/?id=${encodeURIComponent(reviewsData[0].id)}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            });

            const profileButton = document.createElement('a');
            profileButton.innerHTML = `<i class="fa-solid fa-user" style="color: #000000; font-size: 30px;"></i>`;
            profileButton.href = '/profile'


            const shareButton = document.createElement('a');
            shareButton.innerHTML = `<i class="fa-solid fa-share" style="color: #000000; font-size: 30px;"></i>`;
            shareButton.addEventListener('click', function(){
                html2canvas(reviewsContainer).then(function(canvas) {
                    let link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'screenshot.png';
                    link.click();
                });
            });


            buttonsContainer.appendChild(editButton);
            buttonsContainer.insertAdjacentHTML('beforeend', '&emsp;');
            buttonsContainer.appendChild(deleteButton);
            buttonsContainer.insertAdjacentHTML('beforeend', '<br>');
            buttonsContainer.insertAdjacentHTML('beforeend', '<br>');
            buttonsContainer.appendChild(profileButton);
            buttonsContainer.insertAdjacentHTML('beforeend', '&emsp;');
            buttonsContainer.appendChild(shareButton);
            reviewsContainer.appendChild(buttonsContainer);
        }

        if (username != reviewsData[0].username) {
            // FORM COMENTARIO
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment-section');

            const form = document.createElement('form');


            const comentarioLabel = document.createElement('label');
            comentarioLabel.classList.add('comment-label')
            const comentarioInput = document.createElement('input');
            comentarioInput.classList.add('comment-input');
            comentarioInput.placeholder = 'Adorei a sua review!';
            comentarioInput.type = 'text';
            comentarioInput.name = 'comment';
            comentarioLabel.appendChild(comentarioInput);

            form.appendChild(comentarioLabel);

            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const reviewId = localStorage.getItem('reviewId');
                const comment = comentarioInput.value;
                const token = localStorage.getItem('token');

                try {
                    const response = await fetch('/api/comment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            reviewId: reviewId,
                            comment: comment
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        window.location.href = '/getAllReviewsComments';
                    } else {
                        const data = await response.json();
                        alert(`Erro: ${data.message}`);
                    }
                } catch (error) {
                    console.error(error);
                    alert('Um erro aconteceu ao criar o comentário');
                }
            });

            const commentButton = document.createElement('button');
            commentButton.id = 'get-review-id';
            commentButton.textContent = 'Comentar';
            commentButton.classList.add('comment-button');
            commentButton.addEventListener('click', function (event) {
                form.dispatchEvent(new Event('submit'));
            });

            commentDiv.appendChild(form);
            commentDiv.appendChild(commentButton);
            reviewsContainer.appendChild(commentDiv)




        }
    } catch (error) {
        console.error('Erro ao buscar revisões:', error);
    }
});
