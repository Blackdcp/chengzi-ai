"use client";
import { useEffect, useRef } from 'react';

export function AdsterraBanner({ options }: { options: { key: string, format: string, width: number, height: number, params?: any } }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; }</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = ${JSON.stringify(options)};
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${options.key}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <iframe
        srcDoc={html}
        width={options.width}
        height={options.height}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </div>
  );
}

export function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerId = "container-b50e3f7e2710e0dd1052c6b1d8c13c65";
    
    // Create the container div inside our ref
    if (!document.getElementById(containerId)) {
      const div = document.createElement('div');
      div.id = containerId;
      containerRef.current.appendChild(div);

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://arkgleamfox.com/b50e3f7e2710e0dd1052c6b1d8c13c65/invoke.js';
      containerRef.current.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} style={{ margin: '16px 0', width: '100%', minHeight: '100px', display: 'flex', justifyContent: 'center' }} />;
}
