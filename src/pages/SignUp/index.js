import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import {AuthContext} from '../../contexts/auth'
import logo from '../../assets/logo.png'


function SignUp() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const {signUp, loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(nome !== '' && email !== '' && senha !== ''){
      signUp(email,senha,nome);
    }

  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <img src={logo} alt="Logo do sistema"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Crie sua conta</h1>
            <label>Nome: </label>
            <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} /><br/>
            <label>E-mail: </label>
            <input type="text" placeholder="seuemail@dominio.com" value={email} onChange={(e)=> setEmail(e.target.value)} /><br/>
            <label>Senha: </label>
            <input  type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)}/><br/>
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
          </form>
          <Link to="/">Já tem uma conta? Clique aqui!</Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;
  