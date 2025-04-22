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
          // Methode 3: Versuch eines separaten API-Aufrufs (auch Auth-Problem)
          else if (data.author) {
            try {
              const authorResponse = await fetch(`https://public-api.wordpress.com/wp/v2/sites/beersociety.berlin/users/${data.author}`);
              if (authorResponse.ok) {
                const authorData = await authorResponse.json();
                if (authorData.name) {
                  setAuthorName(authorData.name);
                }
              }
            } catch (error) {
              console.error("Fehler beim Abrufen des Autors:", error);
            }
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