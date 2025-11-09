import { useMapState } from "@/Map";
import { useState } from "react";

const SideBarTabNames = {
    demographics: "Demographics",
    businesses: "Businesses",
    economy: "Economy",
} as const;

type SidebarTab = keyof typeof SideBarTabNames;

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
            <div className="min-w-80 shadow-xl border-r-2 border-blue-400">
                {county ? (
                    <>
                        <p className="text-slate-800 font-bold text-xl text-center py-4 px-3 border-b border-slate-200">
                            {county} County Analytics
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
