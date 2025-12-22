### 6.2.7 Protocolos de transporte de ligação

Para programas que usam a biblioteca do cliente MySQL (por exemplo, `mysql` e `mysqldump`), o MySQL suporta conexões com o servidor com base em vários protocolos de transporte: TCP/IP, arquivo de soquete Unix, named pipe e memória compartilhada.

- Seleção do protocolo de transporte
- Apoio ao transporte para ligações locais e remotas
- Interpretação de localhost
- Características de encriptação e segurança
- Compressão de conexão

#### Seleção do protocolo de transporte

Para uma conexão dada, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões para `localhost` resultam em uma conexão de arquivo de soquete em sistemas Unix e Unix-like, e uma conexão TCP/IP para `127.0.0.1` de outra forma. Para informações adicionais, consulte a Seção 6.2.4, Conectando ao Servidor MySQL Usando Opções de Comando.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. A tabela a seguir mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis a maiúsculas e minúsculas.

<table><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col">[<code class="option">--protocol</code>] Valor</th> <th scope="col">Protocolo de transporte utilizado</th> <th scope="col">Plataformas aplicáveis</th> </tr></thead><tbody><tr> <th>[[<code>TCP</code>]]</th> <td>TCP/IP</td> <td>Todos</td> </tr><tr> <th>[[<code>SOCKET</code>]]</th> <td>Arquivo de soquete Unix</td> <td>Unix e sistemas semelhantes a Unix</td> </tr><tr> <th>[[<code>PIPE</code>]]</th> <td>Tubo com nome</td> <td>Vidros</td> </tr><tr> <th>[[<code>MEMORY</code>]]</th> <td>Memória partilhada</td> <td>Vidros</td> </tr></tbody></table>

#### Apoio ao transporte para ligações locais e remotas

O transporte TCP/IP suporta conexões com servidores MySQL locais ou remotos.

Socket-file, named-pipe e shared-memory transport suportam conexões apenas para servidores MySQL locais.

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, o `localhost` é interpretado do seguinte modo:

- Em sistemas Unix e semelhantes a Unix, uma conexão com `localhost` resulta em uma conexão de arquivo de soquete.
- Caso contrário, uma conexão para `localhost` resulta em uma conexão TCP/IP para `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado em relação a esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1` em todas as plataformas.

#### Características de encriptação e segurança

TCP/IP e socket-file transportes estão sujeitos a criptografia TLS/SSL, usando as opções descritas em Opções de comando para conexões criptografadas.

Uma conexão é segura por padrão se feita através de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos que estão sujeitos a criptografia TLS / SSL, uma conexão pode ser protegida usando criptografia:

- As conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.
- As conexões socket-file são seguras por padrão. Eles também podem ser criptografados, mas criptografar uma conexão socket-file não a torna mais segura e aumenta a carga da CPU.
- As conexões de name-pipe não são seguras por padrão, e não estão sujeitas a criptografia para torná-las seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários do MySQL estão autorizados a usar conexões de name-pipe.
- As conexões de memória compartilhada são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver ativada, o servidor só permitirá conexões que usem alguma forma de transporte seguro. De acordo com as observações anteriores, as conexões que usam TCP/IP criptografadas usando TLS/SSL, um arquivo de soquete ou memória compartilhada são conexões seguras. As conexões TCP/IP não criptografadas usando TLS/SSL e as conexões de tubo nomeado não são seguras.

Ver também Configurar conexões criptografadas como obrigatórias.

#### Compressão de conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se a compressão e a criptografia forem usadas para uma determinada conexão, a compressão ocorre antes da criptografia.
