import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SideMenu from "@/components/layout/SideMenu";
import HomeContent from "@/components/home/HomeContent";

export default function Home() {
  return (
    <>
      <Header>
        <HomeContent />
        <Footer />
      </Header>
      <SideMenu />
    </>
  );
}
