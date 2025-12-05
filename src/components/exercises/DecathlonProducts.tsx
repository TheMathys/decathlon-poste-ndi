import React, { useState, useMemo } from "react";
import decathlonProducts from "../../data/decathlonProducts.json";
import type { Exercise, DecathlonProduct } from "../../types/index.js";
import { APP_CONFIG, EXTERNAL_WEBSITE_NAME } from "../../config/constants";
import { ProductCard } from "./ProductCard";
import { Button } from "../shared/ui/Button";

interface DecathlonProductsProps {
  exercise: Exercise;
}

const DecathlonProducts: React.FC<DecathlonProductsProps> = ({ exercise }) => {
  const [showProducts, setShowProducts] = useState(false);

  const submitBasketToDecathlon = (basket: {
    externalWebsite: string;
    items: Array<{ id: string; quantity: number }>;
  }) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://www.decathlon.fr/externalBasket?basket=${encodeURIComponent(JSON.stringify(basket))}`;
    form.target = "_blank";
    form.style.display = "none";

    document.body.appendChild(form);

    form.submit();

    setTimeout(() => {
      document.body.removeChild(form);
    }, APP_CONFIG.FORM_CLEANUP_DELAY);
  };

  const addToDecathlonBasket = (product: DecathlonProduct) => {
    const basket = {
      externalWebsite: EXTERNAL_WEBSITE_NAME,
      items: [
        {
          id: product.productId,
          quantity: 1,
        },
      ],
    };

    submitBasketToDecathlon(basket);
  };

  const addMultipleToBasket = (products: DecathlonProduct[]) => {
    if (products.length === 0) {
      return;
    }

    const basket = {
      externalWebsite: EXTERNAL_WEBSITE_NAME,
      items: products.map((p) => ({
        id: p.productId,
        quantity: 1,
      })),
    };

    submitBasketToDecathlon(basket);
  };

  const products = useMemo((): DecathlonProduct[] => {
    const matchedProducts: Array<{ product: DecathlonProduct; score: number }> = [];

    decathlonProducts.forEach((product: DecathlonProduct) => {
      let score = 0;

      if (product.exerciseIds && product.exerciseIds.includes(exercise.id)) {
        score += 1000;
      }

      if (exercise.materiel.length > 0) {
        const materialMap: Record<string, string[]> = {
          banc: ["banc-musculation-1"],
          barre: ["barre-traction-1"],
          barre_de_traction: ["barre-traction-1"],
        };
        Object.entries(materialMap).forEach(([material, productIds]) => {
          if (exercise.materiel.includes(material) && productIds.includes(product.id)) {
            score += 500;
          }
        });
      }

      const isYogaMobility =
        exercise.categories.includes("yoga_mobilite") || exercise.categories.includes("mobilite");
      const isBodyweight = exercise.categories.includes("poids_du_corps");
      const isMuscleBuilding = exercise.categories.includes("renforcement_musculaire");
      const needsEquipment = exercise.materiel.length > 0;
      const exerciseNameLower = exercise.name.toLowerCase();

      if (isYogaMobility) {
        if (product.id === "tapis-yoga-1" || product.id === "rouleau-massage-1") {
          score += 100;
        } else if (
          ["banc-musculation-1", "barre-traction-1", "haltères-ajustables-1"].includes(product.id)
        ) {
          score = 0;
        }
      } else if (isBodyweight && isMuscleBuilding && !needsEquipment) {
        if (product.id === "chaussures-fitness-1" && product.exerciseIds?.includes(exercise.id)) {
          score += 100;
        } else if (product.id === "gants-fitness-1" && product.exerciseIds?.includes(exercise.id)) {
          score += 100;
        } else if (
          product.id === "tapis-yoga-1" &&
          !exerciseNameLower.includes("yoga") &&
          !exerciseNameLower.includes("sol") &&
          !exerciseNameLower.includes("plank")
        ) {
          score = 0;
        } else if (
          ["bandes-resistance-1", "banc-musculation-1", "barre-traction-1"].includes(product.id) &&
          !product.exerciseIds?.includes(exercise.id)
        ) {
          score = 0;
        } else if (
          product.exerciseCategories &&
          product.exerciseCategories.some((cat) => exercise.categories.includes(cat))
        ) {
          if (product.id === "haltères-ajustables-1") {
            score += 20;
          } else {
            score += 10;
          }
        }
      } else if (isMuscleBuilding) {
        if (
          product.exerciseCategories &&
          product.exerciseCategories.some((cat) => exercise.categories.includes(cat))
        ) {
          if (product.id === "chaussures-fitness-1" || product.id === "gants-fitness-1") {
            score += 50;
          } else {
            score += 20;
          }
        }
      }

      if (score > 0) {
        matchedProducts.push({ product, score });
      }
    });

    matchedProducts.sort((a, b) => b.score - a.score);

    let finalProducts = matchedProducts
      .slice(0, APP_CONFIG.MAX_PRODUCTS_PER_EXERCISE)
      .map((item) => item.product);

    if (finalProducts.length === 0) {
      const genericProducts = decathlonProducts.filter((p: DecathlonProduct) =>
        ["bouteille-eau-1", "serviette-sport-1"].includes(p.id)
      );
      return genericProducts;
    }

    const hasGenericProducts = finalProducts.some((p) =>
      ["bouteille-eau-1", "serviette-sport-1"].includes(p.id)
    );

    if (!hasGenericProducts && finalProducts.length < APP_CONFIG.MAX_PRODUCTS_PER_EXERCISE) {
      const genericProducts = decathlonProducts.filter((p: DecathlonProduct) =>
        ["bouteille-eau-1", "serviette-sport-1"].includes(p.id)
      );
      finalProducts = finalProducts.concat(
        genericProducts.slice(0, APP_CONFIG.MAX_PRODUCTS_PER_EXERCISE - finalProducts.length)
      );
    }

    return finalProducts;
  }, [exercise]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border-t-2 border-gray-200 pt-6">
      <button
        onClick={() => setShowProducts(!showProducts)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-expanded={showProducts}
        aria-controls={`products-${exercise.id}`}
        aria-label={
          showProducts ? "Masquer les produits recommandés" : "Afficher les produits recommandés"
        }
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h4 className="font-bold text-green-900">Produits Decathlon recommandés</h4>
            <p className="text-sm text-green-700">Matériel adapté pour cet exercice</p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-green-700 transition-transform duration-200 ${showProducts ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showProducts && (
        <div id={`products-${exercise.id}`}>
          {products.length > 1 && (
            <div className="mt-4 mb-4">
              <Button
                variant="primary"
                onClick={() => addMultipleToBasket(products)}
                className="w-full"
                aria-label="Ajouter tous les produits au panier Decathlon"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
              >
                Ajouter tous les produits au panier
              </Button>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToBasket={addToDecathlonBasket}
                onAddMultiple={addMultipleToBasket}
                allProducts={products}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecathlonProducts;
