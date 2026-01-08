/**
 * Simple markdown-to-HTML converter (no external dependencies)
 * Handles common markdown patterns for GitHub README files
 */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function parseCodeBlock(lines: string[], index: number): { html: string; nextIndex: number } {
  let code = '';
  let lang = '';
  let i = index;
  
  // Check for language specification
  const match = lines[i].match(/^```(\w+)?/);
  if (match) {
    lang = match[1] || '';
    i++;
  }
  
  while (i < lines.length && !lines[i].startsWith('```')) {
    code += lines[i] + '\n';
    i++;
  }
  
  // Skip closing ```
  i++;
  
  const escapedCode = escapeHtml(code.trim());
  const className = lang ? `language-${lang}` : '';
  
  return {
    html: `<pre><code class="${className}">${escapedCode}</code></pre>`,
    nextIndex: i,
  };
}

function parseInlineCode(text: string): string {
  // This function is now only used for lists, where content isn't pre-escaped
  // Parse inline code and escape HTML in code content
  return text.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });
}

function parseLinks(text: string): string {
  // [text](url)
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-hover underline">$1</a>');
}

function parseBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function parseItalic(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function parseList(lines: string[], index: number, ordered: boolean): { html: string; nextIndex: number } {
  let html = ordered ? '<ol class="list-decimal list-inside space-y-1">' : '<ul class="list-disc list-inside space-y-1">';
  let i = index;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Check if line is a list item
    const listMatch = ordered 
      ? line.match(/^\d+\.\s+(.+)$/)
      : line.match(/^[-*]\s+(.+)$/);
    
    if (!listMatch) {
      break;
    }
    
    let content = listMatch[1];
    content = parseInlineCode(content);
    content = parseLinks(content);
    content = parseBold(content);
    content = parseItalic(content);
    
    html += `<li class="text-text-secondary">${content}</li>`;
    i++;
  }
  
  html += ordered ? '</ol>' : '</ul>';
  
  return { html, nextIndex: i };
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  const lines = markdown.split('\n');
  const html: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      html.push('<br />');
      i++;
      continue;
    }
    
    // Code blocks
    if (trimmed.startsWith('```')) {
      const { html: codeHtml, nextIndex } = parseCodeBlock(lines, i);
      html.push(codeHtml);
      i = nextIndex;
      continue;
    }
    
    // Headers
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        let content = match[2];
        content = parseInlineCode(content);
        content = parseLinks(content);
        content = parseBold(content);
        content = parseItalic(content);
        
        const classes = {
          1: 'text-3xl font-bold text-text-primary mb-4 mt-6',
          2: 'text-2xl font-bold text-text-primary mb-3 mt-5',
          3: 'text-xl font-semibold text-text-primary mb-2 mt-4',
          4: 'text-lg font-semibold text-text-primary mb-2 mt-3',
          5: 'text-base font-semibold text-text-primary mb-1 mt-2',
          6: 'text-sm font-semibold text-text-primary mb-1 mt-2',
        };
        
        html.push(`<h${level} class="${classes[level as keyof typeof classes]}">${content}</h${level}>`);
      }
      i++;
      continue;
    }
    
    // Ordered lists
    if (/^\d+\.\s+/.test(trimmed)) {
      const { html: listHtml, nextIndex } = parseList(lines, i, true);
      html.push(listHtml);
      i = nextIndex;
      continue;
    }
    
    // Unordered lists
    if (/^[-*]\s+/.test(trimmed)) {
      const { html: listHtml, nextIndex } = parseList(lines, i, false);
      html.push(listHtml);
      i = nextIndex;
      continue;
    }
    
    // Horizontal rule
    if (trimmed.match(/^[-*_]{3,}$/)) {
      html.push('<hr class="my-6 border-border" />');
      i++;
      continue;
    }
    
    // Regular paragraphs
    let content = trimmed;
    // Use placeholders for code blocks to prevent double-escaping
    const codePlaceholders: string[] = [];
    let codeIndex = 0;
    
    // Replace inline code with placeholders
    content = content.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `__CODE_${codeIndex}__`;
      codePlaceholders.push(escapeHtml(code));
      codeIndex++;
      return placeholder;
    });
    
    // Now escape HTML in the rest of the content
    content = escapeHtml(content);
    
    // Restore code blocks
    codePlaceholders.forEach((code, idx) => {
      content = content.replace(`__CODE_${idx}__`, `<code>${code}</code>`);
    });
    
    // Parse other markdown syntax
    content = parseLinks(content);
    content = parseBold(content);
    content = parseItalic(content);
    
    html.push(`<p class="text-text-secondary leading-relaxed mb-4">${content}</p>`);
    i++;
  }
  
  return html.join('\n');
}

/**
 * Sanitize HTML from GitHub's markdown API
 * Allows safe markdown HTML elements while removing dangerous scripts/attributes
 */
export function sanitizeMarkdownHtml(html: string): string {
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers from all tags
  html = html.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\son\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol from href/src
  html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  html = html.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
  
  // Remove data: URLs that could be dangerous (allow data:image for base64 images)
  html = html.replace(/src\s*=\s*["']data:(?!image\/)[^"']*["']/gi, 'src=""');
  
  // Remove iframe tags (security risk)
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object/embed tags
  html = html.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  
  return html;
}

/**
 * Convert GitHub blob URL to raw URL
 */
export function githubUrlToRaw(githubUrl: string): string {
  // Handle blob URLs: github.com/user/repo/blob/branch/path
  // Convert to: raw.githubusercontent.com/user/repo/branch/path
  if (githubUrl.includes('/blob/')) {
    return githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  
  // Handle tree URLs: github.com/user/repo/tree/branch/path
  // Convert to: raw.githubusercontent.com/user/repo/branch/path/README.md
  if (githubUrl.includes('/tree/')) {
    const treeUrl = githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/tree/', '/');
    // If path doesn't end with .md, append README.md
    if (!treeUrl.endsWith('.md')) {
      return `${treeUrl}/README.md`;
    }
    return treeUrl;
  }
  
  return githubUrl;
}

