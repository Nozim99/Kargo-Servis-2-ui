import React from 'react';
import useFetch from "../../hooks/useFetch.ts";
import Loading from "../../components/Loading";
import SimpleAreaChart from "./SimpleAreaChart.tsx";
import SimpleBarChart from "./SimpleBarChart.tsx";
import {useTranslation} from "react-i18next";


interface IData {
    products_amount?: { name: string, value: number }[];
    products_price?: { name: string, value: number }[];
    packets_amount?: { name: string, value: number }[];
    parties_amount?: { name: string, value: number }[];
    users_amount?: { name: string, value: number }[];
    regions_price?: { name: string, value: number }[];
    products_amount_by_regions?: { name: string, value: number }[];
    packets_amount_by_regions?: { name: string, value: number }[];
}

const Dashboard: React.FC = () => {
    const {t} = useTranslation()
    const {data: productsData, isLoading} = useFetch<IData, any>(
        {
            key: ['yearly-products-statistics'], // Kesh kaliti (page, pageSize, searchText ga bog'liq)
            endpoint: '/dashboard/data',
        }
    );


    const chartsData = [
        {
            title: t('count_of_products'),
            data: productsData?.products_amount?.slice()?.reverse()
        },
        {
            title: t('money_circulation'),
            data: productsData?.products_price?.slice()?.reverse()
        },
        {
            title: t("count_of_packets"),
            data: productsData?.packets_amount?.slice()?.reverse()
        },
        {
            title: t('count_of_parties'),
            data: productsData?.parties_amount?.slice()?.reverse()
        }
    ]

    const chartsRegionsData = [
        {
            title: t("count_of_clients"),
            data: productsData?.users_amount
        },
        {
            title: t('money_circulation'),
            data: productsData?.regions_price
        },
        {
            title: t('count_of_products'),
            data: productsData?.products_amount_by_regions
        },
        {
            title: t("count_of_packets"),
            data: productsData?.packets_amount_by_regions
        }
    ]


    return (
        // <div className="p-4 md:p-6 lg:p-8 relative">
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100">
            <h1 className={"font-semibold text-xl text-center mb-[10px] sm:text-3xl sm:mb-[15px] lg:mb-[20px]"}>
                {/*Kompaniyaning Yillik Faoliyat Ko'rsatkichlari*/}
                {t("dashboard_title")}
            </h1>
            <p className={"mb-[30px] text-center text-xs min-[500px]:w-[400px] mx-auto sm:text-sm sm:mb-[40px] md:text-base md:w-[500px] md:mb-[60px] lg:text-lg lg:w-[550px]"}>
                {t('dashboard_desc')}
            </p>
            <div className={"relative"}>
                <Loading open={isLoading}/>


                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-y-[20px] sm:gap-y-[40px]"}>
                    {
                        chartsData.map((itemData, index) => (
                            <div className={""}
                                 key={index}>
                                <SimpleAreaChart data={itemData?.data} title={itemData.title}/>
                            </div>
                        ))
                    }
                </div>
                {/*<p className={`mb-[30px] text-center text-xs min-[500px]:w-[400px] mx-auto sm:text-sm sm:mb-[40px] md:text-base md:w-[500px] md:mb-[50px] lg:text-lg lg:w-[550px] mt-[25px]*/}
                {/*min-[400px]:mt-[30px] sm:mt-[40px] md:mt-[50px] lg:mt-[60px] xl:mt-[70px]`}>*/}
                {/*    {t('dashboard_chart_desc')}*/}
                {/*</p>*/}
                {/*<div className={"grid gap-[30px] sm:gap-[50px] md:gap-[60px]"}>*/}
                {/*    {*/}
                {/*        chartsRegionsData.map((itemData, index) => (*/}
                {/*            <div key={index}>*/}
                {/*                <SimpleBarChart data={itemData?.data} title={itemData.title}/>*/}
                {/*            </div>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Dashboard;