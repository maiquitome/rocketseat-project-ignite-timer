import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../..";
import { differenceInSeconds } from "date-fns";

export function Countdown() {
  const {
    activeCycle,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const foundAnActiveCycle = activeCycle !== undefined;
  const totalSeconds = foundAnActiveCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (foundAnActiveCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        const isCycleCompleted = secondsDifference >= totalSeconds;

        if (isCycleCompleted) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [
    activeCycle,
    foundAnActiveCycle,
    totalSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ]);

  const currentSeconds = foundAnActiveCycle
    ? totalSeconds - amountSecondsPassed
    : 0;

  const numberOfMinutesToShowOnScreen = String(
    Math.floor(currentSeconds / 60)
  ).padStart(2, "0");

  const numberOfSecondsToShowOnScreen = String(currentSeconds % 60).padStart(
    2,
    "0"
  );

  useEffect(() => {
    if (foundAnActiveCycle) {
      document.title = `${numberOfMinutesToShowOnScreen}:${numberOfSecondsToShowOnScreen}`;
    }
  }, [
    foundAnActiveCycle,
    numberOfMinutesToShowOnScreen,
    numberOfSecondsToShowOnScreen,
  ]);

  return (
    <CountdownContainer>
      <span>{numberOfMinutesToShowOnScreen[0]}</span>
      <span>{numberOfMinutesToShowOnScreen[1]}</span>
      <Separator>:</Separator>
      <span>{numberOfSecondsToShowOnScreen[0]}</span>
      <span>{numberOfSecondsToShowOnScreen[1]}</span>
    </CountdownContainer>
  );
}
