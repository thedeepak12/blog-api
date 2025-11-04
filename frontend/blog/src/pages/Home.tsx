import { useState, useEffect } from 'react';
import BlogPost from '../components/BlogPost';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: {
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HomeProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function Home({ onLogout, isAuthenticated }: HomeProps) {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
          credentials: 'include'
        });
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          
          if (data && Array.isArray(data.posts)) {
            setPosts(data.posts);
          } else {
            console.warn('Unexpected data format:', data);
            setPosts([]);
          }
        } else {
          console.error('Failed to fetch posts:', response.statusText);
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
          {isAuthenticated ? null : (
            <div className="space-x-4">
              <a
                href="/login"
                className="px-4 py-2 bg-gray-900 text-white rounded-md outline-1 outline-white"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 bg-gray-900 text-white rounded-md outline-1 outline-white"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-20">
          {posts.length > 0 ? (
            posts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No blog posts available at the moment.</p>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex justify-end mb-8">
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
