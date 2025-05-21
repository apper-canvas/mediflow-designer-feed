const tableName = 'inventory_item1';

// Get all inventory items with optional filtering
export const getInventoryItems = async (filterOptions = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ['Id', 'Name', 'description', 'quantity', 'unitPrice', 'category', 'Tags'],
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

    // Filter by category if provided
    if (filterOptions.category) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'category',
        operator: 'ExactMatch',
        values: [filterOptions.category]
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
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Get total count of inventory items
export const getInventoryItemsCount = async () => {
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
    console.error('Error getting inventory items count:', error);
    return 0;
  }
};

// Get single inventory item by ID
export const getInventoryItemById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(tableName, id);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching inventory item with ID ${id}:`, error);
    throw error;
  }
};

// Create new inventory item
export const createInventoryItem = async (itemData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields, ensure data is in correct format
    const { Name, description, quantity, unitPrice, category, Tags } = itemData;
    
    const response = await apperClient.createRecord(tableName, {
      records: [{ 
        Name, 
        description, 
        quantity: Number(quantity), 
        unitPrice: parseFloat(unitPrice), 
        category, 
        Tags 
      }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create inventory item');
    }
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

// Update existing inventory item
export const updateInventoryItem = async (id, itemData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out any non-updateable fields
    const { Name, description, quantity, unitPrice, category, Tags } = itemData;
    
    const response = await apperClient.updateRecord(tableName, {
      records: [{ 
        Id: id, 
        Name, 
        description, 
        quantity: Number(quantity), 
        unitPrice: parseFloat(unitPrice), 
        category, 
        Tags 
      }]
    });

    if (response && response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update inventory item');
    }
  } catch (error) {
    console.error(`Error updating inventory item with ID ${id}:`, error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id) => {
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
    console.error(`Error deleting inventory item with ID ${id}:`, error);
    throw error;
  }
};