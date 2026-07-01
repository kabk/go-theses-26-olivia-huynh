const viewer = document.querySelector(".viewer");
const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");

const arrowR = document.querySelector(".arrow-r");
const arrowL = document.querySelector(".arrow-l");
const textBtn = document.querySelector(".text-btn");

const progressBar = document.querySelector(".progress-bar");
const progressCount = document.querySelector(".progress-count");
const progressRadius = 44;
const progressCircumference = 2 * Math.PI * progressRadius;

const liveDateTimes = document.querySelectorAll(".liveDateTime");


let currentSlide = 0;
let panelOpen = false;

function refreshFades() {
    document.querySelectorAll(".text-panel-inner").forEach(inner => {
        inner.dispatchEvent(new Event("scroll"));
    });

    document.querySelectorAll(".text-panel-settings").forEach(settings => {
        settings.dispatchEvent(new Event("scroll"));
    });
}

function updateSlide(animatePanel = false) {
    if (!animatePanel) {
        viewer.classList.add("no-panel-transition");
    } else {
        viewer.classList.remove("no-panel-transition");
    }

    const slideWidth = window.innerWidth;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    const activeSlide = slides[currentSlide];

    if (activeSlide.classList.contains("chapter")) {
        panelOpen = false;
    }

    slides.forEach(slide => {
        slide.classList.remove("panel-open");
    });

    activeSlide.classList.toggle("panel-open", panelOpen);
    viewer.classList.toggle("panel-open", panelOpen);

    textBtn.textContent = panelOpen ? "−" : "+";

    viewer.classList.toggle("cover-slide", activeSlide.classList.contains("cover"));
    viewer.classList.toggle("chapter-slide", activeSlide.classList.contains("chapter"));
    viewer.classList.toggle("subcover-slide", activeSlide.classList.contains("subcover"));
    viewer.classList.toggle("dark-ui", activeSlide.classList.contains("dark"));
    viewer.classList.toggle("last-slide", currentSlide === slides.length - 1);

    updateSlideProgress();

    requestAnimationFrame(() => {
        viewer.classList.remove("no-panel-transition");
        refreshFades();
    });

    viewer.classList.toggle(
        "last-slide",
        currentSlide === slides.length - 1
    );
}

arrowR.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide(false);
    }
});

arrowL.addEventListener("click", () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide(false);
    }
});

textBtn.addEventListener("click", () => {
    panelOpen = !panelOpen;
    updateSlide(true);

    setTimeout(refreshFades, 500);
});

window.addEventListener("resize", () => {
    updateSlide(false);
    refreshFades();
});

updateSlide(false);

/* text panel inner fades */

const innerPanels = document.querySelectorAll(".text-panel-inner");

innerPanels.forEach(inner => {
    const textPanel = inner.closest(".text-panel");

    function updateInnerFade() {
        const hasOverflow = inner.scrollHeight > inner.clientHeight + 1;
        const atTop = inner.scrollTop <= 1;
        const atBottom =
            inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;

        textPanel.classList.toggle("has-inner-overflow", hasOverflow);
        textPanel.classList.toggle("inner-at-top", atTop);
        textPanel.classList.toggle("inner-at-bottom", atBottom);
    }

    inner.addEventListener("scroll", updateInnerFade);
    window.addEventListener("resize", updateInnerFade);

    updateInnerFade();
});

/* text panel settings fades */

const settingsPanels = document.querySelectorAll(".text-panel-settings");

settingsPanels.forEach(settings => {
    const textPanel = settings.closest(".text-panel");

    function updateSettingsFade() {
        const hasOverflow = settings.scrollHeight > settings.clientHeight + 1;
        const atTop = settings.scrollTop <= 1;
        const atBottom =
            settings.scrollTop + settings.clientHeight >= settings.scrollHeight - 1;

        textPanel.classList.toggle("has-settings-overflow", hasOverflow);
        textPanel.classList.toggle("settings-at-top", atTop);
        textPanel.classList.toggle("settings-at-bottom", atBottom);
    }

    settings.addEventListener("scroll", updateSettingsFade);
    window.addEventListener("resize", updateSettingsFade);

    updateSettingsFade();
});

/* mutually exclusive text/settings expand */

document.querySelectorAll(".text-panel").forEach(panel => {
    const arrowT = panel.querySelector(".arrow-t");
    const arrowTS = panel.querySelector(".arrow-ts");

    if (arrowT) {
        arrowT.addEventListener("click", () => {
            const isInnerOpen = panel.classList.contains("inner-expanded");

            panel.classList.remove("settings-expanded");
            panel.classList.toggle("inner-expanded", !isInnerOpen);

            setTimeout(refreshFades, 500);
        });
    }

    if (arrowTS) {
        arrowTS.addEventListener("click", () => {
            const isSettingsOpen = panel.classList.contains("settings-expanded");

            panel.classList.remove("inner-expanded");
            panel.classList.toggle("settings-expanded", !isSettingsOpen);

            setTimeout(refreshFades, 500);
        });
    }
});

/* ref + source toggle */

document.querySelectorAll(".ref-settings").forEach(settings => {
    const imgToggle = settings.querySelector(".toggle-img-ref");
    const sourceToggle = settings.querySelector(".toggle-source-desc");

    if (imgToggle) {
        imgToggle.addEventListener("click", () => {
            settings.classList.toggle("show-img-ref");
            imgToggle.textContent = settings.classList.contains("show-img-ref") ? "−" : "+";

            setTimeout(refreshFades, 500);
        });
    }

    if (sourceToggle) {
        sourceToggle.addEventListener("click", () => {
            settings.classList.toggle("show-source-desc");

            setTimeout(refreshFades, 500);
        });
    }
});

// percentage scroll

function updateSlideProgress() {
    if (!progressBar || !progressCount) return;

    const totalSlides = slides.length;
    const currentNumber = currentSlide + 1;
    const progress = currentNumber / totalSlides;

    progressBar.style.strokeDasharray = progressCircumference;
    progressBar.style.strokeDashoffset =
        progressCircumference * (1 - progress);

    progressCount.textContent = `${currentNumber}`;
}

// live date time [reflects viewer’s local device time]

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



/* hash navigation */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetName = link.getAttribute("href").substring(1);

    const targetSlide = document.querySelector(
      `.slide[data-slide="${targetName}"]`
    );

    if (!targetSlide) return;

    currentSlide = [...slides].indexOf(targetSlide);

    updateSlide(false);

    history.replaceState(null, "", "#" + targetName);
  });
});