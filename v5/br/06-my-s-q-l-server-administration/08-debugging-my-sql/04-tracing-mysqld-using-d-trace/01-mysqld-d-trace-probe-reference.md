#### 5.8.4.1 Referência da sonda DTrace do mysqld

O MySQL suporta as seguintes sondagens estáticas, organizadas em grupos de funcionalidade.

**Tabela 5.5 Provas DTrace do MySQL**

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Grupo</th> <th>Sondas</th> </tr></thead><tbody><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-connection" title="5.8.4.1.1 Sondas de Conexão">Conexão</a></td> <td>[[PH_HTML_CODE_<code>query-exec-start</code>], [[PH_HTML_CODE_<code>query-exec-start</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-command" title="5.8.4.1.2 Provas de comando">Comando</a></td> <td>[[PH_HTML_CODE_<code>insert-row-start</code>], [[PH_HTML_CODE_<code>insert-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-query" title="5.8.4.1.3 Sondas de Consulta">Consulta</a></td> <td>[[PH_HTML_CODE_<code>update-row-start</code>], [[PH_HTML_CODE_<code>update-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-query-parsing" title="5.8.4.1.4 Análises de Particionamento de Consulta">Análise de consultas</a></td> <td>[[PH_HTML_CODE_<code>delete-row-start</code>], [[PH_HTML_CODE_<code>delete-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-querycache" title="5.8.4.1.5 Provas do Cache de Consulta">Cache de consulta</a></td> <td>[[PH_HTML_CODE_<code>read-row-start</code>], [[PH_HTML_CODE_<code>read-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-queryexec" title="5.8.4.1.6 Análises de execução de consultas">Execução de consulta</a></td> <td>[[<code>query-exec-start</code>]], [[<code>connection-done</code><code>query-exec-start</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-rowlevel" title="5.8.4.1.7 Sondas de nível de linha">Nível de linha</a></td> <td>[[<code>insert-row-start</code>]], [[<code>insert-row-done</code>]]</td> </tr><tr> <td></td> <td>[[<code>update-row-start</code>]], [[<code>update-row-done</code>]]</td> </tr><tr> <td></td> <td>[[<code>delete-row-start</code>]], [[<code>delete-row-done</code>]]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-readrow" title="5.8.4.1.8 Leitura de sondagens de linha">Leitura em linha</a></td> <td>[[<code>read-row-start</code>]], [[<code>read-row-done</code>]]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-index" title="5.8.4.1.9 Sondas de índice">Leitura do índice</a></td> <td>[[<code>command-start</code><code>query-exec-start</code>], [[<code>command-start</code><code>query-exec-start</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-lock" title="5.8.4.1.10 Sondas de bloqueio">Bloquear</a></td> <td>[[<code>command-start</code><code>insert-row-start</code>], [[<code>command-start</code><code>insert-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>command-start</code><code>update-row-start</code>], [[<code>command-start</code><code>update-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>command-start</code><code>delete-row-start</code>], [[<code>command-start</code><code>delete-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-filesort" title="5.8.4.1.11 Provas de Filesort">Filesort</a></td> <td>[[<code>command-start</code><code>read-row-start</code>], [[<code>command-start</code><code>read-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-statement" title="5.8.4.1.12 Provas de declaração">Declaração</a></td> <td>[[<code>command-done</code><code>query-exec-start</code>], [[<code>command-done</code><code>query-exec-start</code>]</td> </tr><tr> <td></td> <td>[[<code>command-done</code><code>insert-row-start</code>], [[<code>command-done</code><code>insert-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>command-done</code><code>update-row-start</code>], [[<code>command-done</code><code>update-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>command-done</code><code>delete-row-start</code>], [[<code>command-done</code><code>delete-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>command-done</code><code>read-row-start</code>], [[<code>command-done</code><code>read-row-done</code>]</td> </tr><tr> <td></td> <td>[[<code>query-start</code><code>query-exec-start</code>], [[<code>query-start</code><code>query-exec-start</code>]</td> </tr><tr> <td></td> <td>[[<code>query-start</code><code>insert-row-start</code>], [[<code>query-start</code><code>insert-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-network" title="5.8.4.1.13 Provas de rede">Rede</a></td> <td>[[<code>query-start</code><code>update-row-start</code>], [[<code>query-start</code><code>update-row-done</code>], [[<code>query-start</code><code>delete-row-start</code>], [[<code>query-start</code><code>delete-row-done</code>]</td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-keycache" title="5.8.4.1.14 Provas do Keycache">Keycache</a></td> <td>[[<code>query-start</code><code>read-row-start</code>], [[<code>query-start</code><code>read-row-done</code>], [[<code>query-done</code><code>query-exec-start</code>], [[<code>query-done</code><code>query-exec-start</code>], [[<code>query-done</code><code>insert-row-start</code>], [[<code>query-done</code><code>insert-row-done</code>], [[<code>query-done</code><code>update-row-start</code>], [[<code>query-done</code><code>update-row-done</code>]</td> </tr></tbody></table>

Nota

Ao extrair os dados dos argumentos das sondagens, cada argumento está disponível como `argN`, começando com `arg0`. Para identificar cada argumento dentro das definições, eles recebem um nome descritivo, mas você deve acessar as informações usando o parâmetro `argN` correspondente.

##### 5.8.4.1.1 Sondas de Conexão

As verificações `connection-start` e `connection-done` encerram uma conexão de um cliente, independentemente de a conexão ser feita por meio de um soquete ou de uma conexão de rede.

```sql
connection-start(connectionid, user, host)
connection-done(status, connectionid)
```

- `connection-start`: Acionado após uma conexão e login/autenticação bem-sucedidos terem sido concluídos por um cliente. Os argumentos contêm as informações de conexão:

  - `connectionid`: Um `unsigned long` contendo o ID de conexão. Isso é o mesmo que o ID do processo exibido como o valor `Id` na saída do `SHOW PROCESSLIST`.

  - `user`: O nome de usuário usado na autenticação. O valor está em branco para o usuário anônimo.

  - `host`: O host da conexão do cliente. Para uma conexão feita usando sockets Unix, o valor está em branco.

- `connection-done`: Ativado assim que a conexão com o cliente for fechada. Os argumentos são:

  - `status`: O status da conexão quando ela foi fechada. Uma operação de logout tem um valor de 0; qualquer outra interrupção da conexão tem um valor não nulo.

  - `connectionid`: O ID de conexão da conexão que foi fechada.

O seguinte script D quantifica e resume a duração média das conexões individuais e fornece um contagem, descarregando as informações a cada 60 segundos:

```sql
#!/usr/sbin/dtrace -s


mysql*:::connection-start
{
  self->start = timestamp;
}

mysql*:::connection-done
/self->start/
{
  @ = quantize(((timestamp - self->start)/1000000));
  self->start = 0;
}

tick-60s
{
  printa(@);
}
```

Quando executado em um servidor com um grande número de clientes, você pode ver uma saída semelhante à seguinte:

```sql
  1  57413                        :tick-60s

           value  ------------- Distribution ------------- count
              -1 |                                         0
               0 |@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 30011
               1 |                                         59
               2 |                                         5
               4 |                                         20
               8 |                                         29
              16 |                                         18
              32 |                                         27
              64 |                                         30
             128 |                                         11
             256 |                                         10
             512 |                                         1
            1024 |                                         6
            2048 |                                         8
            4096 |                                         9
            8192 |                                         8
           16384 |                                         2
           32768 |                                         1
           65536 |                                         1
          131072 |                                         0
          262144 |                                         1
524288 |                                         0
```

##### 5.8.4.1.2 Provas de comando

Os comandos de sondagem são executados antes e depois de um comando do cliente ser executado, incluindo qualquer declaração SQL que possa ser executada durante esse período. Os comandos incluem operações como a inicialização do banco de dados, o uso da operação `COM_CHANGE_USER` (compatível com o protocolo MySQL) e a manipulação de declarações preparadas. Muitos desses comandos são usados apenas pela API do cliente MySQL de vários conectores, como PHP e Java.

```sql
command-start(connectionid, command, user, host)
command-done(status)
```

- `command-start`: Acionado quando um comando é enviado ao servidor.

  - `connectionid`: O ID de conexão do cliente que está executando o comando.

  - `command`: Um número inteiro que representa o comando executado. Os valores possíveis estão mostrados na tabela a seguir.

    <table summary="Possíveis valores de comando de início e um nome e descrição para cada um."><col style="width: 10%"/><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th scope="col">Valor</th> <th scope="col">Nome</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th scope="row">00</th> <td>COM_SLEEP</td> <td>Estado do furo interno</td> </tr><tr> <th scope="row">01</th> <td>COM_QUIT</td> <td>Conexão próxima</td> </tr><tr> <th scope="row">02</th> <td>COM_INIT_DB</td> <td>Selecionar banco de dados ([[<code>USE ...</code>]])</td> </tr><tr> <th scope="row">03</th> <td>COM_QUERY</td> <td>Executar uma consulta</td> </tr><tr> <th scope="row">04</th> <td>COM_FIELD_LIST</td> <td>Obtenha uma lista de campos</td> </tr><tr> <th scope="row">05</th> <td>COM_CREATE_DB</td> <td>Crie um banco de dados (desatualizado)</td> </tr><tr> <th scope="row">06</th> <td>COM_DROP_DB</td> <td>Deixe um banco de dados (desatualizado)</td> </tr><tr> <th scope="row">07</th> <td>COM_REFRESH</td> <td>Atualizar a conexão</td> </tr><tr> <th scope="row">08</th> <td>COM_SHUTDOWN</td> <td>Desligar o servidor</td> </tr><tr> <th scope="row">09</th> <td>COM_STATÍSTICAS</td> <td>Obtenha estatísticas</td> </tr><tr> <th scope="row">10</th> <td>COM_PROCESS_INFO</td> <td>Obtenha processos (<a class="link" href="show-processlist.html" title="13.7.5.29 Declaração PROCESSLIST">[[<code>SHOW PROCESSLIST</code>]]</a>)</td> </tr><tr> <th scope="row">11</th> <td>COM_CONNECT</td> <td>Inicializar a conexão</td> </tr><tr> <th scope="row">12</th> <td>COM_PROCESS_KILL</td> <td>Processo de eliminação</td> </tr><tr> <th scope="row">13</th> <td>COM_DEBUG</td> <td>Obter informações de depuração</td> </tr><tr> <th scope="row">14</th> <td>COM_PING</td> <td>Ping</td> </tr><tr> <th scope="row">15</th> <td>COM_TIME</td> <td>Estado do furo interno</td> </tr><tr> <th scope="row">16</th> <td>COM_DELAYED_INSERT</td> <td>Estado do furo interno</td> </tr><tr> <th scope="row">17</th> <td>COM_CHANGE_USER</td> <td>Alterar usuário</td> </tr><tr> <th scope="row">18</th> <td>COM_BINLOG_DUMP</td> <td>Utilizado por uma réplica ou<a class="link" href="mysqlbinlog.html" title="4.6.7 mysqlbinlog — Ferramenta para processar arquivos de log binários"><span class="command"><strong>mysqlbinlog</strong></span></a>para iniciar uma leitura de log binário</td> </tr><tr> <th scope="row">19</th> <td>COM_TABLE_DUMP</td> <td>Utilizado por uma réplica para obter as informações da tabela de origem</td> </tr><tr> <th scope="row">20</th> <td>COM_CONNECT_OUT</td> <td>Utilizado por uma réplica para registrar uma conexão com o servidor</td> </tr><tr> <th scope="row">21</th> <td>COM_REGISTER_SLAVE</td> <td>Utilizado por uma réplica durante o registro</td> </tr><tr> <th scope="row">22</th> <td>COM_STMT_PREPARE</td> <td>Prepare uma declaração</td> </tr><tr> <th scope="row">23</th> <td>COM_STMT_EXECUTE</td> <td>Executar uma declaração</td> </tr><tr> <th scope="row">24</th> <td>COM_STMT_SEND_LONG_DATA</td> <td>Utilizado por um cliente ao solicitar dados estendidos</td> </tr><tr> <th scope="row">25</th> <td>COM_STMT_CLOSE</td> <td>Fechar uma declaração preparada</td> </tr><tr> <th scope="row">26</th> <td>COM_STMT_RESET</td> <td>Reinicie uma declaração preparada</td> </tr><tr> <th scope="row">27</th> <td>COM_SET_OPTION</td> <td>Definir uma opção de servidor</td> </tr><tr> <th scope="row">28</th> <td>COM_STMT_FETCH</td> <td>Peça uma declaração preparada</td> </tr></tbody></table>

  - `usuário`: O usuário que executa o comando.

  - `host`: O host do cliente.
- `command-done`: Ativa quando a execução do comando é concluída. O argumento `status` contém 0 se o comando foi executado com sucesso ou 1 se a instrução foi encerrada antes da conclusão normal.

As sondagens `command-start` e `command-done` são mais úteis quando combinadas com as sondagens de declaração para obter uma ideia do tempo de execução geral.

##### 5.8.4.1.3 Sondas de Consulta

As sondagens `query-start` e `query-done` são acionadas quando uma consulta específica é recebida pelo servidor e quando a consulta foi concluída e as informações foram enviadas com sucesso ao cliente.

```sql
query-start(query, connectionid, database, user, host)
query-done(status)
```

- `query-start`: Acionado após a string de consulta ter sido recebida do cliente. Os argumentos são:

  - `query`: O texto completo da consulta enviada.

  - `connectionid`: O ID de conexão do cliente que enviou a consulta. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor `Id` na saída da consulta `SHOW PROCESSLIST` (show-processlist.html).

  - `database`: O nome do banco de dados em que a consulta está sendo executada.

  - `user`: O nome de usuário usado para se conectar ao servidor.

  - `host`: O nome do host do cliente.
- `query-done`: Ativado assim que a consulta foi executada e as informações foram devolvidas ao cliente. A sonda inclui um único argumento, `status`, que retorna 0 quando a consulta é executada com sucesso e 1 se houver um erro.

Você pode obter um relatório simples do tempo de execução para cada consulta usando o seguinte script D:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %-9s\n", "Who", "Database", "Query", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-9d\n",self->who,self->db,self->query,
          (timestamp - self->querystart) / 1000000);
}
```

Ao executar o script acima, você deve ter uma ideia básica do tempo de execução de suas consultas:

```sql
$> ./query.d
Who                  Database             Query                                    Time(ms)
root@localhost       test                 select * from t1 order by i limit 10     0
root@localhost       test                 set global query_cache_size=0            0
root@localhost       test                 select * from t1 order by i limit 10     776
root@localhost       test                 select * from t1 order by i limit 10     773
root@localhost       test                 select * from t1 order by i desc limit 10 795
```

##### 5.8.4.1.4 Análises de Particionamento de Consulta

As verificações de análise de consulta são acionadas antes que a declaração SQL original seja analisada e quando a análise da declaração e a determinação do modelo de execução necessário para processar a declaração forem concluídas:

```sql
query-parse-start(query)
query-parse-done(status)
```

- `query-parse-start`: Ativado logo antes da declaração ser analisada pelo analisador de consultas MySQL. O único argumento, `query`, é uma string que contém o texto completo da consulta original.

- `query-parse-done`: Acionado quando a análise da declaração original foi concluída. O `status` é um número inteiro que descreve o status da operação. Um `0` indica que a consulta foi analisada com sucesso. Um `1` indica que a análise da consulta falhou.

Por exemplo, você pode monitorar o tempo de execução para a análise de uma consulta específica usando o seguinte script D:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::query-parse-start
{
   self->parsestart = timestamp;
   self->parsequery = copyinstr(arg0);
}

mysql*:::query-parse-done
/arg0 == 0/
{
   printf("Parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}

mysql*:::query-parse-done
/arg0 != 0/
{
   printf("Error parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}
```

No script acima, um predicado é usado em `query-parse-done` para gerar uma saída diferente com base no valor de status da sonda.

Ao executar o script e monitorar a execução:

```sql
$> ./query-parsing.d
Error parsing select from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 36 ms
Parsing select * from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 176 ms
```

##### 5.8.4.1.5 Provas do Cache de Consulta

Os testes de cache de consultas são executados ao executar qualquer consulta. A consulta `query-cache-hit` é acionada quando uma consulta existe no cache de consultas e pode ser usada para retornar as informações do cache de consultas. Os argumentos contêm o texto da consulta original e o número de linhas devolvidas do cache de consultas para a consulta. Se a consulta não estiver no cache de consultas ou o cache de consultas não estiver habilitado, então o teste `query-cache-miss` é acionado em vez disso.

```sql
query-cache-hit(query, rows)
query-cache-miss(query)
```

- `query-cache-hit`: Acionado quando a consulta foi encontrada no cache de consultas. O primeiro argumento, `query`, contém o texto original da consulta. O segundo argumento, `rows`, é um número inteiro que contém o número de linhas na consulta armazenada no cache.

- `query-cache-miss`: Desativado quando a consulta não é encontrada no cache de consultas. O primeiro argumento, `query`, contém o texto original da consulta.

Os testes de cache de consulta são melhor combinados com um teste da consulta principal para que você possa determinar as diferenças nos tempos entre o uso ou não do cache de consulta para consultas especificadas. Por exemplo, no seguinte script D, as informações da consulta e do cache de consulta são combinadas na saída de informações durante o monitoramento:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %2s %-9s\n", "Who", "Database", "Query", "QC", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
   self->qc = 0;
}

mysql*:::query-cache-hit
{
   self->qc = 1;
}

mysql*:::query-cache-miss
{
   self->qc = 0;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-2s %-9d\n",self->who,self->db,self->query,(self->qc ? "Y" : "N"),
          (timestamp - self->querystart) / 1000000);
}
```

Ao executar o script, você pode ver os efeitos do cache de consulta. Inicialmente, o cache de consulta está desativado. Se você definir o tamanho do cache de consulta e, em seguida, executar a consulta várias vezes, você deve ver que o cache de consulta está sendo usado para retornar os dados da consulta:

```sql
$> ./query-cache.d
root@localhost       test                 select * from t1 order by i limit 10     N  1072
root@localhost                            set global query_cache_size=262144       N  0
root@localhost       test                 select * from t1 order by i limit 10     N  781
root@localhost       test                 select * from t1 order by i limit 10     Y  0
```

##### 5.8.4.1.6 Análises de execução de consultas

A verificação de execução da consulta é acionada quando a execução real da consulta começa, após a análise e verificação do cache da consulta, mas antes de quaisquer verificações de privilégios ou otimizações. Ao comparar a diferença entre as verificações de início e término, você pode monitorar o tempo realmente gasto atendendo à consulta (em vez de apenas lidar com a análise e outros elementos da consulta).

```sql
query-exec-start(query, connectionid, database, user, host, exec_type)
query-exec-done(status)
```

Nota

As informações fornecidas nos argumentos para `query-start` e `query-exec-start` são quase idênticas e foram projetadas para que você possa optar por monitorar todo o processo de consulta (usando `query-start`) ou apenas a execução (usando `query-exec-start`), enquanto expõe as informações principais sobre o usuário, o cliente e a consulta em execução.

- `query-exec-start`: Acionado quando a execução de uma consulta individual é iniciada. Os argumentos são:

  - `query`: O texto completo da consulta enviada.

  - `connectionid`: O ID de conexão do cliente que enviou a consulta. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor `Id` na saída da consulta `SHOW PROCESSLIST` (show-processlist.html).

  - `database`: O nome do banco de dados em que a consulta está sendo executada.

  - `user`: O nome de usuário usado para se conectar ao servidor.

  - `host`: O nome do host do cliente.

  - `exec_type`: O tipo de execução. Os tipos de execução são determinados com base no conteúdo da consulta e no local onde ela foi enviada. Os valores para cada tipo estão mostrados na tabela a seguir.

    <table summary="valores exec_type."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Consulta executada a partir de sql_parse, consulta de nível superior.</td> </tr><tr> <td>1</td> <td>Declaração preparada executada</td> </tr><tr> <td>2</td> <td>Instrução de cursor executada</td> </tr><tr> <td>3</td> <td>Consulta executada em procedimento armazenado</td> </tr></tbody></table>

- `query-exec-done`: Ativado quando a execução da consulta foi concluída. A sonda inclui um único argumento, `status`, que retorna 0 quando a consulta é executada com sucesso e 1 se houver um erro.

##### 5.8.4.1.7 Sondas de nível de linha

As verificações `*row-{start,done}` são acionadas sempre que uma operação de linha é empurrada para um motor de armazenamento. Por exemplo, se você executar uma declaração `[INSERT]` (insert.html) com 100 linhas de dados, então as verificações `insert-row-start` e `insert-row-done` são acionadas 100 vezes cada, para cada inserção de linha.

```sql
insert-row-start(database, table)
insert-row-done(status)

update-row-start(database, table)
update-row-done(status)

delete-row-start(database, table)
delete-row-done(status)
```

- `insert-row-start`: Ativado antes de uma linha ser inserida em uma tabela.

- `insert-row-done`: Ativado após uma linha ser inserida em uma tabela.

- `update-row-start`: Ativado antes de uma linha ser atualizada em uma tabela.

- `update-row-done`: Desatado antes de uma linha ser atualizada em uma tabela.

- `delete-row-start`: Ativado antes de uma linha ser excluída de uma tabela.

- `delete-row-done`: Desatado antes de uma linha ser excluída de uma tabela.

Os argumentos suportados pelas sondagens são consistentes para as sondagens correspondentes `start` e `done` em cada caso:

- `database`: O nome do banco de dados.
- `table`: O nome da tabela.
- `status`: O status; 0 para sucesso ou 1 para falha.

Como as sondagens de nível de linha são acionadas para cada acesso individual à linha, essas sondagens podem ser acionadas muitas milhares de vezes por segundo, o que pode ter um efeito prejudicial tanto no script de monitoramento quanto no MySQL. O ambiente DTrace deve limitar o acionamento dessas sondagens para evitar que o desempenho seja afetado negativamente. Use as sondagens com moderação ou use funções de contagem ou agregação para relatar essas sondagens e, em seguida, forneça um resumo quando o script terminar ou como parte de sondagens `query-done` ou `query-exec-done`.

O seguinte script de exemplo resume a duração de cada operação de linha dentro de uma consulta maior:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %9s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur ms", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->rowdur = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-10s %-10s %9d %9d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}

mysql*:::query-done
/ self->rowdur /
{
   printf("%34s %9d %s\n", "", (self->rowdur/1000000), "-> Row ops");
}

mysql*:::insert-row-start
{
   self->rowstart = timestamp;
}

mysql*:::delete-row-start
{
   self->rowstart = timestamp;
}

mysql*:::update-row-start
{
   self->rowstart = timestamp;
}

mysql*:::insert-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::delete-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::update-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}
```

Ao executar o script acima com uma consulta que insere dados em uma tabela, você pode monitorar o tempo exato gasto na inserção de linha bruta:

```sql
St Who        DB            ConnID    Dur ms Query
 0 @localhost test              13     20767 insert into t1(select * from t2)
                                        4827 -> Row ops
```

##### 5.8.4.1.8 Leitura de sondagens de linha

As sondagens de linha de leitura são acionadas em nível do mecanismo de armazenamento sempre que uma operação de leitura de linha ocorre. Essas sondagens são especificadas dentro de cada mecanismo de armazenamento (ao contrário das sondagens `*row-start`, que estão na interface do mecanismo de armazenamento). Portanto, essas sondagens podem ser usadas para monitorar operações e desempenho de nível de linha de armazenamento individuais. Como essas sondagens são acionadas ao redor da interface de leitura de linha do mecanismo de armazenamento, elas podem ser atingidas várias vezes durante uma consulta básica.

```sql
read-row-start(database, table, scan_flag)
read-row-done(status)
```

- `read-row-start`: Desativado quando uma linha é lida pelo motor de armazenamento a partir do `banco de dados` e `tabela` especificados. O `scan_flag` é definido como 1 (verdadeiro) quando a leitura faz parte de uma varredura de tabela (ou seja, uma leitura sequencial) ou 0 (falso) quando a leitura é de um registro específico.

- `read-row-done`: Desativado quando uma operação de leitura de linha dentro de um mecanismo de armazenamento é concluída. O `status` retorna 0 em caso de sucesso ou um valor positivo em caso de falha.

##### 5.8.4.1.9 Sondas de índice

Os índices de sondagem são acionados sempre que uma linha é lida usando um dos índices da tabela especificada. A sondagem é acionada dentro do mecanismo de armazenamento correspondente à tabela.

```sql
index-read-row-start(database, table)
index-read-row-done(status)
```

- `index-read-row-start`: Acionado quando uma linha é lida pelo motor de armazenamento a partir do `banco de dados` e `tabela` especificados.

- `index-read-row-done`: Desencadenado quando uma operação de leitura de linha indexada dentro de um mecanismo de armazenamento é concluída. O `status` retorna 0 em caso de sucesso ou um valor positivo em caso de falha.

##### 5.8.4.1.10 Sondas de bloqueio

As sondagens de bloqueio são chamadas sempre que um bloqueio externo é solicitado pelo MySQL para uma tabela usando o mecanismo de bloqueio correspondente na tabela, conforme definido pelo tipo do motor da tabela. Existem três tipos diferentes de bloqueio: bloqueio de leitura, bloqueio de escrita e operações de desbloqueio. Usando as sondagens, você pode determinar a duração da rotina de bloqueio externo (ou seja, o tempo necessário para o motor de armazenamento implementar o bloqueio, incluindo qualquer tempo de espera para que outro bloqueio fique livre) e a duração total do processo de bloqueio/desbloqueio.

```sql
handler-rdlock-start(database, table)
handler-rdlock-done(status)

handler-wrlock-start(database, table)
handler-wrlock-done(status)

handler-unlock-start(database, table)
handler-unlock-done(status)
```

- `handler-rdlock-start`: Acionado quando um bloqueio de leitura é solicitado na `database` e `table` especificadas.

- `handler-wrlock-start`: Acionado quando um bloqueio de escrita é solicitado na `database` e `table` especificadas.

- `handler-unlock-start`: Acionado quando um pedido de desbloqueio é feito na `database` e `table` especificadas.

- `handler-rdlock-done`: Acionado quando um pedido de bloqueio de leitura é concluído. O `status` é 0 se a operação de bloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

- `handler-wrlock-done`: Ativado quando um pedido de bloqueio de escrita é concluído. O `status` é 0 se a operação de bloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

- `handler-unlock-done`: Acionado quando um pedido de desbloqueio é concluído. O `status` é 0 se a operação de desbloqueio tiver sido bem-sucedida, ou `>0` em caso de falha.

Você pode usar arrays para monitorar o bloqueio e desbloqueio de tabelas individuais e, em seguida, calcular a duração do bloqueio total da tabela usando o seguinte script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::handler-rdlock-start
{
   self->rdlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Read   %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-wrlock-start
{
   self->wrlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Write  %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-unlock-start
{
   self->unlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   printf("Start: Lock->Unlock %s.%s (%d ms lock duration)\n",
          copyinstr(arg0),copyinstr(arg1),
          (timestamp - self->lockmap[this->lockref])/1000000);
}

mysql*:::handler-rdlock-done
{
   printf("End:   Lock->Read   %d ms\n",
          (timestamp - self->rdlockstart)/1000000);
}

mysql*:::handler-wrlock-done
{
   printf("End:   Lock->Write  %d ms\n",
          (timestamp - self->wrlockstart)/1000000);
}

mysql*:::handler-unlock-done
{
   printf("End:   Lock->Unlock %d ms\n",
          (timestamp - self->unlockstart)/1000000);
}
```

Ao executar, você deve obter informações tanto sobre a duração do próprio processo de bloqueio quanto sobre os bloqueios de uma tabela específica:

```sql
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (25743 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
```

##### 5.8.4.1.11 Provas de Filesort

As verificações de filesort são acionadas sempre que uma operação de filesort é aplicada a uma tabela. Para obter mais informações sobre filesort e as condições sob as quais ele ocorre, consulte Seção 8.2.1.14, “Otimização de ORDER BY”.

```sql
filesort-start(database, table)
filesort-done(status, rows)
```

- `filesort-start`: Desencadenado quando a operação de filesort começa em uma tabela. Os dois argumentos da sonda, `database` e `table`, identificam a tabela que está sendo ordenada.

- `filesort-done`: Desencadenado quando a operação de filesort é concluída. Dois argumentos são fornecidos, o `status` (0 para sucesso, 1 para falha) e o número de linhas ordenadas durante o processo de filesort.

Um exemplo disso está no seguinte script, que acompanha a duração do processo de filesort, além da duração da consulta principal:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->filesort = 0;
   self->fsdb = "";
   self->fstable = "";
}

mysql*:::filesort-start
{
  self->filesort = timestamp;
  self->fsdb = copyinstr(arg0);
  self->fstable = copyinstr(arg1);
}

mysql*:::filesort-done
{
   this->elapsed = (timestamp - self->filesort) /1000;
   printf("%2d %-10s %-10s %9d %18d Filesort on %s\n",
          arg0, self->who, self->fsdb,
          self->connid, this->elapsed, self->fstable);
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000;
   printf("%2d %-10s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}
```

Ao executar uma consulta em uma grande tabela com uma cláusula `ORDER BY` que desencadeia um filesort, e depois criar um índice na tabela e repetir a mesma consulta, você pode ver a diferença na velocidade de execução:

```sql
St Who        DB            ConnID       Dur microsec Query
 0 @localhost test              14           11335469 Filesort on t1
 0 @localhost test              14           11335787 select * from t1 order by i limit 100
 0 @localhost test              14          466734378 create index t1a on t1 (i)
 0 @localhost test              14              26472 select * from t1 order by i limit 100
```

##### 5.8.4.1.12 Provas de declaração

As declarações individuais de sondagem são fornecidas para fornecer informações específicas sobre diferentes tipos de declarações. Para as sondagens de início, a string da consulta é fornecida como o único argumento. Dependendo do tipo de declaração, as informações fornecidas pela sonda correspondente `done` podem diferir. Para todas as sondagens `done`, o status da operação (`0` para sucesso, `>0` para falha) é fornecido. Para as operações `[SELECT]` (select.html), `[INSERT]` (insert.html), `[INSERT ... (SELECT FROM ...)]` (insert.html), `[DELETE]` (delete.html) e `[DELETE FROM t1,t2]` (delete.html), o número de linhas afetadas é retornado.

Para as instruções `UPDATE` e `UPDATE t1, t2 ...`, o número de linhas correspondentes e o número de linhas realmente alteradas são fornecidos. Isso ocorre porque o número de linhas realmente correspondentes à cláusula `WHERE` correspondente e o número de linhas realmente alteradas podem diferir. O MySQL não atualiza o valor de uma linha se o valor já corresponder ao novo ajuste.

```sql
select-start(query)
select-done(status,rows)

insert-start(query)
insert-done(status,rows)

insert-select-start(query)
insert-select-done(status,rows)

update-start(query)
update-done(status,rowsmatched,rowschanged)

multi-update-start(query)
multi-update-done(status,rowsmatched,rowschanged)

delete-start(query)
delete-done(status,rows)

multi-delete-start(query)
multi-delete-done(status,rows)
```

- `select-start`: Ativado antes de uma instrução `SELECT`.

- `select-done`: Ativado no final de uma instrução `SELECT`.

- `insert-start`: Ativado antes de uma instrução `INSERT`.

- `insert-done`: Ativado no final de uma instrução `INSERT`.

- `insert-select-start`: Ativado antes de uma instrução `INSERT ... SELECT` (insert.html).

- `insert-select-done`: Ativado no final de uma instrução `INSERT ... SELECT` (insert.html).

- `update-start`: Ativado antes de uma declaração de `UPDATE`.

- `update-done`: Desativado no final de uma declaração de `UPDATE`.

- `multi-update-start`: Ativado antes de uma declaração de `UPDATE` que envolve várias tabelas.

- `multi-update-done`: Ativado no final de uma declaração de `UPDATE` que envolve várias tabelas.

- `delete-start`: Ativado antes de uma instrução `DELETE`.

- `delete-done`: Desativado no final de uma instrução `DELETE`.

- `multi-delete-start`: Ativado antes de uma instrução `DELETE` que envolve múltiplas tabelas.

- `multi-delete-done`: Ativado no final de uma instrução `DELETE` que envolve várias tabelas.

Os argumentos para as sondagens da declaração são:

- `query`: A string de consulta.

- `status`: O status da consulta. `0` para sucesso e `>0` para falha.

- `rows`: O número de linhas afetadas pela declaração. Isso retorna o número de linhas encontradas para `SELECT`, o número de linhas excluídas para `DELETE` e o número de linhas inseridas com sucesso para `INSERT`.

- `rowsmatched`: O número de linhas correspondentes à cláusula `WHERE` de uma operação de atualização (`update.html`).

- `rowschanged`: O número de linhas que realmente foram alteradas durante uma operação de atualização (`UPDATE`).

Você usa essas sondagens para monitorar a execução desses tipos de declarações sem precisar monitorar o usuário ou cliente que está executando as declarações. Um exemplo simples disso é rastrear os tempos de execução:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-60s %-8s %-8s %-8s\n", "Query", "RowsU", "RowsM", "Dur (ms)");
}

mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->query = copyinstr(arg0);
    self->querystart = timestamp;
}

mysql*:::insert-done, mysql*:::select-done,
mysql*:::delete-done, mysql*:::multi-delete-done, mysql*:::insert-select-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           0,
           arg1,
           this->elapsed);
    self->querystart = 0;
}

mysql*:::update-done, mysql*:::multi-update-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           arg1,
           arg2,
           this->elapsed);
    self->querystart = 0;
}
```

Quando executado, você pode ver os tempos básicos de execução e as correspondências de linhas:

```sql
Query                                                        RowsU    RowsM    Dur (ms)
select * from t2                                             0        275      0
insert into t2 (select * from t2)                            0        275      9
update t2 set i=5 where i > 75                               110      110      8
update t2 set i=5 where i < 25                               254      134      12
delete from t2 where i < 5                                   0        0        0
```

Outra alternativa é usar as funções de agregação no DTrace para agreger o tempo de execução de declarações individuais:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet


mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->querystart = timestamp;
}

mysql*:::select-done
{
        @statements["select"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::insert-done, mysql*:::insert-select-done
{
        @statements["insert"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::update-done, mysql*:::multi-update-done
{
        @statements["update"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::delete-done, mysql*:::multi-delete-done
{
        @statements["delete"] = sum(((timestamp - self->querystart)/1000000));
}

tick-30s
{
        printa(@statements);
}
```

O script que foi mostrado acaba de agregar os tempos gastos com cada operação, o que poderia ser usado para ajudar a estabelecer um conjunto padrão de testes.

```sql
 delete                                                            0
  update                                                            0
  insert                                                           23
  select                                                         2484

  delete                                                            0
  update                                                            0
  insert                                                           39
  select                                                        10744

  delete                                                            0
  update                                                           26
  insert                                                           56
  select                                                        10944

  delete                                                            0
  update                                                           26
  insert                                                         2287
  select                                                        15985
```

##### 5.8.4.1.13 Provas de rede

As ferramentas de monitoramento da rede monitoram a transferência de informações do servidor MySQL e de clientes de todos os tipos pela rede. As ferramentas são definidas da seguinte forma:

```sql
net-read-start()
net-read-done(status, bytes)
net-write-start(bytes)
net-write-done(status)
```

- `net-read-start`: Acionado quando uma operação de leitura de rede é iniciada.

- `net-read-done`: Ativado quando a operação de leitura de rede é concluída. O `status` é um `inteiro` que representa o status de retorno da operação, `0` para sucesso e `1` para falha. O argumento `bytes` é um `inteiro` que especifica o número de bytes lidos durante o processo.

- `net-start-bytes`: Acionado quando dados são escritos em um socket de rede. O único argumento, `bytes`, especifica o número de bytes escritos no socket de rede.

- `net-write-done`: Acionado quando a operação de escrita na rede foi concluída. O único argumento, `status`, é um inteiro que representa o status de retorno da operação, `0` para sucesso e `1` para falha.

Você pode usar as sondas de rede para monitorar o tempo gasto lendo e escrevendo em clientes de rede durante a execução. O seguinte script D fornece um exemplo disso. O tempo cumulativo para a leitura ou escrita é calculado, bem como o número de bytes. Observe que o tamanho da variável dinâmica foi aumentado (usando a opção `dynvarsize`) para lidar com o disparo rápido das sondas individuais para leituras/escritas na rede.

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet
#pragma D option dynvarsize=4m

dtrace:::BEGIN
{
   printf("%-2s %-30s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->netwrite = 0;
   self->netwritecum = 0;
   self->netwritebase = 0;
   self->netread = 0;
   self->netreadcum = 0;
   self->netreadbase = 0;
}

mysql*:::net-write-start
{
   self->netwrite += arg0;
   self->netwritebase = timestamp;
}

mysql*:::net-write-done
{
   self->netwritecum += (timestamp - self->netwritebase);
   self->netwritebase = 0;
}

mysql*:::net-read-start
{
   self->netreadbase = timestamp;
}

mysql*:::net-read-done
{
   self->netread += arg1;
   self->netreadcum += (timestamp - self->netreadbase);
   self->netreadbase = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-30s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
   printf("Net read: %d bytes (%d ms) write: %d bytes (%d ms)\n",
               self->netread, (self->netreadcum/1000000),
               self->netwrite, (self->netwritecum/1000000));
}
```

Ao executar o script acima em uma máquina com um cliente remoto, você pode ver que aproximadamente um terço do tempo gasto executando a consulta está relacionado à escrita dos resultados da consulta de volta ao cliente.

```sql
St Who                            DB            ConnID       Dur microsec Query
 0 root@::ffff:198.51.100.108      test              31               3495 select * from t1 limit 1000000
Net read: 0 bytes (0 ms) write: 10000075 bytes (1220 ms)
```

##### 5.8.4.1.14 Provas do Keycache

As verificações da keycache são acionadas ao usar o cache de chaves do índice usado com o motor de armazenamento MyISAM. Existem verificações para monitorar quando os dados são lidos no keycache, quando os dados de chave cache são escritos do cache para um arquivo cache, ou quando acessa-se o keycache.

O uso do Keycache indica quando os dados são lidos ou escritos dos arquivos de índice para o cache e pode ser usado para monitorar o uso eficiente da memória alocada para o keycache. Um grande número de leituras do keycache em uma série de consultas pode indicar que o keycache é muito pequeno para o tamanho dos dados acessados.

```sql
keycache-read-start(filepath, bytes, mem_used, mem_free)
keycache-read-block(bytes)
keycache-read-hit()
keycache-read-miss()
keycache-read-done(mem_used, mem_free)
keycache-write-start(filepath, bytes, mem_used, mem_free)
keycache-write-block(bytes)
keycache-write-done(mem_used, mem_free)
```

Ao ler dados dos arquivos de índice para o keycache, o processo primeiro inicia a operação de leitura (indicada por `keycache-read-start`), depois carrega blocos de dados (`keycache-read-block`), e então o bloco de leitura ou corresponde aos dados sendo identificados (`keycache-read-hit`) ou mais dados precisam ser lidos (`keycache-read-miss`). Uma vez que a operação de leitura foi concluída, a leitura para de com `keycache-read-done`.

Os dados podem ser lidos do arquivo de índice para o keycache apenas quando a chave especificada não estiver já no keycache.

- `keycache-read-start`: Acionado quando a operação de leitura do keycache é iniciada. Os dados são lidos a partir do `filepath` especificado, lendo o número especificado de `bytes`. O `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.

- `keycache-read-block`: Acionado quando o keycache lê um bloco de dados, de um número especificado de `bytes`, do arquivo de índice para o keycache.

- `keycache-read-hit`: Acionado quando o bloco de dados lido do arquivo de índice corresponde aos dados da chave solicitados.

- `keycache-read-miss`: Desativado quando o bloco de dados lido do arquivo de índice não corresponde aos dados da chave necessários.

- `keycache-read-done`: Ativa quando a operação de leitura do keycache é concluída. Os valores `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.

As escritas de cache de chave ocorrem quando as informações do índice são atualizadas durante uma operação de `INSERT`, `UPDATE` ou `DELETE`, e as informações de cache da chave são descartadas de volta para o arquivo de índice.

- `keycache-write-start`: Acionado quando a operação de escrita no keycache é iniciada. Os dados são escritos no `filepath` especificado, lendo o número especificado de `bytes`. O `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.

- `keycache-write-block`: Acionado quando o keycache escreve um bloco de dados, de um número especificado de `bytes`, no arquivo de índice do keycache.

- `keycache-write-done`: Acionado quando a operação de escrita no keycache foi concluída. Os valores `mem_used` e `mem_avail` indicam a memória atualmente utilizada pelo keycache e a quantidade de memória disponível dentro do keycache.
