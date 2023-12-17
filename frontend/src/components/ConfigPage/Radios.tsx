import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { data } = useApiQuery_config_radios();
  const [stations, setStations] =
    useState<{ name: string; url: string; id: number }[]>();
  const { mutate, isPending: isSaving } = useApiMutation_config_radios();

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
            <th>
              <Trans i18nKey="label">Label</Trans>
            </th>
            <th>
              <Trans i18nKey="url">URL</Trans>
            </th>
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
                  <IconButton
                    onClick={() => handleDeleteClick(index)}
                    title={t("delete", "Delete")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          <tr>
            <td>
              <Button onClick={handleAddClick}>
                <Trans i18nKey="add">Add</Trans>
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <Stack sx={{ mt: 2 }}>
        <Button type="submit" loading={isSaving} startDecorator={<SaveIcon />}>
          <Trans i18nKey="save">Save</Trans>
        </Button>
      </Stack>
    </form>
  );
};

export default Radios;
