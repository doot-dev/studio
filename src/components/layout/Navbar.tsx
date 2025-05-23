
import Link from 'next/link';
import { Film, Search, HomeIcon, LayoutGrid, ListVideo, Users, Settings, UserCircle, PlusSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  // Placeholder for authentication state
  const isAuthenticated = true;
  const user = { name: 'Demo User', email: 'demo@example.com', avatarUrl: 'https://placehold.co/40x40.png?text=DU' };

  const navLinks = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/genres', label: 'Genres', icon: <LayoutGrid className="h-5 w-5" /> },
    { href: '/watchlist', label: 'My List', icon: <ListVideo className="h-5 w-5" /> }, // Watchlist page repurposed as My List
    { href: '/community', label: 'Community', icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Film className="h-7 w-7 text-accent" />
          <span className="font-bold text-xl whitespace-nowrap">DootRec</span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => (
            <Button key={link.label} variant="ghost" asChild className="px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              <Link href={link.href} className="flex items-center space-x-2">
                {link.icon}
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex-1 flex justify-center items-center max-w-xs sm:max-w-md mx-auto pl-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search titles, genres..."
              className="w-full rounded-full pl-10 pr-4 py-2 h-10 bg-muted/50 focus:bg-card text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/create">
              <PlusSquare className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Review</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} data-ai-hint="user avatar small" />
                    <AvatarFallback>{user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile/me">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {/* <LogOut className="mr-2 h-4 w-4" /> */}
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
