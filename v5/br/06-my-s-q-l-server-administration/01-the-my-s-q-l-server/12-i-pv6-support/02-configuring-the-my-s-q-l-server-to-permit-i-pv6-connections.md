#### 5.1.12.2 Configurando o servidor MySQL para permitir conexões IPv6

O servidor MySQL escuta em uma única porta de rede para conexões TCP/IP. Essa porta está vinculada a um único endereço, mas é possível que um endereço seja mapeado para múltiplas interfaces de rede. Para especificar um endereço, defina `bind_address=addr` no início do servidor, onde *`addr`* é um endereço IPv4 ou IPv6 ou um nome de host. Para obter detalhes, consulte a descrição de `bind_address` em Seção 5.1.7, “Variáveis do Sistema do Servidor”.
