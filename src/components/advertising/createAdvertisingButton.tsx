import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CreateAdvertisingForm from './createAdvertisingForm';
import saveAdvertising, { type SaveAdvertisingFeaturePayload, type SaveAdvertisingImagePayload, type SaveAdvertisingPayload } from '../../api/save_advertisings_api';
import { PlusCircle, PlusCircleIcon } from 'lucide-react';




const CreateAdvertisingButton: React.FC<{ token: string | null }> = ({ token }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (data: FormData) => {

        if (!token) {
            toast.error('You must be logged in to create an advertising.');
            return;
        }

        const features: SaveAdvertisingFeaturePayload[] = [];

        if (data.get('features')) {
            try {
                const featuresRaw = JSON.parse(data.get('features') as string);
                if (Array.isArray(featuresRaw)) {
                    featuresRaw.flat().forEach((feature: { feature_id: number; value: string }) => {
                        if (feature.feature_id && feature.value) {
                            features.push({
                                feature_id: Number(feature.feature_id),
                                value: String(feature.value),
                            });
                        }
                    });

                }
            } catch (e) {
                console.warn('Invalid features JSON', e);
            }
        }

        const images: SaveAdvertisingImagePayload[] = [];

        // push all images files to images array
        data.getAll('images').forEach((file) => {
            if (file instanceof File && file.size > 0) {
                images.push({ file });
            }
        });

        const payload: SaveAdvertisingPayload = {} as SaveAdvertisingPayload;
        payload.title = data.get('title') as string;
        payload.description = data.get('description') as string;
        payload.category_id = Number(data.get('sub_category_id'));
        payload.price = Number(data.get('price'));
        payload.city_id = Number(data.get('city_id'));
        payload.province = data.get('province') as string;

        if (images.length > 0) {
            payload.images = images;
        }

        payload.features = features;

        //'Submitting payload:', JSON.stringify(payload, null, 2));

        const response = await saveAdvertising(token, payload);

        if (response && response.success) {
            toast.success('آگهی با موفقیت ایجاد شد.');
            resetForm();
        } else {
            if (response && response.errors) {
                Object.values(response.errors).forEach((err) => {
                    if (Array.isArray(err)) {
                        err.forEach((e) => {
                            toast.error(e);
                        });
                    }
                });
                return;
            }
            toast.error(response.message || 'خطایی رخ داده است. لطفا دوباره تلاش کنید.');
        }
    }

    const resetForm = () => {

        setIsOpen(false);
        FormData.prototype.delete = function (name: string) {
            const entries = Array.from(this.entries()).filter(entry => entry[0] !== name);
            Object.defineProperty(this, '_entries', {
                value: entries,
                writable: true,
                configurable: true,
            });
            return this;
        }

        window.location.reload();
    }

    const baseFilterButtonClasses =
        'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60';


    return (
        <div className="">

            <CreateAdvertisingForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={(data) => {
                    handleSubmit(data);
                }}
                token={token}
            />

            <div className="md:hidden">
                <button
                    className="flex flex-col items-center justify-center w-24 h-full gap-2 p-2 text-sm text-teal-200"
                    onClick={() => setIsOpen(true)}
                >
                    <PlusCircleIcon size={36} />
                    <span className="text-white">آگهی جدید</span>
                </button>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className={`${baseFilterButtonClasses} hidden md:flex group text-teal-700 font-bold border border-teal-500 bg-teal-100`}
            >
                آگهی جدید
                <PlusCircle className='hidden group-hover:size-7 md:block' />
            </button>
        </div>
    );
}

export default CreateAdvertisingButton;