const tableName = 'staff1';

// Get all staff members with optional filtering
export const getStaffMembers = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'fullName', 'position', 'email', 'phone', 'Tags'],
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

    // Filter by position if provided
    if (filterOptions.position) {
      params.where = [
        {
          fieldName: 'position',
          operator: 'ExactMatch',
          values: [filterOptions.position]
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
    console.error('Error fetching staff members:', error);
    throw error;
  }
};

// Get total count of staff members
export const getStaffCount = async () => {
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
    console.error('Error getting staff count:', error);
    return 0;
  }
};

// Get single staff member by ID
export const getStaffMemberById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(tableName, id);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching staff member with ID ${id}:`, error);
    throw error;
  }
};

// Create new staff member
export const createStaffMember = async (staffData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, fullName, position, email, phone, Tags } = staffData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ Name, fullName, position, email, phone, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create staff member');
    }
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

// Update existing staff member
export const updateStaffMember = async (id, staffData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, fullName, position, email, phone, Tags } = staffData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ Id: id, Name, fullName, position, email, phone, Tags }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update staff member');
    }
  } catch (error) {
    console.error(`Error updating staff member with ID ${id}:`, error);
    throw error;
  }
};

// Delete staff member
export const deleteStaffMember = async (id) => {
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
    console.error(`Error deleting staff member with ID ${id}:`, error);
    throw error;
  }
};