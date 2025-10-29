import { Camera, ImageOffIcon } from 'lucide-react';
import { useState } from 'react';

type AvatarUploaderProps = {
    avatar: string | null;
    name: string;
    preView?: boolean;
    onChange?: (file: File) => void;
    width?: string;
    height?: string;
    noImage?: 'char' | 'icon';
    iconSize?: number
};

const AvatarUploader = ({
    avatar,
    name,
    preView = true,
    onChange,
    width,
    height,
    noImage,
    iconSize
}: AvatarUploaderProps) => {

    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const DefaultImage = () => {
        return noImage === 'icon' ? <ImageOffIcon size={iconSize} /> : <span>{name.charAt(0).toUpperCase()}</span>;
    }

    return (

        <div className={`relative flex items-center justify-center ${width ?? 'w-24'} ${height ?? 'h-24'}`}>
            <div className="flex items-center justify-center w-full h-full overflow-hidden text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded-full">
                {previewURL && preView ? (
                    <img
                        src={previewURL}
                        alt="Preview Avatar"
                        className="object-cover w-full h-full"
                    />
                ) : avatar ? (
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    DefaultImage()
                )}
            </div>


            {/* آیکون دوربین */}
            <label className="absolute flex items-center justify-center w-12 h-12 bg-gray-800 border border-gray-600 rounded-full cursor-pointer right-4 bottom-4">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setPreviewURL(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                            if (onChange) onChange(file);
                        }
                    }}
                />
                <Camera size={20} />
                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7v14h18V7H3z" />
                </svg> */}
            </label>
        </div>
    );
};
export default AvatarUploader;


