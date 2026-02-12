import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingDisplayProps {
  content: string;
  isStreaming: boolean;
}

export function StreamingDisplay({ content, isStreaming }: StreamingDisplayProps) {
  const [displayContent, setDisplayContent] = useState('');

  useEffect(() => {
    setDisplayContent(content);
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{displayContent}</ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-gray-600 dark:bg-gray-400 animate-pulse ml-1" />
      )}
    </div>
  );
}

