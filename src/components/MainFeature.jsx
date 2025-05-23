import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService';

const MainFeature = () => {
  // Icons
  const PlusIcon = getIcon('plus');
  const SaveIcon = getIcon('save');
  const CheckIcon = getIcon('check-circle');
  const XIcon = getIcon('x');
  const TrashIcon = getIcon('trash-2');
  const EditIcon = getIcon('edit');
  const CalendarIcon = getIcon('calendar');
  const ClockIcon = getIcon('clock');
  const UserIcon = getIcon('user');
  const NoteIcon = getIcon('file-text');

  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for current appointment being deleted
  const [deletingId, setDeletingId] = useState(null);
  
  // State for tracking if appointments are being loaded
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  });
  
  // New appointment form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    patientName: '',
    date: '',
    time: '',
    purpose: '',
    status: 'scheduled'
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Load appointments from the database when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  // Fetch appointments from the API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments({
        // Filter for upcoming appointments (optional)
        status: ['scheduled', 'confirmed']
      });
      
      // Format appointments for display
      const formattedAppointments = data.map(apt => ({
        id: apt.Id,
        patientName: apt.patient?.Name || apt.Name,
        date: apt.date,
        time: apt.time,
        purpose: apt.purpose,
        status: apt.status
      }));
      
      setAppointments(formattedAppointments);
      setInitialLoadComplete(true);
  }, [appointments]);
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      id: null,
      patientName: '',
      date: '',
      time: '',
      purpose: '',
      status: 'scheduled'
    });
    setErrors({});
    setIsEditing(false);
  };
  
  const handleAddAppointment = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        if (isEditing) {
          // Update existing appointment
          const appointmentData = {
            Name: formData.patientName, // Use patient name as appointment name
            date: formData.date,
            time: formData.time,
            purpose: formData.purpose,
            status: formData.status
          };
          
          await updateAppointment(formData.id, appointmentData);
          toast.success("Appointment updated successfully!");
        } else {
          // Add new appointment
          const appointmentData = {
            Name: formData.patientName, // Use patient name as appointment name
            date: formData.date,
            time: formData.time,
            purpose: formData.purpose,
            status: formData.status
          };
          
          await createAppointment(appointmentData);
          toast.success("New appointment added!");
        }
        
        // Refresh appointments list
        fetchAppointments();
      } catch (error) {
        console.error('Error saving appointment:', error);
        toast.error(isEditing ? "Failed to update appointment" : "Failed to add appointment");
      } finally {
        setIsSubmitting(false);
        setShowForm(false);
        resetForm();
      }
    }
  };
  
  const handleEditAppointment = (appointment) => {
    setFormData(appointment);
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleDeleteAppointment = async (id) => {
    try {
      setIsDeleting(true);
      setDeletingId(id);
      
      await deleteAppointment(id);
      
      // Update local state after successful deletion
      setAppointments(appointments.filter(app => app.id !== id));
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error("Failed to delete appointment");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };
  
  const handleDeleteConfirmation = (id) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      handleDeleteAppointment(id);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };
      month: 'short',
      day: 'numeric',
      year: 'numeric'
  
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-200">
          Upcoming Appointments
        </h3>
        <motion.button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon size={18} />
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">New</span>
        </motion.button>
      </div>
      
      {/* Appointment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="card border border-surface-200 dark:border-surface-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">
              {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="label">
                  Patient Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    className={`input pl-9 ${errors.patientName ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                  />
                  <div className="absolute left-3 top-2.5 text-surface-500">
                    <UserIcon size={18} />
                  </div>
                </div>
                {errors.patientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="date" className="label">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={`input pl-9 ${errors.date ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-3 top-2.5 text-surface-500">
                    <CalendarIcon size={18} />
                  </div>
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="label">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    className={`input pl-9 ${errors.time ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-3 top-2.5 text-surface-500">
                    <ClockIcon size={18} />
                  </div>
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="purpose" className="label">
                  Purpose
                </label>
                <div className="relative">
                  <textarea
                    id="purpose"
                    name="purpose"
                    rows="3"
                    className={`input pl-9 resize-none ${errors.purpose ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of the appointment"
                  ></textarea>
                  <div className="absolute left-3 top-2.5 text-surface-500">
                    <NoteIcon size={18} />
                  </div>
                </div>
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="btn btn-outline flex items-center gap-2" 
                onClick={handleCancelForm}
              >
                <XIcon size={18} />
                <span>Cancel</span>
              </button>
              <button 
                className="btn btn-primary flex items-center gap-2" 
                onClick={handleAddAppointment}
                  disabled={isSubmitting}>
                <SaveIcon size={18} />
                <span>{isEditing ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Appointments List */}
      <div className="card border border-surface-200 dark:border-surface-700">
        {appointments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-surface-500 dark:text-surface-400 mb-2">No appointments scheduled</p>
            <button 
        {isLoading && !initialLoadComplete ? (
          <div className="py-8 text-center">
            <div className="w-10 h-10 border-4 border-surface-200 dark:border-surface-700 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-surface-500 dark:text-surface-400">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
              onClick={() => setShowForm(true)}
            >
              <PlusIcon size={16} />
              <span>Add your first appointment</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 hidden md:table-cell">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 hidden lg:table-cell">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <motion.tr 
                    key={appointment.id}
                    className="border-b border-surface-200 dark:border-surface-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <td className="py-3 px-4 font-medium">{appointment.patientName}</td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400 hidden sm:table-cell">{formatDate(appointment.date)}</td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400 hidden md:table-cell">{appointment.time}</td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400 hidden lg:table-cell truncate max-w-[200px]">{appointment.purpose}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        appointment.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                          onClick={() => handleEditAppointment(appointment)}
                          aria-label="Edit appointment"
                        >
                          <EditIcon size={18} />
                        </button>
                        <button 
                          className="p-1 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400"
                          onClick={() => handleDeleteConfirmation(appointment.id)}
                          aria-label="Delete appointment"
                          disabled={isDeleting && deletingId === appointment.id}
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MainFeature;