import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApiRequest } from '../../hooks/useApiRequest';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  TagIcon,
  ArrowRightIcon,
  SearchIcon,
  ChevronRightIcon
} from 'lucide-react';

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

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApiRequest();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get('/api/get-all-blogs');
        if (res.success && Array.isArray(res.data)) {
          setBlogPosts(res.data);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError('Failed to fetch blogs');
      }
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  // You can update categories based on your backend if needed
  const categories = ['All'];

  // Filter posts based on search
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EcoClean Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Insights, tips, and stories about sustainable living and environmental consciousness in Sri Lanka
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loading/Error State */}
      {loading && (
        <div className="py-16 text-center text-lg text-gray-500">Loading blogs...</div>
      )}
      {error && (
        <div className="py-16 text-center text-lg text-red-500">{error}</div>
      )}

      {/* Category Filter (if categories are dynamic, update accordingly) */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
            </h2>
            <span className="text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Link to={`/blog/${post._id}`} key={post._id} className="block">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500">
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded-t-xl" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter for the latest insights on sustainable living and environmental tips.
            </p>
            <div className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
