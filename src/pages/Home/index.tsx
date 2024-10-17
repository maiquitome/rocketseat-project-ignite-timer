import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // `* as zod` = because has no a export default
import { differenceInSeconds } from "date-fns";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";
import { useEffect, useState } from "react";

// controlled vs uncontrolled

/*
  ABOUT THE REGISTER OF useForm()

  function register(name: string) {
    return {
      onChange: () => void,
      onBlur: () => void,
      onFocus: () => void,
      on...
    }
  }
  
  register("task").onChange
  register("task").onBlur
  register("task").maxLength
*/

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  // minutesAmount: zod.number().min(5).max(60),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

// interface NewCycleFormData {
//   task: string;
//   minutesAmount: number;
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  // isActive: boolean
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset /*, formState*/ } =
    useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: "",
        minutesAmount: 0,
      },
    });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const foundAnActiveCycle = activeCycle !== undefined;
  // console.log("activeCycle", activeCycle);

  useEffect(() => {
    if (foundAnActiveCycle) {
      setInterval(() => {
        // setAmountSecondsPassed((state) => state + 1); ASSIM NÃO É PRECISO
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        );
      }, 1000);
    }
  }, [activeCycle, foundAnActiveCycle]);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    // setCycles([...cycles, newCycle]);
    setCycles((state) => [...state, newCycle]); // Clojure no React
    setActiveCycleId(newCycle.id);

    // console.log(data);
    reset();
  }

  // console.log(formState.errors);
  const totalSeconds = foundAnActiveCycle ? activeCycle.minutesAmount * 60 : 0;
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

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            // name="task" o name não precisa mais pq o registar já coloca o name
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{numberOfMinutesToShowOnScreen[0]}</span>
          <span>{numberOfMinutesToShowOnScreen[1]}</span>
          <Separator>:</Separator>
          <span>{numberOfSecondsToShowOnScreen[0]}</span>
          <span>{numberOfSecondsToShowOnScreen[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
