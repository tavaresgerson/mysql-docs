### 6.2.7 Protocolos de Transporte de Conexão

Para programas que utilizam a biblioteca de cliente MySQL (por exemplo, **mysql** e **mysqldump**), o MySQL suporta conexões ao servidor com base em vários protocolos de transporte: TCP/IP, soquete de Unix, canal nomeado e memória compartilhada. Esta seção descreve como selecionar esses protocolos e como eles são semelhantes e diferentes.

* Seleção do Protocolo de Transporte
* Suporte ao Transporte para Conexões Locais e Remotas
* Interpretação de localhost
* Características de Criptografia e Segurança
* Compressão de Conexão

#### Seleção do Protocolo de Transporte

Para uma conexão dada, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão de arquivo de soquete em sistemas Unix e Unix-like, e uma conexão TCP/IP a `127.0.0.1` de outra forma. Para obter informações adicionais, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. A tabela a seguir mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são case-sensitive.

<table summary="Valores do protocolo de transporte permitidos, o protocolo de transporte resultante e as plataformas aplicáveis para cada valor."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th><a class="link" href="connection-options.html#option_general_protocol"><code>--protocol</code></a> Value</th> <th>Transport Protocol Used</th> <th>Applicable Platforms</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>TCP/IP</td> <td>Todas</td> </tr><tr> <th><code>SOCKET</code></th> <td>Arquivo de soquete Unix</td> <td>Sistemas Unix e similares</td> </tr><tr> <th><code>PIPE</code></th> <td>Tubo nomeado</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Memória compartilhada</td> <td>Windows</td> </tr></tbody></table>

#### Suporte de Transporte para Conexões Locais e Remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportes de arquivo de soquete, tubo nomeado e memória compartilhada suportam conexões apenas a servidores MySQL locais. (O transporte de tubo nomeado permite conexões remotas, mas essa capacidade não é implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

* Em sistemas Unix e similares, uma conexão a `localhost` resulta em uma conexão de arquivo de soquete.

* Caso contrário, uma conexão a `localhost` resulta em uma conexão TCP/IP a `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado em relação a esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1` em todas as plataformas.

#### Características de Criptografia e Segurança

Os transportes TCP/IP e socket-file estão sujeitos à criptografia TLS/SSL, usando as opções descritas nas Opções de Comando para Conexões Criptografadas. Os transportes named-pipe e shared-memory não estão sujeitos à criptografia TLS/SSL.

Uma conexão é segura por padrão se feita através de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos que estão sujeitos à criptografia TLS/SSL, uma conexão pode ser feita segura usando criptografia:

* Conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.
* Conexões socket-file são seguras por padrão. Elas também podem ser criptografadas, mas criptografar uma conexão socket-file não a torna mais segura e aumenta a carga da CPU.
* Conexões named-pipe não são seguras por padrão e não estão sujeitas à criptografia para torná-las seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários do MySQL têm permissão para usar conexões named-pipe.
* Conexões shared-memory são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver habilitada, o servidor permite apenas conexões que usam alguma forma de transporte seguro. De acordo com as observações anteriores, conexões que usam TCP/IP criptografado usando TLS/SSL, um arquivo socket ou memória compartilhada são conexões seguras. Conexões TCP/IP não criptografadas usando TLS/SSL e conexões named-pipe não são seguras.

Veja também Configurando Conexões Criptografadas como Obrigatórias.

#### Compressão de Conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se compressão e criptografia forem usadas para uma conexão específica, a compressão ocorrerá antes da criptografia. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.