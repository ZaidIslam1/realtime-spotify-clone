import { usePlayerStore } from '@/stores/usePlayerStore'
import { useEffect, useRef } from 'react'

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null)
    const prevSongRef = useRef<string | null>(null)

    const {currentSong, isPlaying, playNext, endOfQueue} = usePlayerStore();

    // handle play/pause logic
    useEffect(() => {
        if (isPlaying) { 
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    // handle song ends
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => {
            playNext();
        }
        audio?.addEventListener("ended", handleEnded);
        return () => audio?.removeEventListener("ended", handleEnded);

    }, [playNext])

    // handle song changes
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;
        const audio = audioRef.current

        // check if the song is changed
        const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChanged || endOfQueue){
            audio.src = currentSong?.audioUrl;
            audio.currentTime = 0;
            prevSongRef.current = currentSong?.audioUrl
            if (isPlaying) audio.play();
        }

    },[currentSong, isPlaying])
    return (
        <audio ref={audioRef}/>
    )
}

export default AudioPlayer