import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

function App() {
    return (
        <TooltipProvider>
            <div className="relative min-h-screen overflow-hidden">
                {/* Animated background gradient */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
                </div>

                {/* Main content */}
                <div className="relative container mx-auto px-4 py-8 flex flex-col min-h-screen">
                    {/* Header */}
                    <Header />

                    {/* Search Form - Main focus */}
                    <main className="flex-1 flex flex-col items-center justify-center -mt-12">
                        <SearchForm />
                    </main>

                    {/* Features */}
                    <Features />

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </TooltipProvider>
    );
}

export default App;
