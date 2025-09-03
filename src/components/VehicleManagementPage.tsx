import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Star, User, MapPin, Phone, Eye, Save, X, Camera, MessageSquare, Award, TrendingUp, LogOut, Truck } from 'lucide-react';
import { Partner, PartnerVehicle } from '../types';

interface VehicleManagementPageProps {
  partner: Partner;
  onUpdatePartner: (partnerData: Partial<Partner>) => void;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'vehicles' | 'feedback' | 'about' | 'profile') => void;
}

interface VehicleFormData {
  type: string;
  model: string;
  registrationNumber: string;
  description: string;
  pricePerHour: string;
  pricePerDay: string;
  specifications: string[];
  images: File[];
  available: boolean;
}

interface CustomerFeedback {
  id: string;
  customerName: string;
  vehicleName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Add material types for material suppliers
const materialTypes = [
  'Sand', 'Soil', 'Gravel', 'Metal', 'Bricks', 'Concrete', 'Timber', 'Cement'
];

export const VehicleManagementPage: React.FC<VehicleManagementPageProps> = ({
  partner,
  onUpdatePartner,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'feedback'>('vehicles');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<PartnerVehicle | null>(null);
  const [newSpecification, setNewSpecification] = useState('');
  
  const [formData, setFormData] = useState<VehicleFormData>({
    type: '',
    model: '',
    registrationNumber: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    specifications: [],
    images: [],
    available: true
  });

  // Mock vehicles data
  const [vehicles, setVehicles] = useState<PartnerVehicle[]>([
    {
      id: '1',
      partnerId: partner.id,
      name: 'JCB 3CX Backhoe Loader',
      type: 'JCB',
      model: '3CX',
      year: 2020,
      description: 'Heavy-duty excavator perfect for digging and construction work. Well-maintained with experienced operator.',
      pricePerHour: 32000,
      pricePerDay: 210000,
      specifications: ['Operating Weight: 8.5 tons', 'Max Digging Depth: 5.2m', 'Bucket Capacity: 0.28m³', 'Engine Power: 74kW'],
      images: ['https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800'],
      images: ['https://i.pinimg.com/736x/08/81/7e/08817ee595ed09578140e8895a177e8b.jpg'],
      available: true,
      location: partner.address,
      insuranceDetails: {
        provider: 'Equipment Insurance Co',
        policyNumber: 'EQ123456789',
        expiryDate: '2025-06-30'
      },
      maintenanceRecords: {
        lastService: '2024-01-15',
        nextService: '2024-04-15',
        certifications: ['Safety Certified', 'Operator Certified']
      },
      status: 'active'
    }
  ]);

  // Mock feedback data
  const [feedbacks] = useState<CustomerFeedback[]>([
    {
      id: '1',
      customerName: 'Saman Perera',
      vehicleName: 'JCB 3CX Backhoe Loader',
      rating: 5,
      comment: 'Excellent service! The JCB was in perfect condition and the operator was very skilled. Completed our excavation work efficiently.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: '2',
      customerName: 'Nimal Silva',
      vehicleName: 'JCB 3CX Backhoe Loader',
      rating: 4,
      comment: 'Good vehicle and reliable service. The owner was professional and the pricing was fair.',
      date: '2024-01-08',
      verified: true
    },
    {
      id: '3',
      customerName: 'Kamala Fernando',
      vehicleName: 'JCB 3CX Backhoe Loader',
      rating: 5,
      comment: 'Outstanding service! Very reliable and the vehicle was delivered on time. Will definitely use again.',
      date: '2024-01-05',
      verified: false
    }
  ]);

  const vehicleTypes = partner.type === 'vehicle_owner' 
    ? ['JCB', 'Excavator', 'Tipper', 'Lorry', 'Water Bowser', 'Crane', 'Concrete Mixer', 'Road Roller']
    : ['Delivery Truck', 'Tipper', 'Lorry', 'Van', 'Pickup Truck'];

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length 
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecification.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, newSpecification.trim()]
      }));
      setNewSpecification('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVehicle: PartnerVehicle = {
      id: Date.now().toString(),
      partnerId: partner.id,
      name: `${formData.model} ${formData.type}`,
      type: formData.type,
      model: formData.model,
      year: new Date().getFullYear(),
      description: formData.description,
      pricePerHour: Number(formData.pricePerHour),
      pricePerDay: Number(formData.pricePerDay),
      specifications: formData.specifications,
      images: formData.images.map(file => URL.createObjectURL(file)),
      available: formData.available,
      location: partner.address,
      insuranceDetails: {
        provider: 'Insurance Provider',
        policyNumber: 'POL' + Date.now(),
        expiryDate: '2025-12-31'
      },
      maintenanceRecords: {
        lastService: new Date().toISOString().split('T')[0],
        nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        certifications: []
      },
      status: 'active'
    };

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...newVehicle, id: editingVehicle.id } : v));
      setEditingVehicle(null);
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }

    // Reset form
    setFormData({
      type: '',
      model: '',
      registrationNumber: '',
      description: '',
      pricePerHour: '',
      pricePerDay: '',
      specifications: [],
      images: [],
      available: true
    });
    setShowAddForm(false);
  };

  const handleEdit = (vehicle: PartnerVehicle) => {
    setFormData({
      type: vehicle.type,
      model: vehicle.model,
      registrationNumber: '',
      description: vehicle.description,
      pricePerHour: vehicle.pricePerHour.toString(),
      pricePerDay: vehicle.pricePerDay.toString(),
      specifications: vehicle.specifications,
      images: [],
      available: vehicle.available
    });
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleDelete = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPageTitle = () => {
    return partner.type === 'vehicle_owner' ? 'Vehicle Management' : 'Material Management';
  };

  const getItemType = () => {
    return partner.type === 'vehicle_owner' ? 'vehicle' : 'material';
  };

  const getItemTypes = () => {
    return partner.type === 'vehicle_owner' ? vehicleTypes : materialTypes;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {partner.businessName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                partner.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : partner.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {[
              { id: 'vehicles', label: `My ${partner.type === 'vehicle_owner' ? 'Vehicles' : 'Materials'}` },
              { id: 'feedback', label: 'Feedback', badge: feedbacks.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <section className={`bg-gradient-to-r ${partner.type === 'vehicle_owner' ? 'from-yellow-400 to-yellow-500' : 'from-green-500 to-green-600'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Manage your {partner.type === 'vehicle_owner' ? 'construction vehicles' : 'construction materials'} and track customer feedback
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Total {partner.type === 'vehicle_owner' ? 'Vehicles' : 'Materials'}</h3>
                <p className="text-white text-2xl font-bold">{vehicles.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Star className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Average Rating</h3>
                <p className="text-white text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Total Reviews</h3>
                <p className="text-white text-2xl font-bold">{feedbacks.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'vehicles' && (
            <div className="space-y-8">
              {/* Add Vehicle Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  My {partner.type === 'vehicle_owner' ? 'Vehicles' : 'Materials'}
                </h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className={`flex items-center space-x-2 ${partner.type === 'vehicle_owner' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'} px-6 py-3 rounded-xl hover:opacity-90 transition-colors font-semibold shadow-lg`}
                >
                  <span>Add New {partner.type === 'vehicle_owner' ? 'Vehicle' : 'Material'}</span>
                </button>
              </div>

              {/* Vehicles Grid */}
              {vehicles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                      <div className="relative">
                        <img
                          src={vehicle.images[0] || 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={vehicle.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                          vehicle.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {vehicle.available ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                        
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <div className="font-medium">{vehicle.type}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Model:</span>
                              <div className="font-medium">{vehicle.model}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">District:</span>
                              <div className="font-medium">{partner.district}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Contact:</span>
                              <div className="font-medium">{partner.phone}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                Rs. {vehicle.pricePerHour.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-600">per hour</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                Rs. {vehicle.pricePerDay.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-600">per day</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No {partner.type === 'vehicle_owner' ? 'Vehicles' : 'Materials'} Added Yet</h3>
                  <p className="text-gray-600 mb-8">Start by adding your first {getItemType()} to attract customers</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className={`${partner.type === 'vehicle_owner' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'} px-8 py-4 rounded-xl hover:opacity-90 transition-colors font-semibold text-lg`}
                  >
                    Add Your First {partner.type === 'vehicle_owner' ? 'Vehicle' : 'Material'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Feedback</h2>
                <p className="text-gray-600 text-lg">See what your customers are saying about your vehicles</p>
              </div>

              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-gray-600">Based on {feedbacks.length} reviews</p>
                </div>
              </div>

              {/* Feedback List */}
              {feedbacks.length > 0 ? (
                <div className="space-y-6">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{feedback.customerName}</h3>
                          <p className="text-gray-600">{feedback.vehicleName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(feedback.rating)}
                          </div>
                          {feedback.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{feedback.comment}</p>
                      <p className="text-gray-500 text-sm">{feedback.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Feedback Yet</h3>
                  <p className="text-gray-600">Customer reviews will appear here once you start receiving bookings</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Vehicle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVehicle ? 'Edit' : 'Add New'} {partner.type === 'vehicle_owner' ? 'Vehicle' : 'Material'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVehicle(null);
                    setFormData({
                      type: '',
                      model: '',
                      registrationNumber: '',
                      description: '',
                      pricePerHour: '',
                      pricePerDay: '',
                      specifications: [],
                      images: [],
                      available: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {partner.type === 'vehicle_owner' ? 'Vehicle' : 'Material'} Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {getItemTypes().map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model/Brand
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter model or brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your vehicle/material, its condition, and any special features"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Hour (Rs.)
                    </label>
                    <input
                      type="number"
                      name="pricePerHour"
                      value={formData.pricePerHour}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Day (Rs.)
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications
                  </label>
                  <div className="space-y-2">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={spec}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newSpecification}
                        onChange={(e) => setNewSpecification(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add specification (e.g., Engine Power: 100HP)"
                      />
                      <button
                        type="button"
                        onClick={addSpecification}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Available for booking
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className={`flex-1 ${partner.type === 'vehicle_owner' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'} py-3 px-6 rounded-lg hover:opacity-90 transition-colors font-semibold flex items-center justify-center`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingVehicle ? 'Update' : 'Add'} {partner.type === 'vehicle_owner' ? 'Vehicle' : 'Material'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingVehicle(null);
                      setFormData({
                        type: '',
                        model: '',
                        registrationNumber: '',
                        description: '',
                        pricePerHour: '',
                        pricePerDay: '',
                        specifications: [],
                        images: [],
                        available: true
                      });
                    }}
                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};