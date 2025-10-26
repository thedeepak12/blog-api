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
}

export default function Home({ onLogout }: HomeProps) {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        } else {
          setError('Failed to load blog posts');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
        </div>

        <div className="space-y-6 mb-20">
          {error ? (
            <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            posts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))
          )}
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
