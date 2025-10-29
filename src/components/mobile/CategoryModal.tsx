import React from "react";
import CategoryFilter from "../CategoryFilter";


const CategoryModal: React.FC<{
    onCategoryChange: (categoryId: number | null) => void;
    selectedCategoryId: number | null;
    onClose: () => void;
}> = ({onCategoryChange, selectedCategoryId, onClose}) => {

    // console.log(window.innerWidth < 726);
    
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-[90%] h-[30%] rounded-2xl shadow-lg p-4">
                    <CategoryFilter
                        onCategoryChange={onCategoryChange}
                        selectedCategoryId={selectedCategoryId}
                        onClose={onClose}
                    />
                </div>
            </div>
        </>
    )
}

export default CategoryModal;