import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { tagBasedCache, getCachedData } from '../lib/cache';
import Image from "next/image"


interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }



export default function ProductList({ category }: { category: string }) {
    const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const cachedProducts = getCachedData(`products_${category}`);
      if (cachedProducts) {
        setProducts(cachedProducts as Product[]);
      }   
      else {    
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Assuming you have an id field in your Firestore documents
          ...doc.data()
        } as Product));
        setProducts(productList);
        tagBasedCache('products', `products_${category}`, productList);
      }

    };
    fetchProducts();
  }, [category]);
console.log(products);
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        
        <div key={product.id} className="border p-4">
          <Image src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" width={100} height={100}/>
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
}