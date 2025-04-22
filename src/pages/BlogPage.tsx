import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPage.css';
import '../styles/ImageCredit.css';

interface BlogPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  jetpack_featured_media_url?: string;
}

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Direkter Abruf der Blog-Beiträge über Kategorie-ID (273 für Blog)
        const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/beersociety.berlin/posts?categories=273');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Fehler beim Laden der Blog-Beiträge.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Function to remove HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  // Function to decode HTML entities and truncate text
  const formatExcerpt = (htmlContent: string, maxLength: number = 105) => {
    // First decode HTML entities using DOMParser
    const decodedText = stripHtml(htmlContent);
    
    // Then truncate to max length
    if (decodedText.length <= maxLength) {
      return decodedText;
    }
    
    // Find the last space before maxLength
    const truncatedText = decodedText.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    
    // Return truncated text at word boundary
    if (lastSpaceIndex > 0) {
      return truncatedText.substring(0, lastSpaceIndex) + '...';
    }
    
    // If no space found, just cut at maxLength
    return truncatedText + '...';
  };

  return (
    <div className="blog-page">
      <h1>Berlin Beer Blog</h1>
      
      {loading && <div className="loading">Posts werden geladen...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && posts.length === 0 && (
        <div className="no-posts">Keine Blog-Beiträge gefunden.</div>
      )}
      
      <div className="blog-posts">
        {posts.map(post => (
          <article key={post.id} className="blog-post-card">
            {post.jetpack_featured_media_url && (
              <Link to={`/blog/${post.id}`}>
              <div className="post-image image-container">
                <img src={post.jetpack_featured_media_url} alt={stripHtml(post.title.rendered)} />
              </div>
              </Link>
            )}
            <Link to={`/blog/${post.id}`}>
            <div className="post-content">
              <h2>
                {stripHtml(post.title.rendered)}
              </h2>
              <div className="post-date">{formatDate(post.date)}</div>
              <div className="post-excerpt">
                <p>{formatExcerpt(post.excerpt.rendered)}</p>
              </div>
            </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPage; 