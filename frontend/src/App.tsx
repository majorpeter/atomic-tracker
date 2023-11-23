import { useEffect, useState } from "react";
import "./App.css";

import { Test, myTestObj } from "@atomic-tracker/common";
import { Button, Sheet } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import Habits from "./components/Habits";

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
      </div>
      <Sheet variant="outlined">
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
      </Sheet>
    </>
  );
}

export default App;
