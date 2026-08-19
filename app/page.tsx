import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import OrgChart from "@/components/OrgChart";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Install from "@/components/Install";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <OrgChart />
      <Features />
      <Workflow />
      <Install />
      <Footer />
    </main>
  );
}
