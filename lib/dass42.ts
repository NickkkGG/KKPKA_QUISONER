export const QUESTIONS = [
  { id: 1, text: "Menjadi marah karena hal-hal kecil/sepele", scale: "stress" },
  { id: 2, text: "Mulut terasa kering", scale: "anxiety" },
  { id: 3, text: "Tidak dapat melihat hal yang positif dari suatu kejadian", scale: "depression" },
  { id: 4, text: "Merasakan gangguan dalam bernapas (napas cepat, sulit bernapas)", scale: "anxiety" },
  { id: 5, text: "Merasa sepertinya tidak kuat lagi untuk melakukan suatu kegiatan", scale: "depression" },
  { id: 6, text: "Cenderung bereaksi berlebihan pada situasi", scale: "stress" },
  { id: 7, text: "Kelemahan pada anggota tubuh", scale: "anxiety" },
  { id: 8, text: "Kesulitan untuk rileks/bersantai", scale: "stress" },
  { id: 9, text: "Cemas yang berlebihan dalam suatu situasi namun bisa lega jika hal/situasi itu berakhir", scale: "anxiety" },
  { id: 10, text: "Pesimis", scale: "depression" },
  { id: 11, text: "Mudah merasa kesal", scale: "stress" },
  { id: 12, text: "Merasa banyak menghabiskan energi karena cemas", scale: "anxiety" },
  { id: 13, text: "Merasa sedih dan depresi", scale: "depression" },
  { id: 14, text: "Tidak sabaran", scale: "stress" },
  { id: 15, text: "Kelelahan", scale: "anxiety" },
  { id: 16, text: "Kehilangan minat pada banyak hal (makan, aktivitas, bersosialisasi)", scale: "depression" },
  { id: 17, text: "Merasa diri tidak layak/pantas/tidak berharga", scale: "depression" },
  { id: 18, text: "Mudah tersinggung", scale: "stress" },
  { id: 19, text: "Berkeringat tanpa stimulasi oleh cuaca maupun latihan fisik", scale: "anxiety" },
  { id: 20, text: "Ketakutan tanpa alasan yang jelas", scale: "anxiety" },
  { id: 21, text: "Merasa hidup tidak berharga", scale: "depression" },
  { id: 22, text: "Sulit untuk beristirahat", scale: "stress" },
  { id: 23, text: "Kesulitan dalam menelan", scale: "anxiety" },
  { id: 24, text: "Tidak dapat menikmati hal-hal yang saya lakukan", scale: "depression" },
  { id: 25, text: "Perubahan kegiatan jantung dan denyut nadi tanpa stimulasi latihan fisik", scale: "anxiety" },
  { id: 26, text: "Merasa hilang harapan dan putus asa", scale: "depression" },
  { id: 27, text: "Mudah marah", scale: "stress" },
  { id: 28, text: "Mudah panik", scale: "anxiety" },
  { id: 29, text: "Kesulitan untuk tenang setelah sesuatu yang mengganggu", scale: "stress" },
  { id: 30, text: "Takut diri terhambat oleh tugas-tugas yang tidak biasa dilakukan", scale: "anxiety" },
  { id: 31, text: "Sulit untuk antusias pada banyak hal", scale: "depression" },
  { id: 32, text: "Sulit mentoleransi gangguan-gangguan terhadap hal yang sedang dilakukan", scale: "stress" },
  { id: 33, text: "Berada pada keadaan yang tegang", scale: "stress" },
  { id: 34, text: "Merasa tidak berharga", scale: "depression" },
  { id: 35, text: "Tidak dapat memaklumi hal apapun yang menghalangi penyelesaian pekerjaan", scale: "stress" },
  { id: 36, text: "Ketakutan", scale: "anxiety" },
  { id: 37, text: "Berpikir/merasa tidak ada harapan untuk masa depan", scale: "depression" },
  { id: 38, text: "Merasa hidup tidak berarti", scale: "depression" },
  { id: 39, text: "Mudah gelisah", scale: "stress" },
  { id: 40, text: "Khawatir dengan situasi saat diri Anda mungkin menjadi panik dan mempermalukan diri sendiri", scale: "anxiety" },
  { id: 41, text: "Gemetar", scale: "anxiety" },
  { id: 42, text: "Sulit untuk meningkatkan inisiatif dalam melakukan sesuatu", scale: "depression" },
] as const;

export const ANSWERS = [
  { value: 0, label: "Tidak Pernah" },
  { value: 1, label: "Kadang-kadang" },
  { value: 2, label: "Sering" },
  { value: 3, label: "Hampir Selalu" },
];

export const JENJANG_LIST = ["S1", "S2", "S3"];

export const PRODI_BY_JENJANG: Record<string, string[]> = {
  S1: ["Arsitektur","Teknik Sipil","Teknik Industri","Informatika","Sistem Informasi","Ilmu Hukum","Ilmu Komunikasi","Sosiologi","Manajemen","Akuntansi","Kedokteran"],
  S2: ["Arsitektur","Teknik Sipil","Teknik Industri","Informatika","Ilmu Hukum","Ilmu Komunikasi","Manajemen"],
  S3: ["Arsitektur","Teknik Sipil","Informatika","Ilmu Hukum"],
};

export function calculateScores(answers: number[]) {
  const depresiIdx = [2, 4, 9, 12, 15, 16, 20, 23, 25, 30, 33, 36, 37, 41];
  const kecemasanIdx = [1, 3, 6, 8, 14, 18, 19, 22, 24, 27, 29, 35, 39, 40];
  const stressIdx = [0, 5, 7, 10, 13, 17, 21, 26, 28, 31, 32, 34, 38, 11];

  const depresi = depresiIdx.reduce((s, i) => s + (answers[i] ?? 0), 0);
  const kecemasan = kecemasanIdx.reduce((s, i) => s + (answers[i] ?? 0), 0);
  const stress = stressIdx.reduce((s, i) => s + (answers[i] ?? 0), 0);

  return { depresi, kecemasan, stress };
}

export function interpretDepresi(score: number) {
  if (score <= 9) return { level: "Normal", color: "green" };
  if (score <= 13) return { level: "Ringan", color: "yellow" };
  if (score <= 20) return { level: "Sedang", color: "orange" };
  if (score <= 27) return { level: "Parah", color: "red" };
  return { level: "Sangat Parah", color: "red" };
}

export function interpretKecemasan(score: number) {
  if (score <= 7) return { level: "Normal", color: "green" };
  if (score <= 9) return { level: "Ringan", color: "yellow" };
  if (score <= 14) return { level: "Sedang", color: "orange" };
  if (score <= 19) return { level: "Parah", color: "red" };
  return { level: "Sangat Parah", color: "red" };
}

export function interpretStress(score: number) {
  if (score <= 14) return { level: "Normal", color: "green" };
  if (score <= 18) return { level: "Ringan", color: "yellow" };
  if (score <= 25) return { level: "Sedang", color: "orange" };
  if (score <= 33) return { level: "Parah", color: "red" };
  return { level: "Sangat Parah", color: "red" };
}
