#### 5.8.4.1 Referência dos Probes DTrace do mysqld

O MySQL suporta os seguintes static probes, organizados em grupos de funcionalidade.

**Tabela 5.5 Probes DTrace do MySQL**

| Grupo | Probes |
| :--- | :--- |
| Conexão | `connection-start`, `connection-done` |
| Comando | `command-start`, `command-done` |
| Query | `query-start`, `query-done` |
| Parsing de Query | `query-parse-start`, `query-parse-done` |
| Query Cache | `query-cache-hit`, `query-cache-miss` |
| Execução de Query | `query-exec-start`, `query-exec-done` |
| Nível de Linha | `insert-row-start`, `insert-row-done` |
| | `update-row-start`, `update-row-done` |
| | `delete-row-start`, `delete-row-done` |
| Leituras de Linha | `read-row-start`, `read-row-done` |
| Leituras de Index | `index-read-row-start`, `index-read-row-done` |
| Lock | `handler-rdlock-start`, `handler-rdlock-done` |
| | `handler-wrlock-start`, `handler-wrlock-done` |
| | `handler-unlock-start`, `handler-unlock-done` |
| Filesort | `filesort-start`, `filesort-done` |
| Statement | `select-start`, `select-done` |
| | `insert-start`, `insert-done` |
| | `insert-select-start`, `insert-select-done` |
| | `update-start`, `update-done` |
| | `multi-update-start`, `multi-update-done` |
| | `delete-start`, `delete-done` |
| | `multi-delete-start`, `multi-delete-done` |
| Network | `net-read-start`, `net-read-done`, `net-write-start`, `net-write-done` |
| Keycache | `keycache-read-start`, `keycache-read-block`, `keycache-read-done`, `keycache-read-hit`, `keycache-read-miss`, `keycache-write-start`, `keycache-write-block`, `keycache-write-done` |

Nota

Ao extrair os dados de argumento dos probes, cada argumento está disponível como `argN`, começando com `arg0`. Para identificar cada argumento dentro das definições, eles são fornecidos com um nome descritivo, mas você deve acessar a informação utilizando o parâmetro `argN` correspondente.

##### 5.8.4.1.1 Probes de Conexão

Os probes `connection-start` e `connection-done` delimitam uma conexão de um cliente, independentemente de a conexão ser através de um socket ou de uma Network connection.

```sql
connection-start(connectionid, user, host)
connection-done(status, connectionid)
```

* `connection-start`: Acionado após uma conexão e login/autenticação bem-sucedidos terem sido concluídos por um cliente. Os argumentos contêm as informações da conexão:

  + `connectionid`: Um `unsigned long` contendo o ID de conexão (`connection ID`). Este é o mesmo que o ID de processo mostrado como o valor `Id` na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `user`: O nome de usuário usado durante a autenticação. O valor é vazio para o usuário anônimo.

  + `host`: O host da conexão do cliente. Para uma conexão feita usando Unix sockets, o valor é vazio.

* `connection-done`: Acionado logo após a conexão com o cliente ter sido fechada. Os argumentos são:

  + `status`: O status da conexão no momento em que foi fechada. Uma operação de logout tem o valor 0; qualquer outra terminação da conexão tem um valor diferente de zero.

  + `connectionid`: O ID de conexão da conexão que foi encerrada.

O script D a seguir quantifica e resume a duração média das conexões individuais e fornece uma contagem, despejando as informações a cada 60 segundos:

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

Quando executado em um server com um grande número de clientes, você pode ver uma saída semelhante a esta:

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

##### 5.8.4.1.2 Probes de Comando

Os probes de comando são executados antes e depois que um comando do cliente é executado, incluindo qualquer SQL statement que possa ser executada durante esse período. Comandos incluem operações como a inicialização do Database, o uso da operação `COM_CHANGE_USER` (suportada pelo protocolo MySQL) e a manipulação de prepared statements. Muitos desses comandos são usados apenas pela API de cliente do MySQL a partir de vários connectors como PHP e Java.

```sql
command-start(connectionid, command, user, host)
command-done(status)
```

* `command-start`: Acionado quando um comando é submetido ao server.

  + `connectionid`: O ID de conexão do cliente que está executando o comando.

  + `command`: Um inteiro que representa o comando que foi executado. Os valores possíveis são mostrados na tabela a seguir.

    | Valor | Nome | Descrição |
    | :--- | :--- | :--- |
    | 00 | COM_SLEEP | Estado interno da Thread |
    | 01 | COM_QUIT | Fechar conexão |
    | 02 | COM_INIT_DB | Selecionar Database (<code>USE ...</code>) |
    | 03 | COM_QUERY | Executar uma Query |
    | 04 | COM_FIELD_LIST | Obter uma lista de Fields |
    | 05 | COM_CREATE_DB | Criar um Database (obsoleto) |
    | 06 | COM_DROP_DB | Eliminar um Database (obsoleto) |
    | 07 | COM_REFRESH | Atualizar conexão |
    | 08 | COM_SHUTDOWN | Desligar Server |
    | 09 | COM_STATISTICS | Obter estatísticas |
    | 10 | COM_PROCESS_INFO | Obter processos (<code>SHOW PROCESSLIST</code>) |
    | 11 | COM_CONNECT | Inicializar conexão |
    | 12 | COM_PROCESS_KILL | Encerrar processo |
    | 13 | COM_DEBUG | Obter informações de Debug |
    | 14 | COM_PING | Ping |
    | 15 | COM_TIME | Estado interno da Thread |
    | 16 | COM_DELAYED_INSERT | Estado interno da Thread |
    | 17 | COM_CHANGE_USER | Mudar usuário |
    | 18 | COM_BINLOG_DUMP | Usado por uma réplica ou **mysqlbinlog** para iniciar uma leitura de binary log |
    | 19 | COM_TABLE_DUMP | Usado por uma réplica para obter as informações da tabela de origem |
    | 20 | COM_CONNECT_OUT | Usado por uma réplica para registrar uma conexão com o server |
    | 21 | COM_REGISTER_SLAVE | Usado por uma réplica durante o registro |
    | 22 | COM_STMT_PREPARE | Preparar um Statement |
    | 23 | COM_STMT_EXECUTE | Executar um Statement |
    | 24 | COM_STMT_SEND_LONG_DATA | Usado por um cliente ao solicitar dados estendidos |
    | 25 | COM_STMT_CLOSE | Fechar um prepared statement |
    | 26 | COM_STMT_RESET | Resetar um prepared statement |
    | 27 | COM_SET_OPTION | Definir uma Server option |
    | 28 | COM_STMT_FETCH | Fazer Fetch de um prepared statement |

  + `user`: O usuário executando o comando.

  + `host`: O client host.
* `command-done`: Acionado quando a execução do comando é concluída. O argumento `status` contém 0 se o comando foi executado com sucesso ou 1 se o statement foi encerrado antes da conclusão normal.

Os probes `command-start` e `command-done` são melhor utilizados quando combinados com os statement probes para obter uma ideia do tempo total de execução.

##### 5.8.4.1.3 Probes de Query

Os probes `query-start` e `query-done` são acionados quando uma Query específica é recebida pelo server e quando a Query foi concluída e a informação foi enviada com sucesso para o cliente.

```sql
query-start(query, connectionid, database, user, host)
query-done(status)
```

* `query-start`: Acionado depois que a string da Query foi recebida do cliente. Os argumentos são:

  + `query`: O texto completo da Query submetida.

  + `connectionid`: O ID de conexão do cliente que submeteu a Query. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor `Id` na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `database`: O nome do Database no qual a Query está sendo executada.

  + `user`: O nome de usuário usado para conectar-se ao server.

  + `host`: O hostname do cliente.
* `query-done`: Acionado assim que a Query é executada e a informação é retornada ao cliente. O probe inclui um único argumento, `status`, que retorna 0 quando a Query é executada com sucesso e 1 se houve um erro.

Você pode obter um relatório simples do tempo de execução para cada Query usando o seguinte script D:

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

Ao executar o script acima, você deve obter uma ideia básica do tempo de execução de suas Queries:

```sql
$> ./query.d
Who                  Database             Query                                    Time(ms)
root@localhost       test                 select * from t1 order by i limit 10     0
root@localhost       test                 set global query_cache_size=0            0
root@localhost       test                 select * from t1 order by i limit 10     776
root@localhost       test                 select * from t1 order by i limit 10     773
root@localhost       test                 select * from t1 order by i desc limit 10 795
```

##### 5.8.4.1.4 Probes de Parsing de Query

Os probes de Parsing de Query são acionados antes que o SQL statement original seja parseado e quando o parsing do statement e a determinação do modelo de execução exigido para processar o statement foram concluídos:

```sql
query-parse-start(query)
query-parse-done(status)
```

* `query-parse-start`: Acionado pouco antes de o statement ser parseado pelo query parser do MySQL. O único argumento, `query`, é uma string contendo o texto completo da Query original.

* `query-parse-done`: Acionado quando o parsing do statement original foi concluído. O `status` é um inteiro que descreve o status da operação. Um `0` indica que a Query foi parseada com sucesso. Um `1` indica que o parsing da Query falhou.

Por exemplo, você poderia monitorar o tempo de execução para o parsing de uma determinada Query usando o seguinte script D:

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

No script acima, um predicate é usado em `query-parse-done` para que uma saída diferente seja gerada com base no valor do status do probe.

Ao executar o script e monitorar a execução:

```sql
$> ./query-parsing.d
Error parsing select from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 36 ms
Parsing select * from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 176 ms
```

##### 5.8.4.1.5 Probes do Query Cache

Os probes do Query Cache são disparados ao executar qualquer Query. O probe `query-cache-hit` é acionado quando uma Query existe no Query Cache e pode ser usado para retornar a informação do Query Cache. Os argumentos contêm o texto original da Query e o número de linhas retornadas do Query Cache para a Query. Se a Query não estiver dentro do Query Cache, ou se o Query Cache não estiver habilitado, o probe `query-cache-miss` é acionado em vez disso.

```sql
query-cache-hit(query, rows)
query-cache-miss(query)
```

* `query-cache-hit`: Acionado quando a Query é encontrada dentro do Query Cache. O primeiro argumento, `query`, contém o texto original da Query. O segundo argumento, `rows`, é um inteiro contendo o número de linhas na Query em cache.

* `query-cache-miss`: Acionado quando a Query não é encontrada dentro do Query Cache. O primeiro argumento, `query`, contém o texto original da Query.

Os probes do Query Cache são melhor combinados com um probe na Query principal para que você possa determinar as diferenças de tempo entre usar ou não usar o Query Cache para Queries especificadas. Por exemplo, no seguinte script D, as informações da Query e do Query Cache são combinadas na saída de informação durante o monitoramento:

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

Ao executar o script, você pode ver os efeitos do Query Cache. Inicialmente, o Query Cache está desabilitado. Se você definir o tamanho do Query Cache e então executar a Query várias vezes, você deverá ver que o Query Cache está sendo usado para retornar os dados da Query:

```sql
$> ./query-cache.d
root@localhost       test                 select * from t1 order by i limit 10     N  1072
root@localhost                            set global query_cache_size=262144       N  0
root@localhost       test                 select * from t1 order by i limit 10     N  781
root@localhost       test                 select * from t1 order by i limit 10     Y  0
```

##### 5.8.4.1.6 Probes de Execução de Query

O probe de execução de Query é acionado quando a execução real da Query começa, após o parsing e a verificação do Query Cache, mas antes de qualquer verificação de privilégio ou optimization. Ao comparar a diferença entre os probes `start` e `done`, você pode monitorar o tempo realmente gasto para atender à Query (em vez de apenas lidar com o parsing e outros elementos da Query).

```sql
query-exec-start(query, connectionid, database, user, host, exec_type)
query-exec-done(status)
```

Nota

A informação fornecida nos argumentos para `query-start` e `query-exec-start` é quase idêntica e projetada para que você possa optar por monitorar todo o processo da Query (usando `query-start`) ou apenas a execução (usando `query-exec-start`) enquanto expõe as informações centrais sobre o user, client e a Query que está sendo executada.

* `query-exec-start`: Acionado quando a execução de uma Query individual é iniciada. Os argumentos são:

  + `query`: O texto completo da Query submetida.

  + `connectionid`: O ID de conexão do cliente que submeteu a Query. O ID de conexão é igual ao ID de conexão retornado quando o cliente se conecta pela primeira vez e ao valor `Id` na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `database`: O nome do Database no qual a Query está sendo executada.

  + `user`: O nome de usuário usado para conectar-se ao server.

  + `host`: O hostname do cliente.
  + `exec_type`: O tipo de execução. Os tipos de execução são determinados com base no conteúdo da Query e onde ela foi submetida. Os valores para cada tipo são mostrados na tabela a seguir.

    | Valor | Descrição |
    | :--- | :--- |
    | 0 | Query executada a partir de sql_parse, Query de nível superior. |
    | 1 | Prepared statement executado |
    | 2 | Cursor statement executado |
    | 3 | Query executada em stored procedure |

* `query-exec-done`: Acionado quando a execução da Query foi concluída. O probe inclui um único argumento, `status`, que retorna 0 quando a Query é executada com sucesso e 1 se houve um erro.

##### 5.8.4.1.7 Probes de Nível de Linha (Row-Level Probes)

Os probes `*row-{start,done}` são acionados cada vez que uma operação de linha é enviada a um storage engine. Por exemplo, se você executar um [`INSERT`](insert.html "13.2.5 INSERT Statement") statement com 100 linhas de dados, os probes `insert-row-start` e `insert-row-done` são acionados 100 vezes cada, para cada inserção de linha.

```sql
insert-row-start(database, table)
insert-row-done(status)

update-row-start(database, table)
update-row-done(status)

delete-row-start(database, table)
delete-row-done(status)
```

* `insert-row-start`: Acionado antes que uma linha seja inserida em uma tabela.

* `insert-row-done`: Acionado após uma linha ser inserida em uma tabela.

* `update-row-start`: Acionado antes que uma linha seja atualizada em uma tabela.

* `update-row-done`: Acionado após uma linha ser atualizada em uma tabela.

* `delete-row-start`: Acionado antes que uma linha seja excluída de uma tabela.

* `delete-row-done`: Acionado após uma linha ser excluída de uma tabela.

Os argumentos suportados pelos probes são consistentes para os probes `start` e `done` correspondentes em cada caso:

* `database`: O nome do Database.
* `table`: O nome da tabela.
* `status`: O status; 0 para sucesso ou 1 para falha.

Como os probes de nível de linha são acionados para cada acesso individual à linha, esses probes podem ser acionados milhares de vezes por segundo, o que pode ter um efeito prejudicial tanto no script de monitoramento quanto no MySQL. O ambiente DTrace deve limitar o acionamento desses probes para evitar que o performance seja afetado negativamente. Use os probes com moderação ou use funções de contador ou agregação para relatar esses probes e, em seguida, forneça um resumo quando o script for encerrado ou como parte dos probes `query-done` ou `query-exec-done`.

O seguinte script de exemplo resume a duração de cada operação de linha dentro de uma Query maior:

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

Ao executar o script acima com uma Query que insere dados em uma tabela, você pode monitorar o tempo exato gasto na execução da raw row insertion (inserção bruta de linha):

```sql
St Who        DB            ConnID    Dur ms Query
 0 @localhost test              13     20767 insert into t1(select * from t2)
                                        4827 -> Row ops
```

##### 5.8.4.1.8 Probes de Leitura de Linha (Read Row Probes)

Os read row probes são acionados no nível do storage engine cada vez que ocorre uma operação de leitura de linha. Esses probes são especificados dentro de cada storage engine (em oposição aos probes `*row-start` que estão na interface do storage engine). Portanto, esses probes podem ser usados para monitorar operações de nível de linha e performance de storage engine individuais. Como esses probes são acionados em torno da interface de leitura de linha do storage engine, eles podem ser atingidos um número significativo de vezes durante uma Query básica.

```sql
read-row-start(database, table, scan_flag)
read-row-done(status)
```

* `read-row-start`: Acionado quando uma linha é lida pelo storage engine do `database` e `table` especificados. O `scan_flag` é definido como 1 (true) quando a leitura faz parte de um table scan (ou seja, uma leitura sequencial), ou 0 (false) quando a leitura é de um registro específico.

* `read-row-done`: Acionado quando uma operação de leitura de linha dentro de um storage engine é concluída. O `status` retorna 0 em caso de sucesso, ou um valor positivo em caso de falha.

##### 5.8.4.1.9 Probes de Index

Os index probes são acionados cada vez que uma linha é lida usando um dos Indexes para a tabela especificada. O probe é acionado dentro do storage engine correspondente para a tabela.

```sql
index-read-row-start(database, table)
index-read-row-done(status)
```

* `index-read-row-start`: Acionado quando uma linha é lida pelo storage engine do `database` e `table` especificados.

* `index-read-row-done`: Acionado quando uma operação de leitura de linha indexada dentro de um storage engine é concluída. O `status` retorna 0 em caso de sucesso, ou um valor positivo em caso de falha.

##### 5.8.4.1.10 Probes de Lock

Os lock probes são chamados sempre que um external Lock é solicitado pelo MySQL para uma tabela usando o mecanismo de Lock correspondente na tabela, conforme definido pelo tipo de engine da tabela. Existem três tipos diferentes de Lock: as operações de Read Lock, Write Lock e Unlock. Usando os probes, você pode determinar a duração da rotina de external locking (ou seja, o tempo que o storage engine leva para implementar o Lock, incluindo qualquer tempo de espera para que outro Lock fique livre) e a duração total do processo de Lock/Unlock.

```sql
handler-rdlock-start(database, table)
handler-rdlock-done(status)

handler-wrlock-start(database, table)
handler-wrlock-done(status)

handler-unlock-start(database, table)
handler-unlock-done(status)
```

* `handler-rdlock-start`: Acionado quando um Read Lock é solicitado no `database` e `table` especificados.

* `handler-wrlock-start`: Acionado quando um Write Lock é solicitado no `database` e `table` especificados.

* `handler-unlock-start`: Acionado quando uma solicitação de Unlock é feita no `database` e `table` especificados.

* `handler-rdlock-done`: Acionado quando uma solicitação de Read Lock é concluída. O `status` é 0 se a operação de Lock foi bem-sucedida, ou `>0` em caso de falha.

* `handler-wrlock-done`: Acionado quando uma solicitação de Write Lock é concluída. O `status` é 0 se a operação de Lock foi bem-sucedida, ou `>0` em caso de falha.

* `handler-unlock-done`: Acionado quando uma solicitação de Unlock é concluída. O `status` é 0 se a operação de Unlock foi bem-sucedida, ou `>0` em caso de falha.

Você pode usar arrays para monitorar o Lock e Unlock de tabelas individuais e, em seguida, calcular a duração do Lock total da tabela usando o seguinte script:

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

Quando executado, você deve obter informações tanto sobre a duração do processo de locking em si, quanto dos Locks em uma tabela específica:

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

##### 5.8.4.1.11 Probes de Filesort

Os filesort probes são acionados sempre que uma operação filesort é aplicada a uma tabela. Para mais informações sobre filesort e as condições sob as quais ele ocorre, consulte [Seção 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization").

```sql
filesort-start(database, table)
filesort-done(status, rows)
```

* `filesort-start`: Acionado quando a operação filesort começa em uma tabela. Os dois argumentos para o probe, `database` e `table`, identificam a tabela que está sendo ordenada.

* `filesort-done`: Acionado quando a operação filesort é concluída. São fornecidos dois argumentos: o `status` (0 para sucesso, 1 para falha) e o número de linhas ordenadas durante o processo filesort.

Um exemplo disso está no seguinte script, que rastreia a duração do processo filesort, além da duração da Query principal:

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

Executando uma Query em uma tabela grande com uma cláusula `ORDER BY` que aciona um filesort, e então criando um Index na tabela e repetindo a mesma Query, você pode ver a diferença na velocidade de execução:

```sql
St Who        DB            ConnID       Dur microsec Query
 0 @localhost test              14           11335469 Filesort on t1
 0 @localhost test              14           11335787 select * from t1 order by i limit 100
 0 @localhost test              14          466734378 create index t1a on t1 (i)
 0 @localhost test              14              26472 select * from t1 order by i limit 100
```

##### 5.8.4.1.12 Probes de Statement

Os probes de Statement individuais são fornecidos para dar informações específicas sobre diferentes tipos de Statement. Para os probes `start`, a string da Query é fornecida como o único argumento. Dependendo do tipo de Statement, a informação fornecida pelo probe `done` correspondente pode diferir. Para todos os probes `done`, o status da operação (`0` para sucesso, `>0` para falha) é fornecido. Para operações [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`INSERT ... (SELECT FROM ...)`](insert.html "13.2.5 INSERT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`DELETE FROM t1,t2`](delete.html "13.2.2 DELETE Statement"), o número de linhas afetadas é retornado.

Para statements [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`UPDATE t1,t2 ...`](update.html "13.2.11 UPDATE Statement"), o número de linhas matched (correspondidas) e o número de linhas realmente changed (alteradas) são fornecidos. Isso ocorre porque o número de linhas realmente correspondidas pela cláusula `WHERE` correspondente e o número de linhas alteradas podem ser diferentes. O MySQL não atualiza o valor de uma linha se o valor já corresponder à nova configuração.

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

* `select-start`: Acionado antes de um statement [`SELECT`](select.html "13.2.9 SELECT Statement").

* `select-done`: Acionado no final de um statement [`SELECT`](select.html "13.2.9 SELECT Statement").

* `insert-start`: Acionado antes de um statement [`INSERT`](insert.html "13.2.5 INSERT Statement").

* `insert-done`: Acionado no final de um statement [`INSERT`](insert.html "13.2.5 INSERT Statement").

* `insert-select-start`: Acionado antes de um statement [`INSERT ... SELECT`](insert.html "13.2.5 INSERT Statement").

* `insert-select-done`: Acionado no final de um statement [`INSERT ... SELECT`](insert.html "13.2.5 INSERT Statement").

* `update-start`: Acionado antes de um statement [`UPDATE`](update.html "13.2.11 UPDATE Statement").

* `update-done`: Acionado no final de um statement [`UPDATE`](update.html "13.2.11 UPDATE Statement").

* `multi-update-start`: Acionado antes de um statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") envolvendo múltiplas tabelas.

* `multi-update-done`: Acionado no final de um statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") envolvendo múltiplas tabelas.

* `delete-start`: Acionado antes de um statement [`DELETE`](delete.html "13.2.2 DELETE Statement").

* `delete-done`: Acionado no final de um statement [`DELETE`](delete.html "13.2.2 DELETE Statement").

* `multi-delete-start`: Acionado antes de um statement [`DELETE`](delete.html "13.2.2 DELETE Statement") envolvendo múltiplas tabelas.

* `multi-delete-done`: Acionado no final de um statement [`DELETE`](delete.html "13.2.2 DELETE Statement") envolvendo múltiplas tabelas.

Os argumentos para os statement probes são:

* `query`: A string da Query.
* `status`: O status da Query. `0` para sucesso e `>0` para falha.

* `rows`: O número de linhas afetadas pelo statement. Isso retorna o número de linhas encontradas para [`SELECT`](select.html "13.2.9 SELECT Statement"), o número de linhas excluídas para [`DELETE`](delete.html "13.2.2 DELETE Statement") e o número de linhas inseridas com sucesso para [`INSERT`](insert.html "13.2.5 INSERT Statement").

* `rowsmatched`: O número de linhas correspondidas pela cláusula `WHERE` de uma operação [`UPDATE`](update.html "13.2.11 UPDATE Statement").

* `rowschanged`: O número de linhas realmente alteradas durante uma operação [`UPDATE`](update.html "13.2.11 UPDATE Statement").

Você usa esses probes para monitorar a execução desses tipos de statement sem ter que monitorar o user ou client que está executando os statements. Um exemplo simples disso é rastrear os tempos de execução:

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

Quando executado, você pode ver os tempos básicos de execução e as linhas correspondidas:

```sql
Query                                                        RowsU    RowsM    Dur (ms)
select * from t2                                             0        275      0
insert into t2 (select * from t2)                            0        275      9
update t2 set i=5 where i > 75                               110      110      8
update t2 set i=5 where i < 25                               254      134      12
delete from t2 where i < 5                                   0        0        0
```

Outra alternativa é usar as funções de agregação no DTrace para agregar o tempo de execução de statements individuais:

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

O script que acabou de ser mostrado agrega os tempos gastos em cada operação, o que pode ser usado para ajudar a fazer o benchmark de um conjunto padrão de testes.

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

##### 5.8.4.1.13 Probes de Network

Os network probes monitoram a transferência de informação do server MySQL e clientes de todos os tipos pela Network. Os probes são definidos da seguinte forma:

```sql
net-read-start()
net-read-done(status, bytes)
net-write-start(bytes)
net-write-done(status)
```

* `net-read-start`: Acionado quando uma operação de network read (leitura de Network) é iniciada.

* `net-read-done`: Acionado quando a operação de network read é concluída. O `status` é um `integer` que representa o status de retorno da operação, `0` para sucesso e `1` para falha. O argumento `bytes` é um inteiro que especifica o número de bytes lidos durante o processo.

* `net-start-bytes`: Acionado quando dados são escritos em um network socket. O único argumento, `bytes`, especifica o número de bytes escritos no network socket.

* `net-write-done`: Acionado quando a operação de network write (escrita de Network) foi concluída. O único argumento, `status`, é um inteiro que representa o status de retorno da operação, `0` para sucesso e `1` para falha.

Você pode usar os network probes para monitorar o tempo gasto lendo e escrevendo para clientes de Network durante a execução. O seguinte script D fornece um exemplo disso. Tanto o tempo cumulativo para a leitura ou escrita é calculado, quanto o número de bytes. Observe que o tamanho da variável dinâmica foi aumentado (usando a opção `dynvarsize`) para lidar com o disparo rápido dos probes individuais para as leituras/escritas de Network.

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

Ao executar o script acima em uma máquina com um cliente remoto, você pode ver que aproximadamente um terço do tempo gasto na execução da Query está relacionado à escrita dos resultados da Query de volta ao cliente.

```sql
St Who                            DB            ConnID       Dur microsec Query
 0 root@::ffff:198.51.100.108      test              31               3495 select * from t1 limit 1000000
Net read: 0 bytes (0 ms) write: 10000075 bytes (1220 ms)
```

##### 5.8.4.1.14 Probes de Keycache

Os keycache probes são acionados ao usar o Index Key Cache utilizado com o storage engine MyISAM. Existem probes para monitorar quando os dados são lidos no keycache, quando os dados de chave em cache são escritos do cache para um arquivo em cache, ou ao acessar o keycache.

O uso do Keycache indica quando os dados são lidos ou escritos dos arquivos de Index no cache, e pode ser usado para monitorar a eficiência com que a memória alocada para o keycache está sendo utilizada. Um alto número de keycache reads em um intervalo de Queries pode indicar que o keycache é muito pequeno para o volume de dados que está sendo acessado.

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

Ao ler dados dos arquivos de Index no keycache, o processo primeiro inicializa a operação de leitura (indicada por `keycache-read-start`), depois carrega blocks de dados (`keycache-read-block`) e, em seguida, o block lido corresponde aos dados que estão sendo identificados (`keycache-read-hit`) ou mais dados precisam ser lidos (`keycache-read-miss`). Uma vez que a operação de leitura tenha sido concluída, a leitura para com `keycache-read-done`.

Os dados podem ser lidos do arquivo de Index para o keycache somente quando a chave especificada ainda não está dentro do keycache.

* `keycache-read-start`: Acionado quando a operação de leitura do keycache é iniciada. Os dados são lidos do `filepath` especificado, lendo o número especificado de `bytes`. Os campos `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.

* `keycache-read-block`: Acionado quando o keycache lê um block de dados, do número especificado de `bytes`, do arquivo de Index para o keycache.

* `keycache-read-hit`: Acionado quando o block de dados lido do arquivo de Index corresponde aos dados de chave solicitados.

* `keycache-read-miss`: Acionado quando o block de dados lido do arquivo de Index não corresponde aos dados de chave necessários.

* `keycache-read-done`: Acionado quando a operação de leitura do keycache foi concluída. Os campos `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.

As escritas no Keycache ocorrem quando a informação do Index é atualizada durante uma operação `INSERT`, `UPDATE` ou `DELETE`, e a informação da chave em cache é descarregada de volta para o arquivo de Index.

* `keycache-write-start`: Acionado quando a operação de escrita do keycache é iniciada. Os dados são escritos no `filepath` especificado, lendo o número especificado de `bytes`. Os campos `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.

* `keycache-write-block`: Acionado quando o keycache escreve um block de dados, do número especificado de `bytes`, para o arquivo de Index a partir do keycache.

* `keycache-write-done`: Acionado quando a operação de escrita do keycache foi concluída. Os campos `mem_used` e `mem_avail` indicam a memória atualmente usada pelo keycache e a quantidade de memória disponível dentro do keycache.