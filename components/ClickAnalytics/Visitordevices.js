import React, { useEffect, useState } from 'react';
import PieChart from '@/components/ClickAnalytics/piechart';
import { X } from 'lucide-react';

const DEVICE_COLORS = {
    Windows: '#ED1250',
    iOS: '#00A383',
    Android: '#92C2FE',
    Others: '#F8AC39',
};

const normalizeDevice = (os) => {
    if (!os) return 'Others';
    const lowerOS = os.toLowerCase();
    if (lowerOS.includes('windows')) return 'Windows';
    if (lowerOS.includes('mac')) return 'Others';
    if (lowerOS.includes('linux')) return 'Android';
    if (lowerOS.includes('android')) return 'Android';
    if (lowerOS.includes('ios') || lowerOS.includes('iphone') || lowerOS.includes('ipad')) return 'iOS';
    return 'Others';
};

const Visitordevices = ({ close, shortlink, visitors ,clicks }) => {

    const [deviceData, setDeviceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visitors && visitors.length > 0) {
            const deviceStats = {};
            visitors.forEach(visitor => {
                const device = normalizeDevice(visitor.deviceInfo?.os);
                deviceStats[device] = (deviceStats[device] || 0) + 1;
            });

            const totalVisitors = visitors.length;
            const formattedData = Object.keys(deviceStats).map(device => ({
                name: device,
                percentage: ((deviceStats[device] / totalVisitors) * 100).toFixed(0),
                color: DEVICE_COLORS[device] || DEVICE_COLORS.Others
            }));

            setDeviceData(formattedData);
        } else {
            setDeviceData([]);
        }
        setLoading(false);
    }, [visitors]);

    return (
        <div className="relative md:ml-4 md:mx-0 mx-2 md:max-h-96 rounded-lg bg-[#F2CECE] shadow-xl py-4 flex flex-col justify-center items-center">
            <button onClick={close} className="absolute z-20 top-3 right-6 md:right-3 active:scale-95">
                <X size={30} color="midnightblue" />
            </button>

            <div className="ml-4 text-start w-full text-blue-950 font-bold text-xl md:text-lg">
                <span>Clicks By Devices For</span>
                <p className="text-center mr-4 text-sm text-blue-700 hover:underline hover:text-blue-500">
                    <a href={`${process.env.NEXT_PUBLIC_HOST}/${shortlink}`} target="_blank" rel="noopener noreferrer">
                        {`${process.env.NEXT_PUBLIC_HOST}/${shortlink}`}
                    </a>
                </p>
            </div>

            <div className="md:h-96 w-full md:overflow-y-auto flex flex-col justify-center items-center">
                {loading ? (
                    <p className="text-blue-700">Loading...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : deviceData.length > 0 ? (
                    <>
                        <div className="size-48 mx-7 my-4 md:my-0 p-1">
                            <PieChart data={deviceData} clicks={clicks} />
                        </div>
                        {deviceData.map((device, index) => (
                            <div key={index} className="mb-1 px-12 md:px-4 w-full text-gray-600 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: device.color }}></div>
                                    <span>{device.name}</span>
                                </div>
                                <p>{device.percentage}%</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-gray-600">No Visitors on this link.</p>
                )}
            </div>
        </div>
    );
};

export default Visitordevices;
