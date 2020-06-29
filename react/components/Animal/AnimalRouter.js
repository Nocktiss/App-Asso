import React from "react";
// Route
import { Switch, Route } from "react-router-native";
// Utils
import { RT_ANIMAL_HOME, RT_FAVORITE_HOME } from "../../config/_constants";
// Custom components
import Home from "./Home";
// import FavoriteAnimals from "./FavoriteAnimals";

const AnimalRouter = () => {
  return (
    <Switch>
      <Route path={RT_ANIMAL_HOME} component={Home} exact={true} />
      <Route path={RT_FAVORITE_HOME} component={Home} exact={true} />
    </Switch>
  );
};

export default AnimalRouter;
