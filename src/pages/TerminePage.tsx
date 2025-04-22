import { useState, useEffect } from 'react';
import '../styles/TerminePage.css';
import '../styles/ImageCredit.css';

interface TerminPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  jetpack_featured_media_url?: string;
}

interface EventDetails {
  location: string;
  eventDate: string;
  eventTime: string;
  eventLink: string;
  eventInfo: string;
}

function TerminePage() {
  const [posts, setPosts] = useState<TerminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermine = async () => {
      try {
        setLoading(true);
        // Direkter Abruf der Termine über Kategorie-ID
        const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/beersociety.berlin/posts?categories=145526');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching termine:', err);
        setError('Fehler beim Laden der Termine.');
      } finally {
        setLoading(false);
      }
    };

    fetchTermine();
  }, []);

  // Function to remove HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Parse event details from post content or excerpt
  const parseEventDetails = (post: TerminPost): EventDetails => {
    // Default values as fallbacks
    const defaultDetails: EventDetails = {
      location: 'Berlin',
      eventDate: "",
      eventTime: "",
      eventLink: "",
      eventInfo: ""
    };
    
    try {
      // Try to extract data from excerpt first, then content if needed
      const contentToSearch = post.excerpt.rendered || post.content.rendered;
      const textContent = stripHtml(contentToSearch);
      
      // Log the raw text for debugging
      // console.log(`Raw content for ${post.id}:`, textContent);
      
      // First try the semicolon-separated format "Ort; Datum; Uhrzeit; Link;"
      let parts = textContent.split(';').map(part => part.trim());
      
      if (parts.length >= 3) {
        return {
          location: parts[0] || defaultDetails.location,
          eventDate: parts[1] || defaultDetails.eventDate,
          eventTime: parts[2] || defaultDetails.eventTime,
          eventLink: parts.length > 3 ? parts[3] : defaultDetails.eventLink,
          eventInfo: parts.length > 4 ? parts[4] : defaultDetails.eventInfo
        };
      }
      
      // If semicolon splitting didn't work well, try alternative approaches
      // For the format where data is on separate lines
      parts = textContent.split(/[\n\r]+/).map(part => part.trim()).filter(Boolean);
      
      if (parts.length >= 3) {
        // Typical format: Location on line 1, date on line 2, time on line 3, link on line 4
        return {
          location: parts[0] || defaultDetails.location,
          eventDate: parts[1] || defaultDetails.eventDate,
          eventTime: parts[2] || defaultDetails.eventTime,
          eventLink: parts.length > 3 ? parts[3] : defaultDetails.eventLink,
          eventInfo: parts.length > 4 ? parts.slice(4).join(' ') : defaultDetails.eventInfo
        };
      }
      
      return defaultDetails;
    } catch (err) {
      console.error('Error parsing event details:', err);
      return defaultDetails;
    }
  };

  // Helper function to convert a German date string (DD.MM.YYYY) to a JavaScript Date object
  const parseGermanDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== 'string') {
      return new Date(0); // Return earliest possible date if invalid
    }
    
    try {
      // Clean the input string first - remove multiple spaces and normalize format
      const cleanDateStr = dateStr
        .trim()
        .replace(/\s+/g, ' ')      // Normalize spaces
        .replace(/(\d+)\.\s+/g, '$1.') // Remove spaces after dots
        .replace(/\s+\./g, '.');   // Remove spaces before dots
      
      // Try different common German date formats
      
      // First try extracting with regex to handle various separators
      const dateRegex = /(\d{1,2})[.\s-]+(\d{1,2})[.\s-]+(\d{4})/;
      const match = cleanDateStr.match(dateRegex);
      
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
        const year = parseInt(match[3], 10);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
      
      // Fallback to simple splitting by dots or spaces
      let parts: string[] = [];
      if (cleanDateStr.includes('.')) {
        parts = cleanDateStr.split('.');
      } else if (cleanDateStr.includes(' ')) {
        parts = cleanDateStr.split(' ');
      } else if (cleanDateStr.includes('-')) {
        parts = cleanDateStr.split('-');
      }
      
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        let year = parseInt(parts[2], 10);
        
        // Handle two-digit years
        if (year < 100) {
          year += 2000;
        }
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
      
      // If we couldn't parse it in any expected format, log for debugging
      console.warn(`Couldn't parse date string: ${dateStr}`);
      return new Date(0);
    } catch (err) {
      console.error(`Error parsing date string: ${dateStr}`, err);
      return new Date(0);
    }
  };

  // Get sorted posts - earliest date first!
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = parseGermanDate(parseEventDetails(a).eventDate);
    const dateB = parseGermanDate(parseEventDetails(b).eventDate);
    
    // Simple chronological sort - earliest date first
    // We need to REVERSE the order here - get the smaller timestamps first
    return dateA.getTime() - dateB.getTime();
  });

  // Debug: Log all parsed dates
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => {
        const details = parseEventDetails(post);
        const originalDate = details.eventDate;
        const parsedDate = parseGermanDate(details.eventDate);
        console.log(`${post.title.rendered}: Original="${originalDate}", Parsed=${parsedDate.toISOString()}`);
      });
    }
  }, [posts]);

  // Debug: Log the sorted order
  useEffect(() => {
    if (sortedPosts.length > 0) {
      sortedPosts.forEach(post => {
        const details = parseEventDetails(post);
      });
    }
  }, [sortedPosts]);

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

  return (
    <div className="termine-page">
      <h1>Termine</h1>
      
      {loading && <div className="loading">Termine werden geladen...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && sortedPosts.length === 0 && (
        <div className="no-posts">Keine Termine gefunden.</div>
      )}
      
      <div className="termine-list">
        {sortedPosts.map(post => {
          const eventDetails = parseEventDetails(post);
          
          return (
            <article key={post.id} className="termin-card">
              <div className="termin-media">
                {post.jetpack_featured_media_url ? (
                <>
                  <div className="termin-image image-container">
                    <img src={post.jetpack_featured_media_url} alt={stripHtml(post.title.rendered)} />
                  </div>
                  <div className="termin-date">
                    <div className="date-day">{eventDetails.eventDate}</div>
                    <div className="date-time">{eventDetails.eventTime}</div>
                  </div>
                </>
                ) : (
                <div className="termin-date">
                  <div className="date-day">{eventDetails.eventDate}</div>
                  <div className="date-time">{eventDetails.eventTime}</div>
                </div>
                )}
              </div>
              
              <div className="termin-content">
                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                
                <div className="termin-location">
                  <strong>Ort:</strong> {eventDetails.location}
                </div>
                
                <div className="termin-details">{eventDetails.eventInfo}</div>
                
                <a 
                  href={eventDetails.eventLink} 
                  className="read-more"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Details ansehen
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default TerminePage; 