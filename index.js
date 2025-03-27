document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const videos = document.querySelectorAll(".video-elem");
  const qrSection = document.querySelector(".qr-section");

  const playedVideos = new Set();

  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableScroll() {
    document.body.style.overflowY = "auto";
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting && !playedVideos.has(video)) {
          ScrollTrigger.create({
            trigger: video,
            snap: 0.5,
          });

          video.play();
          playedVideos.add(video);
          if (video.id === "absolute_power") {
            video.addEventListener("ended", () => {
              qrSection.style.opacity = 1;
            });
          }
        }
      });
    },
    { threshold: 0.7 }
  );

  videos.forEach((video, vIndex) => {
    if (vIndex !== 0) {
      observer.observe(video);

      if (window.matchMedia("(min-width: 1025px)")) {
        video.addEventListener("play", disableScroll);
        video.addEventListener("pause", enableScroll);
        video.addEventListener("ended", enableScroll);
      }
    }
  });

  const FAQHeading = document.querySelector(".FAQ-heading");

  if (FAQHeading) {
    FAQHeading.addEventListener("click", function () {
      let img = this.querySelector(".FAQ-heading-icon img");
      if (img) img.classList.toggle("opened");

      let FAQDetails = document.getElementById("FAQ-details");
      if (FAQDetails) {
        if (FAQDetails.classList.contains("FAQ-details")) {
          FAQDetails.classList.remove("FAQ-details");
          FAQDetails.classList.add("FAQ-details-active");
        } else {
          FAQDetails.classList.remove("FAQ-details-active");
          FAQDetails.classList.add("FAQ-details");
        }
      }
    });
  }

  const canvas = document.getElementById("video-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const frameCount = 263;
  const currentFrame = (index) =>
    `./assets/images/frame_${(index + 1).toString().padStart(4, "0")}.png`;

  const images = [];
  const cardsForAnimation = {
    frame: 0,
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  gsap.to(cardsForAnimation, {
    frame: frameCount - 1,
    ease: "none",
    snap: "frame",
    scrollTrigger: {
      trigger: canvas,
      start: "top top",
      end: () => `+=${window.innerHeight * 7}`,
      scrub: true,
    },
    onUpdate: render
  });

  images[0].onload = render;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[cardsForAnimation.frame];

    // Ensure the image is loaded before rendering
    if (!img.complete) return;

    // Calculate aspect ratios
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas, scale by height and crop width
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2; // Center horizontally
      offsetY = 0;
    } else {
      // Image is taller than canvas, scale by width and crop height
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2; // Center vertically
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }
});
