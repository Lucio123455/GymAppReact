import styles from './FooterNav.module.css'
import { Link } from 'react-router-dom'
import casaImg from '../../assets/casa.png'
import entrenamientoImg from '../../assets/mancuerna.png'
import perfilImg from '../../assets/perfil.png'

export function FooterNav() {
    return (
        <>
            <div className={styles.footer}>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <img className={styles.imgNav} src={casaImg} alt="Inicio" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/entrenamiento">
                                <img className={styles.imgNav} src={entrenamientoImg} alt="Entrenamiento" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/perfil">
                                <img className={styles.imgNav} src={perfilImg} alt="Perfil" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}