import cron from 'node-cron';
import Device from '../models/Device.js';

const deviceCleanupJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await Device.updateMany(
        {
          last_active_at: { $lt: twentyFourHoursAgo },
          status: { $ne: 'inactive' }
        },
        { status: 'inactive' }
      );

      console.log(`Device cleanup job: ${result.modifiedCount} devices marked as inactive`);
    } catch (error) {
      console.error('Device cleanup job error:', error);
    }
  });
};

export default deviceCleanupJob;
