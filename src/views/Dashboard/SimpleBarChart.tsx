import React, {useMemo} from 'react';
import {BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, LabelList} from 'recharts';

interface IProps {
    data?: {
        name: string;
        value: number;
    }[];
    title: string;
}

const MyTinyBarChart: React.FC<IProps> = ({data, title}) => {
    const maxValue = useMemo(() => {
        return data && data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;
    }, [data]);

    const maxValueWithPercent = Math.ceil(maxValue + maxValue * 0.15);


    const getBarColor = (value: number) => {
        return value > 0 ? '#82ca9d' : '#8884d8';
    };

    // Qisqartirilgan nomni qaytaruvchi funksiya
    const formatTick = (value: string) => {
        return value.substring(0, 4); // Dastlabki 3 ta harf
    };

    // Custom Tooltip komponenti
    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: 'white',
                    padding: '5px 10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p>{`${label} : ${payload[0].value}`}</p> {/* To'liq nom va qiymat */}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h3 className="mb-[10px] text-center font-semibold text-lg sm:text-2xl sm:mb-[20px] lg:mb-[30px] xl:text-3xl">
                {title}
            </h3>
            <div className="w-full h-[260px] text-[10px] min-[400px]:text-xs sm:text-sm">
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={40}
                            // style={{ fontSize: '12px' }}
                            tickFormatter={formatTick} // Qisqartirilgan nomlarni ishlatish
                        />
                        <YAxis domain={[0, maxValueWithPercent]} hide={true}/>
                        {/* Custom Tooltip ni ishlatish */}
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar dataKey="value">
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)}/>
                            ))}
                            <LabelList dataKey={"value"} position={"top"}/>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MyTinyBarChart;