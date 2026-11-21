import Breadcrumb from "@/components/layout/Breadcrumb";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SideMenu from "@/components/layout/SideMenu";

// Common frame of the shop pages that are not category / product pages: theme CSS, <html> classes, header, footer.
export default function PageShell({
  crumbs,
  heading,
  children,
}: {
  crumbs: { label: string; href: string }[];
  heading?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <Breadcrumb items={[{ label: "Home", href: "/" }, ...crumbs]} />
        {heading}
        {children}
        <Footer />
      </Header>
      <SideMenu />
    </>
  );
}
