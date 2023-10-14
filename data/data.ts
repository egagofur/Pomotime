import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../assets/animations/Lottie1.json"),
    text: "Pomodoro teknik manajemen waktu yang melibatkan sesi kerja pendek diikuti oleh istirahat. Ini membantu Anda tetap fokus.",
    textColor: "#005b4f",
    backgroundColor: "#ffa3ce",
  },
  {
    id: 2,
    animation: require("../assets/animations/Lottie2.json"),
    text: "Membantu meningkatkan produktivitas, mengurangi stres, dan meningkatkan kualitas pekerjaan.",
    textColor: "#1e2169",
    backgroundColor: "#bae4fd",
  },
  {
    id: 3,
    animation: require("../assets/animations/Lottie3.json"),
    text: "Tekan ikon timer (25 menit) dan buat hari Anda lebih efisien. Bersiap untuk memulai!.",
    textColor: "#F15937",
    backgroundColor: "#faeb8a",
  },
];

export default data;
