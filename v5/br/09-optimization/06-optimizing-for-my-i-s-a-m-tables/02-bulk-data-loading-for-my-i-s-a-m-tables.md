### 8.6.2 Carregamento de dados em lote para tabelas MyISAM

Esses conselhos de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 8.2.4.1, “Otimizando instruções INSERT”.

- Para uma tabela `MyISAM`, você pode usar inserções concorrentes para adicionar linhas ao mesmo tempo em que as instruções `SELECT` estão sendo executadas, desde que não haja linhas excluídas no meio do arquivo de dados. Veja a Seção 8.11.3, “Inserções Concorrentes”.

- Com um pouco mais de trabalho, é possível fazer com que o comando `LOAD DATA` seja executado ainda mais rápido para uma tabela `MyISAM` quando a tabela tiver muitos índices. Use o procedimento a seguir:

  1. Execute uma instrução `FLUSH TABLES` ou o comando **mysqladmin flush-tables**.

  2. Use **myisamchk --keys-used=0 -rq *`/caminho/para/db/tbl_name`*** para remover todo o uso de índices para a tabela.

  3. Insira dados na tabela com `LOAD DATA`. Isso não atualiza nenhum índice e, portanto, é muito rápido.

  4. Se você pretender apenas ler a tabela no futuro, use **myisampack** para comprá-la. Veja a Seção 15.2.3.3, “Características da tabela comprimida”.

  5. Recrie os índices com **myisamchk -rq *`/caminho/para/db/tbl_name`***. Isso cria a árvore de índices na memória antes de gravá-la no disco, o que é muito mais rápido do que atualizar o índice durante o `LOAD DATA` porque evita muitos buscas no disco. A árvore de índices resultante também é perfeitamente equilibrada.

  6. Execute uma instrução `FLUSH TABLES` ou o comando **mysqladmin flush-tables**.

  A instrução `LOAD DATA` realiza a otimização anterior automaticamente se a tabela `MyISAM` na qual você insere dados estiver vazia. A principal diferença entre a otimização automática e o uso do procedimento explicitamente é que você pode permitir que o **myisamchk** aloque muito mais memória temporária para a criação do índice do que o servidor pode querer alocar para a recriação do índice quando executar a instrução `LOAD DATA`.

  Você também pode desabilitar ou habilitar os índices não únicos para uma tabela `MyISAM` usando as seguintes instruções em vez de **myisamchk**. Se você usar essas instruções, pode pular as operações de `FLUSH TABLES`:

  ```sql
  ALTER TABLE tbl_name DISABLE KEYS;
  ALTER TABLE tbl_name ENABLE KEYS;
  ```

- Para acelerar as operações `INSERT` que são realizadas com múltiplas instruções para tabelas não transacionais, bloqueie suas tabelas:

  ```sql
  LOCK TABLES a WRITE;
  INSERT INTO a VALUES (1,23),(2,34),(4,33);
  INSERT INTO a VALUES (8,26),(6,29);
  ...
  UNLOCK TABLES;
  ```

  Isso beneficia o desempenho, pois o buffer de índice é descarregado no disco apenas uma vez, após todas as instruções `INSERT` terem sido concluídas. Normalmente, haveria tantas descargas do buffer de índice quanto instruções `INSERT`. As instruções de bloqueio explícito não são necessárias se você puder inserir todas as linhas com uma única instrução `INSERT`.

  O bloqueio também reduz o tempo total para testes de múltiplas conexões, embora o tempo máximo de espera para conexões individuais possa aumentar porque elas aguardam por bloqueios. Suponha que cinco clientes tentem realizar inserções simultaneamente da seguinte forma:

  - A conexão 1 faz 1000 inserções
  - Conexões 2, 3 e 4 fazem 1 inserção
  - Conexão 5 faz 1000 inserções

  Se você não usar o bloqueio, as conexões 2, 3 e 4 terminarão antes das conexões 1 e 5. Se você usar o bloqueio, as conexões 2, 3 e 4 provavelmente não terminarão antes das conexões 1 ou 5, mas o tempo total deve ser cerca de 40% mais rápido.

  As operações `INSERT`, `UPDATE` e `DELETE` são muito rápidas no MySQL, mas você pode obter um desempenho geral melhor adicionando bloqueios em torno de tudo o que faz mais de cerca de cinco inserções ou atualizações consecutivas. Se você fizer muitas inserções consecutivas, poderá fazer um `LOCK TABLES` seguido de um `UNLOCK TABLES` de vez em quando (a cada 1.000 linhas ou mais) para permitir que outros threads acessem a tabela. Isso ainda resultaria em um bom ganho de desempenho.

  `INSERT` ainda é muito mais lento para carregar dados do que `LOAD DATA`, mesmo quando se usam as estratégias descritas acima.

- Para aumentar o desempenho das tabelas `MyISAM`, tanto para `LOAD DATA` quanto para `INSERT`, aumente o cache de chaves aumentando a variável de sistema `key_buffer_size`. Consulte a Seção 5.1.1, “Configurando o servidor”.
