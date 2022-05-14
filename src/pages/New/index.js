import { useState, useEffect, useContext } from 'react';
import firebase from '../../services/firebaseConnection'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import './styles.css';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

export default function New(){
    const {id} = useParams();
    const history = useHistory();
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);


    const [assunto,setAssunto] = useState('Suporte');
    const [status,setStatus] = useState('Aberto');
    const [complemento,setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const {user} = useContext(AuthContext);

    useEffect(() =>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        cliente: doc.data().cliente
                    })
                })
                if(lista.length === 0){
                    console.log('Não tem nada aqui!')
                    setCustomers([{id: '1', cliente: 'FREELA'}]);
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false);

                if(id){
                    loadId(lista);
                }
            })
            .catch((error)=>{
                console.log('Deu algum erro')
                setLoadCustomers(false);
                setCustomers([{id: '1', cliente: ''}]);
            })
        }
        loadCustomers();
    }, [id]);

    async function loadId(lista){
        await firebase.firestore().collection('tickets').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error)=>{
            console.lof(error);
            setIdCustomer(false);
        })
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('tickets')
            .doc(id)
            .update({
                cliente: customers[customerSelected].cliente,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado editado com sucesso!');
                setCustomerSelected(0);
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((error)=>{
                toast.error('Ops! Erro ao registrar!');
                console.log(error)
            })
            return;
        }

        await firebase.firestore().collection('tickets')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].cliente,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado registrado com sucesso!');
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch((error)=>{
            toast.error('Erro ao registrar o chamado. Tente novamente mais tarde!');
            console.log(error);
        })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e){
        console.log('Index:', e.target.value);
        console.log('Cliente: ', customers[e.target.value])
        setCustomerSelected(e.target.value);
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Novo chamado">
                    <FiPlus size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile chamados' onSubmit={handleRegister}>
                        <label>Cliente:</label>
                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers} >
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.cliente}
                    </option>
                  )
                })}
              </select>
                        )

                        }
                        
                        <label>Assunto:</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option key={1} value="Suporte">
                                Suporte
                            </option>
                            <option key={2} value="Visita Tecnica">
                                Visita Técnica
                            </option>
                            <option key={3} value="Financeiro">
                                Financeiro
                            </option>
                        </select>
                        <label>Status</label>
                        <div className='status'>
                            <input type='radio' name='radio' value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'}/><span> Em aberto </span>
                            <input type='radio' name='radio' value="Em atendimento" onChange={handleOptionChange} checked={status === 'Em atendimento'}/><span> Em atendimento </span>
                            <input type='radio' name='radio' value="Encerrado" onChange={handleOptionChange} checked={status === 'Encerrado'}/><span> Encerrado </span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text" placeholder='Descreva seu problema (opcional).' value={complemento} onChange={(e) => setComplemento(e.target.value)}/>
                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}