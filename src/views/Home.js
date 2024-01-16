import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Zaimportuj plik CSS
import { useTranslation } from 'react-i18next';

function Home(button) {
    const { t } = useTranslation();
    return (
        <div className="center-content">
            <h1>{t('hello')}</h1>
            <div>
                <Link to="/Books">
                    <button className="home-button">{t('showBookList')}</button>
                </Link>
                <Link to="/CheckOuts">
                    <button className="home-button">{t('showCheckoutList')}</button>
                </Link>
            </div>          
        </div>
    )
        ;
}

export default Home;