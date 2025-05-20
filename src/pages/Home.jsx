import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Icons for tabs
  const DashboardIcon = getIcon('layout-dashboard');
  const PatientsIcon = getIcon('users');
  const AppointmentsIcon = getIcon('calendar');
  const BillingIcon = getIcon('credit-card');
  const InventoryIcon = getIcon('package');
  
  // Welcome notification on component mount
  useState(() => {
    toast.info("Welcome to MediFlow Hospital Management System", {
      icon: "👋"
    });
  }, []);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'patients', label: 'Patients', icon: PatientsIcon },
    { id: 'appointments', label: 'Appointments', icon: AppointmentsIcon },
    { id: 'billing', label: 'Billing', icon: BillingIcon },
    { id: 'inventory', label: 'Inventory', icon: InventoryIcon },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              className="text-primary-dark dark:text-primary-light"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              {React.createElement(getIcon('activity'), { size: 28 })}
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-dark dark:text-primary-light">
              MediFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="py-1.5 pl-8 pr-4 rounded-full border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary w-48 md:w-64"
              />
              {React.createElement(getIcon('search'), { 
                size: 16, 
                className: "absolute left-2.5 top-1/2 transform -translate-y-1/2 text-surface-400 dark:text-surface-500" 
              })}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-300 cursor-pointer">
              {React.createElement(getIcon('user'), { size: 20 })}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Side Navigation */}
        <aside className="w-full md:w-64 bg-white dark:bg-surface-800 border-b md:border-b-0 md:border-r border-surface-200 dark:border-surface-700">
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible py-3 md:py-6 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-0 md:mb-2 mr-2 md:mr-0 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-light/10 text-primary-dark dark:text-primary-light'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                {React.createElement(tab.icon, { 
                  size: 20,
                  className: activeTab === tab.id ? "text-primary dark:text-primary-light" : ""
                })}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-surface-50 dark:bg-surface-900">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-surface-50">Dashboard</h2>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Patients', value: '1,245', icon: 'users', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
                  { label: 'Appointments', value: '42', icon: 'calendar', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
                  { label: 'Staff', value: '38', icon: 'users', color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
                  { label: 'Revenue', value: '$24,800', icon: 'dollar-sign', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' }
                ].map((stat, index) => {
                  const StatIcon = getIcon(stat.icon);
                  return (
                    <motion.div
                      key={index}
                      className="card flex items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`p-3 rounded-lg mr-4 ${stat.color}`}>
                        <StatIcon size={24} />
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400 text-sm">{stat.label}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Main Feature */}
              <MainFeature />
            </div>
          )}
          
          {activeTab === 'patients' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-surface-50">Patient Management</h2>
              <div className="card">
                <p className="text-center text-surface-500 py-8">
                  Patient management module will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-surface-50">Appointment Scheduling</h2>
              <div className="card">
                <p className="text-center text-surface-500 py-8">
                  Appointment scheduling module will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-surface-50">Billing & Payments</h2>
              <div className="card">
                <p className="text-center text-surface-500 py-8">
                  Billing and payment module will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-surface-50">Inventory Management</h2>
              <div className="card">
                <p className="text-center text-surface-500 py-8">
                  Inventory management module will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;