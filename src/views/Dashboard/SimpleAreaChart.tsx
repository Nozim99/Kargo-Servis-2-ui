import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";


const formatMonth = (month: string) => {
    return month.substring(0, 3);
};


export default function SimpleAreaChart({title, data}: { title: string, data?: { name: string, value: number }[] }) {
    // const currentData = demoData?.[demoData?.length - 1];
    const currentData = data?.[data?.length - 1];

    return (
        <div className={"h-full"}>
            <div className={"flex items-center justify-between"}>
                <h3 className={"pl-[67px] lg:text-lg xl:text-xl sm:font-semibold sm:text-lg"}>{title}</h3>
                <div className={"flex flex-col text-center"}>
                    <span className={"text-sm text-gray-500"}>{currentData?.name}</span>
                    <span className={"font-semibold text-lg"}>{currentData?.value?.toLocaleString()}</span>
                </div>
            </div>
            <div className={"h-[170px] sm:h-[210px] md:h-[190px] lg:h-[170px] xl:h-[190px]"}>
                <ResponsiveContainer className={"w-full h-full text-xs sm:text-sm"}>
                    <AreaChart
                        data={data}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name" tickFormatter={formatMonth}/>
                        <YAxis/>
                        <Tooltip/>
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}