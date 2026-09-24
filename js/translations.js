/* ==========================================================================
   TRANSLATIONS
   Every piece of UI copy on the site lives here, in English (en) and
   Bahasa Indonesia (id). Elements point at a key with data attributes:

     <p data-i18n="hero.statement">…</p>              -> sets textContent
     <img data-i18n-attr="alt:hero.portraitAlt">       -> sets attributes
                                                         (several: "alt:a.b; title:c.d")

   Project copy (titles, descriptions, roles, outcomes) lives in
   js/projects.js, next to the rest of each project's data.

   Lines marked  // REVIEW  are Indonesian phrasings worth a second look
   from a native speaker before launch.
   ========================================================================== */

window.TRANSLATIONS = {
  en: {
    meta: {
      title: "Azzel Reyhanth Aristo · Back-end developer",
      description:
        "Back-end developer in Tangerang, Indonesia, working with Node.js, Laravel, and SQL, with a background in HCI and big data.",
      notFoundTitle: "Page not found · Azzel Reyhanth Aristo",
      notFoundDescription: "This page doesn't exist. Head back to Azzel Reyhanth Aristo's portfolio.",
    },

    a11y: {
      skip: "Skip to content",
      language: "Language",
      primaryNav: "Primary",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      close: "Close",
      dragToClose: "Drag down to close",
      emailCopied: "Email address copied to clipboard",
      newTab: "(opens in a new tab)",
    },

    nav: {
      work: "Work",
      about: "About",
      skills: "Skills",
      contact: "Contact",
      cv: "CV",
    },

    hero: {
      role: "Back-end developer",
      statement:
        "I build APIs and data systems that hold up in real use. My HCI background keeps the people using them in view.",
      ctaWork: "View work",
      ctaContact: "Contact",
      portraitAlt: "Portrait of Azzel Reyhanth Aristo in a dark suit and tie",
    },

    work: {
      title: 'Selected <span class="accent">work</span>',
      intro: "Four projects, from a Laravel learning platform to design prototypes. Open one for the full story.",
      details: "Details",
      noscript: "Turn on JavaScript to open project details. Direct links:",
    },

    sheet: {
      opening: "Opening {name}", // {name} is replaced with the project title
      overview: "Overview",
      role: "My role",
      stack: "Built with",
      outcome: "Outcome",
      links: {
        live: "Visit site",
        prototype: "Open prototype",
        demo: "Watch demo",
        github: "View on GitHub",
      },
    },

    about: {
      title: "About",
      lead:
        'I started out in multimedia and interface design, then moved into <span class="accent">back-end</span> work. I still think about the person at the other end of every API call.',
      p1:
        "At Flash Coffee I spent a year as a back-end intern: building Node.js APIs for the mobile app, reviewing server code for performance and security, and writing the documentation that went with it. I also spent a month on the front end.",
      p2:
        "I recently finished a master's in Information Systems, focused on big data, at BINUS University. Outside of code, I've helped run learning programs at the BINUS English Club and I'm learning Japanese at the Nippon Club.",
      timelineTitle: "Experience and education",
      languagesTitle: "Languages",
      languages: "Indonesian (native), English (fluent), Japanese (beginner)",
      timeline: [
        {
          period: "2024 - 2026",
          title: "Master of Information Systems, Big Data",
          org: "BINUS University Graduate Program",
          note: "GPA 3.95. Business intelligence, machine learning, and business analytics.",
        },
        {
          period: "2020 - 2024",
          title: "Bachelor of Computer Science, Multimedia",
          org: "BINUS University",
          note: "GPA 3.73. Human-computer interaction, user experience, and software engineering.",
        },
        {
          period: "2023 - 2024",
          title: "Back-end developer intern",
          org: "Flash Coffee",
          note: "Built and maintained Node.js APIs for the mobile app, plus a month on the front end.",
        },
        {
          period: "2021 - 2022",
          title: "Learning Management staff",
          org: "Bina Nusantara English Club",
          note: "Wrote materials, quizzes, and exams for the TOEFL class and tracked tutor progress.",
        },
        {
          period: "2021",
          title: "Part-time graphic designer",
          org: "ALGO.CORE",
          note: "Designed learning-material slides and Instagram posts, backed by weekly market research.",
        },
      ],
    },

    skills: {
      title: 'Skills and <span class="accent">tools</span>',
      intro: "Back-end work is the core. The rest helps me understand the product around it.",
      backend: "Back end",
      backendNote: "Where I spend most of my time: APIs, server logic, and the data behind them.",
      frontend: "Front end",
      data: "Data",
      design: "Design",
      also: "Also",
    },

    contact: {
      title: 'Have a role or a <span class="accent">project</span> in mind?',
      body: "Email is the quickest way to reach me. You can also find me on LinkedIn and GitHub.",
      copy: "Copy email",
      copied: "Copied",
      cv: "Download CV (PDF)",
      phone: "Phone",
    },

    footer: {
      top: "Back to top",
    },

    notFound: {
      title: "This page doesn't exist.",
      body: "The link may be broken, or the page may have moved.",
      home: "Back to home",
    },
  },

  id: {
    meta: {
      title: "Azzel Reyhanth Aristo · Pengembang back-end",
      description:
        "Pengembang back-end di Tangerang yang bekerja dengan Node.js, Laravel, dan SQL, dengan latar belakang HCI dan big data.",
      notFoundTitle: "Halaman tidak ditemukan · Azzel Reyhanth Aristo",
      notFoundDescription: "Halaman ini tidak ada. Kembali ke portofolio Azzel Reyhanth Aristo.",
    },

    a11y: {
      skip: "Langsung ke konten",
      language: "Bahasa",
      primaryNav: "Navigasi utama",
      menuOpen: "Buka menu",
      menuClose: "Tutup menu",
      close: "Tutup",
      dragToClose: "Tarik ke bawah untuk menutup",
      emailCopied: "Alamat email sudah disalin",
      newTab: "(terbuka di tab baru)",
    },

    nav: {
      work: "Karya",
      about: "Tentang",
      skills: "Keahlian",
      contact: "Kontak",
      cv: "CV",
    },

    hero: {
      role: "Pengembang back-end",
      statement:
        "Saya membangun API dan sistem data yang tetap andal saat dipakai sungguhan. Latar belakang HCI membuat saya selalu memikirkan orang yang menggunakannya.",
      ctaWork: "Lihat karya",
      ctaContact: "Kontak",
      portraitAlt: "Potret Azzel Reyhanth Aristo mengenakan jas gelap dan dasi",
    },

    work: {
      title: '<span class="accent">Karya</span> pilihan',
      intro:
        "Empat proyek, dari platform belajar berbasis Laravel hingga prototipe desain. Buka salah satunya untuk cerita lengkapnya.",
      details: "Detail",
      noscript: "Aktifkan JavaScript untuk membuka detail proyek. Tautan langsung:",
    },

    sheet: {
      opening: "Membuka {name}",
      overview: "Ringkasan",
      role: "Peran saya",
      stack: "Dibangun dengan",
      outcome: "Hasil",
      links: {
        live: "Kunjungi situs",
        prototype: "Buka prototipe",
        demo: "Tonton demo",
        github: "Lihat di GitHub",
      },
    },

    about: {
      title: "Tentang saya",
      lead:
        'Saya memulai dari multimedia dan desain antarmuka, lalu beralih ke <span class="accent">back-end</span>. Sampai sekarang, saya selalu memikirkan orang di ujung lain setiap panggilan API.', // REVIEW: "di ujung lain setiap panggilan API"
      p1:
        "Di Flash Coffee, saya menjalani magang back-end selama setahun: membangun API Node.js untuk aplikasi mobile, meninjau kode server dari sisi performa dan keamanan, serta menulis dokumentasinya. Saya juga sempat sebulan menangani front-end.",
      p2:
        "Saya baru saja menyelesaikan S2 Sistem Informasi dengan peminatan big data di BINUS University. Di luar kode, saya pernah ikut mengelola program belajar di BINUS English Club dan sedang belajar bahasa Jepang di Nippon Club.", // REVIEW: "peminatan big data"
      timelineTitle: "Pengalaman dan pendidikan",
      languagesTitle: "Bahasa",
      languages: "Indonesia (bahasa ibu), Inggris (fasih), Jepang (pemula)",
      timeline: [
        {
          period: "2024 - 2026",
          title: "Magister Sistem Informasi, Big Data",
          org: "BINUS University, Program Pascasarjana",
          note: "IPK 3,95. Business intelligence, machine learning, dan business analytics.",
        },
        {
          period: "2020 - 2024",
          title: "Sarjana Ilmu Komputer, Multimedia",
          org: "BINUS University",
          note: "IPK 3,73. Interaksi manusia dan komputer, user experience, dan rekayasa perangkat lunak.",
        },
        {
          period: "2023 - 2024",
          title: "Magang back-end developer",
          org: "Flash Coffee",
          note: "Membangun dan memelihara API Node.js untuk aplikasi mobile, ditambah sebulan di front-end.",
        },
        {
          period: "2021 - 2022",
          title: "Staf Learning Management",
          org: "Bina Nusantara English Club",
          note: "Menyusun materi, kuis, dan ujian kelas TOEFL, serta memantau perkembangan tutor.",
        },
        {
          period: "2021",
          title: "Desainer grafis paruh waktu",
          org: "ALGO.CORE",
          note: "Mendesain slide materi belajar dan konten Instagram berdasarkan riset pasar mingguan.",
        },
      ],
    },

    skills: {
      title: 'Keahlian dan <span class="accent">alat</span>',
      intro: "Back-end adalah fokus utama saya. Sisanya membantu saya memahami produk secara utuh.",
      backend: "Back-end",
      backendNote: "Bagian yang paling banyak saya kerjakan: API, logika server, dan data di baliknya.",
      frontend: "Front-end",
      data: "Data",
      design: "Desain",
      also: "Lainnya",
    },

    contact: {
      title: 'Punya posisi atau <span class="accent">proyek</span> yang ingin dibicarakan?',
      body: "Email adalah cara tercepat untuk menghubungi saya. Saya juga ada di LinkedIn dan GitHub.",
      copy: "Salin email",
      copied: "Tersalin",
      cv: "Unduh CV (PDF)",
      phone: "Telepon",
    },

    footer: {
      top: "Kembali ke atas",
    },

    notFound: {
      title: "Halaman ini tidak ada.",
      body: "Tautannya mungkin rusak, atau halamannya sudah dipindahkan.",
      home: "Kembali ke beranda",
    },
  },
};
