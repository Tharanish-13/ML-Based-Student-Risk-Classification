import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        attendance: '',
        marks: '',
        assignments: '',
        study_hours: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchStudent = async () => {
                try {
                    const res = await api.get(`/students/${id}`);
                    setFormData({
                        name: res.data.name,
                        email: res.data.email,
                        attendance: res.data.attendance,
                        marks: res.data.marks,
                        assignments: res.data.assignments,
                        study_hours: res.data.study_hours
                    });
                } catch (err) {
                    console.error("Failed to load student");
                }
            };
            fetchStudent();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                attendance: parseFloat(formData.attendance),
                marks: parseFloat(formData.marks),
                assignments: parseInt(formData.assignments),
                study_hours: parseFloat(formData.study_hours)
            };

            if (isEdit) {
                await api.put(`/students/${id}`, payload);
            } else {
                await api.post('/students/', payload);
            }
            navigate('/students');
        } catch (err) {
            console.error("Failed to save student");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Attendance (%)</label>
                        <input
                            type="number"
                            name="attendance"
                            min="0" max="100"
                            value={formData.attendance}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Marks</label>
                        <input
                            type="number"
                            name="marks"
                            min="0" max="100"
                            value={formData.marks}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assignments (0-10)</label>
                        <input
                            type="number"
                            name="assignments"
                            min="0" max="10"
                            value={formData.assignments}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Study Hours (Daily)</label>
                        <input
                            type="number"
                            name="study_hours"
                            min="0" step="0.1"
                            value={formData.study_hours}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => navigate('/students')} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Save Student</button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
