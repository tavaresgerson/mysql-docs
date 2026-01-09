### 8.3.5 Reutilização de Sessões SSL

Os programas clientes do MySQL podem optar por retomar uma sessão SSL anterior, desde que o servidor tenha a sessão em seu cache de execução. Esta seção descreve as condições que são favoráveis para a reutilização de sessões SSL, as variáveis do servidor usadas para gerenciar e monitorar o cache de sessões e as opções de linha de comando do cliente para armazenar e reutilizar os dados da sessão.

* Configuração e Monitoramento de Execução no Servidor para Reutilização de Sessões SSL
* Configuração no Cliente para Reutilização de Sessões SSL

Cada troca completa de TLS pode ser custosa tanto em termos de computação quanto de sobrecarga de rede, sendo menos custosa se o TLSv1.3 for usado. Ao extrair um ticket de sessão de uma sessão estabelecida e então submeter esse ticket ao estabelecer a próxima conexão, o custo geral é reduzido se a sessão puder ser reutilizada. Por exemplo, considere o benefício de ter páginas da web que podem abrir múltiplas conexões e gerar mais rápido.

Em geral, as seguintes condições devem ser satisfeitas antes que as sessões SSL possam ser reutilizadas:

* O servidor deve manter seu cache de sessão na memória.
* O tempo de expiração do cache de sessão no lado do servidor não deve ter expirado.
* Cada cliente deve manter um cache de sessões ativas e mantê-lo seguro.

As aplicações C podem usar as capacidades da API C para habilitar a reutilização de sessões para conexões criptografadas (veja Reutilização de Sessões SSL).

#### Configuração e Monitoramento de Execução no Servidor para Reutilização de Sessões SSL

Para criar o contexto inicial do TLS, o servidor usa os valores que as variáveis de sistema relacionadas ao contexto têm ao iniciar. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. A tabela a seguir mostra as variáveis de sistema que definem o cache de sessão de execução do servidor e as variáveis de status correspondentes que expor os valores atualmente ativos do cache de sessão.

**Tabela 8.13 Variáveis de Sistema e Status para Reutilização de Sessão**

<table summary="As variáveis de sistema que definem o cache para a reutilização de sessão e as variáveis de status correspondentes que expor os valores ativos do cache de sessão."><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Nome da Variável de Sistema</th> <th>Nome da Variável de Status Correspondente</th> </tr></thead><tbody><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_session_cache_mode"><code>ssl_session_cache_mode</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_mode"><code>Ssl_session_cache_mode</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_session_cache_timeout"><code>ssl_session_cache_timeout</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_timeout"><code>Ssl_session_cache_timeout</code></a></td> </tr></tbody></table>

Nota

Quando o valor da variável de servidor `ssl_session_cache_mode` é `ON`, que é o modo padrão, o valor da variável de status `Ssl_session_cache_mode` é `SERVER`.

As variáveis de cache de sessão SSL aplicam-se tanto aos canais TLS `mysql_main` quanto `mysql_admin`. Seus valores também são exibidos como propriedades na tabela do Schema de Desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o cache de sessão SSL em tempo de execução, use este procedimento:

1. Defina cada variável de sistema relacionada ao cache que deve ser alterada para seu novo valor. Por exemplo, mude o valor do tempo de espera do cache do padrão (300 segundos) para 600 segundos:

   ```
   mysql> SET GLOBAL ssl_session_cache_timeout = 600;
   ```

   Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à maneira como o procedimento de reconfiguração funciona.

   ```
   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 300   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

   Para obter informações adicionais sobre a definição de valores de variáveis, consulte Atribuição de Variáveis de Sistema.

2. Execute `ALTER INSTANCE RELOAD TLS`. Esta instrução reconfigura o contexto TLS ativo a partir dos valores atuais das variáveis de sistema relacionadas ao cache. Também define as variáveis de status relacionadas ao cache para refletir os novos valores ativos do cache. A instrução requer o privilégio `CONNECTION_ADMIN`.

   ```
   mysql> ALTER INSTANCE RELOAD TLS;
   Query OK, 0 rows affected (0.01 sec)

   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

   Novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` usam o novo contexto TLS. As conexões existentes permanecem inalteradas.

#### Configuração do Lado do Cliente para Reutilização de Sessões SSL

Todos os programas cliente MySQL são capazes de reutilizar uma sessão anterior para novas conexões criptografadas feitas para o mesmo servidor, desde que você tenha armazenado os dados da sessão enquanto a conexão original ainda estava ativa. Os dados da sessão são armazenados em um arquivo e você especifica esse arquivo ao invocar o cliente novamente.

Para armazenar e reutilizar os dados da sessão SSL, use este procedimento:

1. Inicie o **mysql** para estabelecer uma conexão criptografada com um servidor que esteja executando o MySQL 9.5.

2. Use o comando **ssl\_session\_data\_print** para especificar o caminho de um arquivo onde você pode armazenar os dados da sessão atualmente ativos de forma segura. Por exemplo:

   ```
   mysql> ssl_session_data_print ~/private-dir/session.txt
   ```

   Os dados da sessão são obtidos na forma de uma string ANSI codificada PEM, terminada por `\0`. Se você omitir o caminho e o nome do arquivo, a string é impressa na saída padrão.

3. Do prompt do seu interpretador de comandos, inicie qualquer programa cliente MySQL para estabelecer uma nova conexão criptografada ao mesmo servidor. Para reutilizar os dados da sessão, especifique a opção de linha de comando `--ssl-session-data` e o argumento de arquivo.

   Por exemplo, estabeleça uma nova conexão usando **mysql**:

   ```
   mysql -u admin -p --ssl-session-data=~/private-dir/session.txt
   ```

   e depois o cliente **mysqlshow**:

   ```
   mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
   Enter password: *****
   +--------------------+
   |     Databases      |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   | world              |
   +--------------------+
   ```

   Em cada exemplo, o cliente tenta retomar a sessão original enquanto estabelece uma nova conexão ao mesmo servidor.

   Para confirmar se o **mysql** reutilizou uma sessão, veja a saída do comando `status`. Se a conexão **mysql** atualmente ativa retomar a sessão, as informações de status incluem `SSL session reused: true`.

Além de **mysql** e **mysqlshow**, a reutilização de sessão SSL se aplica a **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqlbinlog**, **mysqlimport**, **mysqlslap**, **mysqltest**, **mysql\_migrate\_keyring** e **mysql\_secure\_installation**.

Várias condições podem impedir a recuperação bem-sucedida dos dados da sessão. Por exemplo, se a sessão não estiver totalmente conectada, não é uma sessão SSL, o servidor ainda não enviou os dados da sessão ou a sessão SSL simplesmente não é reutilizável. Mesmo com os dados da sessão armazenados corretamente, o cache de sessão do servidor pode expirar. Independentemente da causa, um erro é retornado por padrão se você especificar `--ssl-session-data`, mas a sessão não puder ser reutilizada. Por exemplo:

Para suprimir a mensagem de erro e estabelecer a conexão criando silenciosamente uma nova sessão, especifique `--ssl-session-data-continue-on-failed-reuse` na linha de comando, juntamente com `--ssl-session-data`. Se o tempo limite de cache do servidor expirar, você pode armazenar os dados da sessão novamente no mesmo arquivo. O tempo limite de cache do servidor padrão pode ser estendido (consulte Configuração e monitoramento do tempo de execução no lado do servidor para reutilização de sessões SSL).