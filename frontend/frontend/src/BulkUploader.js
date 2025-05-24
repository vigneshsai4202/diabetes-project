import React, { useState } from 'react';
import Papa from 'papaparse';

const BulkUploader = ({ onDataReady }) => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState('');

  const allowedHeaders = [
    'gender',
    'age',
    'hypertension',
    'heart_disease',
    'smoking_history',
    'bmi',
    'HbA1c_level',
    'blood_glucose_level'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file || !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields;

        const missing = allowedHeaders.filter(h => !headers.includes(h));
        if (missing.length > 0) {
          setError(`Missing required columns: ${missing.join(', ')}`);
          return;
        }

        const cleanedData = results.data.map(row => {
          const newRow = {};
          allowedHeaders.forEach((header) => {
            const value = row[header];
            const parsedValue = ['gender', 'hypertension', 'heart_disease', 'smoking_history'].includes(header)
              ? parseInt(value)
              : parseFloat(value);
            newRow[header] = isNaN(parsedValue) ? null : parsedValue;
          });
          return newRow;
        });

        setError('');
        setCsvData(cleanedData);
        onDataReady(file); // ✅ Correct

      },
      error: (err) => {
        setError(`Parsing error: ${err.message}`);
      },
    });
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>📁 Bulk Upload Predictions</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {csvData.length > 0 && (
        <>
          <h4>Preview ({csvData.length} records)</h4>
          <div style={{ overflowX: 'auto' }}>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  {allowedHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {allowedHeaders.map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && <p>Showing first 5 of {csvData.length} records.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default BulkUploader;
