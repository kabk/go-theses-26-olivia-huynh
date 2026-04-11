


// we make sure the JavaScript file loads after our HTML by using a function test if the HTML is loaded

//function docReady(fn) {
// see if DOM is already available
//if (document.readyState === "complete" || document.readyState === "interactive") {
// call on next available tick
//setTimeout(fn, 1);
//} else {
//document.addEventListener("DOMContentLoaded", fn);
//}
//}   

//docReady(function() {

// functions
// go
// here

//});




// PROGRESS BAR
const screen = document.getElementById("screen");
const progressBar = document.getElementById("progressBar");
const topBar = document.querySelector(".top-bar");
const bottomBar = document.querySelector(".bottom-bar");


// SIDE PANE
const infoButton = document.getElementById('toggleBtn-text');

infoButton.addEventListener('click', () => {
  screen.classList.toggle('split');
});


// ARROW NAVIGATION
const slides = document.querySelectorAll('.picture_container');
const prevBtn = document.getElementById('toggleBtn-arrowleft');
const nextBtn = document.getElementById('toggleBtn-arrowright');
const progressText = document.querySelector(".progress-percentage");
const backBtns = document.querySelectorAll('.back-btn');

let chapterTimeout = null;

let currentIndex = 0;

// CHAPTER TYPE ANIMATION
let chapterTyped = false;

function typeText(element, text, speed = 70) {
  element.textContent = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}
//

// [CHAPTER PANEL SETTINGS]
function updateSpecialState() {
  const activeSlide = slides[currentIndex];

  if (activeSlide.classList.contains('special')) {
    topBar.classList.add('state-dark');
    bottomBar.classList.add('state-dark');
  } else {
    topBar.classList.remove('state-dark');
    bottomBar.classList.remove('state-dark');
  }

  // hide all back buttons first
  backBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  if (
    activeSlide.classList.contains('chapter') ||
    activeSlide.classList.contains('cover')
  ) {


    const backBtn = activeSlide.querySelector('.back-btn');
    if (backBtn) {
      backBtn.classList.add('active');
    }

    const chapterName = activeSlide.querySelector('.chapter-name');

    if (chapterName && !chapterTyped) {
      const finalText = chapterName.dataset.fullText || chapterName.textContent.trim();

      chapterName.dataset.fullText = finalText;
      chapterName.textContent = "";
      chapterName.style.opacity = "0";
      chapterTyped = true;

      chapterTimeout = setTimeout(() => {
        chapterName.style.opacity = "1";
        typeText(chapterName, finalText, 70);
      }, 500);
    }

  } else {
    chapterTyped = false;

    if (chapterTimeout) {
      clearTimeout(chapterTimeout);
      chapterTimeout = null;
    }

    document.querySelectorAll('.chapter-name').forEach(chapterName => {
      const finalText = chapterName.dataset.fullText || chapterName.textContent.trim();
      chapterName.dataset.fullText = finalText;
      chapterName.textContent = finalText;
      chapterName.style.opacity = "0";
    });
  }
}
//

// 'CLICK HANDLERS FOR ALL BACK BUTTONS'
backBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });
});
//

// [PROGRESS BAR PERCENTAGE]
function updateProgressBar() {
  const maxScroll = screen.scrollWidth - screen.clientWidth;
  const progress = maxScroll > 0 ? (screen.scrollLeft / maxScroll) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  // update text (rounded or exact)
  progressText.textContent = `${Math.round(progress)}%`;
}
//

// [CLOSE MOODBOARD UPON ENTERING NEXT SCREEN]
function closeAllMoodboards() {
  document.querySelectorAll('.moodboard_container.active').forEach(moodboard => {
    moodboard.classList.remove('active');
  });

  document.querySelectorAll('.toggle-btn-moodboard.active').forEach(btn => {
    btn.classList.remove('active');
  });
}
//

// BACK BUTTON + ARROW AUTOMATICALLY STAY DOWN ON CHaPTER PAGES
function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));

  closeAllMoodboards();

  const activeSlide = slides[currentIndex];

  // auto-close side panel on chapter screens
  if (activeSlide.classList.contains('chapter')) {
    screen.classList.remove('split');
  }

  screen.scrollTo({
    left: activeSlide.offsetLeft,
    behavior: 'auto'
  });

  updateButtons();
  updateSpecialState();
  updateProgressBar();
}
//

function updateButtons() {
  const activeSlide = slides[currentIndex];

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;

  // ONLY hide on .end slide
  nextBtn.style.visibility = activeSlide.classList.contains('end')
    ? 'hidden'
    : 'visible';
}

function updateCurrentIndexFromScroll() {
  currentIndex = Math.round(screen.scrollLeft / screen.clientWidth);
  updateButtons();
  updateSpecialState();
}

nextBtn.addEventListener('click', () => {
  goToSlide(currentIndex + 1);
});

prevBtn.addEventListener('click', () => {
  goToSlide(currentIndex - 1);
});

screen.addEventListener("scroll", () => {
  updateProgressBar();
  updateCurrentIndexFromScroll();
});

window.addEventListener("resize", () => {
  updateProgressBar();
  updateCurrentIndexFromScroll();
});

updateProgressBar();
updateButtons();
updateSpecialState();



// MOODBOARD BUTTON
document.querySelectorAll('.toggle-btn-moodboard').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('.picture_container');
    const moodboard = container.querySelector('.moodboard_container');

    moodboard.classList.toggle('active');
    btn.classList.toggle('active');
  });
});


// LIVE DATE + TIME STAMP [reflects viewer’s local device time]
const liveDateTimes = document.querySelectorAll(".liveDateTime");

function updateLiveDateTime() {
  const now = new Date();

  const day = now.getDate();
  const month = now.toLocaleDateString('en-GB', { month: 'short' });
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const text = `Imagine・${day} ${month} ${year}・${hours}:${minutes}`;

  liveDateTimes.forEach(el => {
    el.textContent = text;
  });
}

updateLiveDateTime();
setInterval(updateLiveDateTime, 1000);


// IMAGE PROMPT DOTS
document.querySelectorAll('.img-prompt-dots').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('.img-prompt-source').parentElement;
    const details = container.querySelector('.img-prompt-details');

    details.classList.toggle('active');
  });
});


// FIGURE IMAGE REVEAL
document.querySelectorAll('.see-photos-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.parentElement;
    const images = container.querySelectorAll('.fig-image');

    images.forEach(img => {
      img.classList.toggle('active');
    });

    btn.classList.toggle('active');
  });
});


// IMAGE PROMPT EXPANDER
document.querySelectorAll('.img-prompt-expander').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('.img-prompt');
    const picture = container.querySelector('.img-prompt-picture');

    picture.classList.toggle('active');
    btn.classList.toggle('active');
  });
});

// FIGURE EXPANDER
document.querySelectorAll('.fig-expand').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('.footfig');
    const image = container.nextElementSibling;

    image.classList.toggle('active');
    btn.classList.toggle('active');
  });
});


// INTRO_CONTAINER FADE
document.querySelectorAll('.intro_container').forEach((el) => {
  function updateFade() {
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    el.classList.toggle('fade', hasOverflow && !atBottom);
  }

  el.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);
  updateFade();
});


