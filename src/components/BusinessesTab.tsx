import { useMapState } from "@/Map";
import { useEffect, useState } from "react";

type Competitor = {
    name: string;
    bayesian_rating: number;
    market_share_proxy: number;
    rank: number;
};

async function fetchCompetitors(countyName: string, type?: string): Promise<Competitor[]> {
    const params = new URLSearchParams({
        county: countyName,
        include: "market_share,opportunity,viability",
        w1: "0.4",
        w2: "0.4",
        w3: "0.2",
    });

    if (type) params.set("type", type);

    const baseUrl = import.meta.env.VITE_COMPETITION_API_URL ?? "http://localhost:8000";
    const res = await fetch(`${baseUrl}/rank?${params.toString()}`);

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    return data.results;
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1">
            <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">
                        #{competitor.rank}
                    </p>
                    <p className="font-semibold text-base">{competitor.name}</p>
                </div>
                <div className="text-right flex flex-col gap-2">
                    <div>
                        <p className="text-xs text-slate-500">Bayesian Rating</p>
                        <p className="text-lg font-bold text-slate-800">
                            {competitor.bayesian_rating.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Market Share</p>
                        <p className="text-sm font-semibold text-slate-700">
                            {(competitor.market_share_proxy * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BusinessesTab() {
    const { county, businessType } = useMapState();

    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!county) {
            setCompetitors([]);
            setError(null);
            return;
        }

        let cancelled = false;

        async function load() {
            if (!county) return;
            setIsFetching(true);
            setError(null);
            try {
                const results = await fetchCompetitors(county.name, businessType ?? undefined);
                if (!cancelled) setCompetitors(results);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unable to fetch competitor data.");
                    setCompetitors([]);
                }
            } finally {
                if (!cancelled) setIsFetching(false);
            }
        }

        void load();
        return () => { cancelled = true; };
    }, [county, businessType]);

    if (!county) {
        return (
            <div className="p-6 text-slate-600">
                Click on a county to see ranked competitors.
            </div>
        );
    }

    if (isFetching) {
        return (
            <div className="p-6 animate-pulse text-slate-600">
                Loading competitor rankings...
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    if (competitors.length === 0) {
        return (
            <div className="p-6 text-slate-600">
                No competitor data available for {county.name} County.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 p-3 h-full overflow-scroll">
            <div className="bg-slate-50 rounded-2xl p-3 text-sm text-slate-600 border border-slate-200">
                Ranked competitors in <span className="font-semibold">{county.name} County</span>
            </div>
            {competitors.map((competitor) => (
                <CompetitorCard
                    key={`${competitor.name}-${competitor.rank}`}
                    competitor={competitor}
                />
            ))}
        </div>
    );
}
