import React, { useEffect, useState, useMemo } from "react";
import { useAnimals } from "../hooks";
import { Styled } from "./lib";

const ReadyComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const { selectors: animalSelectors, actions: animalActions } = useAnimals();

  const ready = animalSelectors.isAnimalTypesReceived();

  useEffect(() => {
    if (loading) {
      setLoading(true);
      Promise.all([animalActions.getAnimalTypes()]).then(() => {
        setLoading(false);
      });
    }
  }, [animalActions, loading, ready]);

  return useMemo(() => {
    return loading ? <Styled.SplashScreen /> : <>{children}</>;
  }, [children, loading]);
};

export default ReadyComponent;
