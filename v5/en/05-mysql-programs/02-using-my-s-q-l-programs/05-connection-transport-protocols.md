### 4.2.5 Protocolos de Transporte de Conexão

Para programas que utilizam a biblioteca cliente MySQL (por exemplo, **mysql** e **mysqldump**), o MySQL suporta conexões ao server baseadas em diversos protocolos de transporte: TCP/IP, arquivo de socket Unix, named pipe (pipe nomeado) e shared memory (memória compartilhada). Esta seção descreve como selecionar esses protocolos e quais são suas similaridades e diferenças.

* Seleção do Protocolo de Transporte
* Suporte de Transporte para Conexões Locais e Remotas
* Interpretação de localhost
* Criptografia e Características de Segurança
* Compressão de Conexão

#### Seleção do Protocolo de Transporte

Para uma dada conexão, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão por arquivo de socket em sistemas Unix e similares a Unix, e uma conexão TCP/IP para `127.0.0.1` caso contrário. Para informações adicionais, consulte a Seção 4.2.4, “Conectando-se ao Servidor MySQL Usando Opções de Comando”.

Para especificar o protocolo explicitamente, utilize a opção de comando `--protocol`. A tabela a seguir mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não diferenciam maiúsculas de minúsculas.

<table summary="Valores permitidos para o protocolo de transporte, o protocolo de transporte resultante utilizado e as plataformas aplicáveis para cada valor."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th>Valor de <code>--protocol</code></th> <th>Protocolo de Transporte Utilizado</th> <th>Plataformas Aplicáveis</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>TCP/IP</td> <td>Todas</td> </tr><tr> <th><code>SOCKET</code></th> <td>Arquivo de socket Unix</td> <td>Sistemas Unix e similares a Unix</td> </tr><tr> <th><code>PIPE</code></th> <td>Named pipe (Pipe nomeado)</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Shared memory (Memória compartilhada)</td> <td>Windows</td> </tr> </tbody></table>

#### Suporte de Transporte para Conexões Locais e Remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportes por arquivo de socket, named-pipe e shared-memory suportam conexões apenas a servidores MySQL locais. (O transporte named-pipe permite conexões remotas, mas essa capacidade não está implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

* Em sistemas Unix e similares a Unix, uma conexão a `localhost` resulta em uma conexão por arquivo de socket.

* Caso contrário, uma conexão a `localhost` resulta em uma conexão TCP/IP para `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado em relação a esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão a `localhost` resulta em uma conexão TCP/IP para `127.0.0.1` em todas as plataformas.

#### Criptografia e Características de Segurança

Os transportes TCP/IP e por arquivo de socket estão sujeitos à criptografia TLS/SSL, usando as opções descritas em Opções de Comando para Conexões Criptografadas. Os transportes named-pipe e shared-memory não estão sujeitos à criptografia TLS/SSL.

Uma conexão é segura por padrão se for feita por meio de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos sujeitos à criptografia TLS/SSL, uma conexão pode ser tornada segura utilizando criptografia:

* Conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.

* Conexões por arquivo de socket são seguras por padrão. Elas também podem ser criptografadas, mas criptografar uma conexão por arquivo de socket não a torna mais segura e aumenta a carga da CPU.

* Conexões named-pipe não são seguras por padrão e não estão sujeitas à criptografia para torná-las seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários MySQL têm permissão para usar conexões named-pipe.

* Conexões shared-memory são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver habilitada, o server permite apenas conexões que utilizam alguma forma de transporte seguro. De acordo com as observações anteriores, conexões que utilizam TCP/IP criptografado via TLS/SSL, um arquivo de socket ou shared memory são conexões seguras. Conexões TCP/IP não criptografadas usando TLS/SSL e conexões named-pipe não são seguras.

Consulte também Configurando Conexões Criptografadas como Obrigatórias.

#### Compressão de Conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o client e o server. Se tanto a compressão quanto a criptografia forem utilizadas para uma dada conexão, a compressão ocorre antes da criptografia. Para mais informações, consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.