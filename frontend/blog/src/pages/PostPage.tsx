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
}

export default function PostPage({ onLogout }: PostPageProps) {
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
      <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
            {error || 'Post not found'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
          >
            ← Back to Blog
          </button>
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

        <div className="flex justify-end mt-12 mb-8">
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
