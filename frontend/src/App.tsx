import { useEffect, useState } from "react";
import "./App.css";

import { Test, myTestObj } from "@atomic-tracker/common";

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
      {error ? (
        <p>Cannot get data from backend</p>
      ) : (
        <>
          {myTestObj.name} / <b>{obj.name}</b>
          <div className="card">
            <button
              onClick={() =>
                setObj((obj) => ({
                  ...obj,
                  id: obj.id + 1,
                }))
              }
            >
              count is {obj.id}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
