import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiRequest } from '../../hooks/useApiRequest';
import { CalendarIcon, UserIcon } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  imageUrl: string;
  author: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { get } = useApiRequest();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get(`/api/get-blog/${id}`);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
      }
      setLoading(false);
    };
    if (id) fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="py-16 text-center text-lg text-gray-500">Loading...</div>;
  if (error) return <div className="py-16 text-center text-lg text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{blog.author}</span>
          </div>
        </div>
        {blog.imageUrl && (
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover rounded-xl mb-8" />
        )}
        <div className="text-lg text-gray-700 mb-8">
          {blog.description}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
