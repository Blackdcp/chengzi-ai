'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

export default function ChatExporter({ dict, lang }: { dict: any; lang: string }) {
  const [markdown, setMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#1E1E1E', // Match dark theme
      });
      const link = document.createElement('a');
      link.download = 'chat-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {dict.tools.chatExporter.hero.title}
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          {dict.tools.chatExporter.hero.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Input */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-300">Markdown Input</label>
          <textarea
            className="w-full h-[600px] p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm resize-none"
            placeholder={dict.tools.chatExporter.editor.placeholder}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>

        {/* Right Side: Preview & Export */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-gray-300">{dict.tools.chatExporter.editor.previewTitle}</label>
            <button
              onClick={handleDownload}
              disabled={isGenerating || !markdown}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {dict.tools.chatExporter.editor.downloadImage}
            </button>
          </div>

          {/* Render Area Wrapper for clipping */}
          <div className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* THIS is the div that gets captured */}
            <div 
              ref={previewRef}
              className="bg-[#1E1E1E] text-gray-200 p-8 min-h-[600px] flex flex-col relative"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              {/* macOS style Window Buttons */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-invert prose-orange max-w-none flex-grow">
                {markdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <div className="text-gray-500 italic flex h-full items-center justify-center pt-32">
                    {dict.tools.chatExporter.editor.placeholder}
                  </div>
                )}
              </div>

              {/* Viral Watermark */}
              <div className="mt-12 pt-6 border-t border-gray-700/50 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="font-semibold text-orange-500">Chengzi AI</span>
                  <span>—</span>
                  <span>{dict.tools.chatExporter.hero.watermarkText}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Monetization Banner Below the Tool */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-2xl p-8 text-center shadow-lg shadow-orange-500/5">
          <h2 className="text-2xl font-bold text-white mb-4">Want smarter outputs to export?</h2>
          <p className="text-gray-300 mb-6 text-lg">Stop relying on free AI. Upgrade to a premium intelligence.</p>
          <div className="flex justify-center gap-4">
            <Link href={`/${lang}/products/gemini-pro`} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition">
              Get Gemini Advanced ($14.99)
            </Link>
            <Link href={`/${lang}/products/chatgpt-plus-random`} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition">
              Get ChatGPT Plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
