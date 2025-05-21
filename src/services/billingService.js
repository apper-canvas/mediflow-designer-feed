const tableName = 'billing1';

// Get all billing records with optional filtering
export const getBillingRecords = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'amount', 'status', 'billingDate', 'dueDate', 'patientId', 'appointmentId'],
      expands: [
        {
          name: 'patientId',
          alias: 'patient'
        },
        {
          name: 'appointmentId',
          alias: 'appointment'
        }
      ],
      orderBy: [
        {
          field: 'billingDate',
          direction: 'DESC'
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

    // Filter by patient if provided
    if (filterOptions.patientId) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'patientId',
        operator: 'ExactMatch',
        values: [filterOptions.patientId]
      });
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
    console.error('Error fetching billing records:', error);
    throw error;
  }
};

// Get total revenue (sum of paid bills)
export const getTotalRevenue = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      aggregators: [{ function: 'Sum', field: 'amount', alias: 'total' }],
      where: [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: ['paid']
        }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);
    return response.data?.[0]?.total || 0;
  } catch (error) {
    console.error('Error getting total revenue:', error);
    return 0;
  }
};

// Get single billing record by ID
export const getBillingRecordById = async (id) => {
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
        },
        {
          name: 'appointmentId',
          alias: 'appointment'
        }
      ]
    });
    
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching billing record with ID ${id}:`, error);
    throw error;
  }
};

// Create new billing record
export const createBillingRecord = async (billingData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields, ensure data is in correct format
    const { Name, amount, status, billingDate, dueDate, patientId, appointmentId } = billingData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ Name, amount, status, billingDate, dueDate, patientId, appointmentId }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create billing record');
    }
  } catch (error) {
    console.error('Error creating billing record:', error);
    throw error;
  }
};

// Update existing billing record
export const updateBillingRecord = async (id, billingData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, amount, status, billingDate, dueDate, patientId, appointmentId } = billingData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ Id: id, Name, amount, status, billingDate, dueDate, patientId, appointmentId }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update billing record');
    }
  } catch (error) {
    console.error(`Error updating billing record with ID ${id}:`, error);
    throw error;
  }
};

// Delete billing record
export const deleteBillingRecord = async (id) => {
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
    console.error(`Error deleting billing record with ID ${id}:`, error);
    throw error;
  }
};