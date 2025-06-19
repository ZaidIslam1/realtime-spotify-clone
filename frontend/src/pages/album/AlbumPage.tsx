import { useMusicStore } from "@/stores/useMusicStore";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ColorThief from "colorthief";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import AudioVisualizer from "@/components/ui/audio-visualizer";

export const formatDuration = (seconds: number | undefined) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const rounded = Math.floor(seconds); // remove milliseconds
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};


const AlbumPage = () => {
  const { albumId } = useParams();
  const { isLoading, currentAlbum, fetchAlbumById } = useMusicStore();
  const {currentSong, isPlaying, playAlbum, togglePlay} = usePlayerStore();

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(song => song._id === currentSong?._id) && isPlaying;  
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum?.songs, 0);
    }
  }

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index)
  }

  const imgRef = useRef<HTMLImageElement>(null);
  const [dominantColor, setDominantColor] = useState<string>("rgba(80, 56, 160, 0.8)");

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [albumId, fetchAlbumById]);

  const handleImageLoad = () => {
    if (imgRef.current) {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(imgRef.current);
        const rgba = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
        setDominantColor(rgba);
      } catch (error) {
        console.error("ColorThief error:", error);
        setDominantColor("rgba(80, 56, 160, 0.8)"); // fallback
      }
    }
  };

  if (isLoading) return null;

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">

          {/* Dynamic Background Gradient */}
          <div
            className="absolute inset-0 pointer-events-non transition-all duration-700 min-h-screen"
            aria-hidden="true"
            style={{
              background: `linear-gradient(to bottom, ${dominantColor}, #18181b 80%, #18181b)`,
            }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-4 md:gap-6 pb-8">
              <img
                ref={imgRef}
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-full max-w-[240px] h-auto shadow-xl rounded mx-auto md:mx-0"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
              />
              <div className="flex flex-col justify-end text-center md:text-left mt-4 md:mt-0">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold my-4">{currentAlbum?.title}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">{currentAlbum?.artist}</span>
                  <span className="font-medium text-white">• {currentAlbum?.releaseYear}</span>
                  <span className="font-medium text-white">• {currentAlbum?.songs.length} songs</span>
                </div>
              </div>
            </div>

            {/* Play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
                <Button onClick={() => handlePlayAlbum()} size="icon" className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all'>
                  {isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                    <Pause className="h-12 w-12 text-black fill-black transform scale-125"/>
                  ) : (
                    <Play className="h-12 w-12 text-black fill-black transform scale-125"/>
                  )}
                </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/2 backdrop-blur-sm ">
                {/* Table header */}
                <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                    <div>#</div>
                    <div>Title</div>
                    <div>Released Date</div>
                    <div><Clock className="h-4 w-4"/></div>
                </div>
            </div>

            {/* Songs List */}
            <div className="px-6">
                <div className="space-y-2 py-4">
                    {currentAlbum?.songs.map((song, index)=> {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div onClick={() => handlePlaySong(index)} key={song._id} className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}>
                            <div className="flex items-center justify-center">
                               {isCurrentSong && isPlaying ? (
                                  <AudioVisualizer barCount={4} />
                                ) : (
                                  <>
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <Play className="h-4 w-4 hidden group-hover:block" />
                                  </>
                                )}
                            </div>
                            <div className='flex items-center gap-3'>
                                <img src={song.imageUrl} alt={song.title} className='size-10' />

                                <div>
                                    <div className={`font-medium text-white`}>{song.title}</div>
                                    <div>{song.artist}</div>
                                </div>
                            </div>

                            <div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
                            <div className='flex items-center'>{formatDuration(song.duration)}</div>
                        </div>
                      )})} 
                </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
