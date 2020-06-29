import React from "react";
// Route
import { Switch, Route } from "react-router-native";
// Utils
import {
  RT_MAP_HOME,
  RT_ASSOCIATION_DETAILS,
  RT_ANIMAL_DETAILS,
} from "../../config/_constants";
// Custom components
import Home from "./Home";
import DetailsAssociations from "./Details/DetailsAssociations";
import DetailsAnimals from "../Animal/Details/DetailsAnimals";

const AssociationRouter = () => {
  return (
    <Switch>
      <Route path={RT_MAP_HOME} component={Home} exact={true} />
      <Route
        path={RT_ASSOCIATION_DETAILS}
        component={DetailsAssociations}
        exact={true}
      />
      <Route path={RT_ANIMAL_DETAILS} component={DetailsAnimals} exact={true} />
    </Switch>
  );
};

export default AssociationRouter;
