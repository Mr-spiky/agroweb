import Layout from "../../components/common/Layout"
import PageHeader from "../../components/common/PageHeader"
import CropRecommendation from "../../components/farmer/CropRecommendation"
import PestDetection from "../../components/farmer/PestDetection"
import WeatherForecast from "../../components/farmer/WeatherForecast"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { mockOrders } from "../../utils/mockData"

// ── SVG Icons ─────────────────────────────────────────────────────────────
const PlantIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
const PackageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
const WalletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
const ClockIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

const PlusIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const ListIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const StoreIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>


const StatCard = ({ name, value, change, changeType, icon, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{name}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-${colorClass.split("-")[1]}-600 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
        changeType === "increase" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}>
        {changeType === "increase" ? (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        ) : (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        )}
        {change}
      </span>
      <span className="text-xs text-gray-400 ml-2 font-medium">vs last month</span>
    </div>
  </div>
)

const StatusBadge = ({ status }) => {
  const styles = {
    pending:   "bg-amber-100 text-amber-700 border border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
    preparing: "bg-violet-100 text-violet-700 border border-violet-200",
    in_transit:"bg-cyan-100 text-cyan-700 border border-cyan-200",
    delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  }
  const labels = {
    pending: "Pending", confirmed: "Confirmed", preparing: "Preparing",
    in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  )
}

const FarmerDashboard = () => {
  const { currentUser } = useAuth()
  const farmerName = currentUser?.name || "Rajesh Patel"

  const stats = [
    { name: "Active Listings", value: "8", change: "2", changeType: "increase", icon: <PlantIcon />, colorClass: "bg-emerald-500" },
    { name: "Total Orders", value: "48", change: "12%", changeType: "increase", icon: <PackageIcon />, colorClass: "bg-blue-500" },
    { name: "Revenue This Month", value: "₹2,84,700", change: "18%", changeType: "increase", icon: <WalletIcon />, colorClass: "bg-amber-500" },
    { name: "Pending Orders", value: "3", change: "1", changeType: "decrease", icon: <ClockIcon />, colorClass: "bg-violet-500" },
  ]

  // Use first 4 orders from mock as recent (farmer perspective)
  const recentOrders = mockOrders.slice(0, 4).map((o) => ({
    id: o.id,
    buyer: o.buyerName,
    product: o.products[0].name,
    quantity: `${o.products[0].quantity} ${o.products[0].unit || "kg"}`,
    status: o.status,
    amount: `₹${o.total.toLocaleString("en-IN")}`,
  }))

  // Simple revenue bar data (last 6 months)
  const revenueData = [
    { month: "Mar", value: 180000 },
    { month: "Apr", value: 220000 },
    { month: "May", value: 195000 },
    { month: "Jun", value: 250000 },
    { month: "Jul", value: 240000 },
    { month: "Aug", value: 284700 },
  ]
  const maxRevenue = Math.max(...revenueData.map((d) => d.value))

  return (
    <Layout>
      <PageHeader
        title={`Welcome back, ${farmerName.split(" ")[0]} 👋`}
        description="Manage your farm, track orders, and get smart recommendations"
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((item) => (
            <StatCard key={item.name} {...item} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: "/farmer/add-product", icon: <PlusIcon />, label: "Add Product", sub: "List new produce", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200" },
              { to: "/farmer/manage-listings", icon: <ListIcon />, label: "Manage Listings", sub: "Edit your products", color: "text-blue-600", bg: "bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-200" },
              { to: "/farmer/orders", icon: <PackageIcon />, label: "View Orders", sub: "Track your sales", color: "text-amber-600", bg: "bg-amber-50 border-amber-100 hover:bg-amber-100 hover:border-amber-200" },
              { to: "/marketplace", icon: <StoreIcon />, label: "Marketplace", sub: "Browse products", color: "text-violet-600", bg: "bg-violet-50 border-violet-100 hover:bg-violet-100 hover:border-violet-200" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group ${item.bg} border rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md`}
              >
                <div className={`mx-auto w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${item.color}`}>
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-gray-900">{item.label}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              </div>
              <Link to="/farmer/orders" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3 flex-1">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.buyer}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{order.product} · {order.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-gray-900 mb-1">{order.amount}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h3 className="text-lg font-bold text-gray-900">Monthly Revenue</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 font-medium">Last 6 months · ₹ in lakhs</p>
            
            <div className="flex items-end gap-2 sm:gap-4 h-48 bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full border-t border-dashed border-gray-200" />
                ))}
              </div>

              {revenueData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 relative z-10 group">
                  <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8">
                    {(d.value / 100000).toFixed(1)}L
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${d.month === "Aug" ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-200" : "bg-gradient-to-t from-gray-300 to-gray-200 group-hover:from-emerald-300 group-hover:to-emerald-200"}`}
                    style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                  />
                  <span className={`text-xs font-bold ${d.month === "Aug" ? "text-emerald-600" : "text-gray-400"}`}>{d.month}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between">
              <div className="bg-gray-50 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total (6 mo.)</p>
                <p className="font-extrabold text-gray-900 text-lg">₹13,69,700</p>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-xl text-right">
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">Best Month</p>
                <p className="font-extrabold text-emerald-700 text-lg">Aug · ₹2.84L</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="mb-8">
          <WeatherForecast />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crop Recommendation */}
          <CropRecommendation />
          {/* Pest Detection */}
          <PestDetection />
        </div>
      </div>
    </Layout>
  )
}

export default FarmerDashboard
