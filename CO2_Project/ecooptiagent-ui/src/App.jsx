import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function App() {
  const [formData, setFormData] = useState({
    businessType: '',
    lightingType: '',
    lightingHours: '',
    acHours: '',
    vehicles: '',
    fuelType: '',
    avgKmPerDay: '',
    generatorUsed: '',
    generatorHours: '',
    solarUsed: '',
    monthlyElectricity: '',
    pastSixMonths: '',
    userPreferences: '',
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.lightingType) newErrors.lightingType = 'Lighting type is required';
    if (!formData.lightingHours) newErrors.lightingHours = 'Lighting hours is required';
    if (!formData.acHours) newErrors.acHours = 'AC hours is required';
    if (!formData.vehicles) newErrors.vehicles = 'Number of vehicles is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!formData.avgKmPerDay) newErrors.avgKmPerDay = 'Average km/day is required';
    if (!formData.generatorUsed) newErrors.generatorUsed = 'Generator usage is required';
    if (!formData.generatorHours) newErrors.generatorHours = 'Generator hours is required';
    if (!formData.solarUsed) newErrors.solarUsed = 'Solar usage is required';
    if (!formData.monthlyElectricity) newErrors.monthlyElectricity = 'Monthly electricity usage is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);

      setFormData({
        businessType: '',
        lightingType: '',
        lightingHours: '',
        acHours: '',
        vehicles: '',
        fuelType: '',
        avgKmPerDay: '',
        generatorUsed: '',
        generatorHours: '',
        solarUsed: '',
        monthlyElectricity: '',
        pastSixMonths: '',
        userPreferences: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 p-6 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1500&q=80"
          alt="Eco background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-green-100/90 backdrop-blur-sm"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-green-900 drop-shadow-sm">EcoOptiAgent</h1>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl grid gap-6 border border-green-100">
          {Object.entries({
            businessType: 'e.g., IT Office, Manufacturing',
            lightingType: 'e.g., LED, CFL',
            lightingHours: 'e.g., 10',
            acHours: 'e.g., 8',
            vehicles: 'e.g., 3',
            fuelType: 'e.g., Diesel, Petrol, Electric',
            avgKmPerDay: 'e.g., 25',
            generatorUsed: 'e.g., Yes or No',
            generatorHours: 'e.g., 10',
            solarUsed: 'e.g., Yes or No',
            monthlyElectricity: 'e.g., 1200',
            pastSixMonths: 'e.g., 1100,1150,1200,1250,1300,1280',
            userPreferences: 'Optional comment',
          }).map(([key, placeholder]) => (
            <div key={key}>
              <label className="block font-semibold text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur placeholder-gray-400"
              />
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            Submit
          </button>
        </form>

        {result && (
          <div className="mt-12 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-green-100">
            <h2 className="text-2xl font-bold text-green-700 mb-4">AI Suggestions</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm border border-gray-200">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
