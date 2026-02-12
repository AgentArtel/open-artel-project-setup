import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { cn } from '@/lib/utils';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    const out = marked.parse(content);
    if (typeof out === 'string') {
      queueMicrotask(() => setHtml(out));
    } else {
      out.then(setHtml);
    }
  }, [content]);
  return (
    <div
      className={cn(
        'text-sm [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1,&_h2,&_h3]:font-semibold [&_h1,&_h2,&_h3]:mt-4 [&_h1]:mt-0',
        '[&_p]:leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_li]:my-1',
        '[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_pre]:border [&_pre]:overflow-x-auto',
        '[&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_pre_code]:bg-transparent [&_pre_code]:p-0',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
