const tableName = 'department';

// Get all departments with optional filtering
export const getDepartments = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'description', 'Tags'],
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
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get total count of departments
export const getDepartmentsCount = async () => {
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
    console.error('Error getting departments count:', error);
    return 0;
  }
};

// Get single department by ID
export const getDepartmentById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(tableName, id);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw error;
  }
};

// Create new department
export const createDepartment = async (departmentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, description, Tags } = departmentData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ Name, description, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create department');
    }
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update existing department
export const updateDepartment = async (id, departmentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, description, Tags } = departmentData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ Id: id, Name, description, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update department');
    }
  } catch (error) {
    console.error(`Error updating department with ID ${id}:`, error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
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
    console.error(`Error deleting department with ID ${id}:`, error);
    throw error;
  }
};