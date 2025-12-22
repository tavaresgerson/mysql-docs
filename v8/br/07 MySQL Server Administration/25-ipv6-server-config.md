#### Configuração do servidor MySQL para permitir conexões IPv6

O servidor MySQL escuta em um ou mais soquetes de rede para conexões TCP / IP. Cada soquete é vinculado a um endereço, mas é possível que um endereço seja mapeado em várias interfaces de rede.

Configure a variável de sistema `bind_address` no início do servidor para especificar as conexões TCP/IP que uma instância de servidor aceita. Você pode especificar vários valores para essa opção, incluindo qualquer combinação de endereços IPv6, endereços IPv4 e nomes de host que resolvam para endereços IPv6 ou IPv4. Alternativamente, você pode especificar um dos formatos de endereço com código-fonte que permitem ouvir em várias interfaces de rede. Um valor de \*, que é o padrão, ou um valor de `::`, permite conexões IPv4 e IPv6 em todas as interfaces de host IPv4 e IPv6. Para mais informações, consulte a descrição `bind_address` na Seção 7.1.8, Server System Variables.
