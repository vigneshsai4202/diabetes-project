import axios from 'axios';
import { useState } from 'react';
import jsPDF from 'jspdf';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

    try {
      const res = await axios.post('http://localhost:8000/predict', input);
      setPrediction(res.data.prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      alert("Prediction failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput(initialInput);
    setPrediction(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Diabetes Prediction Report', 20, 20);
    doc.setFontSize(12);
    let y = 40;
    Object.entries(input).forEach(([key, value]) => {
      doc.text(`${key.replace(/_/g, ' ')}: ${value}`, 20, y);
      y += 10;
    });
    doc.setFontSize(14);
    y += 10;
    doc.setTextColor(prediction === "Diabetic" ? 'red' : 'green');
    doc.text(`Prediction: ${prediction}`, 20, y);
    doc.save('diabetes_prediction_report.pdf');
  };

  return (
    <div style={{ ...themeStyles, minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '40px'
      }}>
        {/* Form Section */}
        <div style={{ maxWidth: '500px', flex: 1 }}>
          {/* Dark Mode Toggle */}
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

          {[
            { name: 'age', label: 'Age:' },
            { name: 'bmi', label: 'BMI:' },
            { name: 'HbA1c_level', label: 'HbA1c Level:' },
            { name: 'blood_glucose_level', label: 'Blood Glucose Level:' }
          ].map(({ name, label }) => (
            <div key={name}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number"
                name={name}
                value={input[name]}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          ))}

          {[
            { name: 'gender', label: 'Gender', options: ['Female', 'Male'] },
            { name: 'hypertension', label: 'Hypertension', options: ['No', 'Yes'] },
            { name: 'heart_disease', label: 'Heart Disease', options: ['No', 'Yes'] },
            { name: 'smoking_history', label: 'Smoking History', options: ['Never', 'Formerly', 'Currently', 'Ever', 'Unknown'] }
          ].map(({ name, label, options }) => (
            <div key={name}>
              <label style={labelStyle}>{label}</label>
              <select
                name={name}
                value={input[name]}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                {options.map((option, index) => (
                  <option value={index} key={index}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={handlePredict}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Predict
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                backgroundColor: '#888',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
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
              <p style={{ marginTop: '10px', color: darkMode ? '#ccc' : '#555', fontSize: '14px' }}>
                {prediction === "Diabetic"
                  ? "Consider checking with a physician. A balanced diet, exercise, and regular monitoring help manage diabetes."
                  : "Keep up the healthy habits and stay safe!"}
              </p>
              <button
                onClick={handleDownloadPDF}
                style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📄 Download PDF
              </button>
            </div>
          )}
        </div>

        {/* Side Image Section */}
        <div style={{ flex: 1, minWidth: '250px', display: 'none', maxWidth: '400px' }} className="side-img">
          <img
            src="/Diabetes_share.jpg"
            alt="Diabetes Awareness"
            style={{
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginTop: '40px'
            }}
          />
          <p style={{ textAlign: 'center', marginTop: '10px', color: darkMode ? '#ccc' : '#555' }}>
            Stay informed. Early detection helps!
          </p>
        </div>
      </div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (min-width: 768px) {
            .side-img {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;
