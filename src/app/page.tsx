import CompressPdf from "@/components/CompressPdf";
import Feature from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MergePdf from "@/components/MergePdf";
import Navbar from "@/components/Navbar";
import PdfToJpg from "@/components/PdfToJpg";
import SplitPdf from "@/components/SplitPdf";
import HowToUseSection from "@/components/Use";

export default function Home() {
  return (
    <>
      <Hero />
      <Feature />
      <HowToUseSection />
    </>
  );
}
