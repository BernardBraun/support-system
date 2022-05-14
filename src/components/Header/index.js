import { useContext } from 'react';
import './styles.css';
import {AuthContext} from '../../contexts/auth'
import {FiHome} from 'react-icons/fi';
import {FiUser} from 'react-icons/fi';
import {FiSettings} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import avatar from '../../assets/avatar.png'

export default function Header(){

    const {user} = useContext(AuthContext);
    return(
        <div className='sidebar'>
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto Avatar"/>
            </div>
            <Link to="/dashboard">
                <FiHome color='#FFF' size={24}/>
                Chamados
            </Link>
            <Link to="/customers">
                <FiUser color='#FFF' size={24}/>
                Clientes
            </Link>
            <Link to="/profile">
                <FiSettings color='#FFF' size={24}/>
                Configurações
            </Link>
        </div>
    )
}