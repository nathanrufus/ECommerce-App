import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
