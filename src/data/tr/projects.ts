import type { ProjectCopy } from "@/lib/types";

/**
 * Turkish copy for `src/data/projects.ts`, keyed by slug. Anything left out
 * (names like DurAn, tech names, hrefs, status) stays as in English.
 */
export const projectsTr: Record<string, ProjectCopy> = {
  "otonom-iha": {
    title: "Otonom Döner Kanatlı Multikopter İHA",
    description:
      "TEKNOFEST İnsansız Hava Araçları yarışması için yaptığımız quadcopter: Pixhawk 6C / Raspberry Pi 5 / ArduPilot yığını, OpenCV ile hedef tespiti. Elektronik ve Yazılım Kaptanı olarak uçuş kontrolcüsü entegrasyonu, sensör yığını ve otonom görev planlaması bende. 19,76 dakika havada asılı kalma süresi, 12 km otonom menzil ve hassas iniş; araç ilk yılında TEKNOFEST döner kanat finaline ve NASA Space Apps Türkiye finaline kaldı. Halka açık otonom uçuş gösterileri Anadolu Ajansı ve Bursa Hakimiyet’te haber oldu.",
    tagDetail: "TEKNOFEST 2026 · Döner Kanat",
    techPills: [
      "gömülü sistemler",
      "otonom uçuş",
      "uçuş kontrolcüsü",
      "bilgisayarlı görü",
      "PCB tasarımı",
      "makine öğrenmesi",
    ],
  },
  prose: {
    title: "PROSE - Niyet Odaklı Programlama",
    description:
      "Tek cümlelik doğal dili tipli, sürümlü bir ajan görev grafiğine derler, sonra onu adım adım çalıştırır: doğrulama kapıları, yeniden denemeler, idempotency ve deterministik olarak yeniden oynatılabilen canlı bir iz. Model yalnızca adım listesini üretir; id’ler, kenarlar, tipler ve checksum motorun elindedir, bu yüzden özensiz bir model geçersiz bir grafik üretemez.",
    tagDetail: "canlı · tipli ajan görev grafikleri",
    techPills: ["Next.js", "TypeScript", "Zod", "ajan araçları"],
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  teluvane: {
    title: "Teluvane - Ajanlar İçin Hesap Verebilirlik",
    description:
      "Yapay zeka ajanları için çok kiracılı uyumluluk denetim platformu: her LLM çağrısı, araç çağrısı ve araç sonucu oturum bazında SHA-256 ile hash zincirine bağlanır, sonra bir LangGraph + Claude kurulu bunları EU AI Act, ISO 42001, NIST AI RMF ve SOC 2 politika paketlerine göre denetler. Yanında bir MCP sunucusu, SDK’lar ve isteğe bağlı on-chain oturum sabitleme var.",
    tagDetail: "canlı · çok kiracılı + EU AI Act",
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  "live-wildfire": {
    title: "Orman Yangını Yayılım Tahmini Haritası",
    description:
      "NASA FIRMS’ten gerçek aktif yangınları dünya haritasına çeker. Birine tıkladığınızda o yangının rüzgârını, arazi eğimini, yakıt örtüsünü ve nemini alır, önümüzdeki 12 ila 24 saatte nereye yayılacağını canlandırır. Motor, bir Web Worker içinde çalışan sadeleştirilmiş bir Alexandridis (2008) hücresel otomat modeli.",
    tagDetail: "canlı · GDG Çadırlı Hackathon",
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  "tofas-fen-webapp": {
    title: "Tofaş Fen Web Uygulaması",
    description:
      "Gerçek kullanımda olan bir okul yönetim platformu. 22 MongoDB modeli, 6 kullanıcı rolü, JWT + 2FA kimlik doğrulama, GraphQL, WebSocket ile gerçek zamanlı güncelleme ve Kubernetes üzerinde dağıtım.",
    tagDetail: "canlı · React 19 + K8s",
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  "stratos-akademi": {
    description:
      "Kendi İHA kulübüm için yaptığım video eğitim platformu. Müfredat ağacı, atlanamayan video tamamlama, sunucuda puanlanan sınavlar, kaptan geri bildirimiyle uygulamalı görev değerlendirmesi, liderlik tablosu ve yazdırılabilir sertifikalar. Bir cron işi YouTube’dan yeni ders önerir; son kararı her zaman bir insan verir.",
    tagDetail: "canlı · Next.js 16 + Supabase",
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  "masa-hesaplari": {
    description:
      "Restoranlar için QR kodla masadan sipariş ve hesap bölme uygulaması. Müşteri masadaki QR’ı okutur, kendi dilindeki menüye bakar, sipariş verir ve hesabı ürün ürün, eşit ya da tamamını tek seferde öder. 12 tabloluk Postgres şeması (Neon üzerinde Drizzle ORM) masa oturumlarını, siparişleri, bölünmüş ödemelerde ürün kilitlerini ve garson çağrılarını kapsar; yönetici, garson ve mutfak için rol bazlı paneller var. Sipariş durumu müşteriye server-sent events ile canlı akar; kartla ödemeler iyzico üzerinden, hızlı IBAN ve nakit akışlarıyla yan yana çalışır. Dil çerezine dayanan Türkçe/İngilizce i18n, basılı QR bağlantılarını her dilde geçerli tutar; ayrıca 7 sabit etiket üzerinden alerjen/diyet filtresi, JWT kimlik doğrulama ve ödenmemiş masaları işaretleyen günlük bir cron işi var.",
  },
  duran: {
    description:
      "TEKNOFEST Bağımlılıklarla Mücadelede Teknolojik Uygulamalar Yarışması’nda finale kaldı; Stratos Root’un takım kaptanı olarak geliştirdim. Kumar bağımlılığında nükse karşı iki parçalı bir erken uyarı sistemi: ESP32S3 bileklik (MAX30102 PPG, GSR, MPU6050, DS18B20) verisi, React Native uygulamasının davranışsal sinyaliyle cihaz üzerinde birleştirilir ve istek krizleri 3 dakikalık bir pencere içinde yakalanır. Tamamen cihaz üzerinde çalışır: sunucu yok, ham veri saklanmaz, yalnızca olay zaman damgaları kaydedilir. Simüle edilmiş nüks olaylarına karşı %94 tespit doğruluğu, fizyolojik ve davranışsal hatlarda 14 geçen birim testi; arkasında giderek güçlenen üç kademeli bir müdahale akışı var (hatırlatma, duraklatma ekranı, nefes egzersizi + YEDAM hattı).",
    tagDetail: "TEKNOFEST Finalisti · ESP32S3 + React Native",
  },
  "smart-cane": {
    title: "Akıllı Baston Asistanı",
    description:
      "Telefonu beyaz bastona takıyorsunuz; cihaz üzerinde MediaPipe ile nesne tespiti yapıyor, baş ve göğüs hizasındaki engelleri Türkçe sesle bildiriyor ve yaklaştıkça bip sesi veriyor. Baston yere yakın olanı bulur; bu, bastonun kaçırdığını yakalar. Hiçbir kamera karesi telefondan çıkmaz.",
    techPills: ["MediaPipe", "React 19", "Vite PWA", "cihaz üzerinde çıkarım"],
  },
  "local-ai-assistant": {
    title: "Yerel Yapay Zeka Asistanı",
    description:
      "WhatsApp üzerinden çalışan, Llama 3.1 8B’yi bir RTX 3060 Ti üzerinde yerelde koşturan bir “Jarvis”: görev yönetimi, takvim, alışkanlık takibi, harcama takibi ve ruh hali günlüğü, hepsi cihazda. Ortalama yanıt süresi 800 ms’nin altında; 6 aydan uzun süredir her gün kullanıyorum.",
    tagDetail: "Llama 3.1 8B · cihaz üzerinde",
    links: { "source code": "kaynak kod" },
  },
  "zero-g-pharma": {
    description:
      "Mikro yerçekimi ile Dünya yerçekimini karşılaştıran ilaç kristali büyütme simülatörü. NASA Space Apps Challenge 2025 Türkiye birincisi; 6.000’den fazla takım arasından küresel ilk 50’ye girdi.",
    tagDetail: "Türkiye Birincisi · NASA Space Apps 2025",
    links: { "source code": "kaynak kod" },
  },
  "stratos-website": {
    title: "STRATOS İHA - Web Sitesi",
    description:
      "Kurduğum TEKNOFEST İHA topluluğu STRATOS İHA’nın resmi sitesi. Takım tanıtımı, departmanlar ve proje sayfaları.",
    tagDetail: "canlı · stratosiha.com",
    links: { live: "canlı", "source code": "kaynak kod" },
  },
  "fpv-drone": {
    title: "FPV Dron",
    description:
      "MEB Robot yarışması için gerçek zamanlı görüntü aktarımı olan FPV İHA.",
    tagDetail: "MEB Robot · FPV yarış",
    techPills: ["FPV", "elektronik"],
  },
  "vex-robotics": {
    title: "VEX Robotik",
    description:
      "Kendi mekanik tasarımımız ve sensör entegrasyonuyla yapılmış yarışma robotu.",
    techPills: ["VEX V5", "sensörler"],
  },
  "tmt-website": {
    title: "TMT Web Sitesi",
    description: "TMT’nin resmi web sitesi: takım tanıtımı ve proje sayfaları.",
    tagDetail: "Next.js · Takım tanıtımı",
    links: { live: "canlı" },
  },
};
