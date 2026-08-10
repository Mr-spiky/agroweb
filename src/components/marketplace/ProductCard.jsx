"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { useNotification } from "../../context/NotificationContext"

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth()
  const { addToCart } = useCart()
  const { success } = useNotification()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    success(`Added ${product.name} to cart`)
  }

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {product.organic && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow">
                🌿 Organic
              </span>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-700 shadow">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h3>
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-emerald-600">
            ₹{product.price}<span className="text-sm font-normal text-gray-500">/{product.unit || "kg"}</span>
          </p>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">{product.rating} ({product.reviewCount || 0})</span>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.location}
            </div>
            {currentUser && currentUser.role === "buyer" && (
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-150 shadow-sm hover:shadow-emerald-200"
              >
                + Cart
              </button>
            )}
          </div>

          {/* Farmer info */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
            <img
              className="h-5 w-5 rounded-full mr-1.5 ring-1 ring-gray-200"
              src={product.farmerAvatar || "/placeholder.svg"}
              alt={product.farmerName}
            />
            <p className="text-xs text-gray-500">{product.farmerName}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
