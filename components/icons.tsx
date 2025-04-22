import React, { SVGProps } from 'react';

// Custom component for Lungs icon that's missing from lucide-react
export const Lungs = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.081 20c2.633 0 4-2.5 4-6 0-5-1-10-4-10C4.52 4 4 5.5 4 7c0 1 .811 3.657 1.081 5.5C5.516 14 5.5 20 6.081 20Z" />
      <path d="M17.92 20c-2.633 0-4-2.5-4-6 0-5 1-10 4-10 1.561 0 2.081 1.5 2.081 3 0 1-.811 3.657-1.081 5.5C18.485 14 18.5 20 17.92 20Z" />
      <path d="M12 12a3 3 0 0 0-3-3v10" />
      <path d="M12 12a3 3 0 0 1 3-3v10" />
      <path d="M7 17.899A5 5 0 0 1 12 22v-5" />
      <path d="M17 17.899A5 5 0 0 0 12 22v-5" />
      <path d="M7 5c3 0 5 1 5 5" />
      <path d="M17 5c-3 0-5 1-5 5" />
    </svg>
  );
};

// Custom component for Moon icon
export const Moon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );
};