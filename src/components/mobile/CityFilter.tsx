import { XCircle } from "lucide-react";
import React from "react";
import CitySelector from "../CitySelector";



const CityFilter: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onFiltersChange: (filters: {
        cityId: number | null;
        fromPrice: number | null;
        toPrice: number | null;
        onlyWithImage: boolean;
    }) => void;
    filters: {
        cityId: number | null;
        fromPrice: number | null;
        toPrice: number | null;
        onlyWithImage: boolean;
    };
}> = ({isOpen = false, onClose, filters, onFiltersChange}) => {

    
    if(!isOpen) return null;
    
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-[70%] h-[10%] rounded-2xl shadow-lg p-4 bg-white dark:bg-gray-500 relative flex items-center justify-center">
                    <button
                        className="absolute text-red-400 top-4 right-4"
                        onClick={() => {
                            onClose()
                        }}
                    >
                        <XCircle size={32} />
                    </button>

                        <div className="">
                            <CitySelector 
                                onChange={(id) => {

                                    onFiltersChange({
                                        ...filters,
                                        cityId: typeof id === 'number' ? id : null
                                    })
                                }}
                                value={filters.cityId ?? ''}
                            />
                        </div>
                    
                </div>
            </div>
        </>
    )
}

export default CityFilter;