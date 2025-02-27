"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct,fetchProducts, updateProduct, deleteProduct } from "../api/productservis";

interface Product {
  id: string;
  title: string;
  price: number;
  img: string;
  detail: string;
}

const Main = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); 
    setRole(storedRole);

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

  const clearForm = () => {
    setTitle("");
    setPrice("");
    setDetail("");
    setImageFile(null);
    setEditId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("detail", detail);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editId) {
        await updateProduct(editId, formData);
      } else {
        await createProduct(formData);
      }
      setIsOpen(false);
      setProducts(await fetchProducts());
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      clearForm();
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const product = products.find((product) => product.id === id);
    if (!product) return;
    setEditId(id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setDetail(product.detail);
    setImageFile(null);
    setIsOpen(true);
  };

  return (
    <>
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product List</h1>
          {role === "admin" && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-500 text-white sm:px-4 sm:py-2 px-2 py-1 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Add Art
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg relative bg-white">
              <Image src={product.img} alt="Product" width={350} height={150} className="w-full h-[150px] object-none rounded-lg" />
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-sm text-gray-500">{product.detail}</p>

           
                <div className="flex gap-2 mt-4">
                  <button className="bg-gray-400 text-white px-3 py-1 rounded-md">Add To Cart</button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-md">Buy Now</button>
                </div>
    
            </div>
          ))}
        </div>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border rounded-lg" required />
                <textarea placeholder="Details" value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full p-3 border rounded-lg" required />
                <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full p-3 border rounded-lg bg-gray-100" />
                <div className="flex justify-between">
                  <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg" disabled={loading}>{loading ? "Loading..." : "Submit"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
