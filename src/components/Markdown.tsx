import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

type MarkdownProps = {
  content: string
}

// Helper function to filter out non-DOM props
const filterProps = (props: any) => {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !['node', 'ordered', 'checked', 'index'].includes(key))
  );
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="markdown-content"
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...filterProps(props)} />,
        h2: ({ node, ...props }) => (
          <h2 
            className="text-2xl font-bold mt-8 mb-4" 
            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} 
            {...filterProps(props)} 
          />
        ),
        h3: ({ node, ...props }) => (
          <h3 
            className="text-xl font-bold mt-6 mb-3" 
            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} 
            {...filterProps(props)} 
          />
        ),
        h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2" {...filterProps(props)} />,
        p: ({ node, ...props }) => <p className="mb-4 text-text-secondary" {...filterProps(props)} />,
        a: ({ node, ...props }) => (
          <a className="text-primary hover:text-secondary underline" {...filterProps(props)} />
        ),
        ul: ({ node, ordered, ...props }) => <ul className="list-disc pl-6 mb-4" {...filterProps(props)} />,
        ol: ({ node, ordered, ...props }) => <ol className="list-decimal pl-6 mb-4" {...filterProps(props)} />,
        li: ({ node, ordered, ...props }) => <li className="mb-1" {...filterProps(props)} />,
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              className="rounded-md mb-4 bg-dark-lighter p-4"
              {...filterProps(props)}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-background-alt px-1 py-0.5 rounded text-primary font-mono" {...filterProps(props)}>
              {children}
            </code>
          )
        },
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-text-tertiary mb-4" {...filterProps(props)} />,
        hr: ({ node, ...props }) => <hr className="my-6 border-border" {...filterProps(props)} />,
        table: ({ node, ...props }) => <table className="w-full mb-4 border-collapse" {...filterProps(props)} />,
        thead: ({ node, ...props }) => <thead className="bg-background-alt" {...filterProps(props)} />,
        tbody: ({ node, ...props }) => <tbody {...filterProps(props)} />,
        tr: ({ node, ...props }) => <tr className="border-b border-border" {...filterProps(props)} />,
        th: ({ node, ...props }) => <th className="p-2 text-left font-bold text-primary" {...filterProps(props)} />,
        td: ({ node, ...props }) => <td className="p-2 border-r border-border last:border-r-0" {...filterProps(props)} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown

// Note: For a production site, you would want to use a proper markdown library like:
//   - react-markdown: For client-side rendering
//   - next-mdx-remote: For server-side rendering of MDX content
//   - remark/rehype: For advanced markdown processing
// 
// This would replace the dangerouslySetInnerHTML with proper React components
// and provide much better security and flexibility. 