import React from 'react';
import './About.css';
import Header from '../../components/Header/Header';

const About = () => {
  return (
    <div className="about-container">
    <Header />
      <div className="about-content">
        <h2>About</h2>
        <p>This project aims to develop software for a Raspberry Pi that automatically executes when connected via USB or UART to retrieve information from an IoT device. The software will gather details such as firmware version, chip model, and voltage usage, compiling them into an XML format. This information can be stored onboard the Raspberry Pi or transmitted to another system for analysis.</p>
        <h2>Architectural Requirements</h2>
        <div className="requirements">
          <div className="requirement">
            <h3>Quality Requirements</h3>
            <ul>
              <li><strong>Performance:</strong> The system must retrieve data from IoT devices within 5 seconds of connection.</li>
              <li><strong>Reliability:</strong> The system should have an uptime of 99.9% to ensure continuous availability.</li>
              <li><strong>Scalability:</strong> The system must support a minimum of 1 concurrent IoT device connection per Raspberry Pi and storage and upload capability of a minimum of 4 devices at any given time.</li>
              <li><strong>Security:</strong> The system must securely transmit data to external systems using encryption.</li>
              <li><strong>Maintainability:</strong> The system should allow for easy updates and maintenance.</li>
              <li><strong>Usability:</strong> The system must have a simple configuration interface for selecting storage options.</li>
            </ul>
          </div>
          <div className="requirement">
            <h3>Architectural Patterns</h3>
            <ul>
              <li><strong>Layered Architecture:</strong> The system will be organized into layers, including Presentation Layer, Business Logic Layer, and Data Access Layer.</li>
              <li><strong>Microservices Architecture:</strong> The system will be divided into small, independent services that communicate over a network.</li>
            </ul>
          </div>
          <div className="requirement">
            <h3>Design Patterns</h3>
            <ul>
              <li><strong>Singleton Pattern</strong> for controlling access to the data retrieval manager.</li>
              <li><strong>Factory Pattern</strong> for creating instances of communication handlers.</li>
              <li><strong>Observer Pattern</strong> for decoupling data retrieval from storage/transmission.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
