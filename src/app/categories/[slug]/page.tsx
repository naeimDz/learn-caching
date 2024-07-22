'use client'
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';

import Link from 'next/link';
import Image from "next/image"
import { getCachedData, tagBasedCache } from '@/lib/cache';
import { db } from '@/lib/firebase';

type CategoryProps = {
  params: {
    slug: string;
  };
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function CategoryPage({ params }: CategoryProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const cachedProducts = getCachedData(`category_${params.slug}`);
      if (cachedProducts) {
        setProducts(cachedProducts as Product[]);
      } else {
        const q = query(collection(db, 'products'), where('category', '==', params.slug));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productList);
        tagBasedCache('categories', `category_${params.slug}`, productList);
      }
    };

    fetchProducts();
  }, [params.slug]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.slug} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <Image height={500} width={1000} src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"  />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}