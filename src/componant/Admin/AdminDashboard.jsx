import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import '../css/AdminDashboard.css';

function AdminDashboard({ theme, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '' });
  const [editRestaurant, setEditRestaurant] = useState({ id: null, name: '', location: '' });
  const navigate = useNavigate();

  // Fetch all data from the backend
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin-login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch orders
      try {
        const ordersResponse = await axios.get('http://localhost:5000/api/orders', { headers });
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      // Fetch menu items
      try {
        const menuResponse = await axios.get('http://localhost:5000/api/menu', { headers });
        setMenuItems(menuResponse.data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      }

      // Fetch users
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users', { headers });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }

      // Fetch promotions
      try {
        const promotionsResponse = await axios.get('http://localhost:5000/api/promotions', { headers });
        setPromotions(promotionsResponse.data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
      }

      // Fetch restaurants
      try {
        const restaurantsResponse = await axios.get('http://localhost:5000/api/restaurants', { headers });
        setRestaurants(restaurantsResponse.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      alert('Failed to fetch data. Please try again.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Unauthorized access. Redirecting to login.');
      navigate('/admin-login');
    } else {
      fetchData();
    }
  }, [navigate]);

  // Mock data for charts (replace with API data if available)
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

  // Deactivate a user
  const deactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:5000/api/users/${userId}/deactivate`, {}, { headers });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  };

  // Deactivate a restaurant
  const deactivateRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}/deactivate`, {}, { headers });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error deactivating restaurant:', err);
    }
  };

  // Add a new restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('http://localhost:5000/api/restaurants', newRestaurant, { headers });
      setRestaurants([...restaurants, response.data]);
      setNewRestaurant({ name: '', location: '' });
    } catch (err) {
      console.error('Error adding restaurant:', err);
    }
  };

  // Update a restaurant
  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(`http://localhost:5000/api/restaurants/${editRestaurant._id}`, editRestaurant, { headers });
      setRestaurants(restaurants.map((r) => (r._id === response.data._id ? response.data : r)));
      setEditRestaurant({ id: null, name: '', location: '' });
    } catch (err) {
      console.error('Error updating restaurant:', err);
    }
  };

  // Render the active section
  const renderSection = () => {
    const containerClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black';
    const tableClass = theme === 'dark' ? 'table-dark' : 'table-light';
    const buttonClass = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl">{orders.length}</p>
              </div>
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Revenue</h3>
                <p className="text-2xl">${orders.reduce((sum, order) => sum + order.total, 0)}</p>
              </div>
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Active Users</h3>
                <p className="text-2xl">{users.filter((user) => user.active).length}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                <BarChart width={500} height={300} data={salesData}>
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <YAxis stroke={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </div>
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
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
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Order Management</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
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
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Menu Management</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
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
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
              <thead>
                <tr>
                  <th className="p-2">User ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Mobile Number</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="p-2 text-center">{user._id}</td>
                    <td className="p-2 text-center">{user.userName}</td>
                    <td className="p-2 text-center">{user.email}</td>
                    <td className="p-2 text-center">{user.mobNum}</td>
                    <td className="p-2 text-center">{user.address}</td>
                    <td className="p-2 text-center">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'promotions':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Promotions</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
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
      case 'restaurants':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Restaurant Management</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add New Restaurant</h3>
              <form onSubmit={handleAddRestaurant} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newRestaurant.location}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <button type="submit" className={`p-2 rounded ${buttonClass}`}>
                  Add Restaurant
                </button>
              </form>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Edit Restaurant</h3>
              <form onSubmit={handleEditRestaurant} className="flex gap-2">
                <select
                  value={editRestaurant._id || ''}
                  onChange={(e) => {
                    const selectedRestaurant = restaurants.find((r) => r._id === e.target.value);
                    setEditRestaurant(selectedRestaurant ? { ...selectedRestaurant } : { id: null, name: '', location: '' });
                  }}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={editRestaurant.name}
                  onChange={(e) => setEditRestaurant({ ...editRestaurant, name: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={editRestaurant.location}
                  onChange={(e) => setEditRestaurant({ ...editRestaurant, location: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <button type="submit" className={`p-2 rounded ${buttonClass}`}>
                  Update Restaurant
                </button>
              </form>
            </div>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
              <thead>
                <tr>
                  <th className="p-2">Restaurant ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="p-2 text-center">{restaurant._id}</td>
                    <td className="p-2 text-center">{restaurant.name}</td>
                    <td className="p-2 text-center">{restaurant.location}</td>
                    <td className="p-2 text-center">
                      {restaurant.active ? 'Active' : 'Deactivated'}
                    </td>
                    <td className="p-2 text-center">
                      {restaurant.active && (
                        <button
                          onClick={() => deactivateRestaurant(restaurant._id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
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
    <div className={`flex min-h-screen mt-16 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className={`w-64 p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <ul className="sidebar-buttons">
          <li>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'dashboard' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'orders' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('menu')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'menu' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Menu
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'users' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('promotions')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'promotions' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Promotions
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('restaurants')}
              className={`w-full text-left p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${activeSection === 'restaurants' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
            >
              Restaurants
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <div className={`p-4 shadow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
          <h1 className="text-xl font-bold">Food Delivery Admin</h1>
          
        </div>
        <div className="p-6">{renderSection()}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
