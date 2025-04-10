import React, { useState } from 'react';

const MultiSelectDropdown = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const options = [
        { value: 'Warehouse 1', label: 'Warehouse 1' },
        { value: 'Warehouse 2', label: 'Warehouse 2' },
        { value: 'Head Office', label: 'Head Office' },
    ];

    const toggleOption = (value: any) => {
        setSelectedOptions((prev) =>
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        );
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Location:</label>
            <div className="relative">
                <div
                    className={`w-full p-2 border ${selectedOptions.length === 0 ? 'border-gray-300' : 'border-gray-300'} rounded cursor-pointer`}
                    onClick={handleToggleDropdown}
                >
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((label,index) => (
                            <span
                                key={label}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-1"
                            >
                                {label}
                            </span>
                        ))
                    ) : (
                        'Select'
                    )}
                </div>
                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center p-2 hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option.value)}
                                    onChange={() => toggleOption(option.value)}
                                    className="mr-2"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelectDropdown;