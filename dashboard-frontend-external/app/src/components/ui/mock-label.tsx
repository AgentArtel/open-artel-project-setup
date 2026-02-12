// ============================================================================
// MockLabel - Renders text in italics when data is mock
// Usage: <MockLabel text="Sample Project" isMock={item._isMock} />
// ============================================================================

import React from 'react';

interface MockLabelProps {
  text: string;
  isMock?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function MockLabel({ text, isMock, className = '', as: Tag = 'span' }: MockLabelProps) {
  if (isMock) {
    return (
      <Tag className={className}>
        <em className="not-italic italic text-inherit">{text}</em>
      </Tag>
    );
  }
  return <Tag className={className}>{text}</Tag>;
}

interface MockWrapperProps {
  isMock?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps children in <em> when data is mock, making all text italic
 */
export function MockWrapper({ isMock, children }: MockWrapperProps) {
  if (isMock) {
    return <em className="italic">{children}</em>;
  }
  return <>{children}</>;
}
