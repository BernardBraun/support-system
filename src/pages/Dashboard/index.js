import { useEffect, useState } from "react";

import firebase from '../../services/firebaseConnection';
import './styles.css';
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../../components/Modal";

const listRef = firebase.firestore().collection('tickets').orderBy('created', 'desc');

export default function Dashboard(){
    const[chamados, setChamados] = useState([]);
    const[loading, setLoading] = useState(true);
    const[loadingMore, setLoadingMore] = useState(false);
    const[isEmpty,setIsEmpty] = useState(false);
    const[lastDocs,setLastDocs] = useState();
    const[showPostModal, setShowPostModal] = useState(false);
    const[detail, setDetail] = useState();

    useEffect(() => {

        async function loadChamados(){
            await listRef.limit(10)
            .get()
            .then((snapshot)=>{
                updateState(snapshot);
            })
            .catch((error)=>{
                console.log(error);
                setLoadingMore(false);
            })
            setLoading(false);
        }

        loadChamados();
        return() => {}

    },[]);

    

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let list = [];

            snapshot.forEach((doc)=>{
                list.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length-1]

            setChamados(chamados => [...chamados,...list])
            setLastDocs(lastDoc);
        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore(){
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    function togglePostModal(item){
        setShowPostModal(!showPostModal);
        setDetail(item)
    }

    if(loading){
        return(
            <div>
                <Header />
                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }
    
    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25} />
                </Title>

                {chamados.length === 0 ? (

                    
                    <div className="container dashboard">
                    <span>Nenhum chamado registrado</span>
                    <Link to="/new" className="new">
                        <FiPlus size={25} color="#FFF" />
                        Novo chamado
                    </Link>
                </div>
                ) : (
                    <>
                    <Link to="/new" className="new">
                        <FiPlus size={25} color="#FFF" />
                        Novo chamado
                    </Link>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Cliente</th>
                                <th scope="col">Assunto</th>
                                <th scope="col">Status</th>
                                <th scope="col">Data de cadastro</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamados.map((item, index)=>{
                                return(
                                    <tr>
                                        <td data-label="Cliente">{item.cliente}</td>
                                        <td data-label="Assunto">{item.assunto}</td>
                                        <td data-label="Status"><span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status === 'Em atendimento'?'#00ccff':'#999'}}>{item.status}</span></td>
                                        <td data-label="Cadastrado">{item.createdFormated}</td>
                                        <td data-label="#"><button className="action" style={{backgroundColor:'#5cb85c'}} onClick={() => togglePostModal(item)}><FiSearch color="#FFF" size={27}/></button>
                                                           <Link to={`/new/${item.id}`} className="action" style={{backgroundColor:'#f6a935'}}><FiEdit2 color="#FFF" size={27}/></Link></td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                    {loadingMore && <h3 style={{textAlign:'center', marginTop: 15}}>Buscando dados...</h3>}
                    {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button> }
                    </>
                )}
            </div>
            {showPostModal && (
                <Modal 
                    conteudo={detail}
                    close={togglePostModal}
                />
            )}
        </div>
    )
}

/*
{!loadingMore && !isEmpty <button className="btn-more" onClick={() => {}}>Buscar mais</button> }
*/