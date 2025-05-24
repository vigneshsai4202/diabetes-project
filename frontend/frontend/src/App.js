import axios from 'axios';
import { useState } from 'react';
import jsPDF from 'jspdf';
import BulkUploader from './BulkUploader';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

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

  const initialInput = {
    age: '',
    gender: '',
    hypertension: '',
    heart_disease: '',
    smoking_history: '',
    bmi: '',
    HbA1c_level: '',
    blood_glucose_level: ''
  };

  const [input, setInput] = useState(initialInput);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['gender', 'hypertension', 'heart_disease', 'smoking_history'].includes(name)
      ? parseInt(value)
      : parseFloat(value);
    setInput({ ...input, [name]: value === '' ? '' : parsedValue });
  };

  const isValid = () => {
    const { age, bmi, HbA1c_level, blood_glucose_level } = input;
    if (age < 0 || age > 120) return "Age must be between 0 and 120.";
    if (bmi < 5 || bmi > 100) return "BMI must be between 5 and 100.";
    if (HbA1c_level < 2 || HbA1c_level > 15) return "HbA1c Level must be between 2 and 15.";
    if (blood_glucose_level < 50 || blood_glucose_level > 500) return "Blood Glucose Level must be between 50 and 500.";
    return null;
  };

  const handlePredict = async () => {
    for (let key in input) {
      if (input[key] === '' || isNaN(input[key])) {
        alert(`Please enter a valid value for ${key.replace(/_/g, ' ')}`);
        return;
      }
    }

    const error = isValid();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);
    setPrediction(null);
    setRecommendations(null);

    try {
      const res = await axios.post('http://localhost:8000/predict', input);
      setPrediction(res.data.prediction);
      setRecommendations(res.data.lifestyle_recommendations);
    } catch (error) {
      console.error('Error:', error);
      alert("Request failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPredict = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    setBulkLoading(true);
    const res = await axios.post('http://localhost:8000/bulk-predict-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setBulkResults(res.data);
  } catch (error) {
    console.error('Bulk Prediction Error:', error);
    alert('Bulk prediction failed. Check backend.');
  } finally {
    setBulkLoading(false);
  }
};


  const handleReset = () => {
    setInput(initialInput);
    setPrediction(null);
    setRecommendations(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Diabetes & CVD Risk Report', 20, 20);

    doc.setFontSize(12);
    let y = 40;
    Object.entries(input).forEach(([key, value]) => {
      doc.text(`${key.replace(/_/g, ' ')}: ${value}`, 20, y);
      y += 10;
    });

    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(prediction === "Diabetic" ? 'red' : 'green');
    doc.text(`Prediction: ${prediction}`, 20, y);
    y += 10;

    doc.setTextColor('black');
    if (recommendations?.cvd_risk_percent) {
      doc.text(`Estimated 10-year CVD Risk: ${recommendations.cvd_risk_percent}`, 20, y);
      y += 20;
    }

    if (recommendations) {
      doc.setFontSize(14);
      doc.text('Lifestyle Recommendations:', 20, y); y += 10;
      doc.setFontSize(12);
      doc.text(`Diet: ${recommendations.diet.join(', ')}`, 20, y); y += 10;
      doc.text(`Exercise: ${recommendations.exercise.join(', ')}`, 20, y); y += 10;
      doc.text(`Habits: ${recommendations.habits.join(', ')}`, 20, y); y += 10;
    }

    doc.save('diabetes_cvd_report.pdf');
  };

  const themeStyles = {
    backgroundColor: darkMode ? '#121212' : '#f9f9f9',
    color: darkMode ? '#f9f9f9' : '#121212'
  };

  const cardStyles = {
    backgroundColor: darkMode ? '#1e1e1e' : '#f0f4f8',
    color: darkMode ? '#fff' : '#000'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: darkMode ? '#333' : '#fff',
    color: darkMode ? '#fff' : '#000'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block'
  };

  return (
    <div style={{ ...themeStyles, minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ maxWidth: '500px', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <button onClick={toggleDarkMode} style={{
              padding: '6px 10px',
              fontSize: '14px',
              backgroundColor: darkMode ? '#444' : '#ddd',
              color: darkMode ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🩺 Diabetes Predictor</h2>

          {/* Input Fields */}
          {['age', 'bmi', 'HbA1c_level', 'blood_glucose_level'].map((name) => (
            <div key={name}>
              <label style={labelStyle}>{name.replace(/_/g, ' ')}:</label>
              <input type="number" name={name} value={input[name]} onChange={handleChange} style={inputStyle} />
            </div>
          ))}

          {/* Dropdown Fields */}
          {[
            { name: 'gender', options: ['Female', 'Male'] },
            { name: 'hypertension', options: ['No', 'Yes'] },
            { name: 'heart_disease', options: ['No', 'Yes'] },
            { name: 'smoking_history', options: ['Never', 'Formerly', 'Currently', 'Ever', 'Unknown'] }
          ].map(({ name, options }) => (
            <div key={name}>
              <label style={labelStyle}>{name.replace(/_/g, ' ')}:</label>
              <select name={name} value={input[name]} onChange={handleChange} style={inputStyle}>
                <option value="">Select</option>
                {options.map((option, index) => (
                  <option value={index} key={index}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={handlePredict} style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Predict</button>
            <button onClick={handleReset} style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Reset</button>
          </div>

          {loading && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className="spinner" style={{
                width: '30px',
                height: '30px',
                border: '4px solid #ccc',
                borderTop: '4px solid #1976d2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: 'auto'
              }} />
            </div>
          )}

          {prediction && !loading && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              ...cardStyles
            }}>
              <h3>Prediction Result</h3>
              <p style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: prediction === "Diabetic" ? 'red' : 'green'
              }}>
                {prediction === "Diabetic" ? '⚠️ Diabetic' : '✅ Not Diabetic'}
              </p>

              {recommendations?.cvd_risk_percent && (
                <p style={{ marginTop: '15px', fontSize: '15px', color: '#f39c12' }}>
                  🫀 Estimated 10-Year CVD Risk: <strong>{recommendations.cvd_risk_percent}</strong>
                </p>
              )}

              {recommendations && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  ...cardStyles
                }}>
                  <h3>🧘 Lifestyle Recommendations</h3>
                  <ul>
                    <li><strong>Diet:</strong> {recommendations.diet.join(', ')}</li>
                    <li><strong>Exercise:</strong> {recommendations.exercise.join(', ')}</li>
                    <li><strong>Habits:</strong> {recommendations.habits.join(', ')}</li>
                  </ul>
                </div>
              )}

              <button onClick={handleDownloadPDF} style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                📄 Download PDF
              </button>
            </div>
          )}

          <BulkUploader onDataReady={handleBulkPredict} />

          {bulkLoading && <p>🔄 Running bulk predictions...</p>}

          {bulkResults.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>📊 Bulk Prediction Results ({bulkResults.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table border="1" cellPadding="5">
                  <thead>
                                       <tr>
                      {allowedHeaders.map((header) => (
                        <th key={header}>{header.replace(/_/g, ' ')}</th>
                      ))}
                      <th>Prediction</th>
                      <th>CVD Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((result, index) => (
                      <tr key={index}>
                        {allowedHeaders.map((header) => (
                          <td key={header}>{result[header]}</td>
                        ))}
                        <td style={{ color: result.prediction === 'Diabetic' ? 'red' : 'green', fontWeight: 'bold' }}>
                          {result.prediction}
                        </td>
                        <td>
                          {result?.lifestyle_recommendations?.cvd_risk_percent ?? 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
