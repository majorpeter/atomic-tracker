import { useEffect, useState } from "react";
import "./App.css";

import { Test, myTestObj } from "@atomic-tracker/common";
import { Button, Card, Grid } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import Habits from "./components/Habits";
import Todos from "./components/Todos";
import Agenda from "./components/Agenda";

function App() {
  const [obj, setObj] = useState<Test>(myTestObj);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("http://localhost:8080/");
        const data = (await resp.json()) as Test;
        setObj(data);
      } catch {
        setError(true);
      }
    })();
  }, []);

  return (
    <>
      <div>
        <Habits />
        <Grid container spacing={2}>
          <Grid xs={7}>
            <Todos />
          </Grid>
          <Grid xs={5}>
            <Agenda />
          </Grid>
          <Grid xs={4}>
            <Card>
              {error ? (
                <p>Cannot get data from backend</p>
              ) : (
                <>
                  {myTestObj.name} / <b>{obj.name}</b>
                  <p>
                    <Button
                      variant="outlined"
                      startDecorator={<Add />}
                      onClick={() =>
                        setObj((obj) => ({
                          ...obj,
                          id: obj.id + 1,
                        }))
                      }
                    >
                      count is {obj.id}
                    </Button>
                  </p>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default App;
