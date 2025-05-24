const HealthTips = ({ input, prediction }) => {
    const getTips = () => {
      if (!prediction || prediction === "Not Diabetic") return [];
  
      const tips = [
        "🥗 Eat a balanced diet with whole grains, vegetables, and lean protein.",
        "🚶‍♂️ Aim for at least 30 minutes of moderate exercise most days.",
        "💧 Stay hydrated—drink plenty of water.",
        "🛌 Ensure consistent sleep to regulate blood sugar.",
        "🩺 Regularly monitor blood glucose levels and consult your doctor.",
      ];
  
      if (input.bmi > 30) {
        tips.push("⚖️ Consider weight management strategies with medical guidance.");
      }
  
      if (input.blood_glucose_level > 180) {
        tips.push("🍬 Reduce sugar and refined carb intake.");
      }
  
      return tips;
    };
  
    return (
      <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-xl mt-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">💡 Health Recommendations</h2>
        {prediction === "Not Diabetic" ? (
          <p className="text-green-600 dark:text-green-400">You're doing well! Keep up the healthy lifestyle. 🧘‍♀️</p>
        ) : (
          <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
            {getTips().map((tip, i) => (
              <li key={i} className="mb-1">{tip}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default HealthTips;
  