
import React from 'react';
import { PROGRAMMING_LANGUAGES } from '../constants';
import Spinner from './Spinner';

interface CodeInputProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-1">
                    Language
                </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:w-auto p-2.5"
                >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={onSubmit}
                disabled={isLoading || !code.trim()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Spinner /> : 'Review Code'}
            </button>
        </div>
        
        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-4" role="alert">
            <p>{error}</p>
        </div>}

        <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-96 p-4 font-mono text-sm text-gray-200 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-y"
        />
    </div>
  );
};

export default CodeInput;
