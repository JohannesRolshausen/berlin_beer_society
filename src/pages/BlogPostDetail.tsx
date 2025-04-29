import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/BlogPostDetail.css';
import '../styles/ImageCredit.css';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  jetpack_featured_media_url?: string;
  author: number;
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      link?: string;
    }>;
    'wp:term'?: Array<Tag[]>;
    'wp:featuredmedia'?: Array<{
      id: number;
      caption?: {
        rendered: string;
      };
      alt_text?: string;
      description?: {
        rendered: string;
      };
      media_details?: {
        width: number;
        height: number;
      };
    }>;
  };
  tags?: number[];
}

function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string>('');
  const [photographer, setPhotographer] = useState<string>('');

  // Helper function to strip HTML tags for meta description
  const stripHtml = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  // Set meta tags when post is loaded
  useEffect(() => {
    if (post) {
      const cleanTitle = stripHtml(post.title.rendered);
      const description = stripHtml(post.content.rendered).substring(0, 160) + '...';
      
      // Set page title
      document.title = `${cleanTitle} | Berlin Beer Society`;
      
      // Update meta tags
      const updateMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[property="${name}"]`);
        
        if (!meta) {
          meta = document.createElement('meta');
          if (name.startsWith('og:') || name.startsWith('twitter:')) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
      };
      
      // Set description
      updateMeta('description', description);
      
      // Open Graph tags
      updateMeta('og:title', cleanTitle);
      updateMeta('og:description', description);
      updateMeta('og:url', window.location.href);
      updateMeta('og:type', 'article');
      
      // Image
      if (post.jetpack_featured_media_url) {
        updateMeta('og:image', post.jetpack_featured_media_url);
      }
      
      // Twitter Card tags
      updateMeta('twitter:card', 'summary_large_image');
      updateMeta('twitter:title', cleanTitle);
      updateMeta('twitter:description', description);
      
      if (post.jetpack_featured_media_url) {
        updateMeta('twitter:image', post.jetpack_featured_media_url);
      }
      
      // Debug: Log meta tags to console
      console.log('Meta tags updated:', {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        twitterImage: document.querySelector('meta[property="twitter:image"]')?.getAttribute('content')
      });
      
      return () => {
        document.title = 'Berlin Beer Society'; // Reset title when component unmounts
      };
    }
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/beersociety.berlin/posts/${id}?_embed=true`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data);
        
        // Extract photographer from filename if available
        if (data.jetpack_featured_media_url) {
          const url = data.jetpack_featured_media_url;
          
          // Get the filename from the URL
          const urlParts = url.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          // Extract photographer info using regex patterns
          // Looking for patterns like "foto_name" or "foto_firstname_lastname"
          if (filename.toLowerCase().includes('foto_')) {
            const nameParts = filename.split('foto_')[1].split('.')[0].split('_');
            let photographerName = nameParts.map((part: string) => 
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' ');
            
            setPhotographer(`Foto: ${photographerName}`);
          }
          // Check also for patterns with "foto-name" with dash instead of underscore
          else if (filename.toLowerCase().includes('foto-')) {
            const nameParts = filename.split('foto-')[1].split('.')[0].split(/[-_]/);
            let photographerName = nameParts.map((part: string) => 
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' ');
            
            setPhotographer(`Foto: ${photographerName}`);
          }
          // Check also for pattern ending with photographer name: "xyz_foto_name.jpg"
          else if (filename.toLowerCase().includes('_foto_')) {
            const nameParts = filename.split('_foto_')[1].split('.')[0].split('_');
            let photographerName = nameParts.map((part: string) => 
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' ');
            
            setPhotographer(`Foto: ${photographerName}`);
          }
        }
        
        // Try to extract caption if we have access to featured media (unlikely due to auth)
        if (data._embedded && 
            data._embedded['wp:featuredmedia'] && 
            data._embedded['wp:featuredmedia'][0] && 
            typeof data._embedded['wp:featuredmedia'][0] === 'object' && 
            !data._embedded['wp:featuredmedia'][0].code) {
          
          const featuredMedia = data._embedded['wp:featuredmedia'][0];
          
          if (featuredMedia.caption && featuredMedia.caption.rendered) {
            const captionText = featuredMedia.caption.rendered;
            const stripHtmlTags = (html: string) => {
              return html.replace(/<\/?[^>]+(>|$)/g, "");
            };
            const cleanCaption = stripHtmlTags(captionText).trim();
            
            if (cleanCaption.toLowerCase().includes('foto:')) {
              setPhotographer(cleanCaption);
            }
          }
        }
        
        // Versuche den Autor aus Tags zu extrahieren (erster Workaround)
        if (data._embedded && data._embedded['wp:term']) {
          // wp:term[1] enthält üblicherweise die Tags
          const tags = data._embedded['wp:term'][1];
          if (tags && tags.length > 0) {
            // Wir gehen davon aus, dass der erste Tag der Autor ist
            // (basierend auf dem Beispiel, wo "Martin" als Tag verwendet wird)
            setAuthorName(tags[0].name);
          }
        }
        
        // Wenn kein Autor über Tags gefunden wurde, versuche andere Methoden
        if (!authorName) {
          // Versuche Methode 1: _embedded.author (wird wahrscheinlich nicht funktionieren wegen Auth)
          if (data._embedded?.author?.[0]?.name) {
            const author = data._embedded.author[0].name;
            setAuthorName(author);
          } 
        }

      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load this blog post. Please try again later.');
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

  if (loading) {
    return <div className="loading">Beitrag wird geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Beitrag nicht gefunden.</div>;
  }

  return (
    <div className="blog-post-detail">
      <Link to="/blog" className="back-link">← Zurück zum Blog</Link>
      
      <article className="post">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        
        <div className="post-meta">
          <span className="post-date">{formatDate(post.date)}</span>
        </div>
        
        {post.jetpack_featured_media_url && (
          <div className="featured-image image-container">
            <img src={post.jetpack_featured_media_url} alt={post.title.rendered} />
            {photographer && (
              <div className="image-credit">{photographer}</div>
            )}
          </div>
        )}
        
        <div 
          className="post-content" style={{padding: '0.5rem'}}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
        />
        
        <div className="post-footer">
          <em>
            {authorName && `${authorName} • `}
            {formatDate(post.date)}
          </em>
        </div>
      </article>
    </div>
  );
}

export default BlogPostDetail; 