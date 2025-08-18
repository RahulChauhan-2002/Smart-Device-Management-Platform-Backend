import Device from '../models/Device.js';
import { deviceValidation } from '../utils/validation.js';

const createDevice = async (req, res) => {
  try {
    const { error } = deviceValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.message
      });
    }

    const device = await Device.create({  
      ...req.body,
      owner_id: req.user._id
    });

    res.status(201).json({
      success: true,
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        status: device.status,
        last_active_at: device.last_active_at,
        owner_id: device.owner_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getDevices = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = { owner_id: req.user._id };
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    const devices = await Device.find(filter);

    res.json({
      success: true,
      devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const heartbeat = async (req, res) => {
  try {
    const { status } = req.body;
    const last_active_at = new Date();

    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      { status, last_active_at },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device heartbeat recorded',
      last_active_at
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export  {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  heartbeat
};
