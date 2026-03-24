import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      const inlineScript = document.createElement('script');
      
      inlineScript.innerHTML = `
        atOptions = {
          'key' : '29c48bdc3a57c8cc78b4be161f859cbe',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      script.src = "https://www.highperformanceformat.com/29c48bdc3a57c8cc78b4be161f859cbe/invoke.js";
      script.async = true;

      adRef.current.appendChild(inlineScript);
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', width: '100%', minHeight: '60px' }}>
      <div ref={adRef}></div>
    </div>
  );
};

export default AdBanner;
