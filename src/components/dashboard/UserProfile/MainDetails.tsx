import type React from "react";
import AvatarUploader from "../../../components/dashboard/shared/data-table/profileUploader";
import { EditIcon, MailIcon, MapPin, Phone, PhoneOff, TagIcon, TimerIcon } from "lucide-react";
import { BsTelegram } from "react-icons/bs";
import CitySelector from "../../../components/CitySelector";
import Checkbox from "../../../components/dashboard/shared/data-table/checkbox";
import { useState } from "react";
import InputModal from "./Input";
import type { User } from "../../../api/auth_api";
import { IMAGES_URL } from "../../../api/main";

type MainDetailProps = {
    user: User;
    onChange: (record: string, value?: string, file?: File) => void;
}


const MainDetail: React.FC<MainDetailProps> = ({ user, onChange }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [propsData, setPropsData] = useState<{
        name?: string;
        title?: string
        onClose?: () => void;
        record?: string;
        value: string;
    }>({
        name: '',
        record: '',
        onClose: () => setOpen(false),
        title: '',
        value: ''
    })
    const inputProps: {
        name?: string;
        title?: string
        onClose?: () => void;
        onChange: (value?: string, record?: string) => void;
        record?: string;
        value: string;
    } = {
        value: propsData.value,
        onChange: (value, record) => {
            onChange(record ?? '', value ?? '')
            setOpen(false)
        },
        title: propsData.title,
        record: propsData.record,
        name: propsData.name,
        onClose: propsData.onClose,
    }



    return (
        <div className="mt-5 w-[95%] mx-auto p-4 shadow-md text-white dark:text-gray-700 flex items-center justify-center flex-col lg:flex-row lg:justify-around dark:shadow dark:shadow-white rounded-lg">

            {open && (
                <InputModal props={inputProps} />
            )}

            {/* image */}
            <div className="flex flex-col items-center justify-center w-[35%]">

                <AvatarUploader
                    avatar={`${IMAGES_URL}${user.avatar}`}
                    name={user.name}
                    width='w-52'
                    height='h-52'
                    noImage="icon"
                    iconSize={60}
                    onChange={(file) => {
                        
                        onChange('avatar', undefined, file);
                        
                    }}
                />
            </div>

            {/* email and name and ... */}
            <div className="mt-4 text-center text-gray-700 border-t-2 border-gray-500 lg:pr-6 lg:border-gray-600 lg:border-r-2 md:text-right md:mr-6 lg:border-t-0">
                {/* name */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">

                        <TagIcon />

                        <p
                            className="text-black dark:text-white"
                        >
                            {user.name}

                        </p>
                    </div>
                    <button
                        className="text-teal-600 dark:text-teal-400"
                        onClick={() => {
                            setOpen(true)
                            setPropsData({
                                record:'name',
                                name:user.name ?? '',
                                title: 'نام',
                                onClose: () => setOpen(false),
                                value: user.name
                            })
                        }}
                    >
                        <EditIcon />
                    </button>
                </div>

                {/* email */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-1">

                        <MailIcon />

                        <p
                            className="text-xs text-black dark:text-white"
                        >
                            {user.email}

                        </p>
                    </div>
                    <button
                        className="text-teal-600 dark:text-teal-400"
                        onClick={() => {
                            setOpen(true)
                            setPropsData({
                                record:'email',
                                name:user.email ?? '',
                                title: 'نام',
                                onClose: () => setOpen(false),
                                value: user.email
                            })
                        }}
                    >
                        <EditIcon />
                    </button>
                </div>

                {/* phone */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">
                        <Phone />
                        <p
                            className="text-black dark:text-white"
                            
                        >
                            {user.phone ?? 'وارد نشده'}

                        </p>
                    </div>
                    <button
                        className="text-teal-600 dark:text-teal-400"

                        onClick={() => {
                            setOpen(true)
                            setPropsData({
                                record:'phone',
                                name:user.phone ?? '',
                                title: 'نام',
                                onClose: () => setOpen(false),
                                value: user.phone ?? ''
                            })
                        }}
                    >
                        <EditIcon />
                    </button>
                </div>

                {/* telegram */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">
                        <BsTelegram size={26} />
                        <p
                            className="text-black dark:text-white"
                            
                        >
                            {user.telegram ?? 'وارد نشده'}

                        </p>
                    </div>
                    <button
                        className="text-teal-600 dark:text-teal-400"
                        onClick={() => {
                            setOpen(true)
                            setPropsData({
                                record:'telegram',
                                name:user.telegram ?? '',
                                title: 'نام',
                                onClose: () => setOpen(false),
                                value: user.telegram ?? ''
                            })
                        }}
                    >
                        <EditIcon />
                    </button>
                </div>

            </div>

            <div className="mt-4 text-center text-gray-700 border-t-2 border-gray-500 lg:pr-6 lg:border-gray-600 lg:border-r-2 md:text-right md:mr-6 lg:border-t-0">

                <span className="m-4 text-gray-400">اطلاعات پایه</span>
                {/* city */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start w-full gap-2">

                        <MapPin />

                        <CitySelector
                            onChange={(value) => {
                                
                                onChange('city_id', String(value))
                            }}
                            value={user.city_id ?? ''}
                            key={user.name}
                            showLable={false}
                        />
                    </div>
                </div>

                {/* show phone */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">

                        <PhoneOff />

                        <Checkbox
                            checked={user.show_phone ?? false}
                            id={user.name}
                            label="نمایش شماره تلفن"
                            onChange={(checked) => {
                                onChange('show_phone', checked ? 'yes' : 'no')
                            }}

                        />
                    </div>
                </div>

                {/* show Telegram */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">
                        <BsTelegram size={26} />

                        <Checkbox
                            checked={user.show_telegram ?? false}
                            id={'show_telegram'}
                            label="نمایش ایدی تلگرام "
                            onChange={(checked) => {
                                onChange('show_telegram', checked ? 'yes' : 'no')

                            }}
                        />

                    </div>
                </div>

                {/* telegram */}
                <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center justify-start gap-2">
                        <TimerIcon />
                        <p
                            className="text-black dark:text-white"
                        >
                            زمان ثبت نام: {formatDate(user.created_at)}

                        </p>
                    </div>
                </div>

            </div>



        </div>
    )
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-AF', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

export default MainDetail;