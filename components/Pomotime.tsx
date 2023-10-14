import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Timer } from "./Timer";
import { PhaseInfo } from "./PhaseInfo";
import { PlayAction } from "./PlayAction";
import { useAppSelector } from "../redux/store";
import { initialState } from "../types/timer";
import { Audio } from "expo-av";
import { Link } from "expo-router";

export const Pomotime = () => {
  const initialState: initialState = {
    timer: {
      minutes: 25,
      seconds: 0,
      pause: true,
    },
    status: "focus",
    counter: 0,
    phase: 1,
    base: 0,
    percentage: 0,
  };
  const [state, setState] = useState(initialState);
  const { focus, longBreak, replay, shortBreak, speed } = useAppSelector(
    (state) => state.timerReducer
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [soundButtonClicked, setSoundButtonClicked] =
    useState<Audio.Sound | null>(null);
  const [soundButtonNext, setSoundButtonNext] = useState<Audio.Sound | null>(
    null
  );

  const alarmPlay = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/alarm.wav")
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSoundButtonNext = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/button-next.mp3")
    );
    setSoundButtonNext(sound);
    await sound.playAsync();
  };

  const handleSoundButtonClick = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/button.mp3")
    );
    setSoundButtonClicked(sound);
    await sound.playAsync();
  };

  const currentColor =
    state.status === "focus"
      ? "#C8A2C8"
      : state.status === "longBreak"
      ? "#FFA6A8"
      : "#FFC300";

  function setTimer() {
    setState((prev) => {
      const baseValue =
        state.status === "focus"
          ? focus
          : state.status === "shortBreak"
          ? shortBreak
          : longBreak;
      return {
        ...prev,
        timer: {
          ...prev.timer,
          pause: true,
          minutes: baseValue,
          seconds: 0,
        },
        base: baseValue * 60,
        percentage: baseValue * 60,
      };
    });
  }

  function handlePause() {
    setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        pause: !prev.timer.pause,
      },
    }));
    handleSoundButtonClick();
  }

  function handleNext() {
    if (state.status === "focus" && state.phase < 4) {
      setState((prev) => ({
        ...prev,
        status: "shortBreak",
      }));
    } else if (state.status === "shortBreak" && state.phase < 4) {
      setState((prev) => ({
        ...prev,
        status: "focus",
        phase: state.phase + 1,
      }));
    } else if (state.status === "focus" && state.phase === 4) {
      setState((prev) => ({
        ...prev,
        status: "longBreak",
        phase: 4,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        status: "focus",
        phase: 1,
      }));
    }
    handleSoundButtonNext();
  }

  function renderStatus() {
    switch (state.status) {
      case "focus":
        return "Focus";
      case "longBreak":
        return "Long Break";
      case "shortBreak":
        return "Short Break";
      default:
        return "Focus";
    }
  }

  useEffect(() => {
    setTimer();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [state.status, focus, longBreak, replay, shortBreak, speed, sound]);

  useEffect(() => {
    if (state.timer.minutes === 0 && state.timer.seconds === 0) {
      // Timer mencapai 0, maka panggil pemutaran suara
      alarmPlay();
    }
    if (!state.timer.pause) {
      if (state.timer.seconds > 0 || state.timer.minutes > 0) {
        const timer = setTimeout(() => {
          if (state.timer.seconds > 0) {
            setState((prev) => ({
              ...prev,
              timer: {
                ...prev.timer,
                seconds: state.timer.seconds - 1,
              },
              percentage: state.percentage - 1,
            }));
          } else if (state.timer.minutes > 0) {
            setState((prev) => ({
              ...prev,
              timer: {
                ...prev.timer,
                minutes: state.timer.minutes - 1,
                seconds: 59,
              },
              percentage: state.percentage - 1,
            }));
          }
        }, (1 / speed) * 1000);
        return () => clearTimeout(timer);
      } else if (
        state.status === "focus" &&
        state.counter < replay &&
        state.phase < 4
      ) {
        setState((prev) => ({
          ...prev,
          status: "shortBreak",
          timer: {
            ...prev.timer,
            pause: true,
            minutes: shortBreak,
            seconds: 0,
          },
        }));
      } else if (state.status === "shortBreak") {
        setState((prev) => ({
          ...prev,
          status: "focus",
          timer: {
            ...prev.timer,
            pause: true,
            minutes: focus,
            seconds: 0,
          },
          phase: state.phase + 1,
        }));
      } else if (state.status === "longBreak") {
        setState((prev) => ({
          ...prev,
          status: "focus",
          timer: {
            ...prev.timer,
            pause: true,
            minutes: focus,
            seconds: 0,
          },
          phase: 1,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "longBreak",
          timer: {
            ...prev.timer,
            pause: true,
            minutes: longBreak,
            seconds: 0,
          },
          counter: 0,
        }));
      }
    }
  }, [state.timer]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: currentColor,
      }}
    >
      <LinearGradient
        colors={
          state.status === "focus"
            ? ["#6659E4", "#C8A2C8", "#B0C4DE"]
            : state.status === "longBreak"
            ? ["#F97679", "#FFA6A8", "#FFF1E6"]
            : ["#FFC300", "#FFC300", "#FFFFF0"]
        }
        start={[0, 0]}
        end={[1, 1]}
        style={styles.top}
      >
        <Text style={styles.brand}>Pomotime</Text>
        <Timer timer={state.timer} status={renderStatus()} />
      </LinearGradient>
      <View style={styles.bottom}>
        <PhaseInfo
          {...state}
          currentColor={currentColor}
          renderStatus={renderStatus()}
          progress={(state.percentage / state.base) * 100}
        />
        <View style={styles.phaseCardContainer}>
          <PlayAction
            handlePause={handlePause}
            handleNext={handleNext}
            timer={state.timer}
            phase={state.phase}
            status={state.status}
            currentColor={currentColor}
          />
        </View>
      </View>
      <View style={styles.containerWatermark}>
        <Link href={"https://egagofur.vercel.app"}>
          <Text style={styles.textWatermark}>
            Created by <Text style={{ fontWeight: "bold" }}>Ega Gofur</Text>
          </Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
    position: "absolute",
    top: 90,
  },
  top: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 0.5,
    backgroundColor: "#fcfcfc",
    width: "100%",
    borderTopLeftRadius: 15,
    padding: 20,
    alignItems: "center",
    position: "relative",
    gap: 20,
    justifyContent: "center",
  },
  phaseCardContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    overflow: "scroll",
    gap: 10,
    padding: 10,
  },
  containerWatermark: {
    backgroundColor: "#fcfcfc",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  textWatermark: {
    fontSize: 14,
    fontWeight: "200",
    color: "gray",
    textTransform: "capitalize",
  },
});
