"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchProducts } from "../api/productservis";
import { toast } from "react-hot-toast";
import { useCart } from "@/constant/cart-context";
import Sidebar from "../sidebar/page";

interface Product {
  id: string;
  title: string;
  price: number;
  img: string;
  detail: string;
}

const Main = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products");
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartItems.some((item: Product) => item.id === product.id)) {
      toast.error(`${product.title} is already in your cart!`);
      return;
    }
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/cart");
  };

  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 overflow-auto">
        {/* <Navbar /> */}
        <div className=" px-1 mx-auto max-w-7xl p-6 font-mono">
          <h1 className="text-3xl font-bold mb-6">Art Gallery</h1>

          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border relative p-4 h-[400px] rounded-lg shadow-lg bg-white transition transform hover:scale-105 hover:shadow-xl"
              >
                <Image
                  src={product.img || "/placeholder.svg"}
                  alt={product.title}
                  width={350}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold mt-2 text-gray-800">{product.title}</h3>
                <p className="text-gray-500 text-sm">{product.detail}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>

                <div className="flex absolute bottom-2 gap-x-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md shadow hover:bg-gray-400 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;