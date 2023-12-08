import { useState } from "react";
import { Button, IconButton, Input, Stack, Table } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useApiMutation_config_radios,
  useApiQuery_config_radios,
} from "../../util/api-client";

// used for 'key' in table so that input defaultValues can be tied to rows, some of which may be deleted
let uniqueId = 1;

const Radios: React.FC = () => {
  const { data } = useApiQuery_config_radios();
  const [stations, setStations] =
    useState<{ name: string; url: string; id: number }[]>();
  const { mutate, isLoading: isSaving } = useApiMutation_config_radios();

  // initial loading only!
  if (!stations && data) {
    setStations(data.stations.map((item) => ({ ...item, id: uniqueId++ })));
  }

  function handleAddClick() {
    if (stations) {
      setStations((prev) => [...prev!, { name: "", url: "", id: uniqueId++ }]);
    }
  }
  function handleDeleteClick(index: number) {
    if (stations) {
      setStations((prev) => {
        const array = Array.from(prev!);
        array.splice(index, 1);
        return array;
      });
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData(e.target as HTMLFormElement);
    const names = fd.getAll("name[]") as string[];
    const urls = fd.getAll("url[]") as string[];

    mutate({
      schema: 1,
      stations: names.map((name, i) => ({
        name,
        url: urls[i],
      })),
    });
  }

  return (
    <form onSubmit={handleSave}>
      <Table>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {stations &&
            stations.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <Input name="name[]" defaultValue={item.name} />
                </td>
                <td>
                  <Input name="url[]" defaultValue={item.url} />
                </td>
                <td>
                  <IconButton onClick={() => handleDeleteClick(index)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          <tr>
            <td>
              <Button onClick={handleAddClick}>Add</Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <Stack sx={{ mt: 2 }}>
        <Button type="submit" loading={isSaving} startDecorator={<SaveIcon />}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default Radios;
