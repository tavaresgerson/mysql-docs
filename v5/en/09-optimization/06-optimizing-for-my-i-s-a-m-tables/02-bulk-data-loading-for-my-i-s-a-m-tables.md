### 8.6.2 Carregamento Massivo de Dados para Tabelas MyISAM

Estas dicas de desempenho complementam as diretrizes gerais para INSERTs rápidos na Seção 8.2.4.1, “Otimizando Instruções INSERT”.

* Para uma tabela `MyISAM`, você pode usar INSERTs concorrentes para adicionar linhas ao mesmo tempo que instruções `SELECT` estão sendo executadas, se não houver linhas excluídas no meio do arquivo de dados. Consulte a Seção 8.11.3, “Concurrent Inserts”.

* Com algum trabalho extra, é possível fazer o `LOAD DATA` rodar ainda mais rápido para uma tabela `MyISAM` quando a tabela possui muitos Indexes. Utilize o seguinte procedimento:

  1. Execute uma instrução `FLUSH TABLES` ou um comando **mysqladmin flush-tables**.

  2. Use **myisamchk --keys-used=0 -rq *`/path/to/db/tbl_name`*** para remover todo o uso de Indexes para a tabela.

  3. Insira dados na tabela com `LOAD DATA`. Isso não atualiza nenhum Index e, portanto, é muito rápido.

  4. Se você pretende apenas ler a tabela no futuro, use **myisampack** para compactá-la. Consulte a Seção 15.2.3.3, “Compressed Table Characteristics”.

  5. Recrie os Indexes com **myisamchk -rq *`/path/to/db/tbl_name`***. Isso cria a árvore de Index na memória antes de gravá-la no disco, o que é muito mais rápido do que atualizar o Index durante o `LOAD DATA`, pois evita muitas buscas em disco (*disk seeks*). A árvore de Index resultante também fica perfeitamente balanceada.

  6. Execute uma instrução `FLUSH TABLES` ou um comando **mysqladmin flush-tables**.

  O `LOAD DATA` executa a otimização anterior automaticamente se a tabela `MyISAM` na qual você insere dados estiver vazia. A principal diferença entre a otimização automática e o uso explícito do procedimento é que você pode permitir que o **myisamchk** aloque muito mais memória temporária para a criação do Index do que você gostaria que o servidor alocasse para a recriação do Index ao executar a instrução `LOAD DATA`.

  Você também pode desabilitar ou habilitar os Indexes não únicos para uma tabela `MyISAM` usando as seguintes instruções em vez de **myisamchk**. Se você usar estas instruções, poderá pular as operações `FLUSH TABLES`:

  ```sql
  ALTER TABLE tbl_name DISABLE KEYS;
  ALTER TABLE tbl_name ENABLE KEYS;
  ```

* Para acelerar operações de `INSERT` que são executadas com múltiplas instruções em tabelas não transacionais, aplique Lock nas suas tabelas:

  ```sql
  LOCK TABLES a WRITE;
  INSERT INTO a VALUES (1,23),(2,34),(4,33);
  INSERT INTO a VALUES (8,26),(6,29);
  ...
  UNLOCK TABLES;
  ```

  Isso beneficia o desempenho porque o Buffer de Index é descarregado para o disco apenas uma vez, após todas as instruções `INSERT` serem concluídas. Normalmente, haveria tantas descargas do Buffer de Index quanto há instruções `INSERT`. Instruções de Lock explícitas não são necessárias se você puder inserir todas as linhas com um único `INSERT`.

  O Lock também reduz o tempo total em testes de múltiplas conexões, embora o tempo máximo de espera para conexões individuais possa aumentar porque elas esperam pelos Locks. Suponha que cinco clientes tentem executar INSERTs simultaneamente da seguinte forma:

  + Conexão 1 executa 1000 INSERTs
  + Conexões 2, 3 e 4 executam 1 INSERT
  + Conexão 5 executa 1000 INSERTs

  Se você não usar Lock, as conexões 2, 3 e 4 terminam antes de 1 e 5. Se você usar Lock, as conexões 2, 3 e 4 provavelmente não terminarão antes de 1 ou 5, mas o tempo total deve ser cerca de 40% mais rápido.

  Operações `INSERT`, `UPDATE` e `DELETE` são muito rápidas no MySQL, mas você pode obter um desempenho geral melhor adicionando Locks em torno de tudo o que faz mais do que cerca de cinco INSERTs ou UPDATEs sucessivos. Se você fizer muitos INSERTs sucessivos, você pode executar um `LOCK TABLES` seguido por um `UNLOCK TABLES` ocasionalmente (a cada 1.000 linhas ou mais) para permitir que outros Threads acessem a tabela. Isso ainda resultaria em um bom ganho de desempenho.

  O `INSERT` ainda é muito mais lento para carregar dados do que o `LOAD DATA`, mesmo ao usar as estratégias que acabamos de descrever.

* Para aumentar o desempenho das tabelas `MyISAM`, tanto para `LOAD DATA` quanto para `INSERT`, amplie o cache de chaves (*key cache*) aumentando a variável de sistema `key_buffer_size`. Consulte a Seção 5.1.1, “Configuring the Server”.