import { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ onResult, onSaveHistory }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value === '' ? '' : parseFloat(value) });
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
    setError('');
    for (let key in input) {
      if (input[key] === '' || isNaN(input[key])) {
        setError(`Please enter a valid value for ${key.replace(/_/g, ' ')}`);
        return;
      }
    }

    const validationError = isValid();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/predict', input);
      const prediction = res.data.prediction;
      onResult(prediction, input);
      onSaveHistory({ ...input, prediction, timestamp: new Date().toLocaleString() });
      setInput(initialInput);
    } catch (err) {
      setError("Prediction failed. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block font-medium mb-1";
  const inputClass = "w-full p-2 border rounded mb-3";

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fill Patient Details</h2>

      {['age', 'bmi', 'HbA1c_level', 'blood_glucose_level'].map((field) => (
        <div key={field}>
          <label className={labelClass}>{field.replace(/_/g, ' ').toUpperCase()}:</label>
          <input type="number" name={field} value={input[field]} onChange={handleChange} className={inputClass} />
        </div>
      ))}

      {[
        { name: 'gender', label: 'Gender', options: ['Female', 'Male'] },
        { name: 'hypertension', label: 'Hypertension', options: ['No', 'Yes'] },
        { name: 'heart_disease', label: 'Heart Disease', options: ['No', 'Yes'] },
        { name: 'smoking_history', label: 'Smoking History', options: ['Never', 'Formerly', 'Currently', 'Ever', 'Unknown'] }
      ].map(({ name, label, options }) => (
        <div key={name}>
          <label className={labelClass}>{label}:</label>
          <select name={name} value={input[name]} onChange={handleChange} className={inputClass}>
            <option value="">Select</option>
            {options.map((option, idx) => (
              <option key={option} value={idx}>{option}</option>
            ))}
          </select>
        </div>
      ))}

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button onClick={handlePredict} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict'}
      </button>
    </div>
  );
};

export default PredictionForm;
