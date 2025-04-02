// hooks/useDebounce.ts
import {useCallback, useRef} from "react";

//  Timeout type (browser va Node.js uchun)
type Timer = ReturnType<typeof setTimeout>;

// Generic type: Callback funksiyasi har qanday argumentlarni qabul qilishi va har qanday qiymat qaytarishi mumkin
const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) => {
    const timerRef = useRef<Timer | null>(null); // To'g'ri type: Timer | null

    return useCallback(
        (...args: Parameters<T>) => { // Parameters<T> - T funksiyasining argumentlari type'lari
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
};

export default useDebounce;