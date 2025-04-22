import React, { useEffect, useRef } from 'react';

interface AdProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

const AdComponent: React.FC<AdProps> = ({ adSlot, adFormat = 'auto', style = {} }) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only try to load ads if we're in a browser environment
    if (typeof window !== 'undefined' && adRef.current) {
      try {
        // Clear previous ad if any
        if (adRef.current.childNodes.length > 0) {
          adRef.current.innerHTML = '';
        }
        
        // Create a new ins element for the ad
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.textAlign = 'center';
        adElement.setAttribute('data-ad-client', 'ca-pub-8356792861759837');
        adElement.setAttribute('data-ad-slot', adSlot);
        adElement.setAttribute('data-ad-format', adFormat);
        adElement.setAttribute('data-full-width-responsive', 'true');
        
        // Append the ad to our ref
        adRef.current.appendChild(adElement);
        
        // Execute the ad code
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense push error:', error);
        }
      } catch (error) {
        console.error('AdSense load error:', error);
      }
    }
    
    // Cleanup function
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adSlot, adFormat]);
  
  return (
    <div 
      ref={adRef} 
      style={{ 
        minHeight: '100px', 
        margin: '20px 0',
        overflow: 'hidden',
        ...style 
      }}
      className="ad-container"
      data-testid="ad-component"
    />
  );
};

export default AdComponent; 