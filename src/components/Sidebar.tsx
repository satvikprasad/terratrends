import { useMapState } from "@/Map";
import { useState } from "react";
import { Line, LineChart } from "recharts";

const SideBarTabNames = {
    demographics: "Demographics",
    businesses: "Businesses",
    economy: "Economy",
} as const;

type SidebarTab = keyof typeof SideBarTabNames;

function Demographics() {
    return (
        <div className="flex flex-col gap-3 p-3 h-full overflow-scroll">
            <div className="grid grid-cols-2">
                <div className="bg-sky-50 rounded-2xl mr-1.5 p-3">
                    <p className="text-slate-600 text-sm">Population</p>
                    <p className="font-bold text-xl">1.09 million</p>
                </div>
                <div className="bg-sky-50 rounded-2xl ml-1.5 p-3">
                    <p className="text-slate-600 text-sm">Population Growth</p>
                    <p className="font-bold text-xl">+0.5% Growth</p>
                </div>
            </div>
            <div>
                <SampleChart />
            </div>
            <div className="grid grid-cols-2">
                <div className="bg-sky-50 rounded-2xl mr-1.5 p-3">
                    <p className="text-slate-600 text-sm">
                        Median Household Income
                    </p>
                    <p className="font-bold text-xl">$67,000</p>
                </div>
                <div className="bg-sky-50 rounded-2xl ml-1.5 p-3">
                    <p className="text-slate-600 text-sm">
                        Percent with College Degree
                    </p>
                    <p className="font-bold text-xl">47.9%</p>
                </div>
            </div>
            <div>
                <SampleChart />
            </div>
            <div className="grid grid-cols-2">
                <div className="bg-sky-50 rounded-2xl mr-1.5 p-3">
                    <p className="text-slate-600 text-sm">
                        Violent Crime Rate (per 1000)
                    </p>
                    <p className="font-bold text-xl">7.18</p>
                </div>
                <div className="bg-sky-50 rounded-2xl ml-1.5 p-3">
                    <p className="text-slate-600 text-sm">
                        Property Crime Rate
                    </p>
                    <p className="font-bold text-xl">40.42</p>
                </div>
            </div>
            <div>
                <SampleChart />
            </div>
        </div>
    );
}

function SampleChart() {
    return (
        <LineChart
            className="border-2 rounded-2xl border-slate-300"
            style={{
                width: "100%",
                aspectRatio: 1.618,
                maxWidth: 600,
            }}
            responsive
            data={[
                {
                    name: "Page A",
                    uv: 400,
                    pv: 2400,
                    amt: 2400,
                },
                {
                    name: "Page B",
                    uv: 300,
                    pv: 4567,
                    amt: 2400,
                },
                {
                    name: "Page C",
                    uv: 320,
                    pv: 1398,
                    amt: 2400,
                },
                {
                    name: "Page D",
                    uv: 200,
                    pv: 9800,
                    amt: 2400,
                },
                {
                    name: "Page E",
                    uv: 278,
                    pv: 3908,
                    amt: 2400,
                },
                {
                    name: "Page F",
                    uv: 189,
                    pv: 4800,
                    amt: 2400,
                },
            ]}
        >
            <Line dataKey="uv"></Line>
        </LineChart>
    );
}

function SidebarTab({
    tab,
    currTab,
    setCurrTab,
}: {
    tab: SidebarTab;
    currTab: SidebarTab;
    setCurrTab: React.Dispatch<React.SetStateAction<SidebarTab>>;
}) {
    return (
        <button
            className={`bg-transparent hover:cursor-pointer ${
                currTab == tab
                    ? "border-b-2 text-blue-500"
                    : "border-b border-slate-200"
            } p-3`}
            onClick={() => {
                setCurrTab(tab);
            }}
        >
            {SideBarTabNames[tab]}
        </button>
    );
}

export default function Sidebar(): React.JSX.Element {
    const { county } = useMapState();

    const [tab, setTab] = useState<SidebarTab>("demographics");

    return (
        <>
            {/** Sidebar component */}
            <div className="min-w-100 shadow-xl border-r-2 border-blue-300 max-h-screen flex flex-col overflow-hidden">
                {county ? (
                    <>
                        <p className="text-slate-800 font-bold text-xl text-center py-4 px-3 border-b border-slate-200">
                            {county.name} County Analytics
                        </p>
                        <div className="grid grid-cols-3 text-xs">
                            {Object.keys(SideBarTabNames).map((key) => {
                                return (
                                    <SidebarTab
                                        tab={key as SidebarTab}
                                        currTab={tab}
                                        setCurrTab={setTab}
                                    />
                                );
                            })}
                        </div>
                        {(() => {
                            switch (tab) {
                                case "demographics":
                                    return <Demographics />;
                                case "businesses":
                                case "economy":
                                default:
                                    return <></>;
                            }
                        })()}
                    </>
                ) : (
                    <p className="text-slate-600 p-3">
                        Click on a county for further analytics.
                    </p>
                )}
            </div>
        </>
    );
}
