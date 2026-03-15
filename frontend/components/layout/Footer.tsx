import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg">
               <Play className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              CINE<span className="text-primary">TUBE</span>
            </span>
          </Link>
          <p className="text-secondary-foreground text-sm">
            The ultimate destination for movie enthusiasts. Stream your favorite content, read authentic reviews, and manage your watchlist all in one place.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-colors">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-colors">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-colors">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-colors">
              <Youtube className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-white font-bold">Portal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              <li><Link href="/movies" className="hover:text-primary">Movies</Link></li>
              <li><Link href="/series" className="hover:text-primary">Series</Link></li>
              <li><Link href="/top-rated" className="hover:text-primary">Top Rated</Link></li>
              <li><Link href="/new-releases" className="hover:text-primary">New Releases</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Account</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary">Sign Up</Link></li>
              <li><Link href="/watchlist" className="hover:text-primary">My Watchlist</Link></li>
              <li><Link href="/profile" className="hover:text-primary">Profile Setting</Link></li>
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-white font-bold">Support</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs text-center md:text-left">
          © {new Date().getFullYear()} CineTube. All rights reserved. Built with ❤️ for Cinema lovers.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span className="hover:text-white cursor-pointer">Security</span>
          <span className="hover:text-white cursor-pointer">Cookies</span>
          <span className="hover:text-white cursor-pointer">About Us</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
