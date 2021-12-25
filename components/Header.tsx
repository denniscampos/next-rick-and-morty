import Image from 'next/image'
import rickAndMortyLogo from '../public/rick-and-morty.png'
import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <div className={styles.header}>
            <Image src={rickAndMortyLogo} alt="Rick and Morty Logo" />
        </div>
    )
}

export default Header
