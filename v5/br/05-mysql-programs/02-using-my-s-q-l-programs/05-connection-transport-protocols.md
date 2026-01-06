### 4.2.5 Protocolos de transporte de conexão

Para os programas que utilizam a biblioteca de clientes MySQL (por exemplo, **mysql** e **mysqldump**), o MySQL suporta conexões ao servidor com base em vários protocolos de transporte: TCP/IP, socket de Unix, canal nomeado e memória compartilhada. Esta seção descreve como selecionar esses protocolos e como eles são semelhantes e diferentes.

- Seleção do Protocolo de Transporte
- Suporte de transporte para conexões locais e remotas
- Interpretação de localhost
- Características de criptografia e segurança
- Compressão de conexão

#### Seleção do Protocolo de Transporte

Para uma conexão específica, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão de arquivo de soquete em sistemas Unix e Unix-like, e uma conexão TCP/IP a `127.0.0.1` de outra forma. Para obter informações adicionais, consulte a Seção 4.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. A tabela a seguir mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao maiúsculas e minúsculas.

<table summary="Valores do protocolo de transporte permitidos, o protocolo de transporte utilizado como resultado e as plataformas aplicáveis para cada valor."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col"><a class="link" href="connection-options.html#option_general_protocol">[[<code class="option">--protocol</code>]]</a>Valor</th> <th scope="col">Protocolo de transporte utilizado</th> <th scope="col">Plataformas aplicáveis</th> </tr></thead><tbody><tr> <th scope="row">[[<code class="literal">TCP</code>]]</th> <td>TCP/IP</td> <td>Tudo</td> </tr><tr> <th scope="row">[[<code class="literal">SOCKET</code>]]</th> <td>Arquivo de soquete Unix</td> <td>Unix e sistemas semelhantes ao Unix</td> </tr><tr> <th scope="row">[[<code class="literal">PIPE</code>]]</th> <td>Canais nomeados</td> <td>Windows</td> </tr><tr> <th scope="row">[[<code class="literal">MEMORY</code>]]</th> <td>Memória compartilhada</td> <td>Windows</td> </tr></tbody></table>

#### Suporte de transporte para conexões locais e remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportadores socket-file, named-pipe e compartilhamento de memória suportam conexões apenas a servidores MySQL locais. (O transportador named-pipe permite conexões remotas, mas essa capacidade não é implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

- Em sistemas Unix e Unix-like, uma conexão com `localhost` resulta em uma conexão de arquivo de soquete.

- Caso contrário, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado em relação a esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1` em todas as plataformas.

#### Características de criptografia e segurança

Os transportes TCP/IP e socket-file estão sujeitos à criptografia TLS/SSL, usando as opções descritas nas Opções de comando para conexões criptografadas. Os transportes Named-pipe e compartilhamento de memória não estão sujeitos à criptografia TLS/SSL.

Uma conexão é segura por padrão se feita por meio de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos que estão sujeitos à criptografia TLS/SSL, uma conexão pode ser feita segura usando criptografia:

- As conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.

- As conexões de arquivo de soquete são seguras por padrão. Elas também podem ser criptografadas, mas criptografar uma conexão de arquivo de soquete não a torna mais segura e aumenta a carga da CPU.

- As conexões de canal nomeado não são seguras por padrão e não estão sujeitas à criptografia para serem seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários do MySQL têm permissão para usar conexões de canal nomeado.

- As conexões de memória compartilhada são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver habilitada, o servidor permite apenas conexões que utilizam algum tipo de transporte seguro. De acordo com as observações anteriores, as conexões que utilizam TCP/IP criptografado usando TLS/SSL, um arquivo de soquete ou memória compartilhada são conexões seguras. As conexões TCP/IP não criptografadas usando TLS/SSL e as conexões de named pipe não são seguras.

Veja também Configurar conexões criptografadas como obrigatórias.

#### Compressão de conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se compressão e criptografia forem usadas para uma conexão específica, a compressão ocorrerá antes da criptografia. Para mais informações, consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.
