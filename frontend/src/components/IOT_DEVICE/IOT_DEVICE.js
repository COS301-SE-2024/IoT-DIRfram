import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExchange, faTrashAlt, faBan } from '@fortawesome/free-solid-svg-icons';//faTrashAlt
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './IOT_DEVICE.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Pagination from '../Pagination/Pagination';
// import { set } from 'mongoose';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IoT_Device = ({ deviceId, isAdmin }) => {
  const [devices, setDeviceFiles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [secondDevice, setSecondDevice] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  console.log('isAdmin:', isAdmin);
  const devicesPerPage = 10; // Number of devices per page
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

  const getDeviceFiles = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/device/getDeviceFiles`, {
        params: {
          device_id: deviceId,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });
      const sortedDevices = response.data.sort(
        (a, b) => new Date(extractTimeFromFilename(b.filename)) - new Date(extractTimeFromFilename(a.filename))
      );
      setDeviceFiles(sortedDevices);
      setFilteredDevices(sortedDevices);
    } catch (error) {
      setError(error);
      console.error('Error fetching device files:', error);
    }
  }, [deviceId, fromDate, toDate], error);

  useEffect(() => {
    if (deviceId) {
      getDeviceFiles();
    }
  }, [deviceId, getDeviceFiles]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when devices change
  }, [filteredDevices]);

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
    const confirmed = window.confirm("Are you sure you want to delete this device?");
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete('http://localhost:3001/device/deleteFile', {
        data: { file_id: id }
      });
      setDeviceFiles((prevDevices) => prevDevices.filter(device => device._id !== id));
      setFilteredDevices((prevDevices) => prevDevices.filter(device => device._id !== id));

      toast.success('Item Deleted', {
        position: 'top-center',
        onClose: () => closeModal(),
      });

    } catch (error) {
      console.error('Error deleting device:', error);
    }
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
      if (index < sections.length - 1) {
        const newlineElement = document.createTextNode("\n\n");
        root.appendChild(newlineElement);
      }
    });
    const serializer = new XMLSerializer();
    return serializer.serializeToString(root);
  };

  const generateVoltageData = (voltage) => {
    return {
      labels: voltage.map((_, index) => `Point ${index + 1}`),
      datasets: [
        {
          label: 'Current (A)',
          data: voltage,
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
        }
      ]
    };
  };

  const options = {
    aspectRatio: 3,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data Points',
          color: '#fff', // White text for title
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: '#fff', // White text for x-axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light transparent white grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: 'Current (A)',
          color: '#fff', // White text for title
        },
        min: 0,
        ticks: {
          color: '#fff', // White text for y-axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Light transparent white grid lines
        },
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff', // White text for legend labels
        }
      },
      tooltip: {
        callbacks: {
          labelColor: function (tooltipItem) {
            return {
              backgroundColor: '#1F393E', // Change this to the desired color
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 2,
            };
          },
          label: function (tooltipItem) {
            return `Current (A): ${tooltipItem.raw.toFixed(6)}`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltip
        titleColor: '#fff', // White text for tooltip title
        bodyColor: '#fff', // White text for tooltip body
      }
    },
  };

  const calculateStats = (voltage) => {
    const max = Math.max(...voltage).toFixed(6);
    const min = Math.min(...voltage).toFixed(6);
    const avg = (voltage.reduce((sum, val) => sum + val, 0) / voltage.length).toFixed(6);
    
    const maxIndex = voltage.indexOf(Math.max(...voltage));
    const minIndex = voltage.indexOf(Math.min(...voltage));
  
    return { max, maxIndex, min, minIndex, avg };
  };  

  // const handleItemClick = (device) => {
  //   setSelectedDevice(device);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedDevice(null);
  // };

  const handleItemClick = (device) => {
    if (!isComparing) {
      setSelectedDevice(device);
      setIsModalOpen(true);
    } else {
      setSecondDevice(device);
      setIsModalOpen(true);
    }
  };

  const handleCompareClick = () => {
    if (selectedDevice && secondDevice) {
      setIsComparing(true);
      toast.error('Already comparing.');
    } else {
      setIsComparing(true);
      setIsModalOpen(false);

    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    setSecondDevice(null);
    setIsComparing(false);
  };


  const downloadVoltageAsCsv = (voltage, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,Point,Current (A)\n";
    voltage.forEach((value, index) => {
      csvContent += `${index + 1},${value.toFixed(6)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const csvFilename = filename.slice(0, -4) + '_voltage.csv';
    link.setAttribute('download', csvFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterDevicesByDate = () => {
    const filtered = devices.filter((device) => {
      const deviceDate = new Date(extractTimeFromFilename(device.filename)).toISOString().split('T')[0];
      const from = fromDate ? new Date(fromDate).toISOString().split('T')[0] : null;
      const to = toDate ? new Date(toDate).toISOString().split('T')[0] : null;
      return (!from || deviceDate >= from) && (!to || deviceDate <= to);
    });
    setFilteredDevices(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setFilteredDevices(devices);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const renderComparisonChart = () => {
    if (selectedDevice && secondDevice) {
      const data1 = selectedDevice.voltage || [];
      const data2 = secondDevice.voltage || [];
      console.log(selectedDevice);
      console.log(secondDevice);
      const comparisonData = generateNewVoltageData(data1, data2);
      return (
        // options={options}
        <div className='graphDiv'>
          <Line data={comparisonData} options={compOptions}/>
        </div>
      );
    }
    return null;
  };

  const compOptions = {
    aspectRatio: 3,
    maintainAspectRatio: true,
  }

  const generateNewVoltageData = (voltage1, voltage2 = []) => {
    return {
      labels: voltage1.map((_, index) => `Point ${index + 1}`),
      datasets: [
        {
          label: 'Device 1 Current (A)',
          data: voltage1,
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
        },
        {
          label: 'Device 2 Current (A)',
          data: voltage2,
          fill: true,
          backgroundColor: 'rgba(153,102,255,0.2)',
          borderColor: 'rgba(153,102,255,1)',
        }
      ]
    };
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="devices-list">
      <div className="date-filter">
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className='date-input'
            onClick={(e) => e.target.showPicker()}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className='date-input'
            onClick={(e) => e.target.showPicker()}
          />
        </label>
        <button onClick={filterDevicesByDate}>Search</button>
        <button onClick={clearFilters} className='remove-button'>Clear</button>
      </div>
      <br />
      <Pagination
        filteredDevices={filteredDevices}
        devicesPerPage={devicesPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
      {currentDevices.length === 0 ? (
        <p>No IoT device data found.</p>
      ) : (
        currentDevices
          .sort((a, b) => new Date(extractTimeFromFilename(b.filename)) - new Date(extractTimeFromFilename(a.filename)))
          .map((device, index) => (
            <div key={indexOfFirstDevice + index} className="device-item" onClick={() => handleItemClick(device)}>
              <h3 className="filename">
                IoT Device {indexOfFirstDevice + index + 1}<br /> {extractTimeFromFilename(device.filename)}
              </h3>
            </div>
          ))
      )}

      {/* Pagination controls
      <div className="pagination">
        {[...Array(Math.ceil(filteredDevices.length / devicesPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)} className={`page-link ${currentPage === number + 1 ? 'active' : ''}`}>
            {number + 1}
          </button>
        ))}
      </div> */}

      <Pagination
        filteredDevices={filteredDevices}
        devicesPerPage={devicesPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />

      {isModalOpen && (
        <div className="modal-overlay-iot" onClick={closeModal}>
          <div className="modal-content-iot" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Device Details</h2>
              <button onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
            {/* className="buttons-container" */}
            <div>
              {secondDevice ? (
                <>
                  <button className="icon-button delete-button" onClick={() => setSecondDevice(null)}>Cancel Comparison <FontAwesomeIcon icon={faBan}/></button>
                  <div className="comparison-chart">
                    <h3>Comparison Chart</h3>
                    {renderComparisonChart()}

                  </div>
                </>
              ) : (
                <>
                  <button className="icon-button edit-button" onClick={() => downloadFile(selectedDevice.content, selectedDevice.filename)}>
                    Download File <FontAwesomeIcon icon={faDownload}/>
                  </button>
                  {isAdmin === "true" && (<button className="icon-button delete-button" onClick={() => handleDelete(selectedDevice._id)}>
                    Delete Info <FontAwesomeIcon icon={faTrashAlt}/>
                  </button>)}
                  <button className="icon-button green-button" onClick={() => downloadVoltageAsCsv(selectedDevice.voltage, selectedDevice.filename)}>
                    Download Current <FontAwesomeIcon icon={faDownload}/>
                  </button>
                  <button className="icon-button compare-button" onClick={() => handleCompareClick()}>
                    Compare Current <FontAwesomeIcon icon={faExchange}/>
                  </button>
                </>
              )}
            </div>

           
              <div className='device-container-iot'>
                <div className='left-container'>
                  <h2>Extracted from: {selectedDevice.device_name}</h2>
                  <p><strong>Extracted Time: </strong>{extractTimeFromFilename(selectedDevice.filename)}</p>
                  <h3>Firmware and Chip information:</h3>
                  <pre className="device-content">{extractSegmentedContent(selectedDevice.content)}</pre>
                </div>
                <div className='right-container'>
                  <h3>Full Content</h3>
                  <div className="content-window">
                    <pre className="device-content">{selectedDevice.content}</pre>
                  </div>
                </div>
                {selectedDevice.voltage && selectedDevice.voltage.length > 0 && !secondDevice && (
                  <div className='voltage-chart'>
                    <h3>Current Data</h3>
                    <div className='graphDiv'>
                      <Line data={generateVoltageData(selectedDevice.voltage)} options={options} />
                    </div>
                    <div className="stats">
                      <p><strong>Max Current:</strong> {calculateStats(selectedDevice.voltage).max} - Point {calculateStats(selectedDevice.voltage).maxIndex + 1}</p>
                      <p><strong>Min Current:</strong> {calculateStats(selectedDevice.voltage).min} - Point {calculateStats(selectedDevice.voltage).minIndex + 1}</p>
                      <p><strong>Average Current:</strong> {calculateStats(selectedDevice.voltage).avg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};


export default IoT_Device;
