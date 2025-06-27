import qgisLogo from "../assets/qsign.svg";
import postgresLogo from "../assets/Postgresql_elephant.svg";
import geoserverLogo from "../assets/GeoServer_Logo.svg.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2025 RecycleMap</p>
        <p>Desarrollado con tecnologías SIG</p>
      </div>
      <div className="footer-right">
        <p>Colaboradores:</p>
        <a href="https://qgis.org/" target="_blank" rel="noopener noreferrer">
          <img src={qgisLogo} alt="QGIS" title="QGIS" />
        </a>
        <a href="https://www.postgresql.org/" target="_blank" rel="noopener noreferrer">
          <img src={postgresLogo} alt="PostgreSQL" title="PostgreSQL" />
        </a>
        <a href="https://geoserver.org/" target="_blank" rel="noopener noreferrer">
          <img src={geoserverLogo} alt="GeoServer" title="GeoServer" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
