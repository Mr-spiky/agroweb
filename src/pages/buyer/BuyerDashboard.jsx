import { Link } from "react-router-dom"
import Layout from "../../components/common/Layout"
import PageHeader from "../../components/common/PageHeader"
import { useAuth } from "../../context/AuthContext"
import { mockOrders, mockProducts } from "../../utils/mockData"

const StatusBadge = ({ status }) => {
  const styles = {
    pending:    "bg-amber-100 text-amber-700",
    confirmed:  "bg-blue-100 text-blue-700",
    preparing:  "bg-violet-100 text-violet-700",
    in_transit: "bg-cyan-100 text-cyan-700",
    delivered:  "bg-emerald-100 text-emerald-700",
  }
  const labels = {
    pending: "Pending", confirmed: "Confirmed", preparing: "Preparing",
    in_transit: "In Transit", delivered: "Delivered",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  )
}

const BuyerDashboard = () => {
  const { currentUser } = useAuth()
  const buyerName = currentUser?.name || "Amit Kumar"

  const stats = [
    { name: "Total Orders", value: "24", change: "+3 this month", icon: "📦", color: "bg-blue-50 border-blue-100" },
    { name: "This Month Spent", value: "₹12,470", change: "+8% vs last month", icon: "💳", color: "bg-violet-50 border-violet-100" },
    { name: "Favourite Farmers", value: "8", change: "+2 new follows", icon: "👨‍🌾", color: "bg-emerald-50 border-emerald-100" },
    { name: "Cart Items", value: "5", change: "₹2,340 in cart", icon: "🛒", color: "bg-amber-50 border-amber-100" },
  ]

  // Recent buyer orders from mock data
  const recentOrders = mockOrders.slice(0, 4).map((o) => ({
    id: o.id,
    farmer: o.farmerName,
    product: o.products[0].name,
    quantity: `${o.products[0].quantity} ${o.products[0].unit || "kg"}`,
    status: o.status,
    amount: `₹${o.total.toLocaleString("en-IN")}`,
    date: o.orderDate,
  }))

  // Recommended: top-rated products with real images
  const recommended = [...mockProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  // Seasonal highlights
  const seasonal = [
    { emoji: "🥭", name: "Alphonso Mango", season: "Summer · May–July", price: "₹280/kg", tag: "GI Tagged" },
    { emoji: "🌾", name: "Basmati Rice", season: "Kharif · Aug–Oct", price: "₹95/kg", tag: "Premium Grade" },
    { emoji: "🫛", name: "Fresh Peas", season: "Winter · Nov–Jan", price: "₹60/kg", tag: "Seasonal" },
  ]

  return (
    <Layout>
      <PageHeader
        title={`Hello, ${buyerName.split(" ")[0]} 👋`}
        description="Discover fresh produce and manage your orders"
      />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item) => (
            <div key={item.name} className={`${item.color} border rounded-2xl p-5 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-gray-600">{item.name}</p>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: "/marketplace", icon: "🏪", label: "Browse Market", sub: "Find fresh produce", bg: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
              { to: "/buyer/cart", icon: "🛒", label: "View Cart", sub: "Review your items", bg: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
              { to: "/buyer/orders", icon: "📋", label: "Order History", sub: "Track your orders", bg: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
              { to: "/settings", icon: "⚙️", label: "Settings", sub: "Manage account", bg: "bg-violet-50 border-violet-200 hover:bg-violet-100" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${item.bg} border rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="text-sm font-semibold text-gray-900">{item.label}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link to="/buyer/orders" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.product}</p>
                    <p className="text-xs text-gray-500">{order.farmer} · {order.quantity}</p>
                    <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Top Rated Produce</h3>
              <Link to="/marketplace" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                See all →
              </Link>
            </div>
            <div className="space-y-3">
              {recommended.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.farmerName} · {product.location}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-xs text-gray-500">{product.rating}</span>
                      {product.organic && (
                        <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Organic</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">₹{product.price}/{product.unit || "kg"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal Highlights */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">🌿 Seasonal Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seasonal.map((item) => (
              <div key={item.name} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.season}</p>
                <p className="text-emerald-600 font-bold text-sm mt-2">{item.price}</p>
                <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BuyerDashboard
