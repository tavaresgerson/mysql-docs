## 10.6 Otimizando tabelas MyISAM

O motor de armazenamento `MyISAM` funciona melhor com dados que são lidos principalmente ou com operações de baixa concorrência, porque os bloqueios de tabela limitam a capacidade de realizar atualizações simultâneas. No MySQL, `InnoDB` é o motor de armazenamento padrão, em vez de `MyISAM`.

### 10.6.1 Otimizando consultas MyISAM

Algumas dicas gerais para acelerar as consultas em tabelas de `MyISAM`:

* Para ajudar o MySQL a otimizar melhor as consultas, use `ANALYZE TABLE` ou execute **myisamchk --analyze** em uma tabela após ela ter sido carregada com dados. Isso atualiza um valor para cada parte do índice que indica o número médio de linhas que têm o mesmo valor. (Para índices exclusivos, isso é sempre 1.) O MySQL usa isso para decidir qual índice escolher quando você junta duas tabelas com base em uma expressão não constante. Você pode verificar o resultado da análise da tabela usando `SHOW INDEX FROM tbl_name` e examinando o valor de `Cardinality`. [**myisamchk --description --verbose**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") mostra informações sobre a distribuição do índice.

* Para ordenar um índice e dados de acordo com um índice, use **myisamchk --sort-index --sort-records=1** (assumindo que você deseja ordenar no índice 1). Esta é uma boa maneira de tornar as consultas mais rápidas se você tiver um índice exclusivo do qual deseja ler todas as linhas em ordem de acordo com o índice. A primeira vez que você ordena uma tabela dessa maneira, pode levar um longo tempo.

* Tente evitar consultas complexas de `SELECT` em tabelas de `MyISAM` que são atualizadas frequentemente, para evitar problemas com bloqueio de tabela que ocorrem devido à concorrência entre leitores e escritores.

* `MyISAM` suporta inserções concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode `INSERT` inserir novas linhas nela ao mesmo tempo em que outros threads estão lendo da tabela. Se é importante ser capaz de fazer isso, considere usar a tabela de maneiras que evitem a exclusão de linhas. Outra possibilidade é executar `OPTIMIZE TABLE` (optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") para desfragmentar a tabela depois de ter excluído muitas linhas dela. Esse comportamento é alterado ao definir a variável `concurrent_insert`. Você pode forçar novas linhas a serem anexadas (e, portanto, permitir inserções concorrentes), mesmo em tabelas que tenham linhas excluídas. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Para tabelas `MyISAM` que mudam com frequência, tente evitar todas as colunas de comprimento variável (`VARCHAR`, `BLOB` e `TEXT`). A tabela usa o formato de linha dinâmico se incluir até mesmo uma única coluna de comprimento variável. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*.

Normalmente, não é útil dividir uma tabela em diferentes tabelas apenas porque as linhas se tornam grandes. Ao acessar uma linha, o maior impacto no desempenho é o busca no disco necessário para encontrar o primeiro byte da linha. Após encontrar os dados, a maioria dos discos modernos pode ler toda a linha o suficiente para a maioria das aplicações. Os únicos casos em que dividir uma tabela faz uma diferença perceptível é se for uma tabela `MyISAM` usando um formato de linha dinâmico que você pode alterar para um tamanho de linha fixo, ou se você precisa muito frequentemente de escanear a tabela, mas não precisa da maioria das colunas. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*.

* Use `ALTER TABLE ... ORDER BY expr1, expr2, ...` se você geralmente recupera linhas em ordem de `expr1, expr2, ...`. Ao usar esta opção após alterações extensas na tabela, você poderá obter um desempenho maior.

* Se você precisa calcular resultados, como contagens, com base em informações de muitas linhas, pode ser preferível introduzir uma nova tabela e atualizar o contador em tempo real. Uma atualização do seguinte formato é muito rápida:

  ```
  UPDATE tbl_name SET count_col=count_col+1 WHERE key_col=constant;
  ```

Isso é muito importante quando você usa motores de armazenamento MySQL, como o `MyISAM`, que tem apenas bloqueio de nível de tabela (vários leitores com um único escritor). Isso também oferece melhor desempenho com a maioria dos sistemas de banco de dados, porque o gerenciador de bloqueio de linha, neste caso, tem menos a ver.

* Use `OPTIMIZE TABLE` periodicamente para evitar fragmentação com tabelas de formato dinâmico `MyISAM`. Veja a Seção 18.2.3, “Formatos de Armazenamento de Tabela MyISAM”.

* Declarar uma tabela `MyISAM` com a opção de tabela `DELAY_KEY_WRITE=1` torna as atualizações de índice mais rápidas, pois elas não são descarregadas no disco até que a tabela seja fechada. O inconveniente é que, se algo matar o servidor enquanto uma tabela estiver aberta, você deve garantir que a tabela esteja em ordem, executando o servidor com a variável de sistema `myisam_recover_options` definida, ou executando **myisamchk** antes de reiniciar o servidor. (No entanto, mesmo nesse caso, você não deve perder nada ao usar `DELAY_KEY_WRITE`, porque as informações chave sempre podem ser geradas a partir das linhas de dados.)

* As strings são automaticamente comprimidas com espaços pré e pós-prefixo nos índices `MyISAM`. Veja a Seção 15.1.15, “Instrução CREATE INDEX”.

* Você pode aumentar o desempenho ao fazer o cache de consultas ou respostas em sua aplicação e, em seguida, executar muitas inserções ou atualizações juntas. A bloqueadoria da tabela durante essa operação garante que o cache do índice seja descartado apenas uma vez após todas as atualizações.

### 10.6.2 Carregamento de dados em massa para tabelas MyISAM

Essas dicas de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 10.2.5.1, “Otimizando as declarações INSERT”.

* Para uma tabela `MyISAM`, você pode usar inserções concorrentes para adicionar linhas ao mesmo tempo em que as instruções `SELECT` estão sendo executadas, se não houver linhas excluídas no meio do arquivo de dados. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Com um pouco mais de trabalho, é possível fazer o `LOAD DATA` rodar ainda mais rápido para uma tabela `MyISAM` quando a tabela tem muitos índices. Use o procedimento a seguir:

1. Execute uma declaração `FLUSH TABLES` ou um comando [**mysqladmin flush-tables**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program").

2. Use [**myisamchk --keys-used=0 -rq *`/path/to/db/tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") para remover todo o uso de índices para a tabela.

3. Insira os dados na tabela com `LOAD DATA`. Isso não atualiza nenhum índice e, portanto, é muito rápido.

4. Se você pretender apenas ler a tabela no futuro, use **myisampack** para comprá-la. Veja a Seção 18.2.3.3, “Características da tabela comprimida”.

5. Re-crie os índices com [**myisamchk -rq *`/path/to/db/tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). Isso cria a árvore de índices na memória antes de escrevê-la no disco, o que é muito mais rápido do que atualizar o índice durante `LOAD DATA`, pois evita muitos buscas no disco. A árvore de índices resultante também é perfeitamente equilibrada.

6. Execute uma declaração `FLUSH TABLES` ou um comando [**mysqladmin flush-tables**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program").

`LOAD DATA` realiza a otimização anterior automaticamente se a tabela `MyISAM` na qual você insere dados estiver vazia. A principal diferença entre a otimização automática e o uso do procedimento explicitamente é que você pode permitir que **myisamchk** aloque muito mais memória temporária para a criação do índice do que você pode querer que o servidor aloque para a recriação do índice quando executa a declaração `LOAD DATA`.

Você também pode desabilitar ou habilitar os índices não únicos para uma tabela `MyISAM` usando as seguintes instruções em vez de **myisamchk**. Se você usar essas instruções, pode ignorar as operações `FLUSH TABLES`:

  ```
  ALTER TABLE tbl_name DISABLE KEYS;
  ALTER TABLE tbl_name ENABLE KEYS;
  ```

* Para acelerar as operações de `INSERT` que são realizadas com múltiplas declarações para tabelas não transacionais, bloqueie suas tabelas:

  ```
  LOCK TABLES a WRITE;
  INSERT INTO a VALUES (1,23),(2,34),(4,33);
  INSERT INTO a VALUES (8,26),(6,29);
  ...
  UNLOCK TABLES;
  ```

Isso beneficia o desempenho, pois o buffer de índice é descarregado no disco apenas uma vez, após todas as declarações `INSERT` terem sido concluídas. Normalmente, haveria tantos descarregamentos do buffer de índice quanto houver declarações `INSERT`. Não são necessárias declarações de bloqueio explícitas se você puder inserir todas as linhas com uma única `INSERT`.

A bloqueadoria também reduz o tempo total para testes de múltiplas conexões, embora o tempo máximo de espera para conexões individuais possa aumentar, pois elas aguardam por bloqueios. Suponha que cinco clientes tentem realizar inserções simultaneamente da seguinte forma:

+ A conexão 1 faz 1000 inserções
+ As conexões 2, 3 e 4 fazem 1 inserção
+ A conexão 5 faz 1000 inserções

Se você não usar o bloqueio, as conexões 2, 3 e 4 terminam antes das conexões 1 e 5. Se você usar o bloqueio, as conexões 2, 3 e 4 provavelmente não terminam antes das conexões 1 ou 5, mas o tempo total deve ser cerca de 40% mais rápido.

As operações `INSERT`, `UPDATE` e `DELETE` são muito rápidas no MySQL, mas você pode obter um desempenho geral melhor adicionando bloqueios em torno de tudo o que faz mais de cerca de cinco inserções ou atualizações consecutivas. Se você fizer muitas inserções consecutivas, você pode fazer um `LOCK TABLES` seguido por um `UNLOCK TABLES` de vez em quando (a cada 1.000 linhas ou algo assim) para permitir que outros threads acessem a tabela. Isso ainda resultaria em um bom ganho de desempenho.

`INSERT` ainda é muito mais lento para carregar dados do que `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement"), mesmo quando se usa as estratégias que acabamos de descrever.

* Para aumentar o desempenho das tabelas `MyISAM`, tanto para `LOAD DATA` quanto para `INSERT`, aumente a cache de chave aumentando a variável de sistema `key_buffer_size`. Veja a Seção 7.1.1, “Configurando o servidor”.

### 10.6.3 Otimizando as declarações de Tabela de REPARAÇÃO

`REPAIR TABLE` para as tabelas `MyISAM` é semelhante ao uso do **myisamchk** para operações de reparo, e algumas das mesmas otimizações de desempenho se aplicam:

* **myisamchk** tem variáveis que controlam a alocação de memória. Você pode melhorar o desempenho ajustando essas variáveis, conforme descrito na Seção 6.6.4.6, “Uso de memória do myisamchk”.

* Para `REPAIR TABLE`, o mesmo princípio se aplica, mas, como a reparação é feita pelo servidor, você define variáveis do sistema do servidor em vez de variáveis de **myisamchk**. Além disso, além de definir variáveis de alocação de memória, aumentar a variável do sistema `myisam_max_sort_file_size` aumenta a probabilidade de que a reparação use o método de filesort mais rápido e evite a reparação mais lenta pelo método de cache de chave. Defina a variável para o tamanho máximo do arquivo do seu sistema, após verificar para ter certeza de que há espaço livre suficiente para conter uma cópia dos arquivos da tabela. O espaço livre deve estar disponível no sistema de arquivos que contém os arquivos originais da tabela.

Suponha que uma operação de reparo de tabela **myisamchk** seja realizada usando as seguintes opções para definir suas variáveis de alocação de memória:

```
--key_buffer_size=128M --myisam_sort_buffer_size=256M
--read_buffer_size=64M --write_buffer_size=64M
```

Algumas dessas variáveis **myisamchk** correspondem a variáveis do sistema do servidor:

<table summary="myisamchk variables and corresponding server system variables."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>myisamchk Variable</th> <th>System Variable</th> </tr></thead><tbody><tr> <td><code>key_buffer_size</code></td> <td><code>key_buffer_size</code></td> </tr><tr> <td><code>myisam_sort_buffer_size</code></td> <td><code>myisam_sort_buffer_size</code></td> </tr><tr> <td><code>read_buffer_size</code></td> <td><code>read_buffer_size</code></td> </tr><tr> <td><code>write_buffer_size</code></td> <td>none</td> </tr></tbody></table>

Cada uma das variáveis do sistema do servidor pode ser definida em tempo de execução, e algumas delas (`myisam_sort_buffer_size`, `read_buffer_size`) têm um valor de sessão além de um valor global. Definir um valor de sessão limita o efeito da mudança à sua sessão atual e não afeta outros usuários. Alterar uma variável apenas global (`key_buffer_size`, `myisam_max_sort_file_size`) também afeta outros usuários. Para `key_buffer_size`, você deve considerar que o buffer é compartilhado com esses usuários. Por exemplo, se você definir a variável **myisamchk** `key_buffer_size` para 128 MB, pode definir a variável de sistema `key_buffer_size` correspondente maior que isso (se não estiver definida maior que isso já) para permitir o uso do buffer de chave por atividades em outras sessões. No entanto, alterar o tamanho global do buffer de chave invalida o buffer, causando aumento do I/O de disco e lentidão para outras sessões. Uma alternativa que evita esse problema é usar um cache de chave separado, atribuir a ele os índices da tabela a ser reparada e realocar-o quando a reparação estiver completa. Veja a Seção 10.10.2.2, “Múltiplos Caches de Chave”.

Com base nas observações anteriores, uma operação `REPAIR TABLE` (repair-table.html "15.7.3.5 REPAIR TABLE Statement") pode ser realizada da seguinte forma para usar configurações semelhantes ao comando **myisamchk**. Aqui, um buffer de chave separado de 128 MB é alocado e o sistema de arquivos é assumido para permitir um tamanho de arquivo de pelo menos 100 GB.

```
SET SESSION myisam_sort_buffer_size = 256*1024*1024;
SET SESSION read_buffer_size = 64*1024*1024;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
SET GLOBAL repair_cache.key_buffer_size = 128*1024*1024;
CACHE INDEX tbl_name IN repair_cache;
LOAD INDEX INTO CACHE tbl_name;
REPAIR TABLE tbl_name ;
SET GLOBAL repair_cache.key_buffer_size = 0;
```

Se você pretende alterar uma variável global, mas deseja fazer isso apenas durante a operação `REPAIR TABLE`(repair-table.html "15.7.3.5 REPAIR TABLE Statement"), para afetar minimamente outros usuários, salve seu valor em uma variável do usuário e restaure-o posteriormente. Por exemplo:

```
SET @old_myisam_sort_buffer_size = @@GLOBAL.myisam_max_sort_file_size;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
REPAIR TABLE tbl_name ;
SET GLOBAL myisam_max_sort_file_size = @old_myisam_max_sort_file_size;
```

As variáveis do sistema que afetam `REPAIR TABLE` podem ser definidas globalmente na inicialização do servidor se você deseja que os valores sejam aplicados por padrão. Por exemplo, adicione essas linhas ao arquivo do servidor `my.cnf`:

```
[mysqld]
myisam_sort_buffer_size=256M
key_buffer_size=1G
myisam_max_sort_file_size=100G
```

Essas configurações não incluem `read_buffer_size`. Definir globalmente `read_buffer_size` com um valor grande para todas as sessões e pode causar problemas de desempenho devido à alocação excessiva de memória para um servidor com muitas sessões simultâneas.