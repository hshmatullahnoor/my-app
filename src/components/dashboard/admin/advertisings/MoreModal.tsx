import { CheckCircle, MoreVertical, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import type { Advertising } from "../../../../api/advertisings_api";
import toast from "react-hot-toast";
import AdvertisingsAPI from "../../../../api/advertisings_api";

type MoreModalProps = {
    advertising: Advertising;
    token: string;
    onEdit: (ad: Advertising) => void;
}

const MoreModal: React.FC<MoreModalProps> = ({ advertising, token, onEdit }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    type currentEdits = {
        type?: string | null;
        type_reason?: string | null;
        status?: string | null;
        status_reason?: string | null;
    }


    const [errors, setErrors] = useState<{ key: string, error: string } | null>(null)
    const [currentEdits, setCurrentEdits] = useState<currentEdits | null>(null)
    const [typeModel, setTypeModal] = useState<boolean>(false);
    const [statusModel, setstatusModal] = useState<boolean>(false);

    const formatedType = (type?: string | null) => type === 'accepted' ? 'تایید شده' : type === 'rejected' ? 'رد شده' : type === 'pending' ? 'در انتظار' : '';
    const formatedstatus = (status?: string | null) => status === 'active' ? 'فعال' : status === 'inactive' ? 'غیر فعال' : status === 'sold' ? 'فروخته' : '';

    const updateType = async () => {

        //currentEdits);


        if (currentEdits === null) {
            toast.error("لطفا تایپ و دلیل را ولرد کنید !");
            setIsOpen(false);
            setTypeModal(false)
        }

        if (!currentEdits?.type || !currentEdits?.type_reason) {
            setErrors({ key: 'type_reason', error: 'تایپ یا دلیل نا معتبر!' })
            //'err');

        } else {

            const res = await AdvertisingsAPI.updateType(token, advertising.id, currentEdits?.type, currentEdits?.type_reason);

            if (!res.success) {
                toast.error('خطا هنگام ویرایش آگهی');
                //res.message)
            }

            toast.success('ویرایش آگهی با موفقیت انجام شد.');

            setIsOpen(false);
            setTypeModal(false);
            onEdit(advertising);

        }
    }

    const typeModalElement = () => {
        setIsOpen(false)
        return (
            <>
                <div className="fixed inset-0 z-20" onClick={() => { setTypeModal(false) }} />
                <div className="absolute left-7 -top-16 z-[300] w-56 mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl dark:border-gray-700 dark:bg-gray-900 max-h-[400%]p-4">

                    <div className="p-4">
                        <p className="block my-3 text-right text-gray-500">
                            {advertising.title}
                        </p>

                        <span className="mt-3 text-right text-gray-500">
                            تغییر حالت به {formatedType(currentEdits?.type)}
                        </span>

                        <div className="mt-2">

                            <input type="text" name="reason" id="reason"
                                className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                placeholder="دلیل عمل خود را وارد کنید"
                                onBlur={(e) => {
                                    setCurrentEdits({ type_reason: e.target.value, type: currentEdits?.type });
                                    // updateType(currentEdits);
                                }}
                            />
                            {errors && errors.key === 'type_reason' && (
                                <span className="text-sm text-red-500">{errors.error}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 my-3">

                            <button className="flex items-center justify-center gap-1 p-2 text-red-800 bg-red-300 rounded-lg hover:bg-red-400"
                                onClick={() => {
                                    setTypeModal(false);
                                    setCurrentEdits({ type: undefined, type_reason: undefined });
                                }}
                            >
                                لغو
                                <XCircleIcon size={20} />
                            </button>

                            <button className="flex items-center justify-center gap-1 p-2 text-teal-800 bg-teal-300 rounded-lg hover:bg-teal-400"
                                onClick={() => {

                                    updateType();
                                }}
                            >
                                ذخیره
                                <CheckCircle size={20} />
                            </button>



                        </div>
                    </div>

                </div>
            </>
        )
    }

    const updatestatus = async () => {

        if (!currentEdits) {
            toast.error('وضعیت و دلیل نامعتبر');
            setstatusModal(false);
        }

        const status = currentEdits?.status;
        const reason = currentEdits?.status_reason;

        if (!status || !reason) {
            setErrors({ key: 'status_reason', error: 'وضعیت یا دلیل نامعتبر' })
        } else {
            //status + ' ' + reason);

            const res = await AdvertisingsAPI.updateStatus(token, advertising.id, status, reason);

            if (!res.success) {
                toast.error('خطا در بروزرسانی آگهی');
                //res.message);
                setstatusModal(false);
            }

            toast.success('وضعیت با موفقیت بروزرسانی شد');
            onEdit(res.data ?? advertising)
        }

    }

    const statusModalElement = () => {
        setIsOpen(false)
        return (
            <>
                <div className="fixed inset-0 z-20" onClick={() => { setstatusModal(false) }} />
                <div className="absolute left-7 -top-16 z-[300] w-56 mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl dark:border-gray-700 dark:bg-gray-900 max-h-[400%]p-4">

                    <div className="p-4">
                        <p className="block my-3 text-right text-gray-500">
                            {advertising.title}
                        </p>

                        <span className="mt-3 text-right text-gray-500">
                            تغییر وضعیت به {formatedstatus(currentEdits?.status)}
                        </span>

                        <div className="mt-2">

                            <input type="text" name="reason" id="reason"
                                className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                placeholder="دلیل عمل خود را وارد کنید"
                                onBlur={(e) => {
                                    setCurrentEdits({ status_reason: e.target.value, status: currentEdits?.status });
                                    // updateType(currentEdits);
                                }}
                            />
                            {errors && errors.key === 'status_reason' && (
                                <span className="text-sm text-red-500">{errors.error}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 my-3">

                            <button className="flex items-center justify-center gap-1 p-2 text-red-800 bg-red-300 rounded-lg hover:bg-red-400"
                                onClick={() => {
                                    setstatusModal(false);
                                    setCurrentEdits({ status: undefined, status_reason: undefined });
                                }}
                            >
                                لغو
                                <XCircleIcon size={20} />
                            </button>

                            <button className="flex items-center justify-center gap-1 p-2 text-teal-800 bg-teal-300 rounded-lg hover:bg-teal-400"
                                onClick={() => {

                                    updatestatus();
                                }}
                            >
                                ذخیره
                                <CheckCircle size={20} />
                            </button>



                        </div>
                    </div>

                </div>
            </>
        )
    }

    return (
        <div className="relative">

            {typeModel && (
                typeModalElement()
            )}

            {statusModel && (
                statusModalElement()
            )}

            <button
                type="button"
                onClick={() => { setIsOpen(!isOpen) }}
                className="p-2 text-gray-500 transition-colors bg-gray-300 rounded-full hover:text-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="حذف"
            // disabled={!onDelete}
            >
                <MoreVertical />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(!isOpen) }} />
                    <div className="absolute left-7 -top-16 z-[300] w-56 mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl dark:border-gray-700 dark:bg-gray-900 max-h-[400%]p-4">
                        <p className="mt-2 text-gray-500">{advertising.title.substring(0, 35)}</p>

                        <div className="m-2">

                            <span className="my-2 text-gray-500">
                                تغییر حالت فعلی
                            </span>

                            <select
                                name="type"
                                id="type"
                                className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                defaultValue="حالت فعلی را انتخاب کنید"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value !== 'none') {

                                        setCurrentEdits({ type: value });
                                        setTypeModal(true)
                                    }
                                }}
                            >
                                <option value="none" defaultValue={"p"}>تغییر حالت</option>
                                <option value={'accepted'}>
                                    تایید کردن
                                </option>

                                <option value="pending">
                                    در انتظار تایید
                                </option>
                                <option value="rejected">
                                    رد کردن
                                </option>

                            </select>

                        </div>
                        <div className="m-2">

                            <span className="my-2 text-gray-500">
                                تغییر وضعیت فعلی
                            </span>

                            <select
                                name="status"
                                id="status"
                                className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                defaultValue="حالت فعلی را انتخاب کنید"
                                onChange={(e) => {
                                    setCurrentEdits({ status: e.target.value });
                                    setstatusModal(true)
                                }}
                            >
                                <option value="none" defaultValue={"p"}>تغییر وضعیت</option>
                                <option value={'active'}>
                                    فعال
                                </option>

                                <option value="inactive">
                                    غیر غعال
                                </option>
                                <option value="sold">
                                    فروخته
                                </option>

                            </select>
                        </div>


                    </div>
                </>
            )}
        </div>

    )
}

export default MoreModal;