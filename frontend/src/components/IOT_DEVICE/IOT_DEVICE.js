import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './IOT_DEVICE.css';
import axios from 'axios';

const IoT_Device = () => {
  const [devices, setDeviceFiles] = useState([]);
  const [error, setError] = useState(null);
  const [deviceId, setDeviceId] = useState("1000000013dcc3ed");

  const getDeviceFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/device/getDeviceFiles', {
        params: { device_id: deviceId }
      });
      setDeviceFiles(response.data);
      console.log('Device files:', response.data);
    } catch (error) {
      setError('Failed to fetch device files');
      console.error('Error fetching device files:', error);
    }
  };

  useEffect(() => {
    getDeviceFiles();
  }, []);

  const extractTimeFromFilename = (filename) => {
    const timestamp = filename.slice(4, -4);
    const [date, time] = timestamp.split('-');
    const formattedTime = `${date.replace(/:/g, '-')} ${time}`;
    return formattedTime;
  };

  const extractSegmentedContent = (content) => {
    const segments = content.split('\n\n\n');
    return segments[1] ? segments[1] : segments[0];
  };

  const handleDelete = async (id) => {
    console.log(`Delete device with ID: ${id}`);

    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to delete this device?");
    if (!confirmed) {
      return; // Do nothing if user cancels
    }
    try {
      const response = await axios.delete('http://localhost:3001/device/deleteFile', {
        data: {
          file_id: id
        }
      });
      console.log('Delete device response:', response.data);
    } catch (error) {
      console.error('Error deleting device:', error);
    }

    getDeviceFiles();
  };

  const downloadFile = (content, filename) => {
    const fileExtension = prompt("Choose file format: 'xml' or 'text'");
    if (fileExtension === 'xml') {
      downloadAsXml(content, filename);
    } else if (fileExtension === 'text') {
      downloadAsText(content, filename);
    } else {
      alert('Invalid file format. Please choose either "xml" or "text".');
    }
  };

  const downloadAsXml = (content, filename) => {
    const xmlContent = convertToXml(content);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const newfilename = filename.slice(0, -4) + '.xml';
    a.download = newfilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadAsText = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const newfilename = filename.slice(0, -4) + '.txt';
    a.download = newfilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const convertToXml = (content) => {
    const sections = content.split('\n\n\n');
    const root = document.createElement("root");
    sections.forEach((section, index) => {
      const sectionLines = section.split('\n');
      const sectionContentWithSpaces = sectionLines.join('\n\n'); // Add spaces between each line
      const sectionElement = document.createElement(`section_${index + 1}`);
      sectionElement.textContent = sectionContentWithSpaces;
      root.appendChild(sectionElement);
      // Add two newline characters after each section's content
      if (index < sections.length - 1) {
        const newlineElement = document.createTextNode("\n\n");
        root.appendChild(newlineElement);
      }
    });
    const serializer = new XMLSerializer();
    return serializer.serializeToString(root);
  };

  return (
    <div className="devices-list">
      {devices.length === 0 ? (
        <p>No IoT devices connected.</p>
      ) : (
        devices.map((device, index) => (
          <div key={index} className="device-item">
            <div className="buttons-container">
              <button className="icon-button edit-button" onClick={() => downloadFile(device.content, device.filename)}>
                Download FIle: <FontAwesomeIcon icon={faDownload} size="2x" />
              </button>
              <div className="spacer"><h3>IoT Device {index + 1}</h3></div> {/* Add a spacer */}
              <button className="icon-button delete-button" onClick={() => handleDelete(device._id)}>
                Delete Info: <FontAwesomeIcon icon={faTrashAlt} size="2x" />
              </button>
            </div>
            <div className='device-container'>
              <div className='left-container'>
                <h2>Extracted from: {device.device_name}</h2>
                <p><strong>Extracted Time: </strong>{extractTimeFromFilename(device.filename)}</p>
                <h3>Firmware and Chip information:</h3>
                <pre className="device-content">{extractSegmentedContent(device.content)}</pre>
              </div>
              <div className='right-container'>
                <h3>Full Content</h3>
                <div className="content-window">
                  <pre className="device-content">{device.content}</pre>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IoT_Device;
