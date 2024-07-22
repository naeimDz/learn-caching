"use client"
import ProductList from "@/components/ProductList";
import { fifoCache, lfuCache, lruCache } from "@/lib/cache";
import { db } from "@/lib/firebase";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};


export default function Home() {
  useEffect(() => {
    // LRU: Recently viewed products
    lruCache.set('product1', { id: 1, name: 'Product 1' });
    lruCache.set('product2', { id: 2, name: 'Product 2' });
    // Access product1 to make it most recently used
    lruCache.get('product1');

    // LFU: Popular categories
    lfuCache.set('category1', { id: 1, name: 'Category 1' });
    lfuCache.set('category2', { id: 2, name: 'Category 2' });
    // Increase frequency of category1
    lfuCache.get('category1');
    lfuCache.get('category1');

    // FIFO: Temporary session data
    fifoCache.set('session1', { userId: 1, data: 'Session Data 1' });
    fifoCache.set('session2', { userId: 2, data: 'Session Data 2' });
    // New session will push out the oldest one when cache is full
    fifoCache.set('session3', { userId: 3, data: 'Session Data 3' });
  }, []);


  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('popularity', 'desc'), limit(4));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(products);
    };

    fetchFeaturedProducts();
  }, []);
  return (
   <>
   <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Our Store</h1>
     { /* Hero Section */}
      <div className="bg-blue-100 rounded-lg p-8 mb-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Summer Sale!</h2>
        <p className="text-xl mb-4">Get up to 50% off on selected items</p>
        <Link href="/products" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <ProductList category={"Books"} />
    {/* Categories */}
    <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((category) => (
            <Link href={`/categories/${category.toLowerCase()}`} key={category} className="block">
              <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition">
                <h3 className="font-semibold">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="text-gray-600">
          We're passionate about providing high-quality products at affordable prices. 
          Our team is dedicated to ensuring your shopping experience is smooth and enjoyable.
        </p>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-4">Subscribe to our newsletter for the latest deals and updates.</p>
        <form className="flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-4 py-2 rounded"
          />
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">
            Subscribe
          </button>
        </form>
      </section>
    </div>
   </>
  );
}
