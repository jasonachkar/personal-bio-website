'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const KQL_QUERY = `// Impossible Travel Detection — Microsoft Sentinel
// Flags logins from geographically impossible locations within 2 hours

let threshold_minutes = 120;
let max_speed_km_h = 900;

SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == 0  // Successful sign-in
| project TimeGenerated, UserPrincipalName, IPAddress, Location,
          LocationDetails, AppDisplayName
| sort by UserPrincipalName, TimeGenerated asc
| extend prev_time     = prev(TimeGenerated),
         prev_location = prev(Location),
         prev_ip       = prev(IPAddress),
         prev_user     = prev(UserPrincipalName)
| where UserPrincipalName == prev_user
| extend time_diff_min = datetime_diff('minute', TimeGenerated, prev_time)
| where time_diff_min < threshold_minutes and time_diff_min > 0
| where Location != prev_location
| project TimeGenerated, UserPrincipalName, Location, prev_location,
          IPAddress, prev_ip, time_diff_min
| where isnotempty(Location) and isnotempty(prev_location)`;

const KEYWORDS = new Set([
  'let', 'where', 'project', 'extend', 'sort', 'by', 'asc', 'desc', 'and', 'or', 'summarize',
]);

const FUNCTIONS = new Set(['ago', 'prev', 'datetime_diff', 'isnotempty']);

const TABLES = new Set(['SigninLogs']);

type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'function' | 'table' | 'operator' | 'plain';

const tokenStyles: Record<TokenKind, string> = {
  comment: 'text-emerald-600/90',
  string: 'text-amber-400',
  number: 'text-cyan-300',
  keyword: 'text-violet-400',
  function: 'text-sky-400',
  table: 'text-orange-300',
  operator: 'text-slate-400',
  plain: 'text-slate-200',
};

/** Lightweight inline KQL tokenizer — avoids pulling highlight.js past the CSP. */
function tokenizeLine(line: string): Array<{ kind: TokenKind; text: string }> {
  const tokens: Array<{ kind: TokenKind; text: string }> = [];
  const pattern = /\/\/.*|'[^']*'|\b\d+(?:\.\d+)?[a-z]*\b|\b[A-Za-z_]\w*\b|[|=<>!(),+\-*]+|\s+|./g;
  for (const match of line.matchAll(pattern)) {
    const text = match[0];
    let kind: TokenKind = 'plain';
    if (text.startsWith('//')) kind = 'comment';
    else if (text.startsWith("'")) kind = 'string';
    else if (/^\d/.test(text)) kind = 'number';
    else if (KEYWORDS.has(text)) kind = 'keyword';
    else if (FUNCTIONS.has(text)) kind = 'function';
    else if (TABLES.has(text)) kind = 'table';
    else if (/^[|=<>!(),+\-*]+$/.test(text)) kind = 'operator';
    tokens.push({ kind, text });
  }
  return tokens;
}

/**
 * Expandable, syntax-highlighted read-only KQL detection query.
 * Collapsed by default; used on the Sentinel detection pack project card.
 */
export function KqlViewer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className={cn(
          'inline-flex items-center gap-2',
          'rounded-lg border border-border bg-background-elevated/60',
          'px-3 py-1.5 font-mono text-xs text-text-secondary',
          'transition-colors duration-200',
          'hover:border-primary/40 hover:text-primary'
        )}
      >
        <span className="text-primary">{'{ }'}</span>
        View KQL Detection Logic
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>

      {expanded && (
        <div className="mt-3 overflow-hidden rounded-xl border border-emerald-500/20 bg-[#0d1117]">
          <div className="flex items-center justify-between border-b border-emerald-500/10 px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
              impossible-travel.kql
            </span>
            <span className="font-mono text-[10px] text-slate-500">read-only</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
            <code>
              {KQL_QUERY.split('\n').map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {tokenizeLine(line).map((token, tokenIndex) => (
                    <span key={tokenIndex} className={tokenStyles[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default KqlViewer;
