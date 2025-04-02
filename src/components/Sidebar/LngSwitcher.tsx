import {useTranslation} from "react-i18next";
import {Select} from "antd";

export default function LngSwitcher() {
    const {i18n} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex justify-center items-center">
            <Select
                value={i18n.language}
                onChange={changeLanguage}
                optionLabelProp="label"
                className="lng_select rounded-md "
            >
                <Select.Option value="uz" label={
                    <span className={"flex items-center gap-[5px]"}>
                        <svg width="20" height="20" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_503_3720)">
                        <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5"
                              strokeWidth="0.5"/>
                        <mask id="mask0_503_3720" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0"
                              width="28" height="20">
                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white"
                                  strokeWidth="0.5"/>
                        </mask>
                        <g mask="url(#mask0_503_3720)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.66667H28V0H0V6.66667Z" fill="#04AAC8"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 20H28V13.3333H0V20Z" fill="#23C840"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M4.66669 5.33333C5.07797 5.33333 5.46025 5.20919 5.77811 4.99633C5.74128 4.99876 5.70413 4.99999 5.66669 4.99999C4.74621 4.99999 4.00002 4.2538 4.00002 3.33333C4.00002 2.41285 4.74621 1.66666 5.66669 1.66666C5.70413 1.66666 5.74128 1.6679 5.77811 1.67033C5.46025 1.45747 5.07797 1.33333 4.66669 1.33333C3.56212 1.33333 2.66669 2.22876 2.66669 3.33333C2.66669 4.4379 3.56212 5.33333 4.66669 5.33333ZM8.00002 4.66666C8.00002 5.03485 7.70154 5.33333 7.33335 5.33333C6.96516 5.33333 6.66669 5.03485 6.66669 4.66666C6.66669 4.29847 6.96516 3.99999 7.33335 3.99999C7.70154 3.99999 8.00002 4.29847 8.00002 4.66666ZM10 2.66666C10.3682 2.66666 10.6667 2.36818 10.6667 1.99999C10.6667 1.63181 10.3682 1.33333 10 1.33333C9.63183 1.33333 9.33335 1.63181 9.33335 1.99999C9.33335 2.36818 9.63183 2.66666 10 2.66666ZM13.3334 1.99999C13.3334 2.36818 13.0349 2.66666 12.6667 2.66666C12.2985 2.66666 12 2.36818 12 1.99999C12 1.63181 12.2985 1.33333 12.6667 1.33333C13.0349 1.33333 13.3334 1.63181 13.3334 1.99999ZM12.6667 5.33333C13.0349 5.33333 13.3334 5.03485 13.3334 4.66666C13.3334 4.29847 13.0349 3.99999 12.6667 3.99999C12.2985 3.99999 12 4.29847 12 4.66666C12 5.03485 12.2985 5.33333 12.6667 5.33333ZM10.6667 4.66666C10.6667 5.03485 10.3682 5.33333 10 5.33333C9.63183 5.33333 9.33335 5.03485 9.33335 4.66666C9.33335 4.29847 9.63183 3.99999 10 3.99999C10.3682 3.99999 10.6667 4.29847 10.6667 4.66666Z"
                                  fill="white"/>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_503_3720">
                            <rect width="28" height="20" rx="2" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                        <span>UZ</span>
                    </span>
                }>
          <span className="flex items-center gap-2">
            <span><svg width="20" height="20" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_503_3720)">
                        <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5"
                              strokeWidth="0.5"/>
                        <mask id="mask0_503_3720" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0"
                              width="28" height="20">
                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white"
                                  strokeWidth="0.5"/>
                        </mask>
                        <g mask="url(#mask0_503_3720)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.66667H28V0H0V6.66667Z" fill="#04AAC8"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 20H28V13.3333H0V20Z" fill="#23C840"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M4.66669 5.33333C5.07797 5.33333 5.46025 5.20919 5.77811 4.99633C5.74128 4.99876 5.70413 4.99999 5.66669 4.99999C4.74621 4.99999 4.00002 4.2538 4.00002 3.33333C4.00002 2.41285 4.74621 1.66666 5.66669 1.66666C5.70413 1.66666 5.74128 1.6679 5.77811 1.67033C5.46025 1.45747 5.07797 1.33333 4.66669 1.33333C3.56212 1.33333 2.66669 2.22876 2.66669 3.33333C2.66669 4.4379 3.56212 5.33333 4.66669 5.33333ZM8.00002 4.66666C8.00002 5.03485 7.70154 5.33333 7.33335 5.33333C6.96516 5.33333 6.66669 5.03485 6.66669 4.66666C6.66669 4.29847 6.96516 3.99999 7.33335 3.99999C7.70154 3.99999 8.00002 4.29847 8.00002 4.66666ZM10 2.66666C10.3682 2.66666 10.6667 2.36818 10.6667 1.99999C10.6667 1.63181 10.3682 1.33333 10 1.33333C9.63183 1.33333 9.33335 1.63181 9.33335 1.99999C9.33335 2.36818 9.63183 2.66666 10 2.66666ZM13.3334 1.99999C13.3334 2.36818 13.0349 2.66666 12.6667 2.66666C12.2985 2.66666 12 2.36818 12 1.99999C12 1.63181 12.2985 1.33333 12.6667 1.33333C13.0349 1.33333 13.3334 1.63181 13.3334 1.99999ZM12.6667 5.33333C13.0349 5.33333 13.3334 5.03485 13.3334 4.66666C13.3334 4.29847 13.0349 3.99999 12.6667 3.99999C12.2985 3.99999 12 4.29847 12 4.66666C12 5.03485 12.2985 5.33333 12.6667 5.33333ZM10.6667 4.66666C10.6667 5.03485 10.3682 5.33333 10 5.33333C9.63183 5.33333 9.33335 5.03485 9.33335 4.66666C9.33335 4.29847 9.63183 3.99999 10 3.99999C10.3682 3.99999 10.6667 4.29847 10.6667 4.66666Z"
                                  fill="white"/>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_503_3720">
                            <rect width="28" height="20" rx="2" fill="white"/>
                        </clipPath>
                    </defs>
                </svg></span>
            <span>UZ</span>
          </span>
                </Select.Option>
                <Select.Option value="ru" label={
                    <span className={"flex items-center gap-[5px]"}>
                        <span><svg width="20" height="20" viewBox="0 -4 28 28" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_503_2726)">
                        <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5"
                              strokeWidth="0.5"/>
                        <mask id="mask0_503_2726" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0"
                              width="28" height="20">
                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white"
                                  strokeWidth="0.5"/>
                        </mask>
                        <g mask="url(#mask0_503_2726)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 13.3333H28V6.66667H0V13.3333Z"
                                  fill="#0C47B7"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 20H28V13.3333H0V20Z" fill="#E53B35"/>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_503_2726">
                            <rect width="28" height="20" rx="2" fill="white"/>
                        </clipPath>
                    </defs>
                </svg></span>
                    <span>RU</span>
                    </span>
                }>
          <span className="flex items-center gap-2">
            <span><svg width="20" height="20" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_503_2726)">
                        <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5"
                              strokeWidth="0.5"/>
                        <mask id="mask0_503_2726" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0"
                              width="28" height="20">
                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white"
                                  strokeWidth="0.5"/>
                        </mask>
                        <g mask="url(#mask0_503_2726)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 13.3333H28V6.66667H0V13.3333Z"
                                  fill="#0C47B7"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 20H28V13.3333H0V20Z" fill="#E53B35"/>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_503_2726">
                            <rect width="28" height="20" rx="2" fill="white"/>
                        </clipPath>
                    </defs>
                </svg></span>
            <span>RU</span>
          </span>
                </Select.Option>
            </Select>
        </div>
    );
}