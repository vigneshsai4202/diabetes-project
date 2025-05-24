import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PredictionChart = ({ history }) => {
  // Count diabetic vs not diabetic predictions
  const count = history.reduce(
    (acc, item) => {
      if (item.prediction === "Diabetic") acc.Diabetic += 1;
      else acc["Not Diabetic"] += 1;
      return acc;
    },
    { Diabetic: 0, "Not Diabetic": 0 }
  );

  const data = [
    { name: 'Diabetic', count: count.Diabetic },
    { name: 'Not Diabetic', count: count["Not Diabetic"] },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Prediction Summary</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
