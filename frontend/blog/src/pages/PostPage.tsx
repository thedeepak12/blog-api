import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

interface PostPageProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function PostPage({ onLogout, isAuthenticated }: PostPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-gray-400 text-lg">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-gray-900 px-4 sm:px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{error || 'Post not found'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
          >
            &larr; Back to blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 px-4 sm:px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 text-lg font-medium cursor-pointer"
          >
            &larr; Back to blog
          </button>
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-400 space-x-4">
            <span>By {post.author.username}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span>•</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex justify-end mb-8 mt-20">
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
