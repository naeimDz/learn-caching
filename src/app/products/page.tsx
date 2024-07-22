// File: /app/products/page.tsx
"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import Link from 'next/link';
import { getCachedData, tagBasedCache } from '@/lib/cache';
import { db } from '@/lib/firebase';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cachedProducts = getCachedData('all_products');
        if (cachedProducts) {
          setProducts(cachedProducts as Product[]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));

        setProducts(productList);
        tagBasedCache('products', 'all_products', productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An error occurred while fetching products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}