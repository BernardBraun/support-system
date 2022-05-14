import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import './styles.css';
import logo from '../../assets/logo.png'


function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const {signIn, loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(email !== '' && senha !== ''){
      signIn(email, senha);
    }
  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <img src={logo} alt="Logo do sistema"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <label>E-mail: </label>
            <input type="text" placeholder="seuemail@dominio.com" value={email} onChange={(e)=> setEmail(e.target.value)} /><br/>
            <label>Senha: </label>
            <input  type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)}/><br/>
            <button type="submit">{loadingAuth ? 'Carregando...': 'Acessar'}</button>
          </form>
          <Link to="/register">Crie sua conta</Link>

        </div>
      </div>
    );
  }
  
  export default SignIn;
  