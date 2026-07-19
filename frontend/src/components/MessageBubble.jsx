import { Check, Copy, ExternalLink } from "lucide-react";
import React from "react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ role, content, images }) => {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode("");
    }, 20000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92%] md:max-w-[72%]
px-4 py-2.5 rounded-2xl
break-words overflow-hidden
leading-relaxed
${
  isUser
    ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
    : "text-slate-200 rounded-tl-sm"
}`}
      >
        {/* Images */}

        {images?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                alt="search result"
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3">{children}</h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
            ),

            p: ({ children }) => <p className="mb-3">{children}</p>,

            ul: ({ children }) => (
              <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>
            ),

            code: ({ className, children }) => {
              const value = String(children).trim();
              if (!className) {
                return (
                  <code className="bg-black/30 px-1 py-0.5 rounded text-indigo-400">
                    {value}
                  </code>
                );
              }

              const language = className?.replace("language-", "");

              return (
                <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                  <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                    <span className="uppercase text-xs text-slate-400">
                      {language}
                    </span>

                    <button 
                    onClick={()=>setCopiedCode(value)}
                    className="flex items-center gap-1 text-xs cursor-pointer"
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter language={language}
                  style={oneDark}
                  wrapLongLines
                  showLineNumbers
                  customStyle={{
                    margin:0,
                    padding:"16px",
                    background:"#0d1117",
                    fontSize:"13px"
                  }}
                  >
                    {value}


                  </SyntaxHighlighter>
                </div>
              );
            },

            table: ({ children }) => (
              <table className="border-collapse border border-white/20 my-3 w-full">
                {children}
              </table>
            ),

            th: ({ children }) => (
              <th className="border border-white/20 px-3 py-2 text-left">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border border-white/20 px-3 py-2">{children}</td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="norefferrer"
                className="text-indigo-400 underline inline-flex items-center gap-1"
              >
                {children} <ExternalLink size={16} />
              </a>
            ),
          }}
        >
          {content}
        </Markdown>
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer"
            onClick={() => setLightBox(null)}
          >
            ✕
          </button>

          <img
            src={lightBox}
            alt="preview"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
