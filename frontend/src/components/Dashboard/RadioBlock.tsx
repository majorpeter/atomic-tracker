import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Stack } from "@mui/joy";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useApiQuery_radio } from "../../util/api-client";
import { radioPickerRoute } from "../../pages/Dashboard/RadioPickerModal";
import { AppLocalStorage } from "../../util/local-storage";

const RadioBlock: React.FC = () => {
  const [playingStationIndex, setPlayingStationIndex] = useState<number | null>(
    null
  );
  const { data } = useApiQuery_radio();

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const selectedRadioIndex = data
    ? Math.min(AppLocalStorage.getRadioIndex(), data.stations.length - 1)
    : 0;

  function pause() {
    audioPlayer.current!.pause();
    setPlayingStationIndex(null);
  }

  async function handlePlayPauseClick() {
    if (playingStationIndex === null) {
      if (data && data.stations.length > 0) {
        audioPlayer.current!.src = data?.stations[selectedRadioIndex].url;
        await audioPlayer.current!.play();
        setPlayingStationIndex(selectedRadioIndex);
      }
    } else {
      pause();
    }
  }

  // pause music if station changes
  if (
    playingStationIndex !== null &&
    playingStationIndex !== selectedRadioIndex
  ) {
    pause();
  }

  return (
    <Stack
      sx={{
        display: { xs: "none", sm: "flex" },
      }}
    >
      <audio ref={audioPlayer} />
      {data && (
        <ButtonGroup variant="solid" color="primary">
          <Button component={Link} to={radioPickerRoute.path!}>
            {data.stations.length > 0
              ? data.stations[selectedRadioIndex].name
              : "No stations"}
          </Button>
          <Button onClick={handlePlayPauseClick}>
            {playingStationIndex !== null ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
        </ButtonGroup>
      )}
    </Stack>
  );
};

export default RadioBlock;
