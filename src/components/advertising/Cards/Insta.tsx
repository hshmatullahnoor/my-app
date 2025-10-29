import type React from "react"
import type { Advertising } from "../../../api/advertisings_api"
import { IMAGES_URL } from "../../../api/main"
import { Bookmark, BookmarkCheck, Eye, Flag, HeartIcon, Phone, X } from "lucide-react"
import { saveAdertisingView } from "../../../types/functions"
import { useEffect, useState } from "react"
import LikeAPI from "../../../api/advertisings/like"
import type { User } from "../../../api/auth_api"
import SaveAPI from "../../../api/advertisings/save"
import toast from "react-hot-toast"
import AdvertisingCallModal from "../advertisingCallModal"
import ReportAPI from "../../../api/advertisings/report"
import ImageSlider from "../ImageSlider"

type InstaCardProps = {
    advertisement: Advertising;
    user?: null | User;
    token?: null | string
}

const InstaCard: React.FC<InstaCardProps> = ({ advertisement, user, token }) => {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    useEffect(() => {
        const incrementView = async () => {
            await saveAdertisingView(advertisement.id);
        }

        incrementView();
    })

    const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

    const [reason, setReason] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);
    const [isOpenImageSlider, setIsOpenImageSlider] = useState<boolean>(false);

    const handleReport = async () => {
        setSending(true);
        if (reason.length < 5) {
            toast.error('طول دلیل گذارش خیلی کوتاه است');
            setSending(false);

            return
        }
        if (!token) {
            toast.error('برای گذارش باید ابتدا وارد بشید');
            setSending(false);

            return;
        }
        const res = await ReportAPI.report(token, advertisement.id, reason);

        if (res.success) {
            toast.success('گذارش ارسال شد و بزودی پیگیری خواهد شد')
        } else {
            toast.error('هنگام ارسال گذارش به مشکل برخوردیم!')
            console.log(res.error);
        }

        setSending(false);
        setReportModalOpen(false);
    }

    const reportModal = () => {
        if (!reportModalOpen) return null;
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={() => setReportModalOpen(false)}
            >
                <div
                    className="dark:bg-gray-800 rounded-lg p-4 shadow-xl max-w-2xl w-full mx-4 min-h-60 max-h-[90vh] overflow-y-auto border border-gray-700 bg-white"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="relative">
                        <button
                            className="absolute text-red-400 hover:text-red-600"
                            onClick={() => setReportModalOpen(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="flex flex-col mt-10 w-[80%] mx-auto p-4">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="reason" id="reason" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">دلیل گذارش را وارد کنید</label>
                            <input type="text" name="reason" id="reason"
                                className="w-full px-3 py-2 text-gray-500 placeholder-gray-400 bg-white border border-gray-700 rounded-md dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="لطف کنید دلیل این گذارش را توضیح دهید"
                                onBlur={(e) => {
                                    setReason(e.target.value)
                                }}
                            />
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-4 mt-8">
                        <button
                            className="px-4 py-1 text-white bg-gray-400 rounded-md dark:text-gray-300 dark:bg-gray-900 hover:bg-gray-500 dark:hover:bg-gray-950"
                            onClick={() => {
                                setReportModalOpen(false)
                            }}
                        >لغو</button>
                        <button
                            className="px-4 py-1 bg-teal-500 rounded-md text-teal-50 hover:bg-teal-600 dark:text-white dark:bg-teal-700 dark:hover:bg-teal-800"
                            onClick={handleReport}
                        >

                            {!sending ? 'ارسال' : "درحال ارسال"}

                        </button>
                    </div>

                </div>
            </div>
        )
    }

    const numericPrice = advertisement.price ? parseFloat(String(advertisement.price)) : 0;
    const numericDiscount = advertisement.discount ? parseFloat(String(advertisement.discount)) : 0;
    const discountPercent =
        numericPrice && numericDiscount
            ? ((numericDiscount / numericPrice) * 100).toFixed(1)
            : null;
    const finalPrice = numericPrice - numericDiscount;


    const AdvertisementImage = (props: { advertisement: Advertising }) => {

        if (props.advertisement.images.length > 0) {
            return (
                <img
                    src={`${IMAGES_URL}${props.advertisement.images[0].image_path}`}
                    alt={props.advertisement.title}
                    className="object-cover w-full shadow-2xl md:h-[525px] h-40 rounded-t-md md:rounded-md"
                    onClick={() => setIsOpenImageSlider(true)}
                />
            );
        }



        return (
            <div 
             
             className="flex items-center justify-center w-full bg-gray-300 shadow-2xl rounded-t-md md:h-[525px] h-40 md:rounded-md"
             onClick={() => setIsOpenImageSlider(true)}
             >
                
                <svg className="w-12 h-12 text-gray-400 transition-colors dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );



    };

    const [liked, setLiked] = useState<boolean>(advertisement.is_liked);
    const [likes, setLikes] = useState<number>(advertisement.likes_count);
    const [saved, setSaved] = useState<boolean>(advertisement.is_saved);
    const [isOpenCallModal, setIsOpenCallModal] = useState<boolean>(false);

    const fill = liked ? '#dc2626' : '#ffffff'

    return (
        <>

            <div className="flex items-center justify-end shadow min-h-[45vh] my-6 p-4 rounded-xl flex-col-reverse md:flex-row shadow-gray-400 bg-gray-100 dark:bg-gray-800">


                <AdvertisingCallModal
                    onClose={() => { setIsOpenCallModal(false) }}
                    open={isOpenCallModal}
                    user={advertisement.user}
                />

                {reportModalOpen && (
                    reportModal()
                )}

                {isOpenImageSlider && (
                    <ImageSlider
                        Advertising={advertisement}
                        onClose={() => setIsOpenImageSlider(false)}
                    />
                )}

                <div className="w-full bg-white md:h-[48vh] md:w-2/3 md:rounded-r-md rounded-b-md md:rounded-b-none md:rounded-br-md dark:bg-gray-950">




                    {/* owener details */}
                    <div className="flex items-center justify-start h-16 px-5 bg-gray-500 gap-x-4 md:rounded-tr-md">
                        <div className="">
                            {advertisement.user.avatar ? (
                                <img src={`${IMAGES_URL}${advertisement.user.avatar}`} alt={advertisement.user.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-300 rounded-full">
                                    {advertisement.user.name.substring(0, 1)}
                                </div>
                            )}
                        </div>
                        <div className="">
                            <span className="text-gray-300">{advertisement.user.name}</span>
                        </div>
                    </div>

                    <div className="px-4 pt-3 pb-2">



                        {/* title */}
                        <div className="border-b border-gray-300 dark:border-gray-700">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white">
                                {advertisement.title}
                            </h3>
                        </div>

                        {/* description */}
                        <div className="h-32 mt-2 overflow-y-auto">
                            <p className="h-32 text-sm text-gray-600 dark:text-gray-400">
                                {advertisement.description}
                            </p>
                        </div>

                        {/* features */}
                        <div className="h-6 mt-2">
                            {/* advertisement features */}
                            {advertisement.features && advertisement.features.length > 0 && (
                                <div className="flex items-center justify-start gap-2 mb-3">

                                    {advertisement.features.map((feature, index) => {
                                        return (
                                            <span key={index} className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-white rounded-2xl bg-fuchsia-900">
                                                {/* SVG icon from raw string */}
                                                {feature.icon && feature.icon != null && feature.icon != "" && (
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: feature.icon }}
                                                        className="text-teal-600 size-4 dark:text-white"
                                                    />)}
                                                {feature.value}
                                            </span>
                                        );
                                    })}

                                </div>
                            )}
                        </div>


                        {/* price & category */}
                        <div className="flex items-center justify-between h-12 my-3">
                            <div className="transition-colors text-nowrap">

                                {numericPrice ? (
                                    <div>
                                        <p className="text-teal-600 dark:text-teal-400">
                                            {formatPrice(finalPrice)} افغانی
                                        </p>
                                        {numericDiscount > 0 && (
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="text-red-500 line-through">
                                                    {formatPrice(numericPrice)} افغانی
                                                </span>
                                                <span className="text-teal-500 dark:text-teal-400">{discountPercent}% تخفیف</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">قیمت وارد نشده است.</span>
                                )}
                            </div>
                            {advertisement.category && (
                                <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                                        {advertisement.category.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* location & time */}
                        <div className="flex items-center justify-between h-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {advertisement.city?.name || 'نامشخص'} - {advertisement.province}
                            </span>
                            <span>{formatDate(advertisement.created_at)}</span>
                        </div>

                        {/* likes and views */}
                        <div className="flex items-center justify-start gap-6 mt-2 text-xs text-gray-500 ">
                            <span className="flex items-center justify-center gap-2">
                                <HeartIcon size={20} />
                                {likes}
                            </span>
                            <span className="flex items-center justify-center gap-2">
                                <Eye size={20} />
                                {advertisement.views}
                            </span>
                        </div>

                    </div>

                    <div className="flex flex-row-reverse items-center justify-start h-10 p-3 bg-teal-600 md:rounded-bl-none dark:bg-teal-700 rounded-b-md gap-x-4">
                        <div className="my-2">
                            <div className="text-white">
                                <button
                                    disabled={!user ? true : false}
                                    className={`${!user ? 'cursor-not-allowed' : ''} ${liked ? 'text-red-600' : 'text-white'}`}
                                    onClick={async () => {

                                        if (user && user.id) {
                                            const res = await LikeAPI.auto(user.id, advertisement.id);

                                            if (res.success) {
                                                if (liked) {
                                                    setLikes(likes - 1);
                                                } else {
                                                    setLikes(likes + 1)
                                                }
                                                setLiked(!liked);
                                            }
                                        } else {
                                            toast.error('برای لایک ابتدا وارد شوید!');

                                        }


                                    }}
                                >

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24"
                                        viewBox="0 0 24 24"
                                        fill={fill}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true">
                                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-white">
                                <button
                                    onClick={async () => {

                                        if (user && user.id) {
                                            const res = await SaveAPI.auto(user.id, advertisement.id);

                                            if (res.success) {
                                                setSaved(!saved);
                                            }
                                        } else {
                                            toast.error('برای ذخیره کردن ابتدا وارد شوید!');

                                        }


                                    }}

                                >
                                    {saved ? (
                                        <BookmarkCheck />

                                    ) : (
                                        <Bookmark />
                                    )}
                                </button>

                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-white">
                                <button
                                    onClick={() => { setIsOpenCallModal(true) }}
                                >
                                    <Phone />
                                </button>
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-white">
                                <button
                                    disabled={user ? false : true}
                                    onClick={() => {
                                        setReportModalOpen(true)
                                    }}
                                >
                                    <Flag />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* image */}
                <div className="w-full md:w-1/3 max-h-[35%] rounded-t-md">

                    <AdvertisementImage advertisement={advertisement} />

                </div>

            </div>

        </>
    )
}

export default InstaCard;