import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

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

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch /*reset*/ /*, formState*/ } = newCycleForm;

  const foundAnActiveCycle = activeCycle !== undefined;

  // console.log(formState.errors);

  const task = watch("task");
  const isSubmitDisabled = !task;

  /*
    - Prop Drilling -> Quando existem MUITAS props APENAS para comunicação entre componentes
    - Context API -> Permite compartilhamento de informações entre VÁRIOS componentes ao mesmo tempo
  */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {foundAnActiveCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
