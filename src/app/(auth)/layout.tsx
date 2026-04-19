import Footer from "../../customcomponents/LayoutFiles/Footer";
import Header from "../../customcomponents/LayoutFiles/Header";

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