import React from 'react'
import { FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="footer">

            <h2> Made with ❤️ by Ebuka, lets connect on </h2>

            <h1>

            <FaTwitter href="twitter.com/ebuka_achonwa"/>
            <FaGithub href="github.com/mancancodes"/>
            </h1>

        </div>
    )
}

export default Footer
