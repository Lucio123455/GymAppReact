import styles from './FooterNav.module.css'

import casaImg from '../../assets/casa.png'
import entrenamientoImg from '../../assets/mancuerna.png'
import perfilImg from '../../assets/perfil.png'

export function FooterNav () {
    return (
        <>
            <div className={styles.footer}>
                <nav>
                    <ul>
                        <li><img className={styles.imgNav} src={casaImg} alt="" /></li>
                        <li><img className={styles.imgNav} src={entrenamientoImg} alt="" /></li>
                        <li><img className={styles.imgNav} src={perfilImg} alt="" /></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}