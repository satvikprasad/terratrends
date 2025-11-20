import { useMapState, type MapCounty } from "@/Map";
import type { BusinessPlace } from "@/types/businesses";
import { useState } from "react";
import { Line, LineChart } from "recharts";

const SideBarTabNames = {
    demographics: "Demographics",
    businesses: "Businesses",
    economy: "Economy",
} as const;

type SidebarTab = keyof typeof SideBarTabNames;

function getDummyGdpSectorPrediction(county: MapCounty): React.JSX.Element {
    // Super simple, fake “prediction” based only on countyId
    const base = (parseInt(county.countyId) % 5) - 2;   // gives -2, -1, 0, 1, 2
    const percent = (base * 1.5).toFixed(1);  // scale to something like -3.0%, 0.0%, 3.0%
    const direction = base >= 0 ? "growth" : "decline";

    return <span className={`${base >= 0 ? "text-green-700" : "text-red-700"}`}>{base > 0 ? "+" : ""}{percent}% GDP &Delta;</span>
}


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

function BusinessCard({ business, index }: { business: BusinessPlace; index: number }) {
    const typeList = business.types.slice(0, 3).map((type) => type.replace(/_/g, " "));
    const mapLink = `https://www.google.com/maps/place/?q=place_id:${business.placeId}`;
    const ratingText =
        typeof business.rating === "number" ? business.rating.toFixed(1) : "N/A";

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">
                        #{index + 1}
                    </p>
                    <p className="font-semibold text-lg">{business.name}</p>
                    <p className="text-sm text-slate-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">{ratingText}</p>
                    <p className="text-xs text-slate-500">
                        {business.totalRatings} review{business.totalRatings === 1 ? "" : "s"}
                    </p>
                    {business.priceLevel !== null && (
                        <p className="text-xs text-slate-500">
                            {"$".repeat(Math.max(1, business.priceLevel))}
                        </p>
                    )}
                </div>
            </div>
            {typeList.length > 0 && (
                <p className="text-xs text-slate-500">{typeList.join(" • ")}</p>
            )}
            <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 font-medium"
            >
                Open in Google Maps →
            </a>
        </div>
    );
}

function BusinessesTab() {
    const {
        businessType,
        county,
        businesses,
        isFetchingBusinesses,
        businessError,
    } = useMapState();

    if (!businessType) {
        return (
            <div className="p-6 text-slate-600">
                Enter a business type to see tailored Google Maps insights here.
            </div>
        );
    }

    if (!county) {
        return (
            <div className="p-6 text-slate-600">
                Click on a county to pull the highest-rated {businessType} businesses nearby.
            </div>
        );
    }

    if (businessError) {
        return (
            <div className="p-6 text-red-600">
                {businessError}
            </div>
        );
    }

    if (isFetchingBusinesses) {
        return (
            <div className="p-6 flex flex-col gap-3 animate-pulse text-slate-600">
                <p className="font-semibold">Fetching Google Maps listings...</p>
                <p>We are geocoding {county.name} County and compiling the best-rated matches.</p>
            </div>
        );
    }

    if (businesses.length === 0) {
        return (
            <div className="p-6 text-slate-600">
                No Google Maps listings matched “{businessType}” for {county.name} County.
                Try another category or widen your search.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 p-3 h-full overflow-scroll">
            <div className="bg-slate-50 rounded-2xl p-3 text-sm text-slate-600 border border-slate-200">
                Showing <span className="font-semibold">{businessType}</span> businesses in{" "}
                <span className="font-semibold">{county.name} County</span>, sorted by rating.
            </div>
            {businesses.map((business, index) => (
                <BusinessCard key={business.placeId} business={business} index={index} />
            ))}
        </div>
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
            className={`bg-transparent hover:cursor-pointer ${currTab == tab
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
    const {
        county,
        businessType,
        setBusinessType,
    } = useMapState();

    const [tab, setTab] = useState<SidebarTab>("demographics");

    const [inputBusType, setInputBusType] = useState<string>("");

    return (
        <>
            {/** Sidebar component */}
            <div className="min-w-100 max-w-100 shadow-xl z-1000 max-h-screen flex flex-col overflow-hidden">
                {(county && businessType) ? (
                    <>
                        <div className="flex items-center justify-between py-4 px-3 border-b border-slate-200">
                            <p className="text-slate-800 font-bold text-xl">
                                {county.name} County
                            </p>
                            <p className="text-sm text-slate-600 text-right max-w-[8rem]">
                                {getDummyGdpSectorPrediction(county)}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 text-xs">
                            {Object.keys(SideBarTabNames).map((key) => {
                                return (
                                    <SidebarTab
                                        key={key}
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
                                    return <BusinessesTab />;
                                case "economy":
                                default:
                                    return <></>;
                            }
                        })()}
                    </>
                ) : (
                    <div className="p-6 flex flex-col gap-6">
                        {businessType ? <>
                            <p className="text-slate-600">
                                Your selected business is a <span className="font-bold">{businessType}</span>. Click on a county for further analytics.
                            </p>
                        </> : <>
                            <p className="text-slate-600">
                                Tell us the type of your business, then click on a county for further analytics.
                            </p>
                            <hr className="text-slate-300" />
                            <div className="flex flex-row text-black gap-3 items-center">
                                <p>My business is a </p>
                                <input className="outline-1 rounded-xl py-1 px-2" placeholder="kbbq restaurant" type="text" value={inputBusType} onChange={(e) => {
                                    setInputBusType(e.currentTarget.value);
                                }} />
                                <p>.</p>
                            </div>
                            <button className={`p-3 rounded-xl ${inputBusType.trim() == "" ? "bg-slate-50 hover:cursor-not-allowed" : "bg-slate-100 hover:bg-slate-200"}`} onClick={() => {
                                const trimmedType = inputBusType.trim();

                                if (trimmedType === "") {
                                    return;
                                }

                                setBusinessType(trimmedType);
                            }}>
                                Begin analysing my TerraTrends
                            </button>
                        </>}
                    </div>
                )}
            </div>
        </>
    );
}
