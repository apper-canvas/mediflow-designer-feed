const tableName = 'appointment1';

// Get all appointments with optional filtering
export const getAppointments = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'date', 'time', 'purpose', 'status', 'patientId'],
      expands: [
        {
          name: 'patientId',
          alias: 'patient'
        }
      ],
      orderBy: [
        {
          field: 'date',
          direction: 'ASC'
        }
      ]
    };

    // Add status filter if provided
    if (filterOptions.status) {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filterOptions.status]
        }
      ];
    }

    // Add pagination if needed
    if (filterOptions.limit) {
      params.pagingInfo = {
        limit: filterOptions.limit,
        offset: filterOptions.offset || 0
      };
    }

    const response = await apperClient.fetchRecords(tableName, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointment count
export const getAppointmentsCount = async (status = null) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      aggregators: [{ function: 'Count', field: 'Id', alias: 'total' }]
    };

    // Filter by status if provided
    if (status) {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [status]
        }
      ];
    }

    const response = await apperClient.fetchRecords(tableName, params);
    return response.data?.[0]?.total || 0;
  } catch (error) {
    console.error('Error getting appointments count:', error);
    return 0;
  }
};

// Get single appointment by ID
export const getAppointmentById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(tableName, id, {
      expands: [
        {
          name: 'patientId',
          alias: 'patient'
        }
      ]
    });
    
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    throw error;
  }
};

// Create new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields, ensure data is in correct format
    const { Name, date, time, purpose, status, patientId } = appointmentData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ Name, date, time, purpose, status, patientId }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create appointment');
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update existing appointment
export const updateAppointment = async (id, appointmentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, date, time, purpose, status, patientId } = appointmentData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ Id: id, Name, date, time, purpose, status, patientId }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update appointment');
    }
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}:`, error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord(tableName, {
      RecordIds: [id]
    });

    return response && response.success;
  } catch (error) {
    console.error(`Error deleting appointment with ID ${id}:`, error);
    throw error;
  }
};