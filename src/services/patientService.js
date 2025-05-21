const tableName = 'patient1';

// Get all patients with optional filtering
export const getPatients = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'fullName', 'email', 'phone', 'Tags'],
      orderBy: [
        {
          field: 'Name',
          direction: 'ASC'
        }
      ]
    };

    // Add where conditions if specified in filterOptions
    if (filterOptions.search) {
      params.where = [
        {
          fieldName: 'Name',
          operator: 'Contains',
          values: [filterOptions.search]
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
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get total count of patients
export const getPatientsCount = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords(tableName, {
      aggregators: [{ function: 'Count', field: 'Id', alias: 'total' }]
    });

    return response.data?.[0]?.total || 0;
  } catch (error) {
    console.error('Error getting patients count:', error);
    return 0;
  }
};

// Get single patient by ID
export const getPatientById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(tableName, id);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    throw error;
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, fullName, email, phone, Tags } = patientData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ Name, fullName, email, phone, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create patient');
    }
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update existing patient
export const updatePatient = async (id, patientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, fullName, email, phone, Tags } = patientData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ Id: id, Name, fullName, email, phone, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update patient');
    }
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (id) => {
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
    console.error(`Error deleting patient with ID ${id}:`, error);
    throw error;
  }
};