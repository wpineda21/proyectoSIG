const Map = () => {
    return (
        <>
            <h1 className="title-cards-map">Mapa de Reciclaje</h1>
            <div className="card-map-description">
                <p>Encuentra los puntos de reciclaje más cercanos a tu ubicación.
                Utiliza el mapa interactivo para localizar centros de reciclaje y puntos de recogida de residuos.
                Haz clic en los marcadores para obtener más información sobre cada ubicación.</p>
            </div>
            <div className="map-container">
                {/*Aqui se agrega el mapa de Qguis*/}
                <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846816!3d37.77492977975995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0f5a3b1%3A0x4c8b8e8f60e5b8b1!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1616623141234!5m2!1sen!2sus"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </>

    );
}
export default Map;