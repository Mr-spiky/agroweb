"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/common/Layout"
import PageHeader from "../../components/common/PageHeader"
import ProductCard from "../../components/marketplace/ProductCard"
import ProductFilters from "../../components/marketplace/ProductFilters"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { mockProducts } from "../../utils/mockData"

const Marketplace = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate short loading delay
    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }, 800)
  }, [])

  const applyFiltersAndSearch = (prods, query, filters) => {
    let result = [...prods]

    // Text search
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      )
    }

    if (filters) {
      if (filters.category) result = result.filter((p) => p.category === filters.category)
      if (filters.region)   result = result.filter((p) => p.location === filters.region)
      if (filters.organic)  result = result.filter((p) => p.organic === true)
      if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice))
      if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice))

      switch (filters.sortBy) {
        case "price_low":  result.sort((a, b) => a.price - b.price); break
        case "price_high": result.sort((a, b) => b.price - a.price); break
        case "rating":     result.sort((a, b) => b.rating - a.rating); break
        case "newest":
        default:           result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      }
    }

    return result
  }

  const [activeFilters, setActiveFilters] = useState({})

  const handleSearch = (e) => {
    const q = e.target.value
    setSearchQuery(q)
    setFilteredProducts(applyFiltersAndSearch(products, q, activeFilters))
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
    setFilteredProducts(applyFiltersAndSearch(products, searchQuery, filters))
  }

  const categories = [...new Set(mockProducts.map((p) => p.category))].sort()
  const regions    = [...new Set(mockProducts.map((p) => p.location))].sort()

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Marketplace" description="Browse fresh produce directly from Indian farmers" />
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 flex justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageHeader title="Marketplace" description="Browse fresh produce directly from Indian farmers" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products, farmers, regions..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setFilteredProducts(applyFiltersAndSearch(products, "", activeFilters)) }}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <ProductFilters onFilterChange={handleFilterChange} categories={categories} regions={regions} />

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Stock
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Try adjusting your search term or filters. We have {products.length} products across{" "}
              {categories.length} categories.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilters({}); setFilteredProducts(products) }}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              Clear all filters →
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Marketplace
