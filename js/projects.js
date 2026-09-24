/* ==========================================================================
   PROJECTS
   One entry per project. The work grid and the bottom sheet are both built
   from this array, so adding a project means adding one object here.

   Fields
     id        unique, URL-safe (used for the card and aria ids)
     title     shown as-is in both languages
     mark      1-2 characters for the monogram tile in the loading state
     year      string, e.g. "2023"
     type      { en, id } short category label
     summary   { en, id } one line on the card
     description, role, outcome   { en, id } shown in the sheet
     stack     array of tool names (not translated)
     image     { src, srcset, width, height, alt: { en, id }, fit, bg }
                 fit: "cover" (default) crops to fill; "contain" letterboxes
                 bg:  background colour behind a "contain" image
     links     array of { type, url }
                 type: "live" | "prototype" | "demo" | "github"
                 Labels come from translations.js (sheet.links.*).
                 Add { type: "github", url: "…" } to show a GitHub button.

   Grid layout: cards alternate wide/narrow (7/5, then 5/7 columns) in the
   order listed. With an odd count, the last card spans the full row.
   ========================================================================== */

window.PROJECTS = [
  {
    id: "belajaritma",
    title: "Belajaritma",
    mark: "B",
    year: "2023",
    type: { en: "Web application", id: "Aplikasi web" },
    summary: {
      en: "A Laravel learning platform for programming basics, built for my thesis.",
      id: "Platform belajar pemrograman dasar berbasis Laravel, dibangun untuk skripsi saya.",
    },
    description: {
      en: "Belajaritma helps beginners learn programming fundamentals. Learners study from video and PDF lessons, work through assignments and a final test, take paid certifications in specific fields, and talk problems through in a community forum.",
      id: "Belajaritma membantu pemula mempelajari dasar-dasar pemrograman. Pengguna belajar lewat materi video dan PDF, mengerjakan tugas dan tes akhir, mengambil sertifikasi berbayar untuk bidang tertentu, serta berdiskusi di forum komunitas.",
    },
    role: {
      en: "Developer. I built the Laravel application as part of my thesis research.",
      id: "Pengembang. Saya membangun aplikasi Laravel ini sebagai bagian dari penelitian skripsi.",
    },
    outcome: {
      en: "Completed as my undergraduate thesis at BINUS University in 2024.",
      id: "Diselesaikan sebagai skripsi S1 saya di BINUS University pada 2024.",
    },
    stack: ["Laravel", "PHP", "Blade", "Tailwind CSS"],
    image: {
      src: "assets/img/work/belajaritma-1200.webp",
      srcset: "assets/img/work/belajaritma-560.webp 560w, assets/img/work/belajaritma-720.webp 720w, assets/img/work/belajaritma-1200.webp 1200w",
      width: 1200,
      height: 675,
      alt: {
        en: "Belajaritma login page next to the Laravel Blade code behind it",
        id: "Halaman login Belajaritma di samping kode Laravel Blade di baliknya",
      },
    },
    links: [{ type: "demo", url: "https://drive.google.com/file/d/1KySWJPVnks8cIC2wJU8dArjV4sJ12WSY/view" }],
  },

  {
    id: "garmob",
    title: "GarMob",
    mark: "G",
    year: "2022",
    type: { en: "Figma prototype", id: "Prototipe Figma" },
    summary: {
      en: "A mobile app concept that helps people garden with the right tools.",
      id: "Konsep aplikasi mobile yang membantu orang berkebun dengan alat yang tepat.",
    },
    description: {
      en: "GarMob (Gardening Mobile) recommends the tools, materials, and planting media each plant needs, so people choose the right setup from the start and make it all the way to harvest.",
      id: "GarMob (Gardening Mobile) merekomendasikan alat, bahan, dan media tanam yang dibutuhkan setiap tanaman, agar pengguna memilih perlengkapan yang tepat sejak awal dan berhasil sampai panen.",
    },
    role: {
      en: "UI/UX design and prototyping in Figma.",
      id: "Desain UI/UX dan pembuatan prototipe di Figma.",
    },
    outcome: {
      en: "A clickable Figma prototype of the app.",
      id: "Prototipe Figma yang bisa langsung dicoba.",
    },
    stack: ["Figma"],
    image: {
      src: "assets/img/work/garmob-360.webp",
      srcset: "",
      width: 360,
      height: 362,
      fit: "contain",
      bg: "#7c7f7c",
      alt: {
        en: "GarMob logo: two green leaves above the line “The One True Gardening Solution”",
        id: "Logo GarMob: dua daun hijau di atas tulisan “The One True Gardening Solution”",
      },
    },
    links: [
      {
        type: "prototype",
        url: "https://www.figma.com/proto/s5yxkwmtyEQhi0pEe1dJr7/Prototype-GarMob?node-id=1-4&scaling=scale-down&page-id=0%3A1&starting-point-node-id=1%3A4",
      },
    ],
  },

  {
    id: "cs-course",
    title: "CS Course",
    mark: "CS",
    year: "2021",
    type: { en: "Figma prototype", id: "Prototipe Figma" },
    summary: {
      en: "Design for a free computer science course platform with a learner forum.",
      id: "Desain platform kursus ilmu komputer gratis, lengkap dengan forum.",
    },
    description: {
      en: "CS Course offers free online courses covering what you need to know about computer science. Each course comes with an e-book, video lessons, and exercises, and a forum lets learners share what they know about specific topics.",
      id: "CS Course menyediakan kursus online gratis tentang hal-hal penting dalam ilmu komputer. Setiap kursus dilengkapi e-book, video pembelajaran, dan latihan, serta forum tempat pengguna berbagi pengetahuan tentang topik tertentu.",
    },
    role: {
      en: "UI/UX design: user flows, screens, and the clickable prototype in Figma.",
      id: "Desain UI/UX: alur pengguna, tampilan layar, dan prototipe interaktif di Figma.",
    },
    outcome: {
      en: "Final project for the Human-Computer Interaction course at BINUS University.",
      id: "Proyek akhir mata kuliah Interaksi Manusia dan Komputer di BINUS University.",
    },
    stack: ["Figma"],
    image: {
      src: "assets/img/work/cs-course-1200.webp",
      srcset: "assets/img/work/cs-course-560.webp 560w, assets/img/work/cs-course-720.webp 720w, assets/img/work/cs-course-1200.webp 1200w",
      width: 1200,
      height: 853,
      alt: {
        en: "CS Course home screen with a welcome message and recently visited courses",
        id: "Layar beranda CS Course dengan sapaan dan daftar kursus yang terakhir dibuka",
      },
    },
    links: [
      {
        type: "prototype",
        url: "https://www.figma.com/proto/AVE2TmdHXMwDo9JzcNJJAb/CS-Courses_Final-Project-HCI-(Finalized)?node-id=2-1475&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=2%3A1475",
      },
    ],
  },

  {
    id: "danbam",
    title: "Danbam",
    mark: "D",
    year: "2021",
    type: { en: "Website", id: "Situs web" },
    summary: {
      en: "A multi-page website for a fictional Korean restaurant.",
      id: "Situs web beberapa halaman untuk restoran Korea fiktif.",
    },
    description: {
      en: "Danbam is a restaurant site with four jobs: tell the story behind the place, show off the best dishes and drinks, point people to each location, and give them an easy way to ask questions.",
      id: "Danbam adalah situs restoran dengan empat tugas: menceritakan latar belakang restoran, menampilkan menu makanan dan minuman andalan, menunjukkan lokasi-lokasinya, dan memudahkan pengunjung untuk bertanya.",
    },
    role: {
      en: "Designed and built every page in HTML and CSS.",
      id: "Merancang dan membangun seluruh halaman dengan HTML dan CSS.",
    },
    outcome: {
      en: "Live and hosted on Cloudflare Pages.",
      id: "Sudah online dan di-hosting di Cloudflare Pages.",
    },
    stack: ["HTML", "CSS"],
    image: {
      src: "assets/img/work/danbam-1200.webp",
      srcset: "assets/img/work/danbam-560.webp 560w, assets/img/work/danbam-720.webp 720w, assets/img/work/danbam-1200.webp 1200w",
      width: 1200,
      height: 557,
      alt: {
        en: "Danbam home page with the restaurant's circular bibimbap logo and featured dishes",
        id: "Beranda Danbam dengan logo bibimbap melingkar dan menu andalan",
      },
    },
    links: [{ type: "live", url: "https://danbam.pages.dev/" }],
  },
];
