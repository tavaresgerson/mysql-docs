### 6.2.7 Protocolos de Transporte de Conexão

Para programas que utilizam a biblioteca de cliente MySQL (por exemplo, `mysql` e `mysqldump`), o MySQL suporta conexões ao servidor com base em vários protocolos de transporte: TCP/IP, socket de arquivo Unix, canal nomeado e memória compartilhada. Esta seção descreve como selecionar esses protocolos e como eles são semelhantes e diferentes.

*  Seleção do Protocolo de Transporte
*  Suporte ao Transporte para Conexões Locais e Remotas
*  Interpretação de localhost
*  Características de Criptografia e Segurança
*  Compressão de Conexão

#### Seleção do Protocolo de Transporte

Para uma conexão dada, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão de arquivo socket em sistemas Unix e Unix-like, e uma conexão TCP/IP a `127.0.0.1` de outra forma. Para informações adicionais, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. A tabela a seguir mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são case-sensitive.

<table><thead><tr> <th><code>--protocol</code> Value</th> <th>Protocolo de Transporte Usado</th> <th>Plataformas Aplicaveis</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>TCP/IP</td> <td>Todas</td> </tr><tr> <th><code>SOCKET</code></th> <td>Socket de arquivo Unix</td> <td>Unix e sistemas Unix-like</td> </tr><tr> <th><code>PIPE</code></th> <td>Canal nomeado</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Memória compartilhada</td> <td>Windows</td> </tr></tbody></table>

#### Suporte ao Transporte para Conexões Locais e Remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportes socket-file, named-pipe e compartilhamento de memória suportam conexões apenas a servidores MySQL locais. (O transporte named-pipe permite conexões remotas, mas essa capacidade não é implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

* Em sistemas Unix e Unix-like, uma conexão a `localhost` resulta em uma conexão socket-file.
* Caso contrário, uma conexão a `localhost` resulta em uma conexão TCP/IP a `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado respeitando esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão a `localhost` resulta em uma conexão TCP/IP a `127.0.0.1` em todas as plataformas.

#### Características de criptografia e segurança

Os transportes TCP/IP e socket-file estão sujeitos à criptografia TLS/SSL, usando as opções descritas nas Opções de comando para conexões criptografadas. Os transportes named-pipe e compartilhamento de memória não estão sujeitos à criptografia TLS/SSL.

Uma conexão é segura por padrão se feita através de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos que estão sujeitos à criptografia TLS/SSL, uma conexão pode ser feita segura usando criptografia:

* Conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.
* Conexões socket-file são seguras por padrão. Elas também podem ser criptografadas, mas criptografar uma conexão socket-file não a torna mais segura e aumenta a carga do CPU.
* Conexões named-pipe não são seguras por padrão e não estão sujeitas à criptografia para torná-las seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários do MySQL podem usar conexões named-pipe.
* Conexões compartilhamento de memória são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver habilitada, o servidor permite apenas conexões que utilizam alguma forma de transporte seguro. De acordo com as observações anteriores, as conexões que utilizam TCP/IP criptografado usando TLS/SSL, um arquivo de soquete ou memória compartilhada são conexões seguras. As conexões TCP/IP não criptografadas usando TLS/SSL e as conexões de named pipe não são seguras.

Veja também Configurando Conexões Criptografadas como Obrigatórias.

#### Compressão de Conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se a compressão e a criptografia forem usadas para uma conexão específica, a compressão ocorrerá antes da criptografia. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.