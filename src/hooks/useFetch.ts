// hooks/useFetch.ts
import {useQuery, UseQueryOptions, UseQueryResult} from 'react-query'; // To'g'ri importlar
import {BASE_URL} from '../utils/constants.ts';
import api from '../utils/request_auth.ts'; // 'app' o'rniga 'api' (konventsiyaga mos)
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {useAuth} from "../context/AuthContext.tsx"; // Axios type'lari

interface IUseFetch<TData = any, TError = any> { // Generic typelar
    key: string | string[];
    endpoint: string;
    options?: UseQueryOptions<TData, TError>; // To'g'ri UseQueryOptions type'i
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch'; // Faqat ruxsat etilgan methodlar
    searchParams?: Record<string, string | number | boolean | undefined>; // To'g'ri searchParams type
    generateData?: (data: AxiosResponse<TData>) => TData; // To'g'ri generateData type
    // enabled?: boolean; // options ichida bor, lekin alohida ham qo'shish mumkin (ixtiyoriy)
    // keepPreviousData?: boolean; // options ichida bor (ixtiyoriy)
    requestConfig?: AxiosRequestConfig; // Qo'shimcha Axios config (masalan, headers)

}

const generateUrl = (endpoint: string, searchParams?: Record<string, string | number | boolean | undefined>): string => {
    let url = `${BASE_URL}${endpoint}`;

    if (!searchParams || Object.keys(searchParams).length === 0) {
        return url;
    }

    const params = new URLSearchParams();
    for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) { // Object.hasOwn(searchParams, key) bilan almashtirish mumkin (ES2022+)
            const value = searchParams[key];
            if (value !== undefined && value !== null) { // undefined va null qiymatlarni qo'shmaslik
                params.append(key, String(value));  // string ga o'tkazish
            }
        }
    }

    if (Array.from(params).length > 0) { // URLSearchParams bo'sh emasligini tekshirish
        url += `?${params.toString()}`;
    }
    return url;
};

const useFetch = <TData = any, TError = any>(
    {
        key,
        endpoint,
        options,
        method = 'get',
        searchParams,
        generateData = (response: AxiosResponse<TData>) => response.data, // response.data ni qaytarish
        requestConfig = {}  // default qiymat
    }: IUseFetch<TData, TError>
): UseQueryResult<TData, TError> => { // UseQueryResult ni qaytarish
    const {token} = useAuth();

    const transformedParams = generateUrl(endpoint, searchParams);

    const fetchData = async () => {
        try {
            const response = await api[method]<TData>(transformedParams, requestConfig, {headers: {Authorization: `Bearer ${token}`}}); // method va generic type
            return generateData(response); // response ni generateData ga berish
        } catch (error) {
            // Xatolikni qayta otish (re-throw), react-query uni ushlab oladi
            throw error;  // Agar error ni o'zgartirmoqchi bo'lsangiz, shu yerda qiling. Masalan:  throw new CustomError(error);

        }
    };


    return useQuery<TData, TError>(key, fetchData, options);
};

export default useFetch;