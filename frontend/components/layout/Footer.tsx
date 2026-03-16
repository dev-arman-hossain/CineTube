import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4 md:px-12">
      <div className="flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
               <Play className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white font-outfit uppercase">
              CINE<span className="text-primary">TUBE</span>
            </span>
          </Link>
          <p className="text-secondary-foreground text-sm leading-relaxed">
            The ultimate destination for movie enthusiasts. Stream your favorite content, read authentic reviews, and manage your watchlist all in one place.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:scale-110 transition-all border border-white/5">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:scale-110 transition-all border border-white/5">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:scale-110 transition-all border border-white/5">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:scale-110 transition-all border border-white/5">
              <Youtube className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Portal</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground font-medium">
              <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/series" className="hover:text-primary transition-colors">Series</Link></li>
              <li><Link href="/top-rated" className="hover:text-primary transition-colors">Top Rated</Link></li>
              <li><Link href="/new-releases" className="hover:text-primary transition-colors">New Releases</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Account</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground font-medium">
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link href="/watchlist" className="hover:text-primary transition-colors">My Watchlist</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">Profile Setting</Link></li>
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground font-medium">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-xs font-medium text-center md:text-left">
          © {new Date().getFullYear()} CineTube. All rights reserved. Crafted for Cinema lovers.
        </p>
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="hover:text-primary cursor-pointer transition-colors">Security</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
          <span className="hover:text-primary cursor-pointer transition-colors">About Us</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
