import React, { useState } from 'react';
import axios from '../../utils/axios';

const GeminiPage = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleGenerate = async () => {
        try {
            const res = await axios.post('/api/gemini/generate', { prompt });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error generating content:", error);
        }
    };

    return (
        <div className="gemini-container p-6">
            <h2 className="text-2xl font-bold mb-4">Gemini AI Content Generator</h2>
            <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
            />
            <button
                onClick={handleGenerate}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Generate Content
            </button>
            {response && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <h3 className="font-bold">Generated Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default GeminiPage; 