const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.getElementById('previous-slide-button');
const nextButton = document.getElementById('next-slide-button');
let currSlideIdx = 0;



function showSlide() {
	for (let i = 0; i < slides.length; i++) {
		if (i != currSlideIdx) {
			slides[i].style.display = 'none'
		}
		else {
			slides[i].style.display = 'flex';
		}
	}
}

nextButton.addEventListener(
	'click',
	() => {
		currSlideIdx = (currSlideIdx + 1) % slides.length;
		showSlide();
	}
);

prevButton.addEventListener(
	'click',
	() => {
		console.log("THIS: " + (currSlideIdx - 1) % slides.length);
		currSlideIdx = (currSlideIdx - 1 + slides.length) % slides.length;
		console.log(currSlideIdx);
		showSlide();
	}
)


showSlide() // Sets first slide to be visible