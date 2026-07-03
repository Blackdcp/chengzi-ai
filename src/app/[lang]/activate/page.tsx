import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivatePage() {
  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe 
        src="/proxy-html" 
        style={{ width: "100%", height: "100%", border: "none" }}
        title="激活页面"
      />
    </div>
  );
}
