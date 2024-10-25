import { produce } from "immer";
import { ActionTypes } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
  // isActive: boolean
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

interface CyclesActionPayload {
  newCycle: Cycle;
}

interface CyclesAction {
  type: string;
  payload?: CyclesActionPayload;
}

export function cyclesReducer(state: CyclesState, action: CyclesAction) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload!.newCycle],
      //   activeCycleId: action.payload!.newCycle.id,
      // };
      return produce(state, (draft) => {
        draft.cycles.push(action.payload!.newCycle);
        draft.activeCycleId = action.payload!.newCycle.id;
      });
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     if (cycle.id === state.activeCycleId) {
      //       return { ...cycle, interruptedDate: new Date() };
      //     } else {
      //       return cycle;
      //     }
      //   }),
      //   activeCycleId: null,
      // };

      const currentActiveCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );

      const activeCycleNotFound = currentActiveCycleIndex < 0;

      if (activeCycleNotFound) return state;

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentActiveCycleIndex].interruptedDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     if (cycle.id === state.activeCycleId) {
      //       return { ...cycle, finishedDate: new Date() };
      //     } else {
      //       return cycle;
      //     }
      //   }),
      //   activeCycleId: null,
      // };
      const currentActiveCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );

      const activeCycleNotFound = currentActiveCycleIndex < 0;

      if (activeCycleNotFound) return state;

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentActiveCycleIndex].finishedDate = new Date();
      });
    }
    default:
      return state;
  }
}
