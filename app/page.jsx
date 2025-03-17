"use client"
import useSWR from "swr";
import {useAuth} from "../components/authProvider";
import {ThemeToggleButton} from "@/components/themeToggleButton";

const fetcher = (...args) => fetch(...args).then((res) => res.json());


export default function Home() {
    const auth = useAuth()

    // Get Request
    const {data, error, isLoading} = useSWR("http://localhost:8000/api/hello", fetcher);
    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div
            className="grid max-h-screen overflow-scroll grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex max-h-screen overflow-scroll flex-col gap-8 row-start-2 items-center sm:items-start">
                <div>
                    {auth.isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </div>
                <div>
                    <ThemeToggleButton></ThemeToggleButton>
                </div>
                {JSON.stringify(data)}
                <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2">
                        Get started by editing{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                            app/page.tsx
                        </code>
                    </li>
                    <li>Save ad see your changes instantly.</li>
                </ol>

            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                test
            </footer>
        </div>
    );
}
