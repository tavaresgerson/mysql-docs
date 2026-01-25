### 14.5.2 Change Buffer

O change buffer é uma estrutura de dados especial que armazena em cache alterações em páginas de secondary index quando essas páginas não estão no buffer pool. As alterações armazenadas em buffer, que podem resultar de operações `INSERT`, `UPDATE` ou `DELETE` (DML), são mescladas posteriormente quando as páginas são carregadas no buffer pool por outras operações de leitura.

**Figura 14.3 Change Buffer**

![Content is described in the surrounding text.](images/innodb-change-buffer.png)

Diferentemente dos clustered indexes, os secondary indexes geralmente não são únicos, e as inserções neles ocorrem em uma ordem relativamente aleatória. Da mesma forma, exclusões e atualizações podem afetar páginas de secondary index que não estão localizadas adjacentes em uma index tree. A mesclagem de alterações em cache em um momento posterior, quando as páginas afetadas são lidas no buffer pool por outras operações, evita I/O de acesso aleatório substancial que seria necessário para ler páginas de secondary index do disk para o buffer pool.

Periodicamente, a operação purge (limpeza) que é executada quando o sistema está majoritariamente ocioso, ou durante um desligamento lento (slow shutdown), grava as páginas de index atualizadas no disk. A operação purge pode gravar blocos de disk para uma série de valores de index de forma mais eficiente do que se cada valor fosse gravado no disk imediatamente.

A mesclagem do change buffer pode levar várias horas quando há muitas rows afetadas e numerosos secondary indexes a serem atualizados. Durante esse tempo, o disk I/O é aumentado, o que pode causar uma desaceleração significativa para queries limitadas pelo disk (disk-bound queries). A mesclagem do change buffer também pode continuar a ocorrer após a confirmação de uma transaction, e até mesmo após um desligamento e reinicialização do servidor (consulte a Seção 14.22.2, “Forçando a Recovery do InnoDB”, para mais informações).

Na memória, o change buffer ocupa parte do buffer pool. No disk, o change buffer faz parte do system tablespace, onde as alterações de index são armazenadas em buffer quando o servidor de database é desligado.

O tipo de dados armazenados em cache no change buffer é controlado pela variável `innodb_change_buffering`. Para mais informações, consulte Configurando o Change Buffering. Você também pode configurar o tamanho máximo do change buffer. Para mais informações, consulte Configurando o Tamanho Máximo do Change Buffer.

O change buffering não é suportado para um secondary index se o index contiver uma coluna de index descendente ou se a primary key incluir uma coluna de index descendente.

Para respostas a perguntas frequentes sobre o change buffer, consulte a Seção A.16, “FAQ do MySQL 5.7: InnoDB Change Buffer”.

#### Configurando o Change Buffering

Quando operações `INSERT`, `UPDATE` e `DELETE` são realizadas em uma tabela, os valores das colunas indexadas (particularmente os valores de secondary keys) estão frequentemente em uma ordem não classificada, exigindo I/O substancial para atualizar os secondary indexes. O change buffer armazena em cache as alterações nas entradas do secondary index quando a página relevante não está no buffer pool, evitando assim operações de I/O dispendiosas ao não ler imediatamente a página do disk. As alterações armazenadas em buffer são mescladas quando a página é carregada no buffer pool, e a página atualizada é posteriormente flushed para o disk. A main thread do `InnoDB` mescla as alterações em buffer quando o servidor está quase ocioso e durante um desligamento lento (slow shutdown).

Visto que pode resultar em menos leituras e gravações no disk, o change buffering é mais valioso para workloads limitadas por I/O (I/O-bound); por exemplo, aplicações com um alto volume de operações DML, como bulk inserts, se beneficiam do change buffering.

No entanto, o change buffer ocupa uma parte do buffer pool, reduzindo a memória disponível para armazenar em cache as data pages. Se o working set (conjunto de dados em uso) quase couber no buffer pool, ou se suas tabelas tiverem relativamente poucos secondary indexes, pode ser útil desabilitar o change buffering. Se o conjunto de dados de trabalho couber inteiramente no buffer pool, o change buffering não impõe overhead extra, pois se aplica apenas a páginas que não estão no buffer pool.

A variável `innodb_change_buffering` controla a extensão em que o `InnoDB` executa o change buffering. Você pode habilitar ou desabilitar o buffering para inserts, operações de delete (quando os registros de index são inicialmente marcados para exclusão) e operações purge (quando os registros de index são fisicamente excluídos). Uma operação update é uma combinação de um insert e um delete. O valor padrão de `innodb_change_buffering` é `all`.

Os valores permitidos para `innodb_change_buffering` incluem:

* **`all`**

  O valor padrão: armazena em buffer inserts, operações de marcação para delete (delete-marking operations) e purges.

* **`none`**

  Não armazena em buffer nenhuma operação.

* **`inserts`**

  Armazena em buffer operações de insert.

* **`deletes`**

  Armazena em buffer operações de marcação para delete (delete-marking operations).

* **`changes`**

  Armazena em buffer tanto inserts quanto operações de marcação para delete (delete-marking operations).

* **`purges`**

  Armazena em buffer operações de exclusão física que ocorrem em segundo plano.

Você pode definir a variável `innodb_change_buffering` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterá-la dinamicamente com a instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis globais do sistema. Consulte a Seção 5.1.8.1, “System Variable Privileges”. Alterar a configuração afeta o buffering de novas operações; a mesclagem de entradas existentes em buffer não é afetada.

#### Configurando o Tamanho Máximo do Change Buffer

A variável `innodb_change_buffer_max_size` permite configurar o tamanho máximo do change buffer como uma porcentagem do tamanho total do buffer pool. Por padrão, `innodb_change_buffer_max_size` é definido como 25. A configuração máxima é 50.

Considere aumentar `innodb_change_buffer_max_size` em um servidor MySQL com intensa atividade de insert, update e delete, onde a mesclagem do change buffer não acompanha o ritmo das novas entradas do change buffer, fazendo com que o change buffer atinja seu limite de tamanho máximo.

Considere diminuir `innodb_change_buffer_max_size` em um servidor MySQL com dados estáticos usados para relatórios, ou se o change buffer consumir muito espaço de memória compartilhado com o buffer pool, fazendo com que as páginas saiam do buffer pool (age out) mais cedo do que o desejado.

Teste diferentes configurações com uma workload representativa para determinar uma configuração ideal. A variável `innodb_change_buffer_max_size` é dinâmica, o que permite modificar a configuração sem reiniciar o servidor.

#### Monitorando o Change Buffer

As seguintes opções estão disponíveis para monitoramento do change buffer:

* A saída do Monitor Padrão do `InnoDB` inclui informações de status do change buffer. Para visualizar os dados do monitor, execute a instrução `SHOW ENGINE INNODB STATUS`.

  ```sql
  mysql> SHOW ENGINE INNODB STATUS\G
  ```

  As informações de status do change buffer estão localizadas sob o cabeçalho `INSERT BUFFER AND ADAPTIVE HASH INDEX` e são semelhantes ao seguinte:

  ```sql
  -------------------------------------
  INSERT BUFFER AND ADAPTIVE HASH INDEX
  -------------------------------------
  Ibuf: size 1, free list len 0, seg size 2, 0 merges
  merged operations:
   insert 0, delete mark 0, delete 0
  discarded operations:
   insert 0, delete mark 0, delete 0
  Hash table size 4425293, used cells 32, node heap has 1 buffer(s)
  13577.57 hash searches/s, 202.47 non-hash searches/s
  ```

  Para mais informações, consulte a Seção 14.18.3, “Saída do Monitor Padrão e do Lock Monitor do InnoDB”.

* A tabela `INNODB_METRICS` do Information Schema fornece a maioria dos pontos de dados encontrados na saída do Monitor Padrão do `InnoDB`, além de outros pontos de dados. Para visualizar as métricas do change buffer e uma descrição de cada uma, execute a seguinte Query:

  ```sql
  mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%ibuf%'\G
  ```

  Para informações sobre o uso da tabela `INNODB_METRICS`, consulte a Seção 14.16.6, “Tabela de Métricas INFORMATION_SCHEMA do InnoDB”.

* A tabela `INNODB_BUFFER_PAGE` do Information Schema fornece metadados sobre cada página no buffer pool, incluindo páginas de change buffer index e change buffer bitmap. As páginas do change buffer são identificadas por `PAGE_TYPE`. `IBUF_INDEX` é o tipo de página para páginas de change buffer index, e `IBUF_BITMAP` é o tipo de página para páginas de change buffer bitmap.

  Aviso: A Query na tabela `INNODB_BUFFER_PAGE` pode introduzir um overhead de performance significativo. Para evitar impacto na performance, reproduza o problema que deseja investigar em uma instância de teste e execute suas Queries na instância de teste.

  Por exemplo, você pode executar uma Query na tabela `INNODB_BUFFER_PAGE` para determinar o número aproximado de páginas `IBUF_INDEX` e `IBUF_BITMAP` como uma porcentagem do total de páginas do buffer pool.

  ```sql
  mysql> SELECT (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
         WHERE PAGE_TYPE LIKE 'IBUF%') AS change_buffer_pages,
         (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE) AS total_pages,
         (SELECT ((change_buffer_pages/total_pages)*100))
         AS change_buffer_page_percentage;
  +---------------------+-------------+-------------------------------+
  | change_buffer_pages | total_pages | change_buffer_page_percentage |
  +---------------------+-------------+-------------------------------+
  |                  25 |        8192 |                        0.3052 |
  +---------------------+-------------+-------------------------------+
  ```

  Para informações sobre outros dados fornecidos pela tabela `INNODB_BUFFER_PAGE`, consulte a Seção 24.4.2, “A Tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE”. Para informações de uso relacionadas, consulte a Seção 14.16.5, “Tabelas do Buffer Pool INFORMATION_SCHEMA do InnoDB”.

* O Performance Schema fornece instrumentação de mutex wait do change buffer para monitoramento avançado de performance. Para visualizar a instrumentação do change buffer, execute a seguinte Query:

  ```sql
  mysql> SELECT * FROM performance_schema.setup_instruments
         WHERE NAME LIKE '%wait/synch/mutex/innodb/ibuf%';
  +-------------------------------------------------------+---------+-------+
  | NAME                                                  | ENABLED | TIMED |
  +-------------------------------------------------------+---------+-------+
  | wait/synch/mutex/innodb/ibuf_bitmap_mutex             | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_mutex                    | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex | YES     | YES   |
  +-------------------------------------------------------+---------+-------+
  ```

  Para informações sobre o monitoramento de mutex waits do `InnoDB`, consulte a Seção 14.17.2, “Monitorando Mutex Waits do InnoDB Usando o Performance Schema”.