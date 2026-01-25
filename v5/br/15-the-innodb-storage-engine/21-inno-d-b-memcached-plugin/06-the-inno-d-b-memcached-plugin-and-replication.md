### 14.21.6 O Plugin memcached do InnoDB e a Replication

Como o plugin `daemon_memcached` suporta o Binary Log do MySQL, as atualizações feitas em um Source Server através da interface **memcached** podem ser replicadas para backup, balanceamento de cargas de trabalho de leitura intensivas e alta disponibilidade. Todos os comandos **memcached** são suportados com logging do Binary Log.

Você não precisa configurar o plugin `daemon_memcached` em Replica Servers. A principal vantagem desta configuração é o aumento do *throughput* de escrita no Source. A velocidade do mecanismo de Replication não é afetada.

As seções a seguir mostram como usar a capacidade do Binary Log ao utilizar o plugin `daemon_memcached` com MySQL Replication. Assume-se que você tenha concluído a configuração descrita na Seção 14.21.3, “Configurando o Plugin memcached do InnoDB”.

#### Habilitando o Binary Log do memcached no InnoDB

1. Para usar o plugin `daemon_memcached` com o Binary Log do MySQL, habilite a opção de configuração `innodb_api_enable_binlog` no Source Server. Esta opção só pode ser definida na inicialização do Server. Você também deve habilitar o Binary Log do MySQL no Source Server usando a opção `--log-bin`. Você pode adicionar estas opções ao arquivo de configuração do MySQL, ou na linha de comando do **mysqld**.

   ```sql
   mysqld ... --log-bin -–innodb_api_enable_binlog=1
   ```

2. Configure o Source Server e o Replica Server, conforme descrito na Seção 16.1.2, “Configurando a Replication Baseada em Posição de Arquivo do Binary Log”.

3. Use **mysqldump** para criar um *snapshot* dos dados do Source e sincronize o *snapshot* com o Replica Server.

   ```sql
   source $> mysqldump --all-databases --lock-all-tables > dbdump.db
   replica $> mysql < dbdump.db
   ```

4. No Source Server, execute `SHOW MASTER STATUS` para obter as coordenadas do Binary Log do Source.

   ```sql
   mysql> SHOW MASTER STATUS;
   ```

5. No Replica Server, use uma instrução `CHANGE MASTER TO` para configurar um Replica Server utilizando as coordenadas do Binary Log do Source.

   ```sql
   mysql> CHANGE MASTER TO
          MASTER_HOST='localhost',
          MASTER_USER='root',
          MASTER_PASSWORD='',
          MASTER_PORT = 13000,
          MASTER_LOG_FILE='0.000001,
          MASTER_LOG_POS=114;
   ```

6. Inicie a Replica.

   ```sql
   mysql> START SLAVE;
   ```

   Se o log de erros imprimir uma saída semelhante à seguinte, a Replica está pronta para Replication.

   ```sql
   2013-09-24T13:04:38.639684Z 49 [Note] Slave I/O thread: connected to
   master 'root@localhost:13000', replication started in log '0.000001'
   at position 114
   ```

#### Testando a Configuração de Replication memcached do InnoDB

Este exemplo demonstra como testar a configuração de Replication **memcached** do `InnoDB` usando **memcached** e telnet para inserir, atualizar e deletar dados. Um Client MySQL é usado para verificar os resultados nos Source Servers e Replica Servers.

O exemplo usa a tabela `demo_test`, que foi criada pelo script de configuração `innodb_memcached_config.sql` durante a configuração inicial do plugin `daemon_memcached`. A tabela `demo_test` contém um único registro de exemplo.

1. Use o comando `set` para inserir um registro com uma Key de `test1`, um *flag value* de `10`, um valor de expiração de `0`, um *cas value* de 1 e um Value de `t1`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 1
   t1
   STORED
   ```

2. No Source Server, verifique se o registro foi inserido na tabela `demo_test`. Assumindo que a tabela `demo_test` não foi modificada anteriormente, deve haver dois registros. O registro de exemplo com uma Key de `AA`, e o registro que você acabou de inserir, com uma Key de `test1`. A coluna `c1` mapeia para a Key, a coluna `c2` para o Value, a coluna `c3` para o *flag value*, a coluna `c4` para o *cas value* e a coluna `c5` para o tempo de expiração. O tempo de expiração foi definido como 0, pois não é utilizado.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

3. Verifique se o mesmo registro foi replicado para o Replica Server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

4. Use o comando `set` para atualizar a Key para um Value de `new`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 2
   new
   STORED
   ```

   A atualização é replicada para o Replica Server (observe que o *cas value* também é atualizado).

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | new          |   10 |    2 |    0 |
   +-------+--------------+------+------+------+
   ```

5. Delete o registro `test1` usando um comando `delete`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   delete test1
   DELETED
   ```

   Quando a operação `delete` é replicada para a Replica, o registro `test1` na Replica também é deletado.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+--------------+------+------+------+
   | c1 | c2           | c3   | c4   | c5   |
   +----+--------------+------+------+------+
   | AA | HELLO, HELLO |    8 |    0 |    0 |
   +----+--------------+------+------+------+
   ```

6. Remova todas as linhas da tabela usando o comando `flush_all`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

   ```sql
   mysql> SELECT * FROM test.demo_test;
   Empty set (0.00 sec)
   ```

7. Use telnet para o Source Server e insira dois novos registros.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'
   set test2 10 0 4
   again
   STORED
   set test3 10 0 5
   again1
   STORED
   ```

8. Confirme que os dois registros foram replicados para o Replica Server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | test2 | again        |   10 |    4 |    0 |
   | test3 | again1       |   10 |    5 |    0 |
   +-------+--------------+------+------+------+
   ```

9. Remova todas as linhas da tabela usando o comando `flush_all`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

10. Verifique para garantir que a operação `flush_all` foi replicada no Replica Server.

    ```sql
    mysql> SELECT * FROM test.demo_test;
    Empty set (0.00 sec)
    ```

#### Notas sobre o Binary Log do memcached no InnoDB

Formato do Binary Log:

* A maioria das operações **memcached** é mapeada para instruções DML (análogas a insert, delete, update). Visto que não há uma instrução SQL real sendo processada pelo MySQL Server, todos os comandos **memcached** (exceto `flush_all`) usam o logging de Replication Baseada em Linhas (RBR), o que é independente de qualquer configuração `binlog_format` do Server.

* O comando `flush_all` do **memcached** é mapeado para o comando `TRUNCATE TABLE`. Como os comandos DDL só podem usar logging baseado em Statement, o comando `flush_all` é replicado enviando uma instrução `TRUNCATE TABLE`.

Transactions:

* O conceito de Transactions tipicamente não faz parte das aplicações **memcached**. Para considerações de performance, `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` são usados para controlar o tamanho do Batch para Transactions de leitura (*read*) e escrita (*write*). Essas configurações não afetam a Replication. Cada operação SQL na tabela `InnoDB` subjacente é replicada após a conclusão bem-sucedida.

* O valor padrão de `daemon_memcached_w_batch_size` é `1`, o que significa que cada operação de escrita **memcached** é Committed imediatamente. Esta configuração padrão incorre em uma certa sobrecarga de performance para evitar inconsistências nos dados que são visíveis nos Source Servers e Replica Servers. Os registros replicados estão sempre disponíveis imediatamente no Replica Server. Se você definir `daemon_memcached_w_batch_size` para um valor maior que `1`, os registros inseridos ou atualizados via **memcached** não são imediatamente visíveis no Source Server; para visualizar os registros no Source Server antes que sejam Committed, execute `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`.