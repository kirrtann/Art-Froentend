"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import { getArt } from "../api/services/productservis";
import { deleteProduct } from "../api/productservis";

interface Art {
  id: string
  title: string;
  detail: string;
  img: string;
}

const Products = () => {
  const [yourProducts, setYourProducts] = useState<Art[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const user_id = localStorage.getItem("id");
      if (!user_id) {
        console.warn("User ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await getArt({ user_id });
        console.log(response?.data);

        if (Array.isArray(response?.data)) {
          setYourProducts(response.data);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching art:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setYourProducts((prevProducts) => yourProducts.filter((product) => product.id !== id));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <Navbar /> */}
      <h1 className="text-center mt-[50px] text-[28px] font-bold">Your Art</h1>

      <div className="flex flex-wrap justify-center  gap-4 mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : yourProducts.length > 0 ? (
          yourProducts.map((art, index) => (
            <div key={index} className="border p-4 relative rounded-lg shadow-md">
              <img src={art.img} alt={art.title} className="w-[300px] h-[200px] object-full mt-2 rounded-md" />
              <h2 className="font-bold text-[20px] ">{art.title}</h2>
              <p>{art.detail}</p>
              <div className="flex gap-2 mt-4 justify-end  ">
                <button className="bg-gray-400 text-white px-3 py-1 rounded-md">Update</button>
                <button onClick={() => handleDelete(art.id)} className="bg-green-500 text-white px-3 py-1 rounded-md">Delete</button>
              </div>
            </div>
            
          ))
        ) : (
          <p>No art found.</p>
        )}
      </div>
    </>
  );
};

export default Products;
