import { useRef, useState } from "react";
import { Button, ButtonGroup, Stack } from "@mui/joy";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useApiQuery_radio } from "../../util/api-client";

const RadioBlock: React.FC = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const { data } = useApiQuery_radio();

  const audioPlayer = useRef<HTMLAudioElement>(null);

  async function handlePlayPauseClick() {
    if (!playing) {
      if (data && data.stations.length > 0) {
        audioPlayer.current!.src = data?.stations[0].url;
        await audioPlayer.current!.play();
        setPlaying(true);
      }
    } else {
      audioPlayer.current!.pause();
      setPlaying(false);
    }
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
          <Button>
            {data.stations.length > 0 ? data.stations[0].name : "No stations"}
          </Button>
          <Button onClick={handlePlayPauseClick}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
        </ButtonGroup>
      )}
    </Stack>
  );
};

export default RadioBlock;
