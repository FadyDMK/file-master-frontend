import PropTypes from 'prop-types';
import folderIcon from '../../../assets/folder.png';
import styles from './Folder.module.css';

Folder.propTypes = {
    name: PropTypes.string.isRequired
};

export default function Folder({name}) {
    return(
        <div className={styles.container}>
            <img src={folderIcon} alt="folder" className={styles.icon}/>
            <p>{name}</p>
        </div>
    )
}