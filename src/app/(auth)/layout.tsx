import Footer from "../components/LayoutFiles/Footer";
import Header from "../components/LayoutFiles/Header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* <Header /> */}
            {children}
            {/* <Footer /> */}
        </>
    );
}