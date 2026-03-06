import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

const BatchUpload = () => {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setStatus({ type: '', message: '' });

        if (selectedFile) {
            parseCSV(selectedFile);
        } else {
            setParsedData(null);
        }
    };

    const parseCSV = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length < 2) throw new Error("File must contain a header row and at least one data row.");

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const expectedHeaders = ['name', 'email', 'attendance', 'marks', 'assignments', 'study_hours'];

                // Validate headers
                const missingHeaders = expectedHeaders.filter(eh => !headers.includes(eh));
                if (missingHeaders.length > 0) {
                    throw new Error(`Missing expected headers: ${missingHeaders.join(', ')}`);
                }

                const students = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    if (values.length !== headers.length) continue; // Skip malformed rows

                    const student = {};
                    headers.forEach((header, index) => {
                        if (expectedHeaders.includes(header)) {
                            student[header] = header === 'name' || header === 'email'
                                ? values[index]
                                : Number(values[index]) || 0;
                        }
                    });

                    // Basic validation
                    if (!student.name) throw new Error(`Row ${i + 1} is missing a name`);
                    students.push(student);
                }

                if (students.length === 0) throw new Error("No valid student data found in the file.");

                setParsedData(students);
                setStatus({ type: 'success', message: `Successfully parsed ${students.length} students.` });
            } catch (err) {
                console.error(err);
                setParsedData(null);
                setStatus({ type: 'error', message: err.message || "Failed to parse CSV file." });
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!parsedData || parsedData.length === 0) return;

        try {
            setUploading(true);
            setStatus({ type: '', message: '' });
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/students/batch', parsedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus({ type: 'success', message: response.data.message || 'Batch upload successful!' });
            setFile(null);
            setParsedData(null);
            document.getElementById('file-upload').value = '';
        } catch (err) {
            console.error('Batch upload failed:', err);
            setStatus({ type: 'error', message: err.response?.data?.detail || 'Batch upload failed.' });
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "name,email,attendance,marks,assignments,study_hours\n";
        const sample = "John Doe,john@example.com,85.5,78.0,8,4.5\nJane Smith,jane@example.com,92.0,88.5,10,6.0";
        const blob = new Blob([headers + sample], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'student_batch_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                Batch Upload Students
            </h1>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-8 border border-white/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                <div className="text-center mb-8">
                    <p className="text-gray-600 mb-4 text-left">
                        Upload a CSV file containing student performance data. The system will automatically process the records, calculate their risk levels, and add them to the system.
                    </p>
                    <button
                        onClick={downloadTemplate}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto hover:underline"
                    >
                        <FileText size={16} /> Download CSV Template
                    </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <input
                        type="file"
                        id="file-upload"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-indigo-500">
                            <Upload size={32} />
                        </div>
                        <span className="text-lg font-medium text-gray-800 mb-1">
                            {file ? file.name : 'Click to browse or drag file here'}
                        </span>
                        <span className="text-sm text-gray-500">Only .csv files are supported</span>
                    </label>
                </div>

                {status.message && (
                    <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {status.type === 'error' ? <XCircle className="mt-0.5 flex-shrink-0" /> : <CheckCircle className="mt-0.5 flex-shrink-0" />}
                        <div>
                            <p className="font-medium">{status.type === 'error' ? 'Upload Error' : 'Success'}</p>
                            <p className="text-sm mt-1 opacity-90">{status.message}</p>
                        </div>
                    </div>
                )}

                {parsedData && parsedData.length > 0 && !uploading && status.type !== 'error' && (
                    <div className="mt-8 border-t border-gray-100 pt-8 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Preview Data ({parsedData.length} records)</h3>
                            <button
                                onClick={handleUpload}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                Confirm Upload <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {parsedData.slice(0, 5).map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.attendance}%</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.marks}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {parsedData.length > 5 && (
                                <div className="text-center py-3 bg-gray-50 text-sm text-gray-500 italic border-t border-gray-200">
                                    + {parsedData.length - 5} more records
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchUpload;
