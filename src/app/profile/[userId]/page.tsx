import Image from 'next/image';
import { mockUsers, mockReviews } from '@/data/mock';
import { PostCard } from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Check } from 'lucide-react';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const userId = params.userId === 'me' ? mockUsers[0].id : params.userId; // 'me' alias for first mock user
  const user = mockUsers.find(u => u.id === userId);
  const userReviews = mockReviews.filter(review => review.userId === userId);
  
  // Placeholder for saved content
  const savedContent = mockReviews.slice(0, 1).filter(review => review.userId !== userId);


  if (!user) {
    return <p className="text-center text-destructive py-10">User not found.</p>;
  }

  // Placeholder follow state
  const isFollowing = false;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-card rounded-lg shadow-md">
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-primary">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} data-ai-hint="user avatar large"/>
          <AvatarFallback className="text-4xl">{user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">{user.name}</h1>
          <p className="text-muted-foreground mb-4">@{user.id}</p>
          <div className="flex justify-center sm:justify-start space-x-6 mb-4 text-sm">
            <div><span className="font-semibold">{user.postsCount || 0}</span> Posts</div>
            <div><span className="font-semibold">{user.followersCount || 0}</span> Followers</div>
            <div><span className="font-semibold">{user.followingCount || 0}</span> Following</div>
          </div>
          {/* Assuming this is not the current user's profile for follow button display */}
          {params.userId !== 'me' && (
            <Button variant={isFollowing ? "secondary" : "default"} className="bg-accent hover:bg-accent/80 text-accent-foreground">
              {isFollowing ? <Check className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-96 mx-auto mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {userReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userReviews.map((review) => (
                <PostCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">{user.name} hasn't posted any reviews yet.</p>
          )}
        </TabsContent>
        <TabsContent value="saved">
          {savedContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedContent.map((review) => (
                <PostCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
          <p className="text-center text-muted-foreground py-10">No saved content to display.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
