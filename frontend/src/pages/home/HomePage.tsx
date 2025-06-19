import Topbar from '@/components/Topbar'
import { useMusicStore } from '@/stores/useMusicStore'
import { useEffect } from 'react'
import FeaturedSection from './components/FeaturedSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import SectionGrid from './components/SectionGrid';
import { usePlayerStore } from '@/stores/usePlayerStore';

const Homepage = () => {

  const {madeForYouSongs, featuredSongs, trendingSongs, fetchMadeForYouSongs, fetchFeaturedSongs, fetchTrendingSongs, isLoading} = useMusicStore();
  const {initializeQueue} = usePlayerStore();

  useEffect(()=>{
    fetchMadeForYouSongs();
    fetchFeaturedSongs();
    fetchTrendingSongs();

  }, [fetchMadeForYouSongs, fetchFeaturedSongs, fetchTrendingSongs])

  useEffect(() => {
    if(madeForYouSongs.length > 0 && featuredSongs.length > 0  && trendingSongs.length > 0 ){
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }

  },[initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);

  return (
    <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
      <Topbar/>
      <ScrollArea className='h-[calc(100vh-180px)]'>
        <div className='p-4 sm:p-6'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good Afternoon</h1>
          <FeaturedSection songs={featuredSongs}/>
        
          <div className='space-y-8'>
            <SectionGrid title="MadeForYou" songs={madeForYouSongs} isLoading={isLoading}/>
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>
          </div>  
        </div>

      </ScrollArea>
    </main>
  )
}

export default Homepage