
import { mockUsers } from '@/data/mock';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Check } from 'lucide-react';

export default function CommunityPage() {
  // Placeholder follow state logic
  const getFollowState = (userId: string) => {
    // In a real app, this would check against the current user's following list
    return userId === 'user2'; // Example: current user follows user2
  };

  return (
    <div className="space-y-8">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Community Hub
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and connect with other DootRec users. Follow reviewers whose tastes align with yours!
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockUsers.map((user) => {
          const isFollowing = getFollowState(user.id);
          return (
            <Card key={user.id} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pt-6">
                <Avatar className="h-24 w-24 mx-auto border-4 border-accent">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} data-ai-hint="user avatar community" />
                  <AvatarFallback className="text-3xl">{user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="text-xl mb-1">
                  <Link
                    href={`/profile/${user.id}`}
                    className="hover:text-accent transition-colors"
                    >
                    {user.name}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-2">@{user.id}</p>
                <div className="flex justify-center space-x-4 text-xs text-muted-foreground mb-3">
                  <span><span className="font-semibold text-foreground">{user.postsCount || 0}</span> Reviews</span>
                  <span><span className="font-semibold text-foreground">{user.followersCount || 0}</span> Followers</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 px-2">
                  User bio placeholder. Passionate about indie films and sci-fi series.
                </p>
              </CardContent>
              <CardFooter className="w-full p-4 border-t border-border/50">
                {/* In a real app, this button would trigger a follow/unfollow action */}
                <Button 
                  variant={isFollowing ? "secondary" : "default"} 
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground data-[state=following]:bg-secondary data-[state=following]:text-secondary-foreground"
                  data-state={isFollowing ? 'following' : 'not-following'}
                >
                  {isFollowing ? <Check className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
