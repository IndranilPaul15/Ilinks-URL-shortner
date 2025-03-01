import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { X } from "lucide-react";

const VisitorGraph = ({ close, visitors }) => {
    const [formattedData, setFormattedData] = useState([]);
    const [dateRange, setDateRange] = useState(7)
    const [timeInterval, setTimeInterval] = useState('hour')

    const formatDate = (dateString, useTime = false) => {
        if (!dateString) return "Invalid Date";
        let date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateString);
            return "Invalid Date";
        }

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options); // Day-Month-Year format

        if (useTime) {
            if (timeInterval === 'second') {
                return date.toLocaleTimeString('en-GB'); // For second-level format (1:23:24 AM)
            }
            if (timeInterval === 'minute') {
                return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
            }
            return date.toLocaleTimeString('en-GB', { hour: 'numeric' });
        }
        return formattedDate;
    };

    const visitorCounts = useMemo(() => {
        if (!Array.isArray(visitors)) return {};
        const counts = {};
        visitors.forEach((entry) => {
            const formattedDate = formatDate(entry.date, dateRange === 0);
            if (formattedDate !== "Invalid Date") {
                counts[formattedDate] = (counts[formattedDate] || 0) + 1;
            }
        });
        return counts;
    }, [visitors, dateRange, timeInterval]);
    const processedData = useMemo(() => {
        return Object.entries(visitorCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [visitorCounts]);
    useEffect(() => {
        if (!visitors || visitors.length === 0) {
            console.warn("No visitor data available");
            return;
        }
        setFormattedData(processedData);
    }, [processedData]);

    const visibleData = formattedData.slice(-dateRange);

    const chartData = {
        labels: visibleData.map((entry) => entry.date),
        datasets: [
            {
                label: "Visitors :",
                data: visibleData.map((entry) => entry.count),
                borderColor: "#39FF14",
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: "white",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white",
                    font: { size: 15 },
                },
            },
            y: {
                ticks: {
                    color: "white",
                    font: { size: 16 },
                },
            },
        },
    };

    return (
        <div className="relative text-white  rounded-xl shadow-xl bg-blue-950/60 w-[93vw] md:w-[65vw] mx-auto">
            <button onClick={close} className="absolute z-20 top-3 right-6 md:right-3 active:scale-95">
                <X size={30} color="white" />
            </button>
            <h2 className="text-2xl font-semibold py-2  text-center">Visitor Analytics</h2>
            {(visibleData.length > 0) ? (
                <Line className="p-3 " data={chartData} options={chartOptions} />
            ) : (
                <p className="text-center text-gray-300 mt-6">No visitor data available</p>
            )}

            <div className="mt-6 mb-3 flex flex-col md:flex-row justify-between gap-5 pt-0 pb-3 px-4 md:gap-12 items-center">
                <div className="flex items-center space-x-3">
                    <label className="md:text-lg font-medium">Date Range:</label>
                    <input
                        type="range"
                        min="0"
                        max="30"
                        value={dateRange}
                        onChange={(e) => setDateRange(Number(e.target.value))}
                        className="w-48 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    />
                    <span className="md:text-lg font-medium">{dateRange === 0 ? "Time" : `${dateRange} days`}</span>
                </div>

                {dateRange === 0 && (
                    <div className="flex items-center space-x-4">
                        <label className="text-lg font-medium">Time Interval:</label>
                        <select
                            value={timeInterval}
                            onChange={(e) => setTimeInterval(e.target.value)}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                            <option value="hour">Hour</option>
                            <option value="minute">Minute</option>
                            <option value="second">Second</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitorGraph;
