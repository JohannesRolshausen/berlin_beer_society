import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function useDocumentMeta({ title, description, image, url }: MetaOptions): void {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper to create or update meta tags
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

    // Update meta tags if values are provided
    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description);
      updateMeta('twitter:description', description);
    }

    if (image) {
      updateMeta('og:image', image);
      updateMeta('twitter:image', image);
    }

    if (url) {
      updateMeta('og:url', url);
    }

    // Set standard Open Graph tags
    updateMeta('og:type', 'article');
    updateMeta('twitter:card', 'summary_large_image');
    
    if (title) {
      updateMeta('og:title', title);
      updateMeta('twitter:title', title);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Berlin Beer Society'; // Default title
    };
  }, [title, description, image, url]);
}