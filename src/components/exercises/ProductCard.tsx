import React, { useState } from "react";
import type { DecathlonProduct } from "../../types/index.js";

interface ProductCardProps {
  product: DecathlonProduct;
  onAddToBasket: (product: DecathlonProduct) => void;
  onAddMultiple?: (products: DecathlonProduct[]) => void;
  allProducts?: DecathlonProduct[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToBasket,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-3"
      >
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {imageError || !product.image || !product.image.startsWith("http") ? (
            <div className="text-4xl">📦</div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </a>

      <div className="flex flex-col flex-1">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-2 hover:text-green-600 transition-colors"
        >
          <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
        </a>
        {product.description && (
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        )}
        <p className="text-lg font-bold text-green-600 mb-3">{product.price}</p>

        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onAddToBasket(product)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`Ajouter ${product.name} au panier Decathlon`}
          >
            <span>Ajouter au panier</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label={`Voir le produit ${product.name} sur Decathlon`}
          >
            <span>Voir le produit</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

