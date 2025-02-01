import PropTypes from 'prop-types';
import fileIcon from '../../../assets/file.png';
import styles from './File.module.css';

File.propTypes = {
    name: PropTypes.string.isRequired
};

export default function File({name}) {
    return(
        <div className={styles.container}>
            <img src={fileIcon} alt="file" className={styles.icon}/>
            <p>{name}</p>
        </div>
    )
}