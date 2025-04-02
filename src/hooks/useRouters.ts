// hooks/useRouters.ts
import { useNavigate, useSearchParams } from "react-router-dom";

const useRouters = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // * 1: URLSearchParams ni objectga o'tkazish (to'g'ri type bilan)
    const query: Record<string, string> = Object.fromEntries(searchParams.entries());

    // * 2: Query parametrlarni tozalash
    const clearQueries = () => {
        setSearchParams({});
    };

    // * 3: Query parametrlarni o'rnatish/yangilash
    const setQueries = (obj: Record<string, string | undefined>) => { // undefined ham bo'lishi mumkin
        const newParams = new URLSearchParams(searchParams); // Mavjud parametrlardan nusxa olish
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) { // Object.hasOwn(obj, key) ishlatish mumkin ES2022+
                const value = obj[key];
                if (value !== undefined) { // undefined qiymatlarni o'tkazib yuborish
                    newParams.set(key, value);
                } else {
                    newParams.delete(key); // undefined bo'lsa, o'chirish
                }
            }
        }
        setSearchParams(newParams);
    };

    // * 4: Bitta yoki bir nechta query parametrlarini o'chirish
    const removeQuery = (...props: string[]) => {
        const newParams = new URLSearchParams(searchParams);
        props.forEach(item => {
            newParams.delete(item);
        });

        setSearchParams(newParams);
    };

    // * 5: Boshqa sahifaga o'tish (navigate)
    const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => { // Qo'shimcha optionlar (replace, state)
        navigate(path, options);
    };

    return {
        query,          // * 1
        clearQueries,   // * 2
        setQueries,     // * 3
        removeQuery,    // * 4
        navigateTo,     // * 5
        searchParams,   // URLSearchParams objectini ham qaytarish (ba'zida to'g'ridan-to'g'ri ishlash uchun kerak bo'lishi mumkin)
    };
};

export default useRouters;