const {
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
  } = require('../models/businessModel');
  const pool = require('../config/db');
  
  // Get all businesses
  exports.getAllBusinesses = async (req, res) => {
    try {
      const businesses = await getAllBusinesses();
      res.status(200).json(businesses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get a business by ID
  exports.getBusinessById = async (req, res) => {
    const { id } = req.params;
    try {
      const business = await getBusinessById(id);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      res.status(200).json(business);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update a business
  exports.updateBusiness = async (req, res) => {
    const { id } = req.params;
    const { name, phone, address, business_type } = req.body;
    try {
      const updatedBusiness = await updateBusiness(id, name, phone, address, business_type);
      if (!updatedBusiness) {
        return res.status(404).json({ message: 'Business not found' });
      }
      res.status(200).json(updatedBusiness);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Delete a business
  exports.deleteBusiness = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBusiness = await deleteBusiness(id);
      if (!deletedBusiness) {
        return res.status(404).json({ message: 'Business not found' });
      }
      res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  