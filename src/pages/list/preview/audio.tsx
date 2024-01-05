import {
  Box,
  Center,
  Heading,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerAudioListProps,
} from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { FileProps, IContext } from "../context";
import getIcon from "../../../utils/icon";
import useFileUrl from "../../../hooks/useFileUrl";
import useLocalStorage from "../../../hooks/useLocalStorage";

export const type = 4;
export const exts = [];

const Audio = ({ file }: FileProps) => {
  const { lastFiles, getSetting } = useContext(IContext);
  const theme = useColorModeValue("light", "dark");
  const { t, i18n } = useTranslation();
  const [audioLists, setAudioLists] = React.useState<
    ReactJkMusicPlayerAudioListProps[]
  >([]);
  const fileUrl = useFileUrl();
  const [volume, setVolume] = useLocalStorage("volume", 0.5);
  const mobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const cover = getSetting("music cover") 
  const singer = t("unknown");
  const [playIndex, setPlayIndex] = React.useState(0);
  
  const urln = fileUrl();
  function getUrlLastPart(urln: string) {
    const urlParts = urln.split("/");
    return urlParts[urlParts.length - 1];
  }
  const lastPart = getUrlLastPart(urln);
  console.log(lastPart); 
  const zifu = "https://sxzhuoyu.oss-cn-qingdao.aliyuncs.com/fileserver2/lrc/"
  const str2 = zifu + lastPart;
  const str3 = str2.replace(".flac", ".lrc");
  console.log(str3);
// 定义一个字符串变量
  let lyric = '';

  // 使用fetch从网络获取LRC文件
  fetch(str3)
    .then(response => response.text())
    .then(data => {
      // 将每行LRC文本连接到一起
      lyric = data.split('\n').join('\n');
      
      // 输出整合后的LRC文本
      console.log(lyric);
    })
    .catch(error => console.error('Error fetching LRC file:', error));

  console.log(lyric);
  useEffect(() => {
    const audio: ReactJkMusicPlayerAudioListProps = {
      name: file.name,
      musicSrc: fileUrl(),
      cover: cover,
      singer: '说说crystal',
      lyric: lyric,
    };
    console.log(audio);
    if (file.thumbnail) {
      audio.cover = file.thumbnail;
    }
    const audioList = lastFiles
      // .filter((item) => item.name !== file.name && item.type === type)
      .filter((item) => item.type === type)
      .map((item) => {
        let link = fileUrl(item);
        const audio = {
          name: item.name,
          musicSrc: link,
          cover: cover,
          singer: '说说crystal',
          lyric: lyric,
        };
        if (item.thumbnail) {
          audio.cover = item.thumbnail;
        }
        return audio;
      });
    if (audioList.length > 0) {
      setAudioLists(audioList);
    } else {
      setAudioLists([audio]);
    }
    setPlayIndex(audioList.findIndex((item) => item.name === file.name));
  }, []);
  return (
    <Box className="audio-box" w="full">
      <Center p="8" w="full">
        <Heading display="inline-flex" alignItems="center">
          <Icon
            color={getSetting("icon color") || "#1890ff"}
            as={getIcon(file.type, "")}
          />
          {t("Enjoy the music")}...
        </Heading>
      </Center>
    
      <ReactJkMusicPlayer
        audioLists={audioLists}
        theme={theme}
        locale={i18n.language === "zh" ? "zh_CN" : "en_US"}
        showLyric= {true}
        lyricClassName = {lyric}
        mode="full"
        autoPlay={getSetting("autoplay audio") === "true"}
        defaultPosition={{
          left: 20,
          bottom: 20,
        }}
        playIndex={playIndex}
        onPlayIndexChange={setPlayIndex}
        sortableOptions={{ disabled: mobile }}
        defaultVolume={volume}
        onAudioVolumeChange={(v) => setVolume(v)}
      />
    </Box>
  );
};

export default Audio;
