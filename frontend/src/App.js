// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots/AllSpots";
import UsersSpots from "./components/Spots/UsersSpots";
import SpotPage from "./components/Spots/SpotPage";

import "./index.css"

function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots />
          </Route>
          <Route exact path="/my-spots">
            <UsersSpots />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
