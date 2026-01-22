
export interface ResearchItem {
    id: string;
    slug: string;
    type: 'workshop' | 'paper' | 'conference';
    title: string;
    date: string;
    authors: string;
    abstract: string;
    content: string; // HTML or Markdown content
    tags: string[];
    image?: string;
}

export const researchItems: ResearchItem[] = [
    {
        id: "1",
        slug: "workshop-peningkatan-kompetensi-guru-smk-ai",
        type: "workshop",
        title: "Workshop Peningkatan Kompetensi Guru SMK Bidang AI",
        date: "28 September - Oktober 2020",
        authors: "Tim AiCi & SMK BISA-HEBAT",
        abstract: "Workshop intensif untuk meningkatkan kompetensi guru SMK dalam bidang Artificial Intelligence, mencakup teori dasar AI, machine learning, dan implementasi praktis dalam pembelajaran.",
        content: `
            <p>Program workshop ini dirancang khusus untuk memenuhi kebutuhan pengajar di Sekolah Menengah Kejuruan (SMK) dalam menghadapi era Revolusi Industri 4.0. Artificial Intelligence (AI) telah menjadi bagian integral dari berbagai industri, dan penting bagi pendidik untuk memiliki pemahaman yang mendalam tentang teknologi ini agar dapat mentransfer pengetahuan tersebut kepada siswa.</p>
            
            <h3>Tujuan Workshop</h3>
            <ul>
                <li>Memberikan pemahaman fundamental tentang AI dan Machine Learning.</li>
                <li>Melatih guru dalam penggunaan tools dan framework AI populer seperti TensorFlow dan Python.</li>
                <li>Mengembangkan kurikulum berbasis proyek yang relevan dengan kebutuhan industri.</li>
            </ul>

            <h3>Materi yang Diajarkan</h3>
            <p>Peserta diajak untuk menyelami berbagai topik, mulai dari pengenalan Data Science, dasar-dasar Neural Networks, hingga Computer Vision. Sesi praktikum melibatkan pembuatan model sederhana untuk klasifikasi gambar dan prediksi data.</p>

            <h3>Hasil yang Diharapkan</h3>
            <p>Setelah mengikuti workshop ini, para guru diharapkan mampu merancang modul pembelajaran AI yang interaktif dan aplikatif, serta membimbing siswa dalam mengembangkan proyek-proyek inovatif berbasis teknologi cerdas.</p>
        `,
        tags: ["AI", "Education", "Workshop"],
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600"
    },
    {
        id: "2",
        slug: "implementasi-deep-learning-deteksi-objek-robot-edukasi",
        type: "paper",
        title: "Implementasi Deep Learning untuk Deteksi Objek pada Robot Edukasi",
        date: "15 Maret 2021",
        authors: "Dr. Ahmad Fauzi, M.Kom., Tim Riset AiCi",
        abstract: "Penelitian ini mengeksplorasi penerapan algoritma deep learning YOLO untuk meningkatkan kemampuan deteksi objek pada robot edukasi yang digunakan dalam pembelajaran AI di tingkat SMK.",
        content: `
            <p>Penelitian ini berfokus pada integrasi algoritma You Only Look Once (YOLO) ke dalam sistem visi robot edukasi. Robot edukasi seringkali memiliki keterbatasan komputasi, sehingga tantangan utamanya adalah mengoptimalkan model deep learning agar dapat berjalan secara real-time tanpa mengurangi akurasi secara signifikan.</p>

            <h3>Metodologi</h3>
            <p>Kami menggunakan dataset yang dikumpulkan dari lingkungan laboratorium sekolah, terdiri dari berbagai objek sehari-hari dan rintangan umum. Model YOLOv4-tiny dipilih dan dilatih ulang (fine-tuning) menggunakan teknik transfer learning untuk menyesuaikan dengan domain spesifik ini.</p>

            <h3>Hasil Eksperimen</h3>
            <p>Hasil pengujian menunjukkan bahwa model yang dioptimalkan mampu mencapai frame rate rata-rata 24 FPS pada hardware Raspberry Pi 4 dengan akurasi mAP (mean Average Precision) sebesar 78%. Ini menunjukkan kelayakan penggunaan deep learning canggih pada perangkat edge berbiaya rendah untuk tujuan pendidikan.</p>

            <h3>Kesimpulan</h3>
            <p>Implementasi ini membuka peluang baru bagi siswa SMK untuk belajar tentang konsep advanced computer vision dan robotics secara langsung, menjembatani kesenjangan antara teori dan praktik industri.</p>
        `,
        tags: ["AI", "Robotics", "Deep Learning"],
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600"
    },
    {
        id: "3",
        slug: "strategi-pembelajaran-ai-generasi-digital-native",
        type: "conference",
        title: "Strategi Pembelajaran AI untuk Generasi Digital Native",
        date: "10 Juni 2021",
        authors: "Prof. Dr. Siti Nurhaliza, M.Pd., Tim AiCi",
        abstract: "Presentasi pada konferensi nasional pendidikan tentang strategi efektif dalam mengajarkan konsep AI kepada siswa generasi digital native dengan pendekatan STEAM.",
        content: `
            <p>Generasi Digital Native memiliki karakteristik belajar yang unik; mereka terbiasa dengan arus informasi yang cepat dan interaksi digital yang intuitif. Mengajarkan konsep abstrak seperti Artificial Intelligence memerlukan pendekatan yang berbeda dari metode konvensional.</p>

            <h3>Pendekatan STEAM</h3>
            <p>Kami mengusulkan pendekatan STEAM (Science, Technology, Engineering, Arts, Mathematics) sebagai kerangka kerja utama. Melalui STEAM, AI tidak hanya dipandang sebagai kode pemrograman, tetapi sebagai alat untuk berekspresi dan memecahkan masalah kreatif.</p>

            <h3>Studi Kasus</h3>
            <p>Dalam paper ini, kami memaparkan studi kasus di beberapa SMK binaan AiCi. Siswa diajak untuk membuat proyek seni generatif menggunakan AI atau merancang sistem rekomendasi musik sederhana. Hasilnya menunjukkan peningkatan motivasi belajar yang signifikan dan pemahaman konsep yang lebih mendalam dibandingkan metode ceramah tradisional.</p>

            <h3>Rekomendasi</h3>
            <p>Pendidik disarankan untuk lebih banyak menggunakan visualisasi, gamifikasi, dan proyek kolaboratif dalam pengajaran AI. Penting juga untuk mendiskusikan implikasi etis dari teknologi ini sejak dini.</p>
        `,
        tags: ["Education", "AI", "STEAM"],
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600"
    },
    {
        id: "4",
        slug: "evaluasi-efektivitas-modul-pembelajaran-robotika-ai",
        type: "paper",
        title: "Evaluasi Efektivitas Modul Pembelajaran Robotika Berbasis AI",
        date: "22 Agustus 2021",
        authors: "Ir. Budi Santoso, M.T., Tim Kurikulum AiCi",
        abstract: "Studi evaluatif terhadap efektivitas modul pembelajaran robotika yang dikembangkan AiCi, dengan fokus pada peningkatan pemahaman konsep AI dan keterampilan programming siswa.",
        content: `
            <p>AiCi telah mengembangkan serangkaian modul pembelajaran robotika yang mengintegrasikan konsep AI dasar. Penelitian ini bertujuan untuk mengukur sejauh mana modul tersebut efektif dalam membantu siswa memahami logika pemrograman dan konsep sensing-actuation cerdas.</p>

            <h3>Metode Evaluasi</h3>
            <p>Evaluasi dilakukan menggunakan metode Pre-test dan Post-test Control Group Design di 5 SMK mitra. Parameter yang diukur meliputi pemahaman kognitif, keterampilan psikomotorik dalam merakit dan memprogram robot, serta sikap terhadap teknologi.</p>

            <h3>Temuan Utama</h3>
            <p>Analisis data menunjukkan peningkatan skor rata-rata sebesar 45% pada kelompok eksperimen dibandingkan kelompok kontrol. Siswa yang menggunakan modul AiCi menunjukkan kemampuan problem-solving yang lebih baik saat dihadapkan pada tantangan pemrograman yang belum pernah mereka temui sebelumnya.</p>
            
            <h3>Implikasi</h3>
            <p>Hasil ini memvalidasi pendekatan kurikulum yang kami kembangkan dan memberikan landasan kuat untuk diseminasi modul ini ke jaringan sekolah yang lebih luas di Indonesia.</p>
        `,
        tags: ["Robotics", "Education", "Evaluation"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600"
    },
];
