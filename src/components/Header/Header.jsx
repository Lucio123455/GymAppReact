import styles from './Header.module.css'

export function Header({titulo}) {
    return (
      <>
        <div className={styles.header}>
            <h1 className={styles.title}>{titulo}</h1>
        </div>
      </>
    );
  }
