import './footer.sass';

function Footer() {

    return(
        <footer>
            <div className="footer__item">
                <div className="footer__title">
                    About Us
                </div>
                <div className="footer__descr">
                    <span>
                        Good
                    </span>
                    <span>
                        Smart
                    </span>
                    <span>
                        Strong
                    </span>                
                </div>
            </div>
            <div className="footer__item">
                <div className="footer__title">
                    Contact Us
                </div>
                <div className="footer__descr">
                    <span>
                        email:example@gmail.com
                    </span>
                    <span>
                        Phone:8-800-535-3535
                    </span>
                    <span>  
                        Telegram:@ReserveBistro
                    </span>
                </div>
            </div>
            
        </footer>
    )
}

export default Footer;