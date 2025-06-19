import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <Link to="/" className="rounded-lg">
          <img src="/spotify.png" alt="Spotify Logo" className="size-10" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Music Manager</h1>
          <p className="text-zinc-400 mt-1">Manage your music catalog</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center">
        <UserButton />
      </div>
    </div>

  )
}

export default Header