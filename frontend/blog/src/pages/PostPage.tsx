import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Comment {
  id: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: {
    username: string;
  };
  comments: Comment[];
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('PostPage - currentUser state changed:', currentUser);
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await fetch(`http://localhost:3000/posts/${id}`);
        
        if (!postResponse.ok) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        const postData = await postResponse.json();
        setPost(postData);
        
        try {
          const userResponse = await fetch('http://localhost:3000/auth/me', {
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setCurrentUser(userData);
          } else if (userResponse.status === 401) {
            setCurrentUser(null);
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setCurrentUser(null);
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

  const handleAddComment = async (content: string) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, newComment]
        };
      });

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 sm:px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-400">Loading post...</p>
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
            className="text-gray-400 hover:text-white text-lg font-medium cursor-pointer"
          >
            &larr; Back to blog
          </button>
          {!isAuthenticated && (
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

        <div className="max-w-4xl mx-auto">
          <article className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>By {post.author.username}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line text-white">{post.content}</p>
            </div>
          </article>

          <section className="border-t border-gray-800 pt-8">
            <CommentsSection
              comments={post.comments || []}
              onAddComment={handleAddComment}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </section>

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
    </div>
  );
}
