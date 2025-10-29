import type { SaveAdvertisingFeaturePayload } from "../../../api/save_advertisings_api";

export function handleNextButtonClick(
    currentStep: number,
    progressStepsLength: number,
    formData: FormData,
    setErrors: (errors: Array<{ key: string; value: string }>) => void,
    setCurrentStep: (step: number) => void,
    selectedCategoryFeatures: SaveAdvertisingFeaturePayload[][],
    onsubmitted: (data: FormData) => void
) {
    // اگر مرحله آخره، داده‌ها آماده ارسال هستند
    if (currentStep >= progressStepsLength) {
        //"✅ Final FormData submitted:");
        //JSON.stringify(Object.fromEntries(formData.entries()), null, 2));

        onsubmitted(formData);
       
        return;
    }

    

    const step = Math.floor(currentStep); // بخش صحیح مرحله
    switch (step) {
        case 1: {
            const category_id = formData.get("category_id");
            const sub_category_id = formData.get("sub_category_id");

            if (!category_id) {
                setErrors([{ key: "category_id", value: "لطفا دسته‌بندی را انتخاب کنید." }]);
                return;
            }

            if (!sub_category_id) {
                // اگر دسته انتخاب شده ولی زیر دسته نه، فقط یه مقدار fractional جلو بره
                setErrors([{ key: "sub_category_id", value: "لطفا زیر دسته‌بندی را انتخاب کنید." }]);
                return;
            }

            setErrors([]);
            // از fractional برای انیمیشن نرم‌تر استفاده می‌کنیم
            const nextStep = currentStep < 1.9 ? 2 : step + 1;
            setCurrentStep(nextStep);
            break;
        }

        case 2: {
            formData.set("features", JSON.stringify(selectedCategoryFeatures));
            setErrors([]);
            setCurrentStep(step + 1);
            break;
        }

        case 3: {
            const title = formData.get("title") as string;
            const description = formData.get("description") as string;
            const errors = [];

            if (!title || title.trim() === "")
                errors.push({ key: "title", value: "لطفا عنوان آگهی را وارد کنید." });

            if (!description || description.trim() === "")
                errors.push({ key: "description", value: "لطفا توضیحات آگهی را وارد کنید." });

            if (errors.length) {
                setErrors(errors);
                return;
            }

            setErrors([]);
            setCurrentStep(step + 1);
            break;
        }

        case 4: {
            const city_id = formData.get("city_id");
            const province = formData.get("province") as string;
            const errors = [];

            if (!city_id) errors.push({ key: "city_id", value: "لطفا شهر را انتخاب کنید." });
            if (!province || province.trim() === "")
                errors.push({ key: "province", value: "لطفا ولسوالی را وارد کنید." });

            if (errors.length) {
                setErrors(errors);
                return;
            }

            setErrors([]);
            setCurrentStep(step + 1);
            break;
        }

        case 5: {
            const price = formData.get("price") as string;
            const discount = formData.get("discount") as string;
            const errors = [];

            if (!price || price.trim() === "")
                errors.push({ key: "price", value: "لطفا قیمت آگهی را وارد کنید." });

            if (discount && isNaN(Number(discount)))
                errors.push({ key: "discount", value: "مقدار تخفیف باید یک عدد باشد." });

            if (errors.length) {
                setErrors(errors);
                return;
            }

            setErrors([]);
            setCurrentStep(step + 1);
            break;
        }

        case 6: {
            const images = formData.getAll("images");
            if (images.length === 0) {
                setErrors([{ key: "images", value: "لطفا حداقل یک تصویر آپلود کنید." }]);
                return;
            }

            setErrors([]);
            setCurrentStep(step + 1);
            break;
        }

        default:
            setCurrentStep(step + 1);
            break;
    }
}
