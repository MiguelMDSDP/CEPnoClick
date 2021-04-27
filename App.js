// ---------- IMPORTAÇÕES ----------
import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  ImageBackground,
  View,
  TextInput,
  Pressable,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';

import titleImage from "./images/title.png";
import backgroundImage from "./images/background.png";
// ---------------------------------


const App = () => {
  // ---------- DECLARAÇÕES DOS ESTADOS ----------
  const [CEP, setCEP] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  // ---------------------------------------------

  // ---------- INCLUSÃO DA MÁSCARA NO INPUT ----------
  const handleCEPChange = (value) => {
    if (value.length > 5) {
      if (value.includes('-')) {
        setCEP(`${value.slice(0, 5)}-${value.slice(6, 9)}`);
      } else {
        setCEP(`${value.slice(0, 5)}-${value.slice(5, 8)}`);
      } 
    } else {
      setCEP(value);
    }
  }
  // --------------------------------------------------

  // ---------- FUNÇÃO QUE É EXECUTADA QUANDO O BOTÃO ----------
  // ----------- DE BUSCA É PRESSIONADO (REQUISIÇÃO) -----------
  const searchCEP = async () => {
    setLoading(true);
    await fetch(`https://viacep.com.br/ws/${CEP.slice(0, 5)}${CEP.slice(6, 9)}/json/`)
      .then((response) => response.json()) // Espera da resposta e decodificação
      .then((json) => { // Espera da codificação para alteração dos estados
      
        // Se a resposta vier com um campo de erro,
        // anuncia o erro para a aplicação
        if (json.erro) {
          setError("CEP não encontrado!");
          setAddress(null);
        } else {
        // Se não existir erro, altera o estado
        // que armazena o endereço
          setAddress(json);
          setError(null);
        }
      })
      .catch((error) => { // Tratamento de erro, caso a requisição seja feita de forma errada
        setAddress(null);
        setError("Erro interno do sistema!");
      });
    setLoading(false);
  }
  // -----------------------------------------------------------

  const handleSearch = async () => {
    setModalVisible(true);
    searchCEP();
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Image style={styles.titleImage}
          source={titleImage}
        />
        <TextInput style={styles.input}
          value={CEP}
          placeholder="Digite o CEP"
          onChangeText={handleCEPChange}
        />
        <Pressable
          style={CEP.length === 9 ? styles.enabledButton : styles.disabledButton}
          disabled={CEP.length === 9 ? false : true}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>{`Buscar`}</Text>
        </Pressable>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            {loading ? (
              <ActivityIndicator size="large" color="ffdf2b" />
            ) : (
              error ? (
                <>
                  {/* Mostra o erro, caso exista */}
                  <Text style={styles.title}>Erro!</Text>
                  <Text style={styles.text}>{error}</Text>
                </>
              ) : address ? (
                <>
                  {/* Mostra os dados do endereço, proveniente da API ViaCEP */}
                  <Text style={styles.title}>Informações</Text>
                  <Text style={styles.text}>{`CEP: ${address.cep}`}</Text>
                  <Text style={styles.text}>{`Logradouro: ${address.logradouro || 'Não informado'}`}</Text>
                  <Text style={styles.text}>{`Complemento: ${address.complemento || 'Não informado'}`}</Text>
                  <Text style={styles.text}>{`Bairro: ${address.bairro || 'Não informado'}`}</Text>
                  <Text style={styles.text}>{`Localidade: ${address.localidade || 'Não informado'}`}</Text>
                  <Text style={styles.text}>{`UF: ${address.uf || 'Não informado'}`}</Text>
                </>
              ) : (
                <>
                </>
              )
            )}
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{`Fechar`}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


// ---------- Estilizações ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  background: {
    flex: 1,
    alignSelf: 'stretch',
    resizeMode: "cover",
    alignItems: 'center',
    justifyContent: "center"
  },

  titleImage: {
    width: 230,
    height: 150,
    marginBottom: 75
  },

  input: {
    width: 275,
    height: 50,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: "#59522a",
    marginBottom: 75,
    borderRadius: 25,
    backgroundColor: "#fff",
  },

  enabledButton: {
    width: 150,
    height: 45,
    borderRadius: 20,
    backgroundColor: "#ffdf2b"
  },

  disabledButton: {
    width: 150,
    height: 45,
    borderRadius: 20,
    backgroundColor: "#ffdf2baa"
  },

  buttonText: {
    color: "#59522a",
    fontSize: 18,
    lineHeight: 45,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  modalView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  centeredView: {
    width: 350,
    height: 700,
    marginTop: 22,
    alignItems: "center",
    borderColor: "#59522a",
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: "center",
    backgroundColor: "#eaeaea",
  },

  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },

  text: {
    margin: 5,
    fontSize: 16,
    textAlign: 'center'
  },

  modalButton: {
    width: 120,
    height: 40,
    marginTop: 50,
    borderRadius: 15,
    backgroundColor: "#ffdf2b"
  },

  modalButtonText: {
    color: "#59522a",
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 38,
    fontWeight: 'bold',
  },

  mapContainer: {
    height: 300,
    width: 300
  },

  map: {
    flex: 1
  }
});
// ----------------------------------


export default App; // Exportação do componente
