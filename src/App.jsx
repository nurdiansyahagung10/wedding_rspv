import { useState, useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Daftarkan ScrollTrigger ke GSAP
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. KOMPONEN BUNGA HERO (RESPONSIF)
// ==========================================
// Komponen Bunga Kuning Craspedia (Fixed Size / Tidak Terpengaruh Responsif)
function InteractiveFlower({
  stemHeight = 460,
  stemCurve = 14,
  headSize = 22,
  delay = 0,
  className = "",
}) {
  const flowerRef = useRef(null);

  useLayoutEffect(() => {
    const anim = gsap.to(flowerRef.current, {
      rotation: `+=${(Math.random() * 3 + 2.5) * (Math.random() > 0.5 ? 1 : -1)}`,
      duration: 3.5 + Math.random() * 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: delay,
    });

    return () => anim.kill();
  }, [delay]);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hitX = e.clientX - (rect.left + rect.width / 2);
    const force = hitX > 0 ? -14 : 14;

    gsap.to(flowerRef.current, {
      rotation: force,
      duration: 0.3,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(flowerRef.current, {
          rotation: 0,
          duration: 1.8,
          ease: "elastic.out(1.2, 0.3)",
        });
      },
    });
  };

  const pathD = `M 35 ${stemHeight} Q ${35 + stemCurve} ${stemHeight * 0.55} 35 ${headSize}`;

  return (
    <div
      ref={flowerRef}
      onMouseEnter={handleMouseEnter}
      style={{ transformOrigin: "bottom center" }}
      className={`relative cursor-pointer pointer-events-auto select-none will-change-transform ${className}`}
    >
      <svg
        width="70"
        height={stemHeight}
        viewBox={`0 0 70 ${stemHeight}`}
        className="overflow-visible"
      >
        <path
          d={pathD}
          fill="none"
          stroke="#44573b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g transform={`translate(35, ${headSize})`}>
          <circle
            r={headSize}
            fill="#F6B819"
            filter="drop-shadow(0 5px 8px rgba(0,0,0,0.2))"
          />
          <circle r={headSize * 0.85} fill="#F9C629" />
          <circle r={headSize * 0.45} fill="#FDE047" opacity="0.85" />
          <circle
            cx={-headSize * 0.3}
            cy={-headSize * 0.3}
            r={headSize * 0.25}
            fill="#FEF08A"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN BUNGA COUNTDOWN (MEKAR RESPONSIF)
// ==========================================
function BloomingWhiteFlower({ className = "", shouldBloom = false }) {
  const flowerWrapperRef = useRef(null);
  const petalsRef = useRef([]);
  const centerRef = useRef(null);
  const stemRef = useRef(null);

  useLayoutEffect(() => {
    const petals = petalsRef.current.filter(Boolean);

    gsap.set(petals, { scale: 0, transformOrigin: "bottom center" });
    gsap.set(centerRef.current, { scale: 0, transformOrigin: "center center" });

    if (stemRef.current) {
      const length = stemRef.current.getTotalLength?.() || 260;
      gsap.set(stemRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });
    }

    if (!shouldBloom) return;

    const bloomTl = gsap.timeline();

    bloomTl
      .to(stemRef.current, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.out",
      })
      .to(
        centerRef.current,
        {
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
        },
        "-=0.4",
      )
      .to(
        petals,
        {
          scale: 1,
          duration: 1.2,
          stagger: {
            each: 0.05,
            from: "random",
          },
          ease: "elastic.out(1.2, 0.4)",
        },
        "-=0.3",
      );

    const sway = gsap.to(flowerWrapperRef.current, {
      rotation: 4,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2,
    });

    return () => {
      bloomTl.kill();
      sway.kill();
    };
  }, [shouldBloom]);

  const petalAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div
      ref={flowerWrapperRef}
      style={{ transformOrigin: "bottom center" }}
      className={`relative select-none pointer-events-none will-change-transform ${className}`}
    >
      <svg
        viewBox="0 0 220 320"
        className="overflow-visible w-full h-auto max-w-[120px] sm:max-w-[180px] md:max-w-[220px]"
      >
        <defs>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.25" />
          </filter>
          <linearGradient id="petal-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="25%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
        </defs>

        <path
          ref={stemRef}
          d="M 115 310 Q 145 200 110 110"
          fill="none"
          stroke="#425737"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <g transform="translate(110, 110)">
          {petalAngles.map((angle, i) => (
            <g
              key={i}
              ref={(el) => (petalsRef.current[i] = el)}
              transform={`rotate(${angle})`}
            >
              <path
                d="M 0 0 C -14 -25 -20 -60 -6 -76 C 0 -82 6 -82 12 -76 C 24 -60 16 -25 0 0 Z"
                fill="url(#petal-grad)"
                stroke="#cbd5e1"
                strokeWidth="0.6"
                filter="url(#soft-shadow)"
                opacity="0.96"
              />
              <line
                x1="0"
                y1="-8"
                x2="0"
                y2="-68"
                stroke="#cbd5e1"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity="0.7"
              />
            </g>
          ))}

          <g ref={centerRef}>
            <circle r="18" fill="url(#center-grad)" />
            {[...Array(14)].map((_, idx) => {
              const rot = idx * (360 / 14);
              return (
                <circle
                  key={idx}
                  cx={Math.cos((rot * Math.PI) / 180) * 11}
                  cy={Math.sin((rot * Math.PI) / 180) * 11}
                  r="2.2"
                  fill="#78350f"
                />
              );
            })}
            <circle r="6" fill="#b45309" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// 3. MAIN COMPONENT (APP)
// ==========================================
function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStoryTab, setActiveStoryTab] = useState(0);
  const [isCountFinished, setIsCountFinished] = useState(false);

  // Musik State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // Salin Rekening State
  const [copiedAccount, setCopiedAccount] = useState(null);

  // Album Swipe Gallery State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    guestGroup: "ksp_general",
    attendance: "attending",
    guests: "1",
    mealPreference: "",
    wishes: "",
  });
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Daftar Doa Tamu
  const [wishesList, setWishesList] = useState([
    {
      id: 1,
      name: "Keluarga Besar KSP PDL",
      guestGroup: "ksp_general",
      status: "Hadir",
      timeAgo: "1 jam yang lalu",
      message:
        "Selamat melangkah ke jenjang pernikahan Christy & Gideon! Doa terbaik dari kami segenap keluarga besar KSP, kiranya bahagia dan rukun senantiasa.",
    },
    {
      id: 2,
      name: "Arthur & Helena",
      guestGroup: "friends_level2",
      status: "Hadir",
      timeAgo: "3 jam yang lalu",
      message:
        "Gas tipis-tipis di lantai 2 nanti malam! Can't wait to toast with both of you guys. Congrats Christy & Gideon!",
    },
    {
      id: 3,
      name: "Keluarga Besar Sitorus",
      guestGroup: "ksp_general",
      status: "Hadir",
      timeAgo: "6 jam yang lalu",
      message:
        "Selamat berbahagia anak kami berdua. Kiranya penyertaan Tuhan senantiasa melimpahi perjalanan rumah tangga baru kalian.",
    },
  ]);

  // Image Lightbox State
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  // REFS
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef(null);
  const rsvpRef = useRef(null);

  // Floating Dock Ref
  const floatingDockRef = useRef(null);

  const backgroundRef = useRef(null);
  const overlayRef = useRef(null);

  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const flowersClusterLeftRef = useRef(null);
  const flowersClusterRightRef = useRef(null);

  const lineRef = useRef(null);
  const eventInfoRef = useRef(null);
  const venueImageRef = useRef(null);
  const venueTextRef = useRef(null);
  const dateRef = useRef(null);

  const storySectionRef = useRef(null);
  const storyContainerRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const galleryTrackRef = useRef(null);
  const timelessStorySectionRef = useRef(null);

  // Schedule & Kartu
  const scheduleSectionRef = useRef(null);
  const cardLeftRef = useRef(null);
  const cardCenterRef = useRef(null);
  const cardRightRef = useRef(null);

  // Countdown & Timeline
  const countdownSectionRef = useRef(null);
  const countNumberRef = useRef(null);
  const timelineSectionRef = useRef(null);

  // What to Wear: Sticky Header & Parallax Cards Refs
  const dresscodeSectionRef = useRef(null);
  const dresscodeStickyHeaderRef = useRef(null);
  const dresscodeCardLeftRef = useRef(null);
  const dresscodeCardCenterRef = useRef(null);
  const dresscodeCardRightRef = useRef(null);

  // Additional Sections
  const albumSectionRef = useRef(null);
  const rsvpSectionRef = useRef(null);
  const giftSectionRef = useRef(null);
  const wishesSectionRef = useRef(null);
  const galleryGridSectionRef = useRef(null);
  const locationSectionRef = useRef(null);
  const closingSectionRef = useRef(null);

  const storySentence =
    "We invite you to celebrate this precious chapter in our lives. Thank you for being part of our beautiful journey, sharing laughter, joy, and memories that will last a lifetime.";
  const storyWords = storySentence.split(" ");

  const galleryPhotos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const albumSlides = [
    {
      id: 1,
      title: "The Golden Hour Whispers",
      caption:
        "Momen hangat pertama saat kami mengikat janji saling mendampingi.",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
      location: "Bandung Pine Forest",
    },
    {
      id: 2,
      title: "Shared Smiles & Simple Joys",
      caption:
        "Tawa lepas di setiap obrolan santai yang selalu membuat kami ingin terus bersama.",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80",
      location: "Old Town Heritage",
    },
    {
      id: 3,
      title: "Embracing Every Season",
      caption:
        "Melewati setiap rintangan dengan rasa saling percaya dan menopang.",
      src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&auto=format&fit=crop&q=80",
      location: "The Botanical Glasshouse",
    },
    {
      id: 4,
      title: "Towards The Forever Path",
      caption: "Melangkah mantap menuju babak baru yang penuh pengharapan.",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&auto=format&fit=crop&q=80",
      location: "Cathedral Garden Terrace",
    },
  ];

  const storyMilestones = [
    {
      title: "The Day We Met",
      year: "2018",
      description:
        "Every beautiful love story has a beginning, and ours started with a chance encounter that neither of us expected. What began as a simple conversation soon turned into endless laughter, meaningful moments, and a connection that felt effortless.",
      thumbImg:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
      mainImg:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80",
    },
    {
      title: "The Proposal",
      year: "2023",
      description:
        "Underneath a quiet evening sky filled with stars, we promised to stand by each other through all seasons. A simple question turned into the easiest 'yes' we have ever whispered.",
      thumbImg:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80",
      mainImg:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1000&auto=format&fit=crop&q=80",
    },
    {
      title: "The Celebration",
      year: "2026",
      description:
        "Now, surrounded by those we love, we invite you to be part of our next chapter as we step into forever hand in hand, celebrating a lifetime of shared dreams.",
      thumbImg:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
      mainImg:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
    },
  ];

  const timelineSchedules = [
    {
      time: "04:00 PM",
      title: "Guest Arrival",
      description:
        "Enjoy a refreshing welcome drink, and settle in as the celebration begins.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
      align: "left",
    },
    {
      time: "04:30 PM",
      title: "Ceremony Begins",
      description:
        "We'll exchange our vows surrounded by loved ones, beginning our forever with love and heartfelt promises.",
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80",
      align: "right",
    },
    {
      time: "06:00 PM",
      title: "Cocktails & Photos",
      description:
        "Raise a glass, mingle, and capture beautiful memories together during the golden hour.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
      align: "left",
    },
    {
      time: "07:30 PM",
      title: "Dinner & Dancing",
      description:
        "Feast on an unforgettable dinner, followed by speeches, dancing, and heartfelt celebrations.",
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
      align: "right",
    },
  ];

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;

    if (rsvpForm.wishes.trim()) {
      const newWish = {
        id: Date.now(),
        name: rsvpForm.name,
        guestGroup: rsvpForm.guestGroup,
        status: rsvpForm.attendance === "attending" ? "Hadir" : "Berhalangan",
        timeAgo: "Baru saja",
        message: rsvpForm.wishes,
      };
      setWishesList((prev) => [newWish, ...prev]);
    }

    setIsRsvpSubmitted(true);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % albumSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlideIndex(
      (prev) => (prev - 1 + albumSlides.length) % albumSlides.length,
    );
  };

  const handleCopyAccount = (text, bankKey) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(bankKey);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => { });
    }
  };

  // Inisialisasi Lenis dengan Scroll Ekstra Halus & Tertahan
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state Hero
      gsap.set(navbarRef.current, { y: -30, opacity: 0 });
      gsap.set(backgroundRef.current, { scale: 1.1, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(badgeRef.current, { y: 30, opacity: 0 });
      gsap.set(titleRef.current, { y: 60, opacity: 0 });
      gsap.set(descriptionRef.current, { y: 40, opacity: 0 });
      gsap.set(flowersClusterLeftRef.current, { y: 120, opacity: 0 });
      gsap.set(flowersClusterRightRef.current, { y: 120, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(eventInfoRef.current, { y: 50, opacity: 0 });

      // Floating dock disembunyikan di awal
      gsap.set(floatingDockRef.current, {
        y: 100,
        opacity: 0,
        pointerEvents: "none",
      });

      // Intro Timeline
      tl.to(backgroundRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: "power2.out",
      })
        .to(overlayRef.current, { opacity: 1, duration: 1 }, "-=1.1")
        .to(navbarRef.current, { y: 0, opacity: 1, duration: 0.7 }, "-=0.7")
        .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .to(
          titleRef.current,
          { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
          "-=0.45",
        )
        .to(
          descriptionRef.current,
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.55",
        )
        .to(
          flowersClusterLeftRef.current,
          { y: 0, opacity: 1, duration: 1.1 },
          "-=0.4",
        )
        .to(
          flowersClusterRightRef.current,
          { y: 0, opacity: 1, duration: 1.1 },
          "<",
        )
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
          "-=0.6",
        )
        .to(eventInfoRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");

      // Breathing background
      gsap.to(backgroundRef.current, {
        scale: 1.03,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Floating Dock Trigger
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "bottom 85%",
        onEnter: () => {
          gsap.to(floatingDockRef.current, {
            y: 0,
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.6,
            ease: "back.out(1.4)",
          });
        },
        onLeaveBack: () => {
          gsap.to(floatingDockRef.current, {
            y: 100,
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.in",
          });
        },
      });

      // Animasi Word-by-Word ScrollTrigger
      const words = storyContainerRef.current.querySelectorAll(".story-word");
      gsap.fromTo(
        words,
        { color: "#d6d3d1" },
        {
          color: "#0a0a0a",
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: storyContainerRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );

      // Scroll-driven Carousel
      const galleryCards =
        galleryTrackRef.current.querySelectorAll(".gallery-card");

      const updateCardScales = () => {
        const centerX = window.innerWidth / 2;
        galleryCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(centerX - cardCenter);
          const maxDist = window.innerWidth / 1.5;
          const ratio = Math.min(dist / maxDist, 1);

          const scale = 0.8 + ratio * 0.35;
          gsap.set(card, { scale: scale, transformOrigin: "center center" });
        });
      };

      gsap.fromTo(
        galleryTrackRef.current,
        { x: "5%" },
        {
          x: "-35%",
          ease: "none",
          scrollTrigger: {
            trigger: gallerySectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: updateCardScales,
          },
        },
      );

      updateCardScales();

      // =========================================================================
      // TRANSIASI THEME: HANYA MENGUBAH BACKGROUND BODY SAJA
      // =========================================================================
      const lightSectionsBeforeSchedule = [
        heroRef.current,
        storySectionRef.current,
        gallerySectionRef.current,
        timelessStorySectionRef.current,
      ].filter(Boolean);

      const darkTextTargets = [
        scheduleSectionRef.current,
        countdownSectionRef.current,
        timelineSectionRef.current,
        dresscodeSectionRef.current,
        albumSectionRef.current,
        giftSectionRef.current,
        wishesSectionRef.current,
        galleryGridSectionRef.current,
        locationSectionRef.current,
        rsvpSectionRef.current,
        closingSectionRef.current,
      ].filter(Boolean);

      const switchTheme = (isDark) => {
        const duration = 0.8;
        const ease = "power2.inOut";

        // HANYA UBAH BACKGROUND BODY
        gsap.to(document.body, {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          duration,
          ease,
        });

        // Section sebelum Schedule HANYA memudar/hilang tanpa diubah warna latar belakangnya
        gsap.to(lightSectionsBeforeSchedule, {
          opacity: isDark ? 0 : 1,
          duration: 0.6,
          ease,
          pointerEvents: isDark ? "none" : "auto",
        });

        // Warna teks umum untuk section gelap agar adaptif
        gsap.to(darkTextTargets, {
          color: isDark ? "#ffffff" : "#1c1917",
          duration,
          ease,
        });

        const scheduleHeadings =
          scheduleSectionRef.current.querySelectorAll(".schedule-heading");
        const scheduleBadges =
          scheduleSectionRef.current.querySelectorAll(".schedule-badge");

        gsap.to(scheduleHeadings, {
          color: isDark ? "#ffffff" : "#1c1917",
          duration,
          ease,
        });

        gsap.to(scheduleBadges, {
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#f5f5f4",
          borderColor: isDark ? "rgba(255, 255, 255, 0.25)" : "#d6d3d1",
          color: isDark ? "#f5f5f4" : "#1c1917",
          duration,
          ease,
        });
      };

      ScrollTrigger.create({
        trigger: scheduleSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => switchTheme(true),
        onLeaveBack: () => switchTheme(false),
      });

      // Animasi Kartu Ceremony & Reception
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          cardLeftRef.current,
          { xPercent: 95, scale: 0.94, opacity: 0.85 },
          {
            xPercent: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scheduleSectionRef.current,
              start: "top 70%",
              end: "top 20%",
              scrub: 1.2,
            },
          },
        );

        gsap.fromTo(
          cardRightRef.current,
          { xPercent: -95, scale: 0.94, opacity: 0.85 },
          {
            xPercent: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scheduleSectionRef.current,
              start: "top 70%",
              end: "top 20%",
              scrub: 1.2,
            },
          },
        );
      });

      // Animasi Counter 0 -> 120 Days
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 120,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: countdownSectionRef.current,
          start: "top 75%",
          once: true,
        },
        onUpdate: () => {
          if (countNumberRef.current) {
            countNumberRef.current.textContent = Math.floor(counterObj.val);
          }
        },
        onComplete: () => {
          if (countNumberRef.current) countNumberRef.current.textContent = 120;
          setIsCountFinished(true);
        },
      });

      // Animasi Garis Timeline
      const timelineItems =
        timelineSectionRef.current.querySelectorAll(".timeline-item");
      const timelineLineProgress = timelineSectionRef.current.querySelector(
        ".timeline-progress-line",
      );

      if (timelineLineProgress) {
        gsap.fromTo(
          timelineLineProgress,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger:
                timelineSectionRef.current.querySelector(".timeline-track"),
              start: "top 70%",
              end: "bottom 60%",
              scrub: 1,
            },
          },
        );
      }

      timelineItems.forEach((item) => {
        const content = item.querySelector(".timeline-content");
        const dot = item.querySelector(".timeline-dot");

        gsap.fromTo(
          [dot, content],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // What to Wear Animations
      if (dresscodeSectionRef.current) {
        gsap.fromTo(
          dresscodeStickyHeaderRef.current,
          { opacity: 1, y: 0, scale: 1 },
          {
            opacity: 0,
            y: -70,
            scale: 0.92,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: dresscodeSectionRef.current,
              start: "top 10%",
              end: "top -45%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          dresscodeCardLeftRef.current,
          { y: 160 },
          {
            y: -180,
            ease: "none",
            scrollTrigger: {
              trigger: dresscodeSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );

        gsap.fromTo(
          dresscodeCardCenterRef.current,
          { y: 220, scale: 0.96 },
          {
            y: -240,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: dresscodeSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          },
        );

        gsap.fromTo(
          dresscodeCardRightRef.current,
          { y: 320 },
          {
            y: -300,
            ease: "none",
            scrollTrigger: {
              trigger: dresscodeSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.8,
            },
          },
        );
      }

      // Mouse Parallax
      const handleMouseMove = (event) => {
        if (window.innerWidth < 768) return;
        const { innerWidth, innerHeight } = window;
        const x = (event.clientX / innerWidth - 0.5) * 2;
        const y = (event.clientY / innerHeight - 0.5) * 2;

        gsap.to(titleRef.current, {
          x: x * 20,
          y: y * 16,
          duration: 1.2,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(titleRef.current, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: "Our Story", href: "#story" },
    { label: "Schedule", href: "#schedule" },
    { label: "Album", href: "#album" },
    { label: "Dresscode", href: "#dresscode" },
    { label: "Location", href: "#location" },
    { label: "RSVP", href: "#rsvp" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto max-w-none 2xl:container bg-transparent relative"
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113038.mp3"
      />

      {/* ================= FLOATING DOCK BOTTOM (TOGGLE NAV + TOGGLE MUSIC) ================= */}
      <div
        ref={floatingDockRef}
        className="fixed bottom-6 inset-x-0 mx-auto w-max z-50 flex items-center gap-3 bg-black/70 hover:bg-black/90 text-white backdrop-blur-2xl border border-white/20 px-4 py-2.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300 will-change-transform"
      >
        <div className="flex items-center gap-1 sm:gap-2 pr-3 border-r border-white/20">
          <a
            href="#story"
            className="text-[11px] sm:text-xs text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Story
          </a>
          <a
            href="#schedule"
            className="text-[11px] sm:text-xs text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Date
          </a>
          <a
            href="#dresscode"
            className="text-[11px] sm:text-xs text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Wear
          </a>
          <a
            href="#rsvp"
            className="text-[11px] sm:text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors"
          >
            RSVP
          </a>
        </div>

        <button
          type="button"
          onClick={toggleMusic}
          aria-label="Toggle Background Music"
          className="flex items-center gap-2.5 active:scale-95 transition-transform cursor-pointer pl-1"
        >
          <div
            className={`w-7 h-7 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-700 ${isPlayingMusic ? "animate-spin" : ""
              }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="text-xs tracking-wider uppercase font-medium">
            {isPlayingMusic ? "Pause" : "Music"}
          </span>
          {isPlayingMusic && (
            <div className="flex items-end gap-0.5 h-3.5 pr-1">
              <span className="w-1 bg-white animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-1 bg-white animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2" />
              <span className="w-1 bg-white animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-3" />
            </div>
          )}
        </button>
      </div>

      {/* SVG Clip Path Cekung */}
      <svg className="w-0 h-0 absolute pointer-events-none">
        <defs>
          <clipPath id="concave-curve-mask" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 Q 0.5,0.13 1,0 L 1,1 Q 0.5,0.87 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ================= HERO SECTION ================= */}
      <main
        ref={heroRef}
        className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-between selection:bg-white/20 will-change-[opacity]"
      >
        <img
          ref={backgroundRef}
          src="/images/h.png"
          alt="Wedding Couple"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform z-0"
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/20 md:bg-black/10 pointer-events-none z-0"
        />

        {/* Navbar */}
        <header
          ref={navbarRef}
          className="relative z-50 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 sm:h-24 flex items-center justify-between text-white"
        >
          <a
            ref={logoRef}
            href="#"
            className="font-serif text-2xl sm:text-3xl tracking-tight drop-shadow-sm focus:outline-none"
          >
            C&G
          </a>

          <nav
            ref={navLinksRef}
            className="hidden md:flex items-center gap-7 text-sm lg:text-base font-normal tracking-wide"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 hover:text-white/80 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMusic}
              aria-label="Toggle Wedding Music in Header"
              className="flex items-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white text-black flex items-center justify-center ${isPlayingMusic ? "animate-spin" : ""
                  }`}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </button>

            <a
              ref={rsvpRef}
              href="#rsvp"
              className="hidden sm:inline-flex items-center justify-center bg-white text-black rounded-full px-6 py-2.5 sm:py-3 text-sm font-medium shadow-sm hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              I'm coming!
            </a>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Drawer */}
          <div
            className={`md:hidden fixed inset-x-4 top-24 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/20 p-6 flex flex-col gap-6 shadow-2xl transition-all duration-300 ease-out origin-top ${isMobileMenuOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <div className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif tracking-wide py-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#rsvp"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-white text-black rounded-full py-3.5 text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              I'm coming!
            </a>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative z-30 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-4 pb-28 md:pb-20 pointer-events-none text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start pointer-events-auto">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-xs sm:text-sm tracking-wide shadow-sm"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/80 flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.5 5 6.2 5c2.1 0 3.5 1.2 4.3 2.4C11.3 6.2 12.7 5 14.8 5c3.7 0 5.5 3.9 3.7 7.5C19 16.65 12 21 12 21z" />
                  </svg>
                </span>
                <span>A Celebration of Love</span>
              </div>

              <h1
                ref={titleRef}
                className="mt-6 sm:mt-8 font-serif text-[clamp(2.5rem,5.5vw,6.5rem)] leading-[0.95] tracking-tight will-change-transform drop-shadow-sm"
              >
                Christy & Gideon
                <br />
                One Beautiful
                <br />
                Forever
              </h1>
            </div>

            <div
              ref={descriptionRef}
              className="lg:col-span-5 xl:col-span-4 flex justify-start lg:justify-end lg:self-end pointer-events-auto"
            >
              <p className="max-w-sm lg:max-w-[260px] text-left lg:text-right text-sm sm:text-base leading-relaxed text-white/90 drop-shadow-sm">
                Join us as we celebrate the beginning of our forever with the
                people we love most.
              </p>
            </div>
          </div>
        </section>

        {/* Cluster Bunga Kiri (Fixed Size) */}
        <div
          ref={flowersClusterLeftRef}
          className="absolute z-20 -bottom-6 left-0 flex items-end -space-x-12 pointer-events-none origin-bottom-left"
        >
          <InteractiveFlower stemHeight={240} stemCurve={-14} headSize={20} delay={0.2} />
          <InteractiveFlower stemHeight={150} stemCurve={18} headSize={16} delay={0.4} className="opacity-90 -mb-2" />
          <InteractiveFlower stemHeight={190} stemCurve={12} headSize={24} delay={0.5} />
          <InteractiveFlower stemHeight={290} stemCurve={-8} headSize={23} delay={0.15} />
          <InteractiveFlower stemHeight={270} stemCurve={-6} headSize={26} delay={0} />
          <InteractiveFlower stemHeight={175} stemCurve={-16} headSize={18} delay={0.7} className="opacity-90 -mb-1" />
          <InteractiveFlower stemHeight={210} stemCurve={16} headSize={18} delay={0.8} />
          <InteractiveFlower stemHeight={310} stemCurve={10} headSize={25} delay={0.25} />
        </div>

        {/* Cluster Bunga Kanan (Fixed Size) */}
        <div
          ref={flowersClusterRightRef}
          className="absolute z-20 -bottom-6 right-0 flex items-end -space-x-12 pointer-events-none origin-bottom-right"
        >
          <InteractiveFlower stemHeight={220} stemCurve={14} headSize={23} delay={0.5} />
          <InteractiveFlower stemHeight={180} stemCurve={-12} headSize={22} delay={0.4} />
          <InteractiveFlower stemHeight={145} stemCurve={-18} headSize={17} delay={0.85} className="opacity-90 -mb-2" />
          <InteractiveFlower stemHeight={260} stemCurve={10} headSize={27} delay={0.1} />
          <InteractiveFlower stemHeight={300} stemCurve={-7} headSize={24} delay={0.35} />
          <InteractiveFlower stemHeight={200} stemCurve={-15} headSize={19} delay={0.7} />
          <InteractiveFlower stemHeight={250} stemCurve={8} headSize={24} delay={0.3} />
        </div>

        {/* Bottom Bar Info */}
        <div className="relative z-30 w-full mt-auto pointer-events-none text-white">
          <div
            ref={lineRef}
            className="w-full border-t border-white/30 sm:border-white/40"
          />

          <div
            ref={eventInfoRef}
            className="w-full max-w-7xl flex items-center justify-center mx-auto px-5 sm:px-8 lg:px-10 py-4 sm:py-6 pointer-events-auto"
          >
            <div className="flex flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6">
              <div
                ref={venueImageRef}
                className="hidden md:block w-24 sm:w-28 h-20 rounded-xl overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md shrink-0"
              >
                <img
                  src="https://framerusercontent.com/images/xX8UXXadRrQNNuW1hUm5WVy1yQ.gif?width=640&height=640"
                  alt="Venue"
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                ref={venueTextRef}
                className="hidden sm:flex h-20 items-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium leading-snug"
              >
                <p>
                  Gereja & Grand Ballroom,
                  <br />
                  Jakarta / Bandung
                </p>
              </div>

              <div
                ref={dateRef}
                className="flex items-center sm:border-s ps-3 gap-3 sm:gap-4 ml-auto sm:ml-0"
              >
                <span className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-none">
                  15
                </span>
                <div className="flex flex-col text-xs sm:text-sm leading-tight text-white/90">
                  <span className="font-medium">September</span>
                  <span className="text-white/75">2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transisi Smoke Blur Bawah Hero */}
        <div className="-bottom-1 left-0 right-0 h-20 sm:h-28 z-25 pointer-events-none bg-gradient-to-b from-white via-white to-white backdrop-blur-[2px] [mask-image:radial-gradient(ellipse_120%_100%_at_50%_100%,black_50%,transparent_100%)]" />
      </main>

      {/* ================= OUR STORY INTRO ================= */}
      <section
        id="story"
        ref={storySectionRef}
        className="relative z-30 w-full bg-transparent text-black pt-20 pb-12 flex flex-col justify-center will-change-[opacity]"
      >
        <div className="max-w-5xl mx-auto text-center space-y-10 sm:space-y-12 px-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-2 text-black bg-slate-100 px-5 sm:px-6 py-2 sm:py-4 rounded-3xl font-semibold">
            <img src="/images/Heart.svg" alt="" className="w-4 h-4 shrink-0" />
            <span>A Celebration of Love</span>
          </span>

          <h2
            ref={storyContainerRef}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug md:leading-relaxed lg:leading-[1.4] tracking-tight max-w-4xl mx-auto flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]"
          >
            {storyWords.map((word, index) => (
              <span
                key={index}
                className="story-word inline-block will-change-[color] transition-none"
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* ================= CURVED SCROLL-DRIVEN CAROUSEL ================= */}
      <section
        ref={gallerySectionRef}
        className="relative z-30 w-full bg-transparent overflow-hidden will-change-[opacity]"
      >
        <div
          className="w-full relative will-change-transform py-8"
          style={{ clipPath: "url(#concave-curve-mask)" }}
        >
          <div
            ref={galleryTrackRef}
            className="flex items-center gap-3 sm:gap-4 md:gap-5 w-max will-change-transform py-8 select-none"
          >
            {galleryPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedGalleryImg(photo.src)}
                className="gallery-card w-64 sm:w-80 md:w-96 aspect-[4/5] shrink-0 overflow-hidden bg-stone-100 will-change-transform shadow-md cursor-pointer hover:opacity-95"
              >
                <img
                  src={photo.src}
                  alt={`Gallery ${photo.id}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
            {galleryPhotos.map((photo) => (
              <div
                key={`repeat-${photo.id}`}
                onClick={() => setSelectedGalleryImg(photo.src)}
                className="gallery-card w-64 sm:w-80 md:w-96 aspect-[4/5] shrink-0 overflow-hidden bg-stone-100 will-change-transform shadow-md cursor-pointer hover:opacity-95"
              >
                <img
                  src={photo.src}
                  alt={`Repeat Gallery ${photo.id}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TIMELESS STORY SECTION ================= */}
      <section
        ref={timelessStorySectionRef}
        className="relative z-30 w-full bg-transparent text-black px-6 lg:px-12 will-change-[opacity]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20 pt-10">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black bg-slate-100 px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.5 5 6.2 5c2.1 0 3.5 1.2 4.3 2.4C11.3 6.2 12.7 5 14.8 5c3.7 0 5.5 3.9 3.7 7.5C19 16.65 12 21 12 21z" />
              </svg>
              <span>Our Story</span>
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-black">
              Two Hearts, One <br /> Timeless Story
            </h2>
          </div>

          <div className="grid grid-cols-3  mb-14 text-center">
            {storyMilestones.map((tab, idx) => {
              const isActive = activeStoryTab === idx;
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveStoryTab(idx)}
                  className={`pb-4 text-lg sm:text-2xl lg:text-3xl font-serif transition-colors relative cursor-pointer ${isActive
                    ? "text-black font-medium"
                    : "text-stone-400 hover:text-stone-600"
                    }`}
                >
                  {tab.title}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {storyMilestones[activeStoryTab].description}
              </p>

              <div className="flex items-end justify-between pt-4">
                <div className="w-24 sm:w-28 aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={storyMilestones[activeStoryTab].thumbImg}
                    alt={storyMilestones[activeStoryTab].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-right">
                  <h4 className="font-serif text-xl sm:text-2xl text-black leading-tight">
                    {storyMilestones[activeStoryTab].title}
                  </h4>
                  <span className="font-serif text-6xl sm:text-7xl lg:text-8xl text-black tracking-tighter leading-none">
                    {storyMilestones[activeStoryTab].year}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] bg-black rounded-3xl sm:rounded-[2rem] overflow-hidden flex items-center justify-center shadow-2xl">
                <div className="absolute inset-x-0 h-9 sm:h-10 bg-[#E5B824] z-10 flex items-center overflow-hidden pointer-events-none select-none">
                  <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_12s_linear_infinite] font-semibold text-black text-xs sm:text-sm tracking-wider uppercase">
                    {[...Array(6)].map((_, i) => (
                      <span key={i} className="flex items-center gap-3">
                        <span>{storyMilestones[activeStoryTab].title}</span>
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.5 5 6.2 5c2.1 0 3.5 1.2 4.3 2.4C11.3 6.2 12.7 5 14.8 5c3.7 0 5.5 3.9 3.7 7.5C19 16.65 12 21 12 21z" />
                        </svg>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-20 w-[46%] sm:w-[42%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-black/40">
                  <img
                    src={storyMilestones[activeStoryTab].mainImg}
                    alt={storyMilestones[activeStoryTab].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE DATE IS SET / COME CELEBRATE ================= */}
      <section
        id="schedule"
        ref={scheduleSectionRef}
        className="relative z-30 w-full bg-transparent px-5 sm:px-8 lg:px-12 pb-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 pt-16">
            <span className="schedule-badge inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black! bg-white! px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium will-change-[background-color,color,border-color]">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.5 5 6.2 5c2.1 0 3.5 1.2 4.3 2.4C11.3 6.2 12.7 5 14.8 5c3.7 0 5.5 3.9 3.7 7.5C19 16.65 12 21 12 21z" />
              </svg>
              <span>The Date Is Set</span>
            </span>
            <h2 className="schedule-heading font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-black will-change-[color]">
              Come Celebrate
              <br /> With Us
            </h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Kartu Kiri: Ceremony */}
            <div
              ref={cardLeftRef}
              className="lg:col-span-3 relative z-10 bg-[#f2f4f8] rounded-[2rem] p-7 sm:p-9 flex flex-col justify-between min-h-[460px] text-black shadow-xl will-change-transform"
            >
              <div className="space-y-4">
                <span className="font-serif text-7xl sm:text-8xl leading-none block">
                  15
                </span>
                <div className="text-sm font-medium text-stone-700 leading-tight">
                  <p>September 2026</p>
                  <p>3:00 PM</p>
                </div>
                <div className="mt-4 inline-block w-full bg-[#e5e9f0]/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-black leading-snug">
                  Gereja Katedral,
                  <br />
                  Ruang Holy Matrimony
                </div>
              </div>

              <div>
                <div className="w-[1.5px] h-20 bg-black mb-6" />
                <h3 className="font-serif text-3xl sm:text-4xl text-black">
                  Ceremony
                </h3>
              </div>
            </div>

            {/* Kartu Tengah: Dinner & Dancing */}
            <div
              ref={cardCenterRef}
              className="lg:col-span-6 relative z-20 rounded-[2rem] overflow-hidden min-h-[500px] lg:min-h-[560px] flex flex-col justify-between p-7 sm:p-10 text-white shadow-2xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80"
                alt="Celebration"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <h3 className="font-serif text-4xl sm:text-5xl tracking-wide">
                  C&G
                </h3>
                <div className="w-[2px] h-24 bg-white/70" />
              </div>

              <div className="relative z-10 space-y-4 max-w-lg">
                <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug">
                  Dinner, Dancing & A Celebration to Remember
                </h4>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                  As the stars light up the night, we'll gather to share a
                  wonderful meal, dance with those we love, and create memories
                  that will last a lifetime.
                </p>
              </div>
            </div>

            {/* Kartu Kanan: Reception */}
            <div
              ref={cardRightRef}
              className="lg:col-span-3 relative z-10 bg-[#f2f4f8] rounded-[2rem] p-7 sm:p-9 flex flex-col justify-between min-h-[460px] text-black shadow-xl will-change-transform"
            >
              <div className="space-y-6">
                <p className="text-base sm:text-lg font-medium text-black">
                  7:00 PM
                </p>
                <div className="inline-block w-full bg-[#e5e9f0]/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-black leading-snug">
                  Grand Ballroom Hotel,
                  <br />
                  Hall Aster Floor 3
                </div>
              </div>

              <div>
                <div className="w-[1.5px] h-28 bg-black mb-6" />
                <h3 className="font-serif text-3xl sm:text-4xl text-black">
                  Reception
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COUNTDOWN SECTION (BUNGA MEKAR RESPONSIF) ================= */}
      <section
        id="countdown"
        ref={countdownSectionRef}
        className="relative z-30 w-full  flex flex-col items-center justify-center pb-24 px-4 sm:px-6 overflow-hidden bg-transparent select-none"
      >
        <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-4 rounded-full bg-white backdrop-blur-md shadow-md mb-6 sm:mb-10">
          <svg
            className="w-4 h-4 text-black"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs text-black sm:text-sm font-medium tracking-wide">
            Counting Down To “I Do”
          </span>
        </div>

        <div className="relative flex items-center justify-center leading-none">
          <span
            ref={countNumberRef}
            className="font-serif text-[clamp(4.5rem,15vw,14rem)] tracking-tight tabular-nums min-w-[2.2ch] text-right"
          >
            0
          </span>

          <div className="relative z-10 w-[clamp(4rem,14vw,14rem)] -mx-3 sm:-mx-8 md:-mx-12 translate-y-6 sm:translate-y-12">
            <BloomingWhiteFlower
              shouldBloom={isCountFinished}
              className="w-full h-auto"
            />
          </div>

          <span className="font-serif text-[clamp(4.5rem,15vw,14rem)] tracking-tight">
            Days
          </span>
        </div>
      </section>

      {/* ================= SCHEDULE OF THE DAY (ANIMATED TIMELINE) ================= */}
      <section
        id="timeline"
        ref={timelineSectionRef}
        className="relative z-30 w-full min-h-screen bg-transparent  px-6 lg:px-12 overflow-hidden select-none"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-4 rounded-full bg-white backdrop-blur-md shadow-md mb-6 sm:mb-10">
              <svg
                className="w-4 h-4 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs sm:text-sm text-black font-semibold tracking-wide">
                Schedule
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-5">
              Schedule of the Day
            </h2>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-normal">
              A thoughtfully planned celebration filled with love, emotions,
              laughter, and unforgettable moments.
            </p>
          </div>

          <div className="timeline-track relative">
            <div className="absolute left-4 md:left-1/2 top-3 bottom-8 w-[1.5px] bg-stone-700 -translate-x-1/2 pointer-events-none" />
            <div className="timeline-progress-line absolute left-4 md:left-1/2 top-3 bottom-8 w-[1.5px] bg-gradient-to-b from-white via-white to-white/70 -translate-x-1/2 pointer-events-none origin-top" />

            <div className="space-y-16 sm:space-y-24">
 {timelineSchedules.map((item, idx) => {
                const isLeft = item.align === "left";

                return (
                  <div
                    key={idx}
                    className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="timeline-dot absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 md:top-auto z-20 flex items-center justify-center">
                      <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-white border border-black shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                      </div>
                    </div>

                    <div
                      className={`timeline-content w-full md:w-1/2 pl-14 md:pl-0 ${
                        isLeft
                          ? "md:pr-16 md:text-right flex flex-col md:items-end"
                          : "md:pl-16 md:text-left flex flex-col md:items-start"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold tracking-wider text-stone-300 mb-2 block">
                        {item.time}
                      </span>

                      <h3 className="font-serif text-3xl sm:text-4xl text-white mb-3 tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-5">
                        {item.description}
                      </p>

                      <div className="w-32 sm:w-36 aspect-square rounded-2xl overflow-hidden shadow-xl border border-white/15">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT TO WEAR (STICKY FADE-OUT & DRAMATIC PARALLAX - 3 ITEMS) ================= */}
      <section
        id="dresscode"
        ref={dresscodeSectionRef}
        className="relative z-30 w-full  bg-transparent mt-20 px-6 lg:px-16 overflow-visible select-none"
      >
        {/* Layer 0 / Belakang: Sticky Header teks yang memudar saat kartu melintas di depannya */}
        <div
          ref={dresscodeStickyHeaderRef}
          className="sticky top-12 sm:top-20 z-0 text-center max-w-2xl mx-auto flex flex-col items-center pointer-events-none will-change-[opacity,transform]"
        >
        <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-4 rounded-full bg-white backdrop-blur-md shadow-md mb-6 sm:mb-10">
            <svg
              className="w-4 h-4 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs text-black sm:text-sm font-medium tracking-wide">
              Wear
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-tight mb-6">
            What to Wear
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light">
            We can't wait to celebrate with you, and we'd love for everyone to
            feel comfortable while embracing the elegance of our special day.
            Our dress code is designed to create a timeless and beautifully
            coordinated atmosphere.
          </p>
        </div>

        {/* Layer Depan: 3 Kartu Paralaks (Kiri, Kanan, Tengah Horizontal) */}
        <div className="max-w-7xl mx-auto relative z-20 pt-16 sm:pt-28  pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-8 items-start">
            {/* 1. Kartu Kiri (Wanita) */}
            <div
              ref={dresscodeCardLeftRef}
              className="md:col-span-6 lg:col-span-5 flex flex-col items-start will-change-transform z-20"
            >
              <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-stone-900 border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1000&auto=format&fit=crop&q=80"
                  alt="Women Dresscode Inspiration"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <p className="mt-6 text-stone-300 text-xs sm:text-sm leading-relaxed max-w-md font-light">
                Elegant dresses, flowing gowns, or chic midi styles are perfect
                for the occasion. We kindly ask guests to avoid wearing white or
                ivory.
              </p>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* 2. Kartu Kanan (Pria) */}
            <div
              ref={dresscodeCardRightRef}
              className="md:col-span-6 lg:col-span-6 flex flex-col items-start md:pt-40 lg:pt-52 will-change-transform z-30"
            >
              <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-stone-900 border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80"
                  alt="Men Suit Inspiration"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <p className="mt-6 text-stone-300 text-xs sm:text-sm leading-relaxed max-w-md font-light">
                Classic tailored suits, blazers paired with crisp trousers, or
                refined modern silhouettes. Earthy neutrals, dark navy, or
                charcoal tones are warmly welcomed.
              </p>
            </div>

            {/* 3. Kartu Horizontal di Tengah Melintang */}
            <div
              ref={dresscodeCardCenterRef}
              className="col-span-1 md:col-span-12 lg:col-span-10 lg:col-start-2 mt-8 md:mt-20 flex flex-col items-center will-change-transform z-40"
            >
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] bg-stone-900 border border-white/20 relative group">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80"
                  alt="Couple Color Coordination"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/90 font-medium">
                      Couple Harmony
                    </span>
                    <h3 className="font-serif text-xl sm:text-3xl text-white">
                      Harmonious Elegance & Tone
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                      Sinergi perpaduan warna tanah lembut dan nuansa formal
                      menciptakan suasana pesta yang hangat dan berkesan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#8c7d70] border border-white/30" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#d6c39f] border border-white/30" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#748373] border border-white/30" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0a0a0a] border border-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALBUM FOTO GESER (SWIPE SLIDER) ================= */}
      <section
        id="album"
        ref={albumSectionRef}
        className="relative z-30 w-full bg-transparent pb-24  px-6 lg:px-12 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black bg-white px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium">
                Memory Album
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                Moments & Memories
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-sm tracking-widest text-stone-400">
                0{currentSlideIndex + 1} / 0{albumSlides.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-12 h-12 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-12 h-12 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden bg-stone-900 border border-white/10 aspect-[4/3] sm:aspect-[16/9] shadow-2xl">
            <img
              src={albumSlides[currentSlideIndex].src}
              alt={albumSlides[currentSlideIndex].title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs uppercase tracking-[0.25em] text-white/90 font-medium">
                  {albumSlides[currentSlideIndex].location}
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-white leading-snug">
                  {albumSlides[currentSlideIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {albumSlides[currentSlideIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {albumSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlideIndex === idx
                      ? "w-8 bg-white"
                      : "w-2 bg-white/30"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SELIPAN FOTO 2 ================= */}
      <div className="w-full h-64 sm:h-96 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&auto=format&fit=crop&q=80"
          alt="Emotional moment insert"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* ================= GALERI FOTO KEBERSAMAAN (GRID) ================= */}
      <section
        id="moments"
        ref={galleryGridSectionRef}
        className="relative z-30 w-full bg-transparent py-24 sm:py-32 px-6 lg:px-12 overflow-hidden select-none"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black bg-white px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium">
              Gallery Moments
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight leading-tight mb-4">
              Our Journey in Frames
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Kumpulan potret tawa dan memori berharga yang kami rajut bersama
              sepanjang perjalanan cinta ini.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
            ].map((src, i) => (
              <div
                key={i}
                onClick={() => setSelectedGalleryImg(src)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] bg-stone-900 border border-white/10 cursor-pointer shadow-lg hover:shadow-2xl transition-all"
              >
                <img
                  src={src}
                  alt={`Moment ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedGalleryImg}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* ================= MAP & PANDUAN LOKASI RUANGAN ================= */}
      <section
        id="location"
        ref={locationSectionRef}
        className="relative z-30 w-full bg-transparent  px-6 lg:px-12 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black bg-white px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium">
              Venue & Map
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight leading-tight mb-4">
              Location & Direction
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Panduan navigasi rute dan pemisahan area venue untuk kenyamanan
              Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-stretch">
            <div className="lg:col-span-5 bg-white/[0.04] border border-white/15 rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/90 font-semibold block mb-1">
                    Area 1 • Tenda Utama
                  </span>
                  <h3 className="font-serif text-2xl">
                    Nasional Umum & Rekan KSP
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Halaman Tenda Utama (Pemberkatan & Resepsi Umum). Seluruh
                    hidangan disajikan dalam stand Halal.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest text-white/90 font-semibold block mb-1">
                    Area 2 • Lantai 2 Lounge
                  </span>
                  <h3 className="font-serif text-2xl">
                    Sahabat & Teman Pengantin
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    Friend's Lounge Lantai 2 (After-Party & Music). Tersedia
                    area stand menu Non-Halal khusus untuk sahabat berdua.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block mb-1">
                    Parkir & Akses
                  </span>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Tersedia fasilitas Valet Parking gratis di Lobi Utama dan
                    Basement B1–B2.
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-white text-black rounded-2xl py-4 text-sm font-semibold hover:bg-stone-200 transition-all shadow-lg active:scale-98"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Buka Rute di Google Maps</span>
              </a>
            </div>

            <div className="lg:col-span-7 h-96 lg:h-auto min-h-[380px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
              <iframe
                title="Wedding Venue Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28507850853!2d106.759478!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49fe3ddb3%3A0x7d021c3b1e3e7f41!2sJakarta!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid"
                className="w-full h-full border-0 grayscale contrast-125 invert opacity-85"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TANDA KASIH / DIGITAL ENVELOPE ================= */}
      <section
        id="gifts"
        ref={giftSectionRef}
        className="relative z-30 w-full bg-transparent py-24 sm:py-32 px-6 lg:px-12 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-stone-300 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full font-medium">
              Wedding Gift
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight leading-tight mb-4">
              Tanda Kasih
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda
              bermaksud memberikan tanda kasih, kami menyediakan amplop digital
              & pengiriman kado:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="rounded-3xl bg-white/[0.05] border border-white/15 p-7 sm:p-8 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="font-serif text-2xl font-bold tracking-widest text-white">
                  MANDIRI
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  a.n Christy Audy V.
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-stone-500">Nomor Rekening</span>
                <p className="font-mono text-2xl sm:text-3xl text-white tracking-wider font-semibold">
                  1370 0192 8472 1
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAccount("1370019284721", "mandiri")}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedAccount === "mandiri"
                  ? "✓ Berhasil Disalin"
                  : "Salin No. Rekening"}
              </button>
            </div>

            <div className="rounded-3xl bg-white/[0.05] border border-white/15 p-7 sm:p-8 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="font-serif text-2xl font-bold tracking-widest text-white">
                  BCA
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  a.n Gideon Mula Gabe S.
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-stone-500">Nomor Rekening</span>
                <p className="font-mono text-2xl sm:text-3xl text-white tracking-wider font-semibold">
                  5410 8829 102
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAccount("54108829102", "bca")}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedAccount === "bca"
                  ? "✓ Berhasil Disalin"
                  : "Salin No. Rekening"}
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 text-center max-w-xl mx-auto backdrop-blur-sm">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-medium block mb-2">
              Kirim Kado Fisik
            </span>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Kediaman Mempelai: Jl. Cemara Asri Indah No. 12B, Jakarta Selatan,
              12560 (Konfirmasi via WhatsApp Pengantin).
            </p>
          </div>
        </div>
      </section>

      {/* ================= RSVP FORM (WIDE 2-COLUMN DENGAN 2 KELOMPOK VENUE) ================= */}
      <section
        id="rsvp"
        ref={rsvpSectionRef}
        className="relative z-30 w-full min-h-screen bg-transparent  px-6 sm:px-10 lg:px-16 overflow-hidden select-none"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2.5 px-5 w-max sm:px-6 py-2 sm:py-4 rounded-full bg-white backdrop-blur-md shadow-md mb-6 sm:mb-10">
              <svg
                className="w-4 h-4 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs text-black sm:text-sm font-semibold tracking-wider uppercase">
                RSVP
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              Will You Be There?
            </h2>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-light">
              Mohon konfirmasi kehadiran sebelum 20 Agustus 2026 demi kenyamanan
              pengaturan meja dan pemisahan area venue.
            </p>

            {isRsvpSubmitted ? (
              <div className="py-10 space-y-4 text-left border-t border-white/20">
                <h3 className="font-serif text-3xl">
                  Terima kasih, {rsvpForm.name || "Sahabat"}!
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-md">
                  Konfirmasi kehadiran Anda telah tercatat pada kelompok:{" "}
                  <strong className="text-white">
                    {rsvpForm.guestGroup === "friends_level2"
                      ? "Lantai 2 (Friend's Lounge & Non-Halal Area)"
                      : "Tenda Utama (Nasional Umum / KSP)"}
                  </strong>
                  . Doa Anda juga telah kami tampilkan di dinding ucapan.
                </p>
                <button
                  type="button"
                  onClick={() => setIsRsvpSubmitted(false)}
                  className="mt-4 text-xs uppercase tracking-widest text-stone-400 hover:text-white underline cursor-pointer"
                >
                  Ubah Konfirmasi / Kirim Doa Lagi
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRsvpSubmit}
                className="space-y-6 sm:space-y-7"
              >
                {/* Pilihan 2 Kelompok Tamu */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-stone-400 font-medium block">
                    Kategori Undangan / Area Venue
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRsvpForm({ ...rsvpForm, guestGroup: "ksp_general" })
                      }
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${rsvpForm.guestGroup === "ksp_general"
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.03] text-stone-300 border-white/10 hover:border-white/30"
                        }`}
                    >
                      <span className="block font-semibold text-xs sm:text-sm">
                        Nasional Umum / KSP
                      </span>
                      <span className="block text-[11px] opacity-75 mt-0.5">
                        Area Tenda Utama (Halal Station)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRsvpForm({
                          ...rsvpForm,
                          guestGroup: "friends_level2",
                        })
                      }
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${rsvpForm.guestGroup === "friends_level2"
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.03] text-stone-300 border-white/10 hover:border-white/30"
                        }`}
                    >
                      <span className="block font-semibold text-xs sm:text-sm">
                        Teman Pengantin
                      </span>
                      <span className="block text-[11px] opacity-75 mt-0.5">
                        Area Lantai 2 (Non-Halal Stall)
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={rsvpForm.name}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white placeholder:text-stone-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Alamat Email"
                      value={rsvpForm.email}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white placeholder:text-stone-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <select
                      value={rsvpForm.attendance}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, attendance: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white outline-none transition-colors cursor-pointer"
                    >
                      <option value="attending" className="bg-stone-900 text-white">
                        Pasti Hadir
                      </option>
                      <option value="declined" className="bg-stone-900 text-white">
                        Maaf, Berhalangan
                      </option>
                    </select>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Jumlah Orang"
                      value={rsvpForm.guests}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, guests: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white placeholder:text-stone-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Preferensi Hidangan / Catatan Khusus"
                    value={rsvpForm.mealPreference}
                    onChange={(e) =>
                      setRsvpForm({
                        ...rsvpForm,
                        mealPreference: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white placeholder:text-stone-400 outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Tuliskan ucapan dan doa restu untuk Christy & Gideon..."
                    value={rsvpForm.wishes}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, wishes: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/30 focus:border-white py-2 text-sm text-white placeholder:text-stone-400 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-[#5984ab] hover:bg-[#6c97be] active:scale-[0.98] text-white text-sm sm:text-base font-medium transition-all shadow-md cursor-pointer"
                  >
                    Kirim Konfirmasi RSVP
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-6 w-full h-[450px] sm:h-[550px] lg:h-[620px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80"
              alt="Celebration Guests"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ================= UNTAIAN DOA TAMU UNDANGAN ================= */}
      <section
        id="wishes"
        ref={wishesSectionRef}
        className="relative z-30 w-full bg-transparent py-24 sm:py-32 px-6 lg:px-12 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-4 text-black bg-white px-5 sm:px-6 py-2 sm:py-4 rounded-full font-medium">
              Wishes & Blessings
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl tracking-tight leading-tight mb-4">
              Untaian Doa Tamu Undangan
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Pembaruan langsung dari ucapan dan doa tulus para sahabat serta
              keluarga terkasih.
            </p>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
            {wishesList.map((wish) => (
              <div
                key={wish.id}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-all space-y-3 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-serif text-sm font-semibold text-white">
                      {wish.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">
                        {wish.name}
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        {wish.timeAgo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300">
                      {wish.guestGroup === "friends_level2"
                        ? "Lantai 2"
                        : "Tenda KSP"}
                    </span>
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-medium ${wish.status === "Hadir"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-stone-700/30 text-stone-400 border border-stone-600/30"
                        }`}
                    >
                      {wish.status}
                    </span>
                  </div>
                </div>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light pl-12">
                  “{wish.message}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION PENUTUP ================= */}
      <section
        ref={closingSectionRef}
        className="relative z-30 w-full  bg-transparent  px-6 lg:px-12 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="w-12 h-12 mx-auto rounded-full border border-white/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-light">
            Atas kehadiran, doa restu, dan kasih yang tulus dari
            Bapak/Ibu/Saudara/i sekalian, kami sekeluarga besar menghaturkan
            limpah terima kasih yang sebesar-besarnya.
          </p>

          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white/90 leading-snug">
            “Kiranya Tuhan memberkati dan melindungi kita senantiasa.”
          </p>

          <div className="space-y-2 pt-6">
            <h3 className="font-serif text-3xl sm:text-4xl tracking-wide">
              Christy & Gideon
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 tracking-wider">
              Beserta Keluarga Besar Sitorus & Valentine / Manurung
            </p>
          </div>

          <div className="pt-16 border-t border-white/10 text-stone-500 text-[11px] sm:text-xs tracking-widest uppercase">
            Digital Wedding Invitation • Christy Audy Valentine & Gideon Mula
            Gabe Sitorus © 2026
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;