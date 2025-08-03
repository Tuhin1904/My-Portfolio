export const metadata = {
    title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
    return (
        <section className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 py-12 px-6 flex border-b-1">
            <div className="max-w-3xl text-center m-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Privacy Policy
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    This portfolio does not collect, store, or share any personal data.
                    It is intended solely to showcase my work and skills.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    For any questions, feel free to{" "}
                    contact me

                    .
                </p>
            </div>
        </section>
    );
}
