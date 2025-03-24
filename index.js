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
            snap: 0.5
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
    { threshold: 0.9 }
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
  const video = document.createElement("video");

  video.src = "./assets/videos/output.mp4";
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.preload = "auto";
  video.playsInline = true;
  video.style.objectFit = "cover";

  video.addEventListener("loadedmetadata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const duration = video.duration;

    gsap.to(video, {
      currentTime: duration + 1,
      ease: "none",
      scrollTrigger: {
        trigger: canvas,
        scrub: true,
        start: "top top",
        marker: true,
        end: () => `+=${window.innerHeight * 6}`,
      },
      onUpdate: render,
    });

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    if (video.requestVideoFrameCallback) {
      video.requestVideoFrameCallback(renderFrame);
    }
  });
});
