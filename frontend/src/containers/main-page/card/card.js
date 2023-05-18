import '../main-page.sass';

function RestCard(props){
    return(
        <div className="rest-list__item">
        <div className="rest-list__item__img">
            <img src={`${props.photos}`} alt="rest-photo" />
        </div>
        <div className="rest-list__item__title">{props.name}</div>
        <div className="rest-list__item__rate"><span>{props.rating}</span></div>
        <div className="rest-list__item__descr">{props.description}</div>
        <div className="rest-list__item__address">{props.address}</div>  
        </div>
    );
}

export default RestCard;