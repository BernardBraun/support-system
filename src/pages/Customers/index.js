import './styles.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import firebase from '../../services/firebaseConnection';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';


export default function Customers(){
    const [cliente,setCliente] = useState('');
    const [endereco,setEndereco] = useState('');
    const [cnpj,setCnpj] = useState('');

    async function handleAdd(e){
        e.preventDefault();
       
        if(cliente !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                cliente: cliente,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=>{
                setCliente('');
                setCnpj('');
                setEndereco('');
                toast.info('Empresa cadastrada com sucesso');
            })
            .catch((error)=>{
                toast.error('Erro ao cadastrar a empresa');
            })
        }else{
            toast.error('Preencha todos os campos!');
        }
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>
                <div className='container' >
                    <form className='form-profile costumers' onSubmit={handleAdd}>
                        <label>Nome do cliente</label>
                        <input type="text" placeholder="Nome da empresa aqui" value={cliente} onChange={ (e) => setCliente(e.target.value)}/>
                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ da empresa aqui" value={cnpj} onChange={ (e) => setCnpj(e.target.value)}/>
                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa aqui" value={endereco} onChange={ (e) => setEndereco(e.target.value)}/>
                        <button type='submit'>Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}