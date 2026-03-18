import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import api from '../api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    riskDistribution: [],
    attendanceTrend: [],
    departmentRisk: []
  });
  const [error, setError] = useState('');

  // Mock data for analytics since backend doesn't have an endpoint for this yet
  useEffect(() => {
    // In a real scenario, this would fetch from an analytics endpoint
    // Since we don't want to change backend too much, we will mock or aggregate existing data
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // We can fetch students and compute stats
        const response = await api.get('/students');
        const students = response.data;
        
        let high = 0; let medium = 0; let low = 0;
        const deptMap = {};

        students.forEach(s => {
          if(s.risk_level === 'High Risk') high++;
          else if(s.risk_level === 'Medium Risk') medium++;
          else low++;

          // Since dept isn't always in student base, we just mock department data for demonstration
        });

        setData({
          riskDistribution: [
            { name: 'Low Risk', value: low || 25 },
            { name: 'Medium Risk', value: medium || 15 },
            { name: 'High Risk', value: high || 5 }
          ],
          attendanceTrend: [
            { name: 'Week 1', attendance: 95 },
            { name: 'Week 2', attendance: 92 },
            { name: 'Week 3', attendance: 88 },
            { name: 'Week 4', attendance: 85 },
            { name: 'Week 5', attendance: 82 }
          ],
          departmentRisk: [
            { name: 'Computer Science', high: 12, medium: 25, low: 50 },
            { name: 'Information Tech', high: 8, medium: 20, low: 45 },
            { name: 'Mechanical', high: 15, medium: 30, low: 40 }
          ]
        });
      } catch (err) {
        console.error('Error fetching analytics data', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      <p className="text-gray-600">Overview of student performance and risk distribution across the institution.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Risk Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Average Attendance Trend (Last 5 Weeks)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Risk */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Levels by Department</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentRisk}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10B981" />
                <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#F59E0B" />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
