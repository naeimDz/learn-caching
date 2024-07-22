"use client"
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getCachedData, timeBasedCache } from '@/lib/cache';
import { db } from '@/lib/firebase';
import Image from "next/image"


type ProductProps = {
  params: {
    id: string;
  };
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function ProductPage({ params }: ProductProps) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const cachedProduct = getCachedData(`product_${params.id}`);
      if (cachedProduct) {
        setProduct(cachedProduct as Product);
      } else {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          timeBasedCache(`product_${params.id}`, productData, 3600); // Cache for 1 hour
        }
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
        <Image height={500} width={1000} src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <p className="text-xl font-semibold mb-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}