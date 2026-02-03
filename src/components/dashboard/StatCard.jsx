import React from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorStyles = {
        primary: 'bg-primary-50 text-primary-600',
        secondary: 'bg-secondary-50 text-secondary-600',
        warning: 'bg-orange-50 text-orange-600',
        danger: 'bg-red-50 text-red-600',
        info: 'bg-cyan-50 text-cyan-600',
    };

    return (
        <div className="card hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={clsx("p-3 rounded-lg", colorStyles[color])}>
                    <Icon size={24} />
                </div>
            </div>
            {(trend || trendValue) && (
                <div className="mt-4 flex items-center text-sm">
                    {trend === 'up' && <ArrowUp size={16} className="text-green-500 mr-1" />}
                    {trend === 'down' && <ArrowDown size={16} className="text-red-500 mr-1" />}
                    {trend === 'neutral' && <Minus size={16} className="text-slate-400 mr-1" />}

                    <span className={clsx(
                        "font-medium",
                        trend === 'up' ? "text-green-600" :
                            trend === 'down' ? "text-red-600" : "text-slate-500"
                    )}>
                        {trendValue}
                    </span>
                    <span className="text-slate-400 ml-2">from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
