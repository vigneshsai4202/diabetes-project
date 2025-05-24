import { Table } from "@/components/ui/table";

const PredictionHistory = ({ history }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📜 Prediction History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No past predictions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border p-2">Date/Time</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">BMI</th>
                <th className="border p-2">Glucose</th>
                <th className="border p-2">HbA1c</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{entry.timestamp}</td>
                  <td className="border p-2">{entry.age}</td>
                  <td className="border p-2">{entry.bmi}</td>
                  <td className="border p-2">{entry.blood_glucose_level}</td>
                  <td className="border p-2">{entry.HbA1c_level}</td>
                  <td className={`border p-2 font-semibold ${entry.prediction === "Diabetic" ? "text-red-500" : "text-green-600"}`}>
                    {entry.prediction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
