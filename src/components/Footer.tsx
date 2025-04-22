import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-primary-800 dark:bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">{t('footer.title')}</h2>
                        <p className="text-gray-200 dark:text-gray-400">{t('footer.tagline')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;