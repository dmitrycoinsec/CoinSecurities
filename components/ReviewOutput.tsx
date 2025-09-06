
import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';

declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
    }
}

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
}

const Placeholder: React.FC = () => (
    <div className="text-center text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-dashed border-gray-600 rounded-full"></div>
        <h3 className="text-xl font-semibold text-gray-400">Waiting for code...</h3>
        <p className="mt-1">Your code review will appear here once you submit.</p>
    </div>
);

const ReviewOutput: React.FC<ReviewOutputProps> = ({ review, isLoading }) => {
    const [html, setHtml] = useState('');

    useEffect(() => {
        if (review && window.marked) {
            setHtml(window.marked.parse(review));
        } else {
            setHtml('');
        }
    }, [review]);

    if (!review && !isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 min-h-[20rem] flex items-center justify-center">
                    <Placeholder />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Review Feedback</h2>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 min-h-[20rem]">
                {isLoading && !review ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Spinner />
                        <p className="mt-4">Analyzing your code, please wait...</p>
                    </div>
                ) : (
                    <article 
                      className="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-md"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                )}
            </div>
        </div>
    );
};

export default ReviewOutput;
