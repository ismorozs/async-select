import { UsersItemResponse } from '../../../../types';
import styles from './styles.module.css';

export const UsersSelectLabel = ({ first_name, last_name, job }: UsersItemResponse) => (
  <div className={styles.UsersSelect__Label}>
    <div className={styles.UsersSelect__LabelAvatar}>
      <span className={styles.UsersSelect__LabelAvatarText}>
        {last_name.at(0)}
      </span>
    </div>
    <span>{`${first_name} ${last_name}, ${job}`}</span>
  </div>
);
