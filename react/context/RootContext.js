import React, { createContext, useMemo, useReducer } from "react";
import {
  reducer as animalReducer,
  initialState as animalIS,
} from "./reducers/animal";
import {
  reducer as associationReducer,
  initialState as associationIS,
} from "./reducers/association";
import {
  reducer as animalMonitorReducer,
  initialState as animalMonitorIS,
} from "./reducers/animalMonitoring";

export const RootContext = createContext();

function combineReducers(reducerDict) {
  return function(state = {}, action) {
    return Object.keys(reducerDict).reduce((acc, curr) => {
      let slice = reducerDict[curr](state[curr], action);
      return { ...acc, [curr]: slice };
    }, state);
  };
}

const rootReducer = combineReducers({
  animal: animalReducer,
  association: associationReducer,
  animals: animalMonitorReducer,
});

const rootInitialState = {
  animal: animalIS,
  association: associationIS,
  animals: animalMonitorIS,
};

export const RootProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, rootInitialState);

  return useMemo(
    () => (
      <RootContext.Provider value={{ state, dispatch }}>
        {children}
      </RootContext.Provider>
    ),
    [children, state]
  );
};
