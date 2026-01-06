### 14.21.6 O Plugin e a Replicação do memcached do InnoDB

Como o plugin `daemon_memcached` suporta o log binário do MySQL, as atualizações feitas em um servidor fonte através da interface **memcached** podem ser replicadas para backup, equilíbrio de cargas de trabalho de leitura intensivas e alta disponibilidade. Todos os comandos **memcached** são suportados com registro binário.

Você não precisa configurar o plugin `daemon_memcached` nos servidores replicados. A principal vantagem dessa configuração é o aumento do desempenho de escrita na fonte. A velocidade do mecanismo de replicação não é afetada.

As seções a seguir mostram como usar a capacidade de registro binário ao usar o plugin `daemon_memcached` com a replicação do MySQL. Assume-se que você completou a configuração descrita na Seção 14.21.3, “Configurando o Plugin InnoDB memcached”.

#### Habilitar o log binário InnoDB memcached

1. Para usar o plugin `daemon_memcached` com o log binário do MySQL, habilite a opção de configuração `innodb_api_enable_binlog` no servidor de origem. Esta opção só pode ser definida durante o início do servidor. Você também deve habilitar o log binário do MySQL no servidor de origem usando a opção `--log-bin`. Você pode adicionar essas opções ao arquivo de configuração do MySQL ou na linha de comando do **mysqld**.

   ```sql
   mysqld ... --log-bin -–innodb_api_enable_binlog=1
   ```

2. Configure o servidor de origem e o servidor de replicação, conforme descrito na Seção 16.1.2, “Configuração da replicação com base na posição do arquivo de log binário”.

3. Use o **mysqldump** para criar um instantâneo de dados de origem e sincronize o instantâneo com o servidor replica.

   ```sql
   source $> mysqldump --all-databases --lock-all-tables > dbdump.db
   replica $> mysql < dbdump.db
   ```

4. No servidor de origem, execute `SHOW MASTER STATUS` para obter as coordenadas do log binário de origem.

   ```sql
   mysql> SHOW MASTER STATUS;
   ```

5. No servidor de replicação, use a instrução `CHANGE MASTER TO` para configurar um servidor de replicação usando as coordenadas do log binário de origem.

   ```sql
   mysql> CHANGE MASTER TO
          MASTER_HOST='localhost',
          MASTER_USER='root',
          MASTER_PASSWORD='',
          MASTER_PORT = 13000,
          MASTER_LOG_FILE='0.000001,
          MASTER_LOG_POS=114;
   ```

6. Comece a replica.

   ```sql
   mysql> START SLAVE;
   ```

   Se o log de erros imprimir uma saída semelhante à seguinte, a replica está pronta para a replicação.

   ```sql
   2013-09-24T13:04:38.639684Z 49 [Note] Slave I/O thread: connected to
   master 'root@localhost:13000', replication started in log '0.000001'
   at position 114
   ```

#### Testando a configuração de replicação do InnoDB memcached

Este exemplo demonstra como testar a configuração de replicação do **memcached** do **InnoDB** usando o **memcached** e o telnet para inserir, atualizar e excluir dados. Um cliente MySQL é usado para verificar os resultados nos servidores fonte e replica.

O exemplo utiliza a tabela `demo_test`, que foi criada pelo script de configuração `innodb_memcached_config.sql` durante a configuração inicial do plugin `daemon_memcached`. A tabela `demo_test` contém um único registro de exemplo.

1. Use o comando `set` para inserir um registro com uma chave de `test1`, um valor de bandeira de `10`, um valor de expiração de `0`, um valor de cas de 1 e um valor de `t1`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 1
   t1
   STORED
   ```

2. No servidor de origem, verifique se o registro foi inserido na tabela `demo_test`. Supondo que a tabela `demo_test` não tenha sido modificada anteriormente, deve haver dois registros. O registro de exemplo com uma chave de `AA` e o registro que você acabou de inserir, com uma chave de `test1`. A coluna `c1` corresponde à chave, a coluna `c2` ao valor, a coluna `c3` ao valor da bandeira, a coluna `c4` ao valor do cas e a coluna `c5` ao tempo de expiração. O tempo de expiração foi definido como 0, pois não é usado.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

3. Verifique para verificar se o mesmo registro foi replicado para o servidor de replicação.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

4. Use o comando `set` para atualizar a chave para um valor de `new`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 2
   new
   STORED
   ```

   A atualização é replicada para o servidor de replicação (observe que o valor `cas` também é atualizado).

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | new          |   10 |    2 |    0 |
   +-------+--------------+------+------+------+
   ```

5. Exclua o registro `test1` usando um comando `delete`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   delete test1
   DELETED
   ```

   Quando a operação `delete` é replicada para a replica, o registro `test1` na replica também é excluído.

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

7. Conecte-se ao servidor de origem pelo Telnet e insira dois novos registros.

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

8. Confirme que os dois registros foram replicados para o servidor de replicação.

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

10. Verifique se a operação `flush_all` foi replicada no servidor replica.

    ```sql
    mysql> SELECT * FROM test.demo_test;
    Empty set (0.00 sec)
    ```

#### Notas do log binário do InnoDB memcached

Formato do log binário:

- A maioria das operações do **memcached** é mapeada a instruções DML (análogo a inserir, excluir, atualizar). Como não há uma instrução SQL real sendo processada pelo servidor MySQL, todos os comandos do **memcached** (exceto o `flush_all`) usam o registro de Replicação Baseada em Linhas (RBR), que é independente de qualquer configuração do `binlog_format` do servidor.

- O comando **memcached** `flush_all` é mapeado para o comando `TRUNCATE TABLE`. Como os comandos DDL só podem usar o registro baseado em instruções, o comando `flush_all` é replicado enviando uma instrução `TRUNCATE TABLE`.

Transações:

- O conceito de transações não costumava fazer parte das aplicações do **memcached**. Por questões de desempenho, `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` são usados para controlar o tamanho do lote para transações de leitura e escrita. Esses ajustes não afetam a replicação. Cada operação SQL na tabela subjacente `InnoDB` é replicada após a conclusão bem-sucedida.

- O valor padrão de `daemon_memcached_w_batch_size` é `1`, o que significa que cada operação de escrita no **memcached** é confirmada imediatamente. Esta configuração padrão gera uma certa sobrecarga de desempenho para evitar inconsistências nos dados visíveis nos servidores de origem e replicação. Os registros replicados estão sempre disponíveis imediatamente no servidor replicador. Se você definir `daemon_memcached_w_batch_size` para um valor maior que `1`, os registros inseridos ou atualizados através do **memcached** não serão imediatamente visíveis no servidor de origem; para visualizar os registros no servidor de origem antes de serem confirmados, execute `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`.
