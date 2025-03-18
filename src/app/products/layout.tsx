// src/app/products/details/layout.tsx
import React from 'react';

const ProductDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default ProductDetailsLayout;