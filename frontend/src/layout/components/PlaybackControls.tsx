import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/pages/album/AlbumPage';
import { usePlayerStore } from '@/stores/usePlayerStore'
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'

const PlaybackControls = () => {
    const {isPlaying, currentSong, togglePlay, playNext, playPrevious}= usePlayerStore();
    const [volume, setVolume] = useState(75);
    const [isMuted, setIsMuted] = useState(false); 
    const prevVolumeRef = useRef(100); 
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {

        audioRef.current = document.querySelector("audio");
        const audio = audioRef.current;

        if(!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate",updateTime);
        audio.addEventListener("loadedmetadata",updateDuration);

        const handleEnded = () => {
            usePlayerStore.setState({isPlaying: false})
        }

        audio.addEventListener("ended",handleEnded);

        return () => {
            audio.removeEventListener("timeupdate",updateTime);
            audio.removeEventListener("loadedmetadata",updateDuration);
            audio.removeEventListener("ended",handleEnded);
        };

    },[currentSong]);

    const handleSeek = (value:number[]) => {
        if(audioRef.current){
            audioRef.current.currentTime = value[0];
        }
    }
    const toggleMute = () => {
    if (!isMuted) {
        prevVolumeRef.current = volume;       // Save current volume
        setVolume(0);
        if (audioRef.current) audioRef.current.volume = 0;
    } else {
        setVolume(prevVolumeRef.current);     // Restore previous volume
        if (audioRef.current) audioRef.current.volume = prevVolumeRef.current / 100;
    }
        setIsMuted(!isMuted);
    };

    return (<footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
        <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
            {/* current playing song */}
            <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
                {currentSong && (
                    <>
                        <img src={currentSong.imageUrl} alt={currentSong.title} className='w-14 h-14 object-cover rounded-md'/>
                        <div className='flex-1 min-w-0'>
                            <div className='font-medium truncate hover:underline cursor-pointer'>
                                {currentSong.title}
                            </div>
                            <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                                {currentSong.artist}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* player controls */}
            <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                <div className='flex items-center gap-4 sm:gap-6'>
                    
                    {/* shuffle */}
                    <Button size="icon" variant="ghost" className="hidden sm:inline-flex hover:text-white text-zinc-400">
                        <Shuffle className="h-4 w-4"/>
                    </Button>
                    {/* backward */}
                    <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400" onClick={playPrevious} disabled={!currentSong}>
                        <SkipBack className="h-4 w-4"/>
                    </Button>

                    {/* play/pause */}
                    <Button size='icon' className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8' onClick={togglePlay} disabled={!currentSong}>
                        {isPlaying ? <Pause className="h-5 w-5 fill-black"/> : <Play className="h-5 w-5 fill-black"/>}
                    </Button>

                    {/* forward */}
                    <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400" onClick={playNext} disabled={!currentSong}>
                        <SkipForward className="h-4 w-4"/>
                    </Button>

                    {/* repeat */}
                    <Button size="icon" variant="ghost" className="hidden sm:inline-flex hover:text-white text-zinc-400">
                        <Repeat className="h-4 w-4"/>
                    </Button>
                </div>

                <div className='hidden sm:flex items-center gap-2 w-full'>
                    <div className='text-sm text-zinc-400'>{formatDuration(Math.round(currentTime))}</div>
                    <Slider value={[currentTime]} max={duration || 100} step={1} className='w-full hover:cursor-pointer active:cursor-pointer' onValueChange={handleSeek}/>
                    <div className='text-sm text-zinc-400'>{formatDuration(Math.round(duration))}</div>
                </div>
            </div>

            {/* volume controls */}
            <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
                <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                    <Mic2 className="h-4 w-4"/>
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                    <ListMusic className="h-4 w-4"/>
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                    <Laptop2 className="h-4 w-4"/>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400" onClick={toggleMute}>
                        {isMuted || volume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume1 className="h-4 w-4" />
                        )}
                    </Button>
                    <Slider value={[volume]} max={100} step={1} className='w-24 hover:cursor-pointer active:cursor-pointer'
                    onValueChange={(value) => {
                        setVolume(value[0])
                        if (audioRef.current){
                            audioRef.current.volume = value[0] / 100
                        }
                    }}/>
                </div>
            </div>
        </div>
    </footer>
    )

}

export default PlaybackControls