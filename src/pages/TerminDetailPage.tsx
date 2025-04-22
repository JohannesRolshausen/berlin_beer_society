import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/TerminDetailPage.css';

interface TerminPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  jetpack_featured_media_url?: string;
}

function TerminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<TerminPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/beersociety.berlin/posts/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching termin post:', err);
        setError('Failed to load this termin. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Termin wird geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Termin nicht gefunden.</div>;
  }

  return (
    <div className="termin-detail-page">
      <Link to="/termine" className="back-link">← Zurück zur Terminübersicht</Link>
      
      <article className="termin">
        <header className="termin-header">
          <div className="termin-date-time">
            <div className="termin-date">{formatDate(post.date)}</div>
            <div className="termin-time">{formatTime(post.date)} Uhr</div>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </header>
        
        {post.jetpack_featured_media_url && (
          <div className="featured-image">
            <img src={post.jetpack_featured_media_url} alt={post.title.rendered} />
          </div>
        )}
        
        <div 
          className="termin-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
        />
      </article>
    </div>
  );
}

export default TerminDetailPage; 