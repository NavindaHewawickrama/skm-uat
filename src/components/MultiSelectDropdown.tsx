import React, { useState } from 'react';

interface LocationOption {
    locationCode: string;
    locationName: string;
}

interface Props {
    locationOptions: LocationOption[];
    selectedLocations: string[];
    setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>; // ✅ CORRECT
}


const MultiSelectDropdown: React.FC<Props> = ({
    locationOptions,
    selectedLocations,
    setSelectedLocations,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (code: string) => {
        setSelectedLocations((prev) =>
            prev.includes(code)
                ? prev.filter((item) => item !== code)
                : [...prev, code]
        );
    };

    const handleToggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Location:</label>
            <div className="relative">
                <div
                    className="w-full p-2 border border-gray-300 rounded cursor-pointer min-h-[42px]"
                    onClick={handleToggleDropdown}
                >
                    {selectedLocations.length > 0 ? (
                        selectedLocations.map((code) => {
                            const match = locationOptions.find((opt) => opt.locationCode === code);
                            return (
                                <span
                                    key={code}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-1"
                                >
                                    {match?.locationName || code}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-gray-500">Select</span>
                    )}
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
                        {locationOptions.map((option) => (
                            <label
                                key={option.locationCode}
                                className="flex items-center p-2 hover:bg-gray-100"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedLocations.includes(option.locationCode)}
                                    onChange={() => toggleOption(option.locationCode)}
                                    className="mr-2"
                                />
                                {option.locationName}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelectDropdown;
