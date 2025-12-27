### 8.3.5 Reutilizando Sessões SSL

Os programas de cliente MySQL podem optar por retomar uma sessão SSL anterior, desde que o servidor tenha a sessão em seu cache de execução. Esta seção descreve as condições que são favoráveis para a reutilização de sessões SSL, as variáveis do servidor usadas para gerenciar e monitorar o cache de sessões e as opções de linha de comando do cliente para armazenar e reutilizar os dados da sessão.

* Configuração e Monitoramento de Execução do Servidor para Reutilização de Sessões SSL
* Configuração do Cliente para Reutilização de Sessões SSL

Cada troca completa de TLS pode ser custosa tanto em termos de computação quanto de sobrecarga de rede, menos custosa se o TLSv1.3 for usado. Ao extrair um ticket de sessão de uma sessão estabelecida e então submeter esse ticket ao estabelecer a próxima conexão, o custo geral é reduzido se a sessão puder ser reutilizada. Por exemplo, considere o benefício de ter páginas da web que podem abrir múltiplas conexões e gerar mais rápido.

Em geral, as seguintes condições devem ser satisfeitas antes que as sessões SSL possam ser reutilizadas:

* O servidor deve manter seu cache de sessão em memória.
* O tempo de expiração do cache de sessão do lado do servidor não deve ter expirado.
* Cada cliente deve manter um cache de sessões ativas e mantê-lo seguro.

As aplicações C podem usar as capacidades da API C para habilitar a reutilização de sessões para conexões criptografadas (veja Reutilização de Sessões SSL).

#### Configuração e Monitoramento de Execução do Servidor para Reutilização de Sessões SSL

Para criar o contexto TLS inicial, o servidor usa os valores que as variáveis de sistema relacionadas ao contexto têm no início. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. A tabela a seguir mostra as variáveis de sistema e status que definem o cache de sessão de execução do servidor e as variáveis de status correspondentes que expor os valores atualmente ativos do cache de sessões.

**Tabela 8.13 Variáveis de Sistema e Status para Reutilização de Sessões**

<table><thead><tr> <th>Nome da Variável do Sistema</th> <th>Nome da Variável de Estado Correspondente</th> </tr></thead><tbody><tr> <td><code>ssl_session_cache_mode</code></td> <td><code>Ssl_session_cache_mode</code></td> </tr><tr> <td><code>ssl_session_cache_timeout</code></td> <td><code>Ssl_session_cache_timeout</code></td> </tr></tbody></table>

::: info Nota

Quando o valor da variável de servidor `ssl_session_cache_mode` é `ON`, que é o modo padrão, o valor da variável de estado `Ssl_session_cache_mode` é `SERVER`.

As variáveis de cache de sessão SSL aplicam-se tanto aos canais TLS `mysql_main` quanto `mysql_admin`. Os seus valores também são exibidos como propriedades na tabela do Gerenciador de Desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o cache de sessão SSL em tempo de execução, use o seguinte procedimento:

1. Defina cada variável de sistema relacionada ao cache que deve ser alterada para o novo valor. Por exemplo, altere o valor do tempo de cache padrão de 300 segundos para 600 segundos:

   ```
   mysql> SET GLOBAL ssl_session_cache_timeout = 600;
   ```

   Os membros de cada par de variáveis de sistema e estado podem ter valores diferentes temporariamente devido à forma como o procedimento de reconfiguração funciona.

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

2. Execute `ALTER INSTANCE RELOAD TLS`. Esta instrução reconfigura o contexto TLS ativo a partir dos valores atuais das variáveis de sistema relacionadas ao cache. Também define as variáveis de estado relacionadas ao cache para refletir os novos valores de cache ativos. A instrução requer o privilégio `CONNECTION_ADMIN`.

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


Todos os programas clientes do MySQL são capazes de reutilizar uma sessão anterior para novas conexões criptografadas feitas para o mesmo servidor, desde que você tenha armazenado os dados da sessão enquanto a conexão original ainda estava ativa. Os dados da sessão são armazenados em um arquivo e você especifica esse arquivo ao invocar o cliente novamente.

Para armazenar e reutilizar os dados da sessão SSL, use este procedimento:

1. Inicie o `mysql` para estabelecer uma conexão criptografada com um servidor que esteja executando o MySQL 8.4.
2. Use o comando `ssl_session_data_print` para especificar o caminho para um arquivo onde você pode armazenar os dados da sessão atualmente ativos de forma segura. Por exemplo:

   ```
   mysql> ssl_session_data_print ~/private-dir/session.txt
   ```

   Os dados da sessão são obtidos na forma de uma string ANSI codificada PEM, terminada por `\0`. Se você omitir o caminho e o nome do arquivo, a string é impressa na saída padrão.
3. Do prompt do seu interpretador de comandos, inicie qualquer programa cliente do MySQL para estabelecer uma nova conexão criptografada com o mesmo servidor. Para reutilizar os dados da sessão, especifique a opção de linha de comando `--ssl-session-data` e o argumento de arquivo.

   Por exemplo, estabeleça uma nova conexão usando `mysql`:

   ```
   mysql -u admin -p --ssl-session-data=~/private-dir/session.txt
   ```

   e depois o cliente `mysqlshow`:

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

   Em cada exemplo, o cliente tenta retomar a sessão original enquanto estabelece uma nova conexão com o mesmo servidor.

Para confirmar se o `mysql` reutilizou uma sessão, veja a saída do comando `status`. Se a conexão `mysql` atualmente ativa retomar a sessão, as informações de status incluem `SSL session reused: true`.

Além do `mysql` e do `mysqlshow`, a reutilização da sessão SSL se aplica ao `mysqladmin`, `mysqlbinlog`, `mysqlcheck`, `mysqldump`, `mysqlimport`, `mysqlslap`, `mysqltest`, `mysql_migrate_keyring` e `mysql_secure_installation`.

Várias condições podem impedir a recuperação bem-sucedida dos dados da sessão. Por exemplo, se a sessão não estiver totalmente conectada, não é uma sessão SSL, o servidor ainda não enviou os dados da sessão ou a sessão SSL simplesmente não é reutilizável. Mesmo com os dados da sessão armazenados corretamente, o cache de sessão do servidor pode expirar. Independentemente da causa, um erro é retornado por padrão se você especificar `--ssl-session-data`, mas a sessão não puder ser reutilizada. Por exemplo:

```
mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
Enter password: *****
ERROR:
--ssl-session-data specified but the session was not reused.
```

Para suprimir a mensagem de erro e estabelecer a conexão criando silenciosamente uma nova sessão, especifique `--ssl-session-data-continue-on-failed-reuse` na linha de comando, juntamente com `--ssl-session-data`. Se o tempo de espera do cache do servidor expirar, você pode armazenar os dados da sessão novamente no mesmo arquivo. O tempo de espera padrão do cache do servidor pode ser estendido (consulte Configuração e Monitoramento do RMI do Servidor para Reutilização de Sessões SSL).