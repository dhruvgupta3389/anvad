import React from 'react';

interface DebugProps {
  product: any;
  selectedVariant: any;
}

const ProductDebug: React.FC<DebugProps> = ({ product, selectedVariant }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="bg-gray-100 p-2 text-xs border rounded mt-2">
      <div><strong>Product ID:</strong> {product.id}</div>
      <div><strong>Product Name:</strong> {product.name}</div>
      <div><strong>Selected Variant ID:</strong> {selectedVariant?.id}</div>
      <div><strong>Selected Variant inStock:</strong> {selectedVariant?.inStock ? 'true' : 'false'}</div>
      <div><strong>Selected Variant Stock Qty:</strong> {selectedVariant?.stock_quantity || 'N/A'}</div>
      <div><strong>Variants Count:</strong> {product.variants?.length || 0}</div>
      <div className="mt-1">
        <strong>All Variants:</strong>
        {product.variants?.map((v: any, i: number) => (
          <div key={i} className="ml-2">
            {v.id}: inStock={v.inStock ? 'true' : 'false'}, qty={v.stock_quantity || 'N/A'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDebug;
