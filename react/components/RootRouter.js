import React from "react";
import { Route, Switch } from "react-router-native";
import {
  RT_ANIMAL_HOME,
  RT_MAP_HOME,
  RT_FAVORITE_HOME,
} from "../config/_constants";
import { RootProvider } from "../context/RootContext";
import { Styled } from "./lib";
import ReadyComponent from "./ReadyComponent";
import AnimalRouter from "./Animal/AnimalRouter";
import AssociationRouter from "./Association/AssociationRouter";

const menu = [
  {
    route: RT_MAP_HOME,
    label: "route.map",
    icon: "MAP",
  },
  {
    route: RT_ANIMAL_HOME,
    label: "route.animal",
    icon: "ANIMAL",
  },
  {
    route: RT_FAVORITE_HOME,
    label: "route.favorites",
    icon: "FAVORITE",
  },
];

const RootRouter = ({ history, location }) => {
  return (
    <>
      <Switch>
        <RootProvider>
          <ReadyComponent location={location}>
            <Route path={RT_MAP_HOME} component={AssociationRouter} />
            <Route path={RT_ANIMAL_HOME} component={AnimalRouter} />
            <Route path={RT_FAVORITE_HOME} component={AnimalRouter} />
          </ReadyComponent>
        </RootProvider>
      </Switch>
      <Styled.AppBar
        routes={menu}
        location={location}
        onPress={route => history.push(route)}
      />
    </>
  );
};

export default RootRouter;
