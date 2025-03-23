import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

function AdminDashboard({ theme }) {
  const [activeSection, setActiveSection] = useState('dashboard'); // State to manage active section
  const [orders, setOrders] = useState([]); // State for orders
  const [menuItems, setMenuItems] = useState([]); // State for menu items
  const [users, setUsers] = useState([]); // State for users
  const [promotions, setPromotions] = useState([]); // State for promotions
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Unauthorized access. Redirecting to login.');
      navigate('/admin-login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
  ];

  const orderStatusData = [
    { name: 'Completed', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Canceled', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // Colors for pie chart

  // Fetch data (mock implementation)
  useEffect(() => {
    // Simulate fetching orders
    setOrders([
      { id: 1, customer: 'John Doe', total: 25, status: 'Completed' },
      { id: 2, customer: 'Jane Smith', total: 30, status: 'Pending' },
    ]);

    // Simulate fetching menu items
    setMenuItems([
      { id: 1, name: 'Burger', price: 10, category: 'Fast Food' },
      { id: 2, name: 'Pizza', price: 15, category: 'Fast Food' },
    ]);

    // Simulate fetching users
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
    ]);

    // Simulate fetching promotions
    setPromotions([
      { id: 1, code: 'SAVE10', discount: '10%', validUntil: '2023-12-31' },
      { id: 2, code: 'FREE5', discount: '$5', validUntil: '2023-11-30' },
    ]);
  }, []);

  // Render active section
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl">1,234</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Revenue</h3>
                <p className="text-2xl">$12,345</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Active Users</h3>
                <p className="text-2xl">567</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                <BarChart width={500} height={300} data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <PieChart width={500} height={300}>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Order Management</h2>
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2 text-center">{order.id}</td>
                    <td className="p-2 text-center">{order.customer}</td>
                    <td className="p-2 text-center">${order.total}</td>
                    <td className="p-2 text-center">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'menu':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Menu Management</h2>
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="p-2">Item ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center">{item.id}</td>
                    <td className="p-2 text-center">{item.name}</td>
                    <td className="p-2 text-center">${item.price}</td>
                    <td className="p-2 text-center">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="p-2">User ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-2 text-center">{user.id}</td>
                    <td className="p-2 text-center">{user.name}</td>
                    <td className="p-2 text-center">{user.email}</td>
                    <td className="p-2 text-center">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'promotions':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Promotions</h2>
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="p-2">Promo ID</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td className="p-2 text-center">{promo.id}</td>
                    <td className="p-2 text-center">{promo.code}</td>
                    <td className="p-2 text-center">{promo.discount}</td>
                    <td className="p-2 text-center">{promo.validUntil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`w-64 p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-3">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`hover:text-gray-400 ${activeSection === 'dashboard' ? 'font-bold' : ''}`}
            >
              Dashboard
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveSection('orders')}
              className={`hover:text-gray-400 ${activeSection === 'orders' ? 'font-bold' : ''}`}
            >
              Orders
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveSection('menu')}
              className={`hover:text-gray-400 ${activeSection === 'menu' ? 'font-bold' : ''}`}
            >
              Menu
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveSection('users')}
              className={`hover:text-gray-400 ${activeSection === 'users' ? 'font-bold' : ''}`}
            >
              Users
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveSection('promotions')}
              className={`hover:text-gray-400 ${activeSection === 'promotions' ? 'font-bold' : ''}`}
            >
              Promotions
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className={`p-4 shadow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
          <h1 className="text-xl font-bold">Food Delivery Admin</h1>
        </div>

        {/* Page Content */}
        <div className="p-6">{renderSection()}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;