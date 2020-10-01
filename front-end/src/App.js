import React from "react";
import RouterComponent from "./component/route/RouterComponent";
import NavBar from "./component/route/NavBar";
import { Container } from "@material-ui/core";

function App() {
  return (
    <div>
      <NavBar />
      <Container>
        <RouterComponent />
      </Container>
    </div>
  );
}

export default App;
