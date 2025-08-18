import DeviceLog from '../models/DeviceLog.js';
import Device from '../models/Device.js';
import { logValidation } from '../utils/validation.js';

const createLog = async (req, res) => {
  try {
    const { error } = logValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Verify device ownership
    const device = await Device.findOne({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const log = await DeviceLog.create({
      device_id: req.params.id,
      event: req.body.event,
      value: req.body.value
    });

    res.status(201).json({
      success: true,
      log: {
        id: log._id,
        event: log.event,
        value: log.value,
        timestamp: log.timestamp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getLogs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Verify device ownership
    const device = await Device.findOne({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const logs = await DeviceLog.find({ device_id: req.params.id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      logs: logs.map(log => ({
        id: log._id,
        event: log.event,
        value: log.value,
        timestamp: log.timestamp
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUsage = async (req, res) => {
  try {
    const { range = '24h' } = req.query;
    
    // Verify device ownership
    const device = await Device.findOne({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Calculate time range
    const now = new Date();
    const timeRange = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const startTime = new Date(now.getTime() - (timeRange[range] || timeRange['24h']));

    const logs = await DeviceLog.find({
      device_id: req.params.id,
      event: 'units_consumed',
      timestamp: { $gte: startTime }
    });

    const totalUnits = logs.reduce((sum, log) => sum + log.value, 0);

    res.json({
      success: true,
      device_id: req.params.id,
      [`total_units_last_${range}`]: totalUnits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


export {
  createLog,
  getLogs,
  getUsage
};
