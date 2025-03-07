"use client"

// import Link from "next/link"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Menu,
//   X,
//   LogOut,
//   Settings,
//   CircleUserRound,
//   ShoppingCart,
// } from "lucide-react"
// import { useCart } from "@/constant/cart-context"

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [userMenu, setUserMenu] = useState(false)
//   const [loginCheck, setLoginCheck] = useState<string | null>(null)
//   const [uname, setUname] = useState<string | null>(null)
//   const [role, setRole] = useState<string | null>(null)
//   const [cartItemCount, setCartItemCount] = useState<number>(0)
//   const router = useRouter()
//   const { cartCount } = useCart();
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setLoginCheck(localStorage.getItem("token"))
//       setUname(localStorage.getItem("email"))
//       setRole(localStorage.getItem("role"))
//       setCartItemCount(parseInt(localStorage.getItem("cartCount") || "0"))
//     }
//   }, [])

//   const logout = () => {
//     localStorage.clear()
//     setLoginCheck(null)
//     setUserMenu(false)
//     setIsMobileMenuOpen(false)
//     router.push("/login")
//   }

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
//               The Art Gallery
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex md:items-center md:space-x-6">
          
//             <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
//               <ShoppingCart className="h-6 w-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//             {loginCheck && (
//               <div className="relative">
//                 <button
//                   onClick={() => setUserMenu(!userMenu)}
//                   className="flex items-center text-gray-700 hover:text-blue-600 transition"
//                 >
//                   <CircleUserRound className="h-6 w-6" />
//                 </button>
//                 {userMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2">
//                     <p className="px-4 py-2 text-sm text-gray-900 font-medium border-b">{uname}</p>
//                     {role === "admin" && (
//                       <Link href="/Productadd" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Art</Link>
//                     )}
//                     <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Orders</Link>
//                     <button
//                       onClick={logout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex md:hidden items-center">
//             <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
//               <ShoppingCart className="h-6 w-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="ml-4 p-2 text-gray-700 hover:text-blue-600"
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-white shadow-md py-2">
           
           
          
//             {loginCheck && (
//               <>
//                 <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Orders</Link>
//                 {role === "admin" && (
//                   <Link href="/Productadd" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Art</Link>
//                 )}
//                 <button
//                   onClick={logout}
//                   className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//             {!loginCheck && (
//               <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Menu, X, CircleUserRound, ShoppingCart } from "lucide-react";
// import { useCart } from "@/constant/cart-context";

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [userMenu, setUserMenu] = useState(false);
//   const [loginCheck, setLoginCheck] = useState<string | null>(null);
//   const [uname, setUname] = useState<string | null>(null);
//   const [role, setRole] = useState<string | null>(null);

//   const { cartCount } = useCart();
//   const router = useRouter();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setLoginCheck(localStorage.getItem("token"));
//       setUname(localStorage.getItem("email"));
//       setRole(localStorage.getItem("role"));
//     }
//   }, []);

//   const logout = () => {
//     localStorage.clear();
//     setLoginCheck(null);
//     setUserMenu(false);
//     setIsMobileMenuOpen(false);
//     router.push("/login");
//   };

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-lg py-4">
//       <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6">
//         {/* Logo */}
//         <Link href="/" className="text-3xl font-bold text-gray-900 tracking-wide hover:text-blue-600 transition-all">
//           🎨 ArtGallery
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-8">
//           <Link href="/cart" className="relative text-gray-800 hover:text-blue-600 transition-all">
//             <ShoppingCart className="h-7 w-7" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//           {loginCheck ? (
//             <div className="relative">
//               <button
//                 onClick={() => setUserMenu(!userMenu)}
//                 className="flex items-center text-gray-900 hover:text-blue-600 transition-all"
//               >
//                 <CircleUserRound className="h-7 w-7" />
//               </button>
//               {userMenu && (
//                 <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl rounded-lg py-3 border">
//                   <p className="px-4 py-2 text-md font-semibold text-gray-800 border-b">{uname}</p>
//                   {role === "admin" && (
//                     <Link href="/Productadd" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition">
//                       Your Art
//                     </Link>
//                   )}
//                   <Link href="/orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition">
//                     Your Orders
//                   </Link>
//                   <button
//                     onClick={logout}
//                     className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link
//               href="/login"
//               className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
//             >
//               Login
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden flex items-center">
//         <Link href="/cart" className="relative text-gray-800 hover:text-blue-600 transition-all">
//             <ShoppingCart className="h-7 w-7" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-800 hover:text-blue-600">
//             {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg border-t py-4 px-6 space-y-4">
          
//           {loginCheck ? (
//             <>
//               <Link href="/orders" className="block text-gray-800 hover:text-blue-600 transition font-medium">
//                 Your Orders
//               </Link>
//               {role === "admin" && (
//                 <Link href="/Productadd" className="block text-gray-800 hover:text-blue-600 transition font-medium">
//                   Your Art
//                 </Link>
//               )}
//               <button
//                 onClick={logout}
//                 className="block w-full text-left text-gray-800 hover:text-blue-600 transition font-medium"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link href="/login" className="block text-gray-800 hover:text-blue-600 transition font-medium">
//               Login
//             </Link>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;