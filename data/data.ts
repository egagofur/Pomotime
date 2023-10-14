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
    text: "Pomodoro is a time management trick that's all about working in short bursts and taking breaks.",
    textColor: "#005b4f",
    backgroundColor: "#ffa3ce",
  },
  {
    id: 2,
    animation: require("../assets/animations/Lottie2.json"),
    text: "It helps improve productivity, reduce stress, and enhance the quality of work.",
    textColor: "#1e2169",
    backgroundColor: "#bae4fd",
  },
  {
    id: 3,
    animation: require("../assets/animations/Lottie3.json"),
    text: "Press the start icon (25 minutes) and make your day more efficient. Get ready to begin!",
    textColor: "#F15937",
    backgroundColor: "#faeb8a",
  },
];

export default data;
