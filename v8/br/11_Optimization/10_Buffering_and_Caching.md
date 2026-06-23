## 10.10 Bufferamento e Caching

O MySQL utiliza várias estratégias que armazenam informações em buffers de memória para aumentar o desempenho.

### 10.10.1 Otimização do Banco de Armazenamento de Buffer do InnoDB

`InnoDB` mantém uma área de armazenamento chamada pool de buffer para cache de dados e índices na memória. Saber como o pool de buffer `InnoDB` funciona e aproveitar isso para manter dados frequentemente acessados na memória é um aspecto importante do ajuste do MySQL.

Para uma explicação sobre o funcionamento interno do pool de buffer `InnoDB`, uma visão geral de seu algoritmo de substituição LRU e informações gerais de configuração, consulte a Seção 17.5.1, “Pool de Buffer”.

Para informações adicionais sobre a configuração e o ajuste do pool de buffer `InnoDB`, consulte essas seções:

* Seção 17.8.3.4, “Configurando a pré-visualização do buffer do InnoDB (leitura antecipada”) * Seção 17.8.3.5, “Configurando a limpeza do buffer do buffer” * Seção 17.8.3.3, “Tornando o exame do buffer do buffer resistente” * Seção 17.8.3.2, “Configurando múltiplas instâncias do buffer do buffer” * Seção 17.8.3.6, “Salvando e restaurando o estado do buffer do buffer” * Seção 17.8.3.1, “Configurando o tamanho do buffer do buffer InnoDB”

### 10.10.1 Cache de Chave MyISAM

Para minimizar o I/O de disco, o mecanismo de armazenamento `MyISAM` explora uma estratégia que é usada por muitos sistemas de gerenciamento de banco de dados. Ele emprega um mecanismo de cache para manter os blocos de tabela mais frequentemente acessados na memória:

* Para blocos de índice, uma estrutura especial chamada cache de chave (ou buffer de chave) é mantida. A estrutura contém vários buffers de bloco onde os blocos de índice mais utilizados são colocados.

* Para blocos de dados, o MySQL não usa cache especial. Em vez disso, ele depende do cache do sistema de arquivos do sistema operacional nativo.

Esta seção descreve, primeiro, o funcionamento básico do cache de chave `MyISAM`. Em seguida, discute características que melhoram o desempenho do cache de chave e que permitem um melhor controle da operação do cache:

* Múltiplas sessões podem acessar o cache simultaneamente. * Você pode configurar vários caches de chave e atribuir índices de tabela a caches específicos.

Para controlar o tamanho da cache de chaves, use a variável de sistema `key_buffer_size`. Se essa variável for definida como zero, não será usada cache de chaves. A cache de chaves também não será usada se o valor de `key_buffer_size` for muito pequeno para alocar o número mínimo de buffers de bloco (8).

Quando a cache de chave não está operacional, os arquivos de índice são acessados usando apenas o bufferização do sistema de arquivos nativo fornecido pelo sistema operacional. (Em outras palavras, os blocos de índice da tabela são acessados usando a mesma estratégia empregada para os blocos de dados da tabela.)

Um bloco de índice é uma unidade contínua de acesso aos arquivos de índice `MyISAM`. Geralmente, o tamanho de um bloco de índice é igual ao tamanho dos nós da árvore B de índice. (Os índices são representados em disco usando uma estrutura de dados B-tree. Os nós na parte inferior da árvore são nós de folha. Os nós acima dos nós de folha são nós não-folha.)

Todos os buffers de bloco em uma estrutura de cache de chave têm o mesmo tamanho. Esse tamanho pode ser igual, maior ou menor que o tamanho de um bloco de índice de tabela. Geralmente, um desses dois valores é um múltiplo do outro.

Quando os dados de qualquer bloco de índice de tabela devem ser acessados, o servidor verifica primeiro se estão disponíveis em algum buffer de bloco da cache de chave. Se estiverem, o servidor acessa os dados na cache de chave em vez de no disco. Ou seja, lê a cache ou escreve nela em vez de ler ou escrever no disco. Caso contrário, o servidor escolhe um buffer de bloco de cache que contenha um bloco (ou blocos) de índice de tabela diferente e substitui os dados por uma cópia do bloco de índice de tabela necessário. Assim que o novo bloco de índice estiver na cache, os dados do índice podem ser acessados.

Se acontecer que um bloco selecionado para substituição tenha sido modificado, o bloco é considerado "sujo". Nesse caso, antes de ser substituído, seu conteúdo é descartado no índice da tabela de onde veio.

Normalmente, o servidor segue uma estratégia LRU (Menos Recentemente Usada): Ao escolher um bloco para substituição, ele seleciona o bloco de índice menos recentemente usado. Para facilitar essa escolha, o módulo de cache de chave mantém todos os blocos usados em uma lista especial (cadeia LRU) ordenada pelo tempo de uso. Quando um bloco é acessado, é o mais recentemente usado e é colocado no final da lista. Quando os blocos precisam ser substituídos, os blocos no início da lista são os menos recentemente usados e se tornam os primeiros candidatos à expulsão.

O motor de armazenamento `InnoDB` também utiliza um algoritmo LRU para gerenciar seu conjunto de buffers. Veja a Seção 17.5.1, “Conjunto de Buffers”.

#### 10.10.2.1 Acesso à Cache de Chave Compartilhada

Os threads podem acessar buffers de cache-chave simultaneamente, sujeito às seguintes condições:

* Um buffer que não está sendo atualizado pode ser acessado por múltiplas sessões.

* Um buffer que está sendo atualizado faz com que as sessões que precisam usá-lo esperem até que a atualização esteja completa.

* Múltiplas sessões podem iniciar solicitações que resultem em substituições de blocos de cache, desde que não interfiram umas com as outras (ou seja, desde que precisem de blocos de índice diferentes e, assim, causem a substituição de diferentes blocos de cache).

O acesso compartilhado à cache de chave permite que o servidor melhore significativamente o desempenho.

#### 10.10.2.2 Caches de Chave Múltiplos

Nota

A partir do MySQL 8.0, a sintaxe de variáveis estruturadas com partes compostas discutida aqui para referência a vários caches de chave `MyISAM` é descontinuada.

O acesso compartilhado à cache de chave melhora o desempenho, mas não elimina a concorrência entre as sessões por completo. Eles ainda competem por estruturas de controle que gerenciam o acesso aos buffers da cache de chave. Para reduzir ainda mais a concorrência de acesso à cache de chave, o MySQL também fornece várias caches de chave. Essa funcionalidade permite que você atribua diferentes índices de tabela a diferentes caches de chave.

Quando existem vários caches de chave, o servidor deve saber qual cache usar ao processar consultas para uma tabela específica do `MyISAM`. Por padrão, todos os índices das tabelas do `MyISAM` são cacheados no cache de chave padrão. Para atribuir índices de tabela a um cache de chave específico, use a declaração `CACHE INDEX` (consulte Seção 15.7.8.2, “Declarativa de ÍNDICE CACHE”). Por exemplo, a declaração a seguir atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave denominado `hot_cache`:

```
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

O cache de chave mencionado em uma declaração `CACHE INDEX`(cache-index.html "15.7.8.2 CACHE INDEX Statement") pode ser criado definindo seu tamanho com uma declaração de configuração de parâmetro `SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") ou usando opções de inicialização do servidor. Por exemplo:

```
mysql> SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Para destruir um cache de chave, defina seu tamanho como zero:

```
mysql> SET GLOBAL keycache1.key_buffer_size=0;
```

Você não pode destruir o cache de chave padrão. Qualquer tentativa de fazer isso é ignorada:

```
mysql> SET GLOBAL key_buffer_size = 0;

mysql> SHOW VARIABLES LIKE 'key_buffer_size';
+-----------------+---------+
| Variable_name   | Value   |
+-----------------+---------+
| key_buffer_size | 8384512 |
+-----------------+---------+
```

As variáveis de cache principais são variáveis estruturadas do sistema que possuem um nome e componentes. Para `keycache1.key_buffer_size`, `keycache1` é o nome da variável de cache e `key_buffer_size` é o componente de cache. Consulte a Seção 7.1.9.5, “Variáveis de sistema estruturadas”, para uma descrição da sintaxe usada para se referir às variáveis de cache de chave estruturadas.

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são reatribuídos ao cache de chave principal padrão.

Para um servidor ocupado, você pode usar uma estratégia que envolve três caches principais:

* Uma cache de teclas "quente" que ocupa 20% do espaço alocado para todas as caches de teclas. Use isso para tabelas que são muito utilizadas em pesquisas, mas que não são atualizadas.

* Uma cache de chave "fria" que ocupa 20% do espaço alocado para todas as caches de chave. Use esta cache para tabelas de tamanho médio e que são modificadas intensamente, como tabelas temporárias.

* Uma cache de chave "quente" que ocupa 60% do espaço da cache de chave. Empregue-a como cache de chave padrão, a ser usada por padrão para todas as outras tabelas.

Uma das razões pelas quais o uso de três caches principais é benéfico é que o acesso a uma estrutura de cache de chave não bloqueia o acesso às outras. As declarações que acessam tabelas atribuídas a um cache não competem com declarações que acessam tabelas atribuídas a outro cache. Ganhos de desempenho ocorrem também por outros motivos:

* O cache quente é usado apenas para consultas de recuperação, portanto, seu conteúdo nunca é modificado. Consequentemente, sempre que um bloco de índice precisar ser extraído do disco, o conteúdo do bloco de cache escolhido para substituição não precisa ser esvaziado primeiro.

* Para um índice atribuído ao cache quente, se não houver consultas que exijam uma varredura do índice, há uma alta probabilidade de que os blocos do índice correspondentes a nós não-folha do B-tree permaneçam no cache.

Uma operação de atualização executada com maior frequência para tabelas temporárias é realizada muito mais rapidamente quando o nó atualizado está na cache e não precisa ser lido do disco primeiro. Se o tamanho dos índices das tabelas temporárias for comparável ao tamanho da cache de chave fria, a probabilidade é muito alta de que o nó atualizado esteja na cache.

A declaração `CACHE INDEX` estabelece uma associação entre uma tabela e um cache de chave, mas a associação é perdida cada vez que o servidor é reiniciado. Se você deseja que a associação tenha efeito cada vez que o servidor é iniciado, uma maneira de realizar isso é usar um arquivo de opção: Inclua configurações variáveis que configurem seus caches de chave e uma variável de sistema `init_file` que nomeia um arquivo que contém declarações [`CACHE INDEX`](cache-index.html "15.7.8.2 CACHE INDEX Statement") a serem executadas. Por exemplo:

```
key_buffer_size = 4G
hot_cache.key_buffer_size = 2G
cold_cache.key_buffer_size = 2G
init_file=/path/to/data-directory/mysqld_init.sql
```

As declarações em `mysqld_init.sql` são executadas sempre que o servidor é iniciado. O arquivo deve conter uma declaração SQL por linha. O exemplo a seguir atribui várias tabelas, cada uma para `hot_cache` e `cold_cache`:

```
CACHE INDEX db1.t1, db1.t2, db2.t3 IN hot_cache
CACHE INDEX db1.t4, db2.t5, db2.t6 IN cold_cache
```

#### 10.10.2.3 Estratégia de Inserção no Ponto Central

Por padrão, o sistema de gerenciamento de cache de chave usa uma estratégia simples de LRU para escolher os blocos de cache de chave que serão expulsos, mas também suporta um método mais sofisticado chamado estratégia de inserção no ponto médio.

Ao usar a estratégia de inserção do ponto médio, a cadeia LRU é dividida em duas partes: uma sublista quente e uma sublista quente. O ponto de divisão entre as duas partes não é fixo, mas o sistema de gerenciamento de cache de chave garante que a parte quente não seja “demasiado curta”, contendo sempre pelo menos `key_cache_division_limit` por cento dos blocos de cache de chave. `key_cache_division_limit` é um componente das variáveis de cache de chave estruturadas, portanto, seu valor é um parâmetro que pode ser definido por cache.

Quando um bloco de índice é lido de uma tabela para a cache de chave, ele é colocado no final da sublista quente. Após um certo número de acertos (acessos do bloco), ele é promovido para a sublista quente. Atualmente, o número de acertos necessários para promover um bloco (3) é o mesmo para todos os blocos de índice.

Um bloco promovido para a sublista quente é colocado no final da lista. O bloco, então, circula dentro dessa sublista. Se o bloco permanecer no início da sublista por um período de tempo suficientemente longo, ele é demitido para a sublista quente. Esse tempo é determinado pelo valor do componente `key_cache_age_threshold` da cache de chave.

O valor limite prescreve que, para uma cache de chave contendo blocos *`N`*, o bloco no início da sublista quente que não foi acessado nos últimos `N * key_cache_age_threshold / 100` sucessos deve ser movido para o início da sublista quente. Ele então se torna o primeiro candidato à expulsão, porque os blocos para substituição são sempre retirados do início da sublista quente.

A estratégia de inserção de ponto médio permite que você mantenha blocos mais valiosos sempre na cache. Se você preferir usar a estratégia LRU simples, deixe o valor `key_cache_division_limit` definido para o seu valor padrão de 100.

A estratégia de inserção de ponto médio ajuda a melhorar o desempenho quando a execução de uma consulta que requer uma varredura de índice efetivamente expulsa todos os blocos do índice correspondentes a nós valiosos de alto nível em forma de árvore B. Para evitar isso, você deve usar uma estratégia de inserção de ponto médio com o `key_cache_division_limit` definido para muito menos que 100. Então, os nós valiosos que são frequentemente atingidos também são preservados na sublista quente durante uma operação de varredura de índice.

#### 10.10.2.4 Pré-carregamento do índice

Se houver blocos suficientes em uma cache de chave para conter blocos de um índice inteiro, ou pelo menos os blocos correspondentes aos seus nós não-folha, faz sentido precarregar a cache de chave com blocos de índice antes de começar a usá-la. O preenchimento permite que você coloque os blocos do índice da tabela em um buffer da cache de chave da maneira mais eficiente: lendo os blocos do índice do disco sequencialmente.

Sem pré-carregar, os blocos ainda são colocados na cache de chave conforme necessário pelas consultas. Embora os blocos permaneçam na cache, porque há buffers suficientes para todos eles, eles são buscados em ordem aleatória e não sequencialmente a partir do disco.

Para pré-carregar um índice em um cache, use a declaração `LOAD INDEX INTO CACHE`(load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement"). Por exemplo, a seguinte declaração pré-carrega os nós (blocos de índice) dos índices das tabelas `t1` e `t2`:

```
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

O modificador `IGNORE LEAVES` faz com que apenas blocos dos nós não-folha do índice sejam pré-carregados. Assim, a declaração mostrada pré-carrega todos os blocos do índice de `t1`, mas apenas blocos dos nós não-folha de `t2`.

Se um índice foi atribuído a um cache de chave usando uma declaração `CACHE INDEX`, o preenchimento coloca blocos de índice nesse cache. Caso contrário, o índice é carregado no cache de chave padrão.

#### 10.10.2.5 Tamanho do bloco de cache principal

É possível especificar o tamanho dos buffers de bloco para um cache de chave individual usando a variável `key_cache_block_size`. Isso permite ajustar o desempenho das operações de E/S para arquivos de índice.

O melhor desempenho para operações de E/S é alcançado quando o tamanho dos buffers de leitura é igual ao tamanho dos buffers de E/S do sistema operacional nativo. Mas definir o tamanho dos nós-chave iguais ao tamanho do buffer de E/S não garante sempre o melhor desempenho geral. Ao ler os nós-folha grandes, o servidor puxa um monte de dados desnecessários, impedindo efetivamente a leitura de outros nós-folha.

Para controlar o tamanho dos blocos no arquivo de índice `.MYI` das tabelas `MyISAM`, use a opção `--myisam-block-size` na inicialização do servidor.

#### 10.10.2.6 Reestruturação de uma Cache Principal

Uma cache principal pode ser reestruturada a qualquer momento, atualizando seus valores de parâmetros. Por exemplo:

```
mysql> SET GLOBAL cold_cache.key_buffer_size=4*1024*1024;
```

Se você atribuir a qualquer um dos componentes de cache `key_buffer_size` ou `key_cache_block_size` o valor que difere do valor atual do componente, o servidor destrói a estrutura antiga do cache e cria uma nova com base nos novos valores. Se o cache contiver blocos sujos, o servidor os salva no disco antes de destruir e recriar o cache. A reestruturação não ocorre se você alterar outros parâmetros de cache de chave.

Ao reestruturar uma cache principal, o servidor primeiro esvazia o conteúdo de quaisquer buffers sujos no disco. Após isso, o conteúdo da cache se torna indisponível. No entanto, a reestruturação não bloqueia consultas que precisam usar índices atribuídos à cache. Em vez disso, o servidor acessa diretamente os índices da tabela usando o cache do sistema de arquivos nativo. O cache do sistema de arquivos não é tão eficiente quanto usar uma cache de chave, então, embora as consultas sejam executadas, pode-se antecipar um atraso. Após a cache ter sido reestruturada, ela se torna disponível novamente para caches de índices atribuídos a ela, e o uso do cache do sistema de arquivos para os índices cessa.

### 10.10.3 Cache de declarações preparadas e programas armazenados

Para determinadas declarações que um cliente pode executar várias vezes durante uma sessão, o servidor converte a declaração em uma estrutura interna e armazena essa estrutura para ser usada durante a execução. O armazenamento em cache permite que o servidor realize a execução de forma mais eficiente, pois evita o esforço de reconverter a declaração caso seja necessário novamente durante a sessão. A conversão e o armazenamento em cache ocorrem para essas declarações:

* Declarações preparadas, tanto aquelas processadas no nível SQL (usando a declaração `PREPARE`) quanto aquelas processadas usando o protocolo binário cliente/servidor (usando a função `mysql_stmt_prepare()` da API C). A variável de sistema `max_prepared_stmt_count` controla o número total de declarações que o servidor armazena em cache. (A soma do número de declarações preparadas em todas as sessões.)

* Programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Neste caso, o servidor converte e armazena o corpo inteiro do programa. A variável de sistema `stored_program_cache` indica o número aproximado de programas armazenados que o servidor armazena por sessão.

O servidor mantém caches para declarações preparadas e programas armazenados em uma base por sessão. As declarações cacheadas para uma sessão não são acessíveis para outras sessões. Quando uma sessão termina, o servidor descarta quaisquer declarações cacheadas para ela.

Quando o servidor utiliza uma estrutura de declaração cacheada interna, ele deve garantir que a estrutura não se torne obsoleta. Alterações de metadados podem ocorrer para um objeto utilizado pela declaração, causando um desajuste entre a definição atual do objeto e a definição representada na estrutura de declaração interna. Alterações de metadados ocorrem para declarações DDL, como aquelas que criam, excluem, alteram, renomeiam ou truncam tabelas, ou que analisam, otimizam ou reparam tabelas. Alterações no conteúdo da tabela (por exemplo, com `INSERT` ou `UPDATE`) não alteram metadados, assim como as declarações `SELECT`.

Aqui está uma ilustração do problema. Suponha que um cliente prepare esta declaração:

```
PREPARE s1 FROM 'SELECT * FROM t1';
```

O `SELECT *` se expande na estrutura interna para a lista de colunas na tabela. Se o conjunto de colunas na tabela for modificado com `ALTER TABLE`, a declaração preparada fica desatualizada. Se o servidor não detectar essa mudança na próxima vez que o cliente executar `s1`, a declaração preparada retornará resultados incorretos.

Para evitar problemas causados por alterações nos metadados das tabelas ou visualizações referenciadas pela declaração preparada, o servidor detecta essas alterações e refaz automaticamente a declaração quando ela é executada novamente. Isso significa que o servidor reanalisa a declaração e reconstrui a estrutura interna. A reanálise também ocorre após as tabelas ou visualizações referenciadas serem apagadas do cache de definição de tabela, seja implicitamente para liberar espaço para novas entradas no cache, seja explicitamente devido a `FLUSH TABLES`(flush.html#flush-tables).

Da mesma forma, se houver alterações em objetos utilizados por um programa armazenado, o servidor repara as declarações afetadas no programa.

O servidor também detecta alterações de metadados para objetos em expressões. Essas podem ser usadas em declarações específicas de programas armazenados, como `DECLARE CURSOR` ou declarações de controle de fluxo, como `IF`, `CASE` e `RETURN`.

Para evitar a análise de programas inteiros armazenados, o servidor analisa as declarações ou expressões afetadas em um programa apenas quando necessário. Exemplos:

* Suponha que os metadados de uma tabela ou visão sejam alterados. A reparação ocorre para um `SELECT *` no programa que acessa a tabela ou visão, mas não para um `SELECT *` que não acesse a tabela ou visão.

* Quando uma declaração é afetada, o servidor a repara apenas parcialmente, se possível. Considere esta declaração `CASE`:

  ```
  CASE case_expr
    WHEN when_expr1 ...
    WHEN when_expr2 ...
    WHEN when_expr3 ...
    ...
  END CASE
  ```

Se uma alteração de metadados afeta apenas `WHEN when_expr3`, essa expressão é reparada. *`case_expr`* e as outras expressões `WHEN` não são reparadas.

A Reparsing utiliza o banco de dados padrão e o modo SQL que estavam em vigor na conversão original para a forma interna.

O servidor tenta refazer a análise até três vezes. Um erro ocorre se todas as tentativas falharem.

A reparação é automática, mas na medida em que ocorre, diminui a declaração preparada e o desempenho do programa armazenado.

Para declarações preparadas, a variável de status `Com_stmt_reprepare` acompanha o número de reparações.