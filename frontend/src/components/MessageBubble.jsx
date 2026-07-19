import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : "bg-white/[0.04] border border-white/[0.07] text-slate-200 rounded-tl-sm"
        }`}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3">{children}</h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-4 mb-2">
                {children}
              </h2>
            ),

            p: ({ children }) => (
              <p className="mb-3">{children}</p>
            ),

            ul: ({ children }) => (
              <ul className="list-disc ml-5 mb-3 space-y-1">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal ml-5 mb-3 space-y-1">
                {children}
              </ol>
            ),

            code: ({ children }) => (
              <code className="bg-black/30 px-1 py-0.5 rounded">
                {children}
              </code>
            ),

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
              <td className="border border-white/20 px-3 py-2">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};

export default MessageBubble;