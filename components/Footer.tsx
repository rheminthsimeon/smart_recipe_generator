import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-auto">
            <div className="container mx-auto px-6 py-4 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Smart Recipe Generator</p>
            </div>
        </footer>
    );
};

export default Footer;