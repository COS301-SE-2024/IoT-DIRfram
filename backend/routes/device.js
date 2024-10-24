const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iotdirfram@gmail.com',
    pass: 'hzxv etub xkpg ngri', // Add your password here
  },
});

module.exports = (client) => {
  const db = client.db('uart_data');
  const clientDB = client.db('Auth');
  const piDevicesCollection = db.collection('pi_devices');
  const usersCollection = clientDB.collection('Users');
  const usersToDevicesCollection = db.collection('users_devices');
  const deviceFilesCollection = db.collection('file_data');

  router.get('/devices', async (req, res) => {
    try {
      //Find all devices in pi_devices database
      const devices = await piDevicesCollection.find().toArray();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.get('/getDeviceName', async (req, res) => {
    // console.log('Query params:', req.query);
    try {
      const { device_id } = req.query;
      // console.log(device_id);

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      // console.log(device);

      if (!device) {
        return res.status(400).json({ error: 'Device not found' });
      }

      //Construct json
      const deviceDetails = {
        device_name: device.device_name,
      };

      res.json(deviceDetails);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch device name' });
    }
  });

  router.post('/devicesForUser', async (req, res) => {
    try {
      const { username } = req.body;

      // Check if the username is provided
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      // Find user in Auth database
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Find devices assigned to the user
      const devices = await usersToDevicesCollection.find({ username }).toArray();
      // console.log(`Found ${devices.length} devices assigned to user ${username}`);
      // console.log(devices);
      // console.log(devices);
      const deviceIds = devices.map((device) => device.device_id);

      // Find device details
      const devicesDetails = await piDevicesCollection.find({ _id: { $in: deviceIds } }).toArray();

      // Append device_name from devices array to devicesDetails as custom_name
      const updatedDevicesDetails = devicesDetails.map(deviceDetail => {
        const associatedDevice = devices.find(device => device.device_id === deviceDetail._id.toString());
        return {
          ...deviceDetail,
          isAdmin: associatedDevice ? associatedDevice.isAdmin : false, // Append isAdmin attribute
          custom_name: associatedDevice ? associatedDevice.device_name : null, // Append device_name as custom_name
        };
      });

      res.json(updatedDevicesDetails);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.get('/getDeviceFiles', async (req, res) => {
    try {
      const { device_id } = req.query;

      //Find files for device
      const files = await deviceFilesCollection
        .find({ device_serial_number: device_id })
        .toArray();

      res.json(files);
    }
    catch (err) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  router.post('/addDevice', async (req, res) => {
    try {
      const { device_id, deviceName } = req.body;

      //check if device_id is provided
      if (!device_id) {
        return res.status(400).json({ error: 'Device ID is required' });
      }

      //check if deviceName is provided
      if (!deviceName) {
        return res.status(400).json({ error: 'Device name is required' });
      }

      //Check if device already exists
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (device) {
        return res.status(400).json({ error: 'Device already exists' });
      }

      //Add device to pi_devices database
      await piDevicesCollection.insertOne({
        _id: device_id,
        deviceName,
      });

      return res.status(200).json({ message: 'Device added' });
    }
    catch (err) {
      res.status(500).json({ error: 'Failed to add device' });
    }

  });

  router.post('/addDeviceToUser', async (req, res) => {
    try {
      const { device_id, username } = req.body;
  
      // Find user in Auth database
      const user = await usersCollection.findOne({
        username,
      });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });
  
      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }
  
      // Check if device is already assigned to any user
      const deviceAssigned = await usersToDevicesCollection.findOne({
        device_id,
      });
  
      // Check if device is already assigned to the current user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        device_id,
      });
  
      if (userToDevice) {
        return res.status(400).json({ error: 'Device already assigned to user' });
      }
  
      // Determine if the user should be admin (first user to add the device)
      const isAdmin = !deviceAssigned; // If device isn't assigned to any user, set isAdmin to true
  
      // Add device to user with optional isAdmin attribute
      await usersToDevicesCollection.insertOne({
        username,
        device_id,
        isAdmin: isAdmin || false, // Set isAdmin to true if first user, otherwise false
      });
  
      return res.status(200).json({ message: 'Device added to user', isAdmin });
  
    } catch (err) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  });  

  router.post('/updateDeviceName', async (req, res) => {
    try {
      const { device_id, device_name, username } = req.body;

      // Check if username is provided
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      // Check if device_id is provided
      if (!device_id) {
        return res.status(400).json({ error: 'Device ID is required' });
      }

      // Check if device_name is provided
      if (!device_name) {
        return res.status(400).json({ error: 'Device name is required' });
      }

      // Find user in Auth database
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the device is assigned to the user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        device_id,
      });

      if (!userToDevice) {
        return res.status(404).json({ error: 'Device not assigned to user' });
      }

      // Update the device name in users_devices collection
      await usersToDevicesCollection.updateOne(
        { username, device_id },
        { $set: { device_name } }
      );

      return res.status(200).json({ message: 'Device name updated successfully' });
    } catch (err) {
      console.error('Failed to update device name:', err);
      res.status(500).json({ error: 'Failed to update device name due to server error' });
    }
  });

  router.post('/removeDeviceFromUser', async (req, res) => {
    try {
      const { device_id, username } = req.body;

      //Find user in Auth database
      const user = await usersCollection.findOne({
        username,
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Check if device is assigned to user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        device_id,
      });

      if (!userToDevice) {
        return res.status(400).json({ error: 'Device not assigned to user' });
      }

      //Remove device from user
      await usersToDevicesCollection.deleteOne({
        username,
        device_id,
      });

      return res.status(200).json({ message: 'Device removed from user' });

    } catch (err) {
      res.status(500).json({ error: 'Failed to remove device' });
    }
  });

  router.post('/deleteDevice', async (req, res) => {
    try {
      const { device_id } = req.body;

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Delete device from pi_devices database
      await piDevicesCollection.deleteOne({
        _id: device_id,
      });

      //Delete device from users_devices database
      await usersToDevicesCollection.deleteMany({
        device_id,
      });

      //Delete files for device from file_data database
      await deviceFilesCollection.deleteMany({
        device_serial_number: device_id,
      });

      return res.status(200).json({ message: 'Device deleted' });

    } catch (err) {
      res.status(500).json({ error: 'Failed to delete device' });
    }
  });

  router.delete('/deleteFile', async (req, res) => {
    try {
      const { file_id } = req.body;
      // console.log(file_id);

      var mongoose = require('mongoose');
      var id = new mongoose.Types.ObjectId(file_id);
      //Find file in file_data database
      const file = await deviceFilesCollection.findOne({
        _id: id,
      });
      // console.log(file);
      if (!file) {
        return res.status(400).json({ error: 'File does not exist' });
      }

      //Delete file from file_data database
      await deviceFilesCollection.deleteOne({
        _id: id,
      });

      return res.status(200).json({ message: 'File deleted' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  // POST /upload_uart route
  router.post('/upload_uart', async (req, res) => {
    try {
      const { type, content, filename, device_name, device_serial_number, voltage } = req.body;

      if (!type || !content || !filename || !device_name || !device_serial_number || !voltage) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Create a document to insert into the file_data collection
      const document = {
        type,
        content,
        filename,
        device_name,
        device_serial_number,
        voltage,
        uploaded_at: new Date(), // Adding a timestamp
      };

      // Insert the document into the file_data collection
      await deviceFilesCollection.insertOne(document);

      // Optionally, add the device to the pi_devices collection
      const device = {
        _id: device_serial_number,
        device_name,
      };

      try {
        await piDevicesCollection.insertOne(device);
      } catch (err) {
        if (err.code !== 11000) { // Ignore duplicate key errors
          throw err;
        }
      }

      // Find user IDs who have access to this Raspberry Pi
      const userDevices = await usersToDevicesCollection.find({ device_id: device_serial_number }).toArray();
      const userIds = userDevices.map(userDevice => userDevice.username);
      // console.log(`Found ${userIds[0]} users with access to this Raspberry Pi`);
      // Find user details for these user IDs
      const users = await usersCollection.find({ username: { $in: userIds } }).toArray();
      // console.log(`Found ${users.length} users with access to this Raspberry Pi`);

      // Send an email to each user
      const mailOptions = {
        from: 'iotdirfram@gmail.com',
        subject: 'New Data Uploaded for Your Raspberry Pi',
        text: `New data has been uploaded for your Raspberry Pi with serial number ${device_serial_number}.\n\nDevice Name: ${device_name}\nFilename: ${filename}\n\nThank you,\nIoT-DIRfram Team`,
      };

      users.forEach(async (user) => {
        if (user.notifications && user.notifications.newDataAvailable) { // Check if the notification is enabled
          console.log(`Sending email to ${user.email}`);
          mailOptions.to = user.email;
          await transporter.sendMail(mailOptions);
        } else {
          console.log(`User ${user.username} has notifications for new data disabled.`);
        }
      });

      res.status(200).json({ message: "Data uploaded successfully and notifications sent!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to upload data or send notifications.", details: err.message });
    }
  });

  return router;
};
