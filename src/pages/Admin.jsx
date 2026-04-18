import { LayoutDashboard, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export default function Admin() {
  return (
    <div className="bg-[#fffcf2] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-mango-100 p-3 rounded-xl text-mango-600"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Orders</p>
              <h2 className="text-2xl font-black text-gray-900">1,248</h2>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Users</p>
              <h2 className="text-2xl font-black text-gray-900">842</h2>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Revenue</p>
              <h2 className="text-2xl font-black text-gray-900">$14,892</h2>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><LayoutDashboard size={24} /></div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Restaurants</p>
              <h2 className="text-2xl font-black text-gray-900">24</h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-extrabold text-gray-900 text-lg">Recent Transactions</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">#ORD-1092</td>
                <td className="px-6 py-4 font-medium text-gray-600">Irfan Khan</td>
                <td className="px-6 py-4 font-extrabold text-mango-600">$29.98</td>
                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Completed</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">#ORD-1093</td>
                <td className="px-6 py-4 font-medium text-gray-600">John Doe</td>
                <td className="px-6 py-4 font-extrabold text-mango-600">$45.50</td>
                <td className="px-6 py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">#ORD-1094</td>
                <td className="px-6 py-4 font-medium text-gray-600">Jane Smith</td>
                <td className="px-6 py-4 font-extrabold text-mango-600">$12.99</td>
                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
