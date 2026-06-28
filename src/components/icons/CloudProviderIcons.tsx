import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function TerraformIcon({ className = 'h-6 w-6', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M4 5.5 13 10.7v10.4L4 15.9V5.5Z" fill="currentColor" opacity="0.82" />
      <path d="M14.5 10.7 23.5 5.5v10.4l-9 5.2V10.7Z" fill="currentColor" opacity="0.62" />
      <path d="M14.5 22.8 23.5 17.6V28l-9-5.2Z" fill="currentColor" />
      <path d="M25 4.7 28 3v10.4l-3 1.7V4.7Z" fill="currentColor" opacity="0.42" />
    </svg>
  );
}

export function AzureIcon({ className = 'h-6 w-6', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M18.2 3 8.8 22.5l8.2-1.2 5.1-9.1L18.2 3Z" fill="currentColor" opacity="0.72" />
      <path d="M19.5 5.2 15.6 16l7.2 9.7L6 28.7h20.9L19.5 5.2Z" fill="currentColor" />
    </svg>
  );
}

export function AwsIcon({ className = 'h-6 w-6', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M8.3 19.7c-3.1 0-5.3-1.9-5.3-4.8 0-2.5 1.8-4.5 4.2-4.8C8.1 7 10.9 5 14.1 5c3.7 0 6.8 2.5 7.6 6 3.9.2 7.3 2.5 7.3 6.1 0 1.5-.5 2.8-1.5 3.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.68"
      />
      <path
        d="M7 23.8c4.9 2.7 12.2 2.6 17.8-.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M22.9 20.9 26 22.8l-1 3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8.2 17.8h1.5l.3-1.1h2l.3 1.1h1.6l-2-6h-1.7l-2 6Zm2.1-2.3.7-2.2.7 2.2h-1.4Zm6.7 2.4c1.5 0 2.5-.7 2.5-1.9 0-1-.6-1.5-1.9-1.8l-.7-.2c-.6-.1-.8-.3-.8-.6s.3-.5.8-.5c.6 0 1 .2 1.5.5l.7-1.1c-.5-.4-1.3-.7-2.2-.7-1.4 0-2.4.7-2.4 1.8 0 1 .7 1.5 1.9 1.8l.7.2c.6.1.8.3.8.6 0 .4-.4.6-.9.6-.7 0-1.2-.2-1.8-.6l-.7 1.1c.6.5 1.5.8 2.5.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
