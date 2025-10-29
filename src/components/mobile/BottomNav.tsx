import React, { useState } from "react";
import type { User } from "../../api/auth_api";
import { FilterIcon, FolderSymlinkIcon, MapPin, UserCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CreateAdvertisingButton from "../advertising/createAdvertisingButton";
import CategoryModal from "./CategoryModal";
import CityFilter from "./CityFilter";
import AdvancedFilters from "../AdvancedFilters";

type MobileBottomNavType = {
    user: User | null;
    token: string | null;
    onCategoryChange: (categoryId: number | null) => void;
    selectedCategoryId: number | null;
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

    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    totalItems: number;
};



const MobileBottomNav: React.FC<MobileBottomNavType> = ({ user, token, onCategoryChange, selectedCategoryId, filters, onFiltersChange, itemsPerPage, onItemsPerPageChange, totalItems }) => {

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
    const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState<boolean>(false);

    const AdvancedFiltersModal = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-[70%] h-[50%] rounded-2xl shadow-lg p-4 bg-white dark:bg-gray-500 relative flex items-center justify-center">

                    <button
                        className="absolute text-red-400 top-4 right-4"
                        onClick={() => {
                            setIsAdvancedFilterModalOpen(false)
                        }}
                    >
                        <XCircle size={32} />
                    </button>

                    <AdvancedFilters
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                        is_Expanded={isAdvancedFilterModalOpen}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        totalItems={totalItems}
                    />
                </div>
            </div>
        )
    }

    return (
        <>

            {isAdvancedFilterModalOpen && (
                AdvancedFiltersModal()
            )}

            {isCategoryModalOpen && (
                <CategoryModal
                    onCategoryChange={onCategoryChange}
                    selectedCategoryId={selectedCategoryId}
                    onClose={() => { setIsCategoryModalOpen(false) }}
                />
            )}

            <CityFilter
                isOpen={isCityModalOpen}
                onClose={() => setIsCityModalOpen(false)}
                filters={filters}
                onFiltersChange={onFiltersChange}
            />
            <div className="fixed bottom-0 flex items-center justify-around w-full h-20 bg-teal-700 md:hidden">
                <div className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200">
                    <button
                        className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200"
                        onClick={() => {
                            setIsCategoryModalOpen(true)
                        }}
                    >
                        <FolderSymlinkIcon />
                        <span className="text-white">دسته ها</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200">
                    <button
                        className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200"
                        onClick={() => {
                            setIsCityModalOpen(!isCityModalOpen)
                        }}
                    >
                        <MapPin />
                        <span className="text-white">شهر</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-24 h-full gap-2 p-2 text-sm text-teal-200">
                    <CreateAdvertisingButton token={token} />
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200">
                    <button
                        onClick={() => setIsAdvancedFilterModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200 md:hidden"
                    >
                        <FilterIcon />
                        <span className="text-white">فیلتر ها</span>
                    </button>
                </div>
                <div className="">
                    <Link
                        to={!user ? '/login' : '/dashboard'}
                        children={
                            <div className="flex flex-col items-center justify-center gap-2 text-xs text-teal-200">
                                <UserCircle2 />
                                <span className="text-white">پنل کاربری</span>
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    )
}

export default MobileBottomNav;