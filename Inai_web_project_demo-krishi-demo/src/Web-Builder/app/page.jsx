import { HeroGeometric } from "@/Web-Builder/Components/ui/shape-landing-hero";
import { LiquidButton } from '@/Web-Builder/Components/ui/liquid-glass-button';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="relative">
            <HeroGeometric
                badge="Next Inai"
                title1="Build Stunning"
                title2="Websites with AI"
            />
            <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
                <Link to="/builder">
                    <LiquidButton className="text-white border rounded-full" size={'xl'}>Start Building</LiquidButton>
                </Link>
            </div>
        </div>
    );
}
