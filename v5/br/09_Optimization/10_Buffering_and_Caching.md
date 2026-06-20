## 8.10 Bufferamento e Caching

O MySQL utiliza várias estratégias que armazenam informações em buffers de memória para aumentar o desempenho.

### 8.10.1 Otimização do Banco de Armazenamento de Buffer do InnoDB

`InnoDB` mantém uma área de armazenamento chamada pool de buffer para cache de dados e índices na memória. Saber como o pool de buffer `InnoDB` funciona e aproveitar isso para manter dados frequentemente acessados na memória é um aspecto importante do ajuste do MySQL.

Para uma explicação sobre o funcionamento interno do pool de buffers `InnoDB`, uma visão geral de seu algoritmo de substituição LRU e informações gerais de configuração, consulte a Seção 14.5.1, “Pool de Buffers”.

Para informações adicionais sobre a configuração e o ajuste do pool de buffer `InnoDB`, consulte essas seções:

* Seção 14.8.3.4, “Configurando a pré-visualização do buffer do InnoDB (leitura antecipada”) * Seção 14.8.3.5, “Configurando a limpeza do buffer do buffer” * Seção 14.8.3.3, “Tornando o exame do buffer do buffer resistente” * Seção 14.8.3.2, “Configurando múltiplas instâncias do buffer do buffer” * Seção 14.8.3.6, “Salvando e restaurando o estado do buffer do buffer” * Seção 14.8.3.1, “Configurando o tamanho do buffer do buffer InnoDB”

### 8.10.2 Cache de Chave MyISAM

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

O motor de armazenamento `InnoDB` também utiliza um algoritmo LRU para gerenciar seu conjunto de buffers. Veja a Seção 14.5.1, “Conjunto de Buffers”.

#### 8.10.2.1 Acesso à Cache de Chave Compartilhada

Os threads podem acessar buffers de cache-chave simultaneamente, sujeito às seguintes condições:

* Um buffer que não está sendo atualizado pode ser acessado por múltiplas sessões.

* Um buffer que está sendo atualizado faz com que as sessões que precisam usá-lo esperem até que a atualização esteja completa.

* Múltiplas sessões podem iniciar solicitações que resultem em substituições de blocos de cache, desde que não interfiram umas com as outras (ou seja, desde que precisem de blocos de índice diferentes e, assim, causem a substituição de diferentes blocos de cache).

O acesso compartilhado à cache de chave permite que o servidor melhore significativamente o desempenho.

#### 8.10.2.2 Caches de Chave Múltiplos

O acesso compartilhado à cache de chave melhora o desempenho, mas não elimina a concorrência entre as sessões por completo. Eles ainda competem por estruturas de controle que gerenciam o acesso aos buffers da cache de chave. Para reduzir ainda mais a concorrência de acesso à cache de chave, o MySQL também fornece várias caches de chave. Essa funcionalidade permite que você atribua diferentes índices de tabela a diferentes caches de chave.

Quando existem vários caches de chave, o servidor deve saber qual cache usar ao processar consultas para uma tabela específica do `MyISAM`. Por padrão, todos os índices das tabelas `MyISAM` são cacheados no cache de chave padrão. Para atribuir índices de tabela a um cache de chave específico, use a declaração `CACHE INDEX` (consulte Seção 13.7.6.2, “Declarativa de ÍNDICE CACHE”). Por exemplo, a declaração a seguir atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave denominado `hot_cache`:

```sql
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

O cache de chave referido em uma declaração `CACHE INDEX` pode ser criado definindo seu tamanho com uma declaração de configuração de parâmetro `SET GLOBAL` ou usando opções de inicialização do servidor. Por exemplo:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Para destruir um cache de chave, defina seu tamanho como zero:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=0;
```

Você não pode destruir o cache de chave padrão. Qualquer tentativa de fazer isso é ignorada:

```sql
mysql> SET GLOBAL key_buffer_size = 0;

mysql> SHOW VARIABLES LIKE 'key_buffer_size';
+-----------------+---------+
| Variable_name   | Value   |
+-----------------+---------+
| key_buffer_size | 8384512 |
+-----------------+---------+
```

As variáveis de cache principais são variáveis estruturadas do sistema que possuem um nome e componentes. Para `keycache1.key_buffer_size`, `keycache1` é o nome da variável de cache e `key_buffer_size` é o componente de cache. Consulte a Seção 5.1.8.3, “Variáveis de sistema estruturadas”, para uma descrição da sintaxe usada para se referir às variáveis de cache de chave estruturadas.

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são reatribuídos ao cache de chave principal padrão.

Para um servidor ocupado, você pode usar uma estratégia que envolve três caches principais:

* Uma cache de teclas "quente" que ocupa 20% do espaço alocado para todas as caches de teclas. Use isso para tabelas que são muito utilizadas em pesquisas, mas que não são atualizadas.

* Uma cache de chave "fria" que ocupa 20% do espaço alocado para todas as caches de chave. Use esta cache para tabelas de tamanho médio e que são modificadas intensamente, como tabelas temporárias.

* Uma cache de chave "quente" que ocupa 60% do espaço da cache de chave. Empregue-a como cache de chave padrão, a ser usada por padrão para todas as outras tabelas.

Uma das razões pelas quais o uso de três caches principais é benéfico é que o acesso a uma estrutura de cache de chave não bloqueia o acesso às outras. As declarações que acessam tabelas atribuídas a um cache não competem com declarações que acessam tabelas atribuídas a outro cache. Ganhos de desempenho ocorrem também por outros motivos:

* O cache quente é usado apenas para consultas de recuperação, portanto, seu conteúdo nunca é modificado. Consequentemente, sempre que um bloco de índice precisar ser extraído do disco, o conteúdo do bloco de cache escolhido para substituição não precisa ser esvaziado primeiro.

* Para um índice atribuído ao cache quente, se não houver consultas que exijam uma varredura do índice, há uma alta probabilidade de que os blocos do índice correspondentes a nós não-folha do B-tree permaneçam no cache.

Uma operação de atualização executada com maior frequência para tabelas temporárias é realizada muito mais rapidamente quando o nó atualizado está na cache e não precisa ser lido do disco primeiro. Se o tamanho dos índices das tabelas temporárias for comparável ao tamanho da cache de chave fria, a probabilidade é muito alta de que o nó atualizado esteja na cache.

A declaração `CACHE INDEX` estabelece uma associação entre uma tabela e um cache de chave, mas a associação é perdida cada vez que o servidor é reiniciado. Se você deseja que a associação tenha efeito cada vez que o servidor é iniciado, uma maneira de realizar isso é usar um arquivo de opção: Inclua configurações variáveis que configurem seus caches de chave e uma variável de sistema `init_file` que nomeia um arquivo que contém declarações `CACHE INDEX` a serem executadas. Por exemplo:

```sql
key_buffer_size = 4G
hot_cache.key_buffer_size = 2G
cold_cache.key_buffer_size = 2G
init_file=/path/to/data-directory/mysqld_init.sql
```

As declarações em `mysqld_init.sql` são executadas sempre que o servidor é iniciado. O arquivo deve conter uma declaração SQL por linha. O exemplo a seguir atribui várias tabelas, cada uma para `hot_cache` e `cold_cache`:

```sql
CACHE INDEX db1.t1, db1.t2, db2.t3 IN hot_cache
CACHE INDEX db1.t4, db2.t5, db2.t6 IN cold_cache
```

#### 8.10.2.3 Estratégia de Inserção no Ponto Central

Por padrão, o sistema de gerenciamento de cache de chave usa uma estratégia simples de LRU para escolher os blocos de cache de chave que serão expulsos, mas também suporta um método mais sofisticado chamado estratégia de inserção no ponto médio.

Ao usar a estratégia de inserção do ponto médio, a cadeia LRU é dividida em duas partes: uma sublista quente e uma sublista quente. O ponto de divisão entre as duas partes não é fixo, mas o sistema de gerenciamento de cache de chave garante que a parte quente não seja “demasiado curta”, contendo sempre pelo menos `key_cache_division_limit` por cento dos blocos de cache de chave. `key_cache_division_limit` é um componente das variáveis de cache de chave estruturadas, portanto, seu valor é um parâmetro que pode ser definido por cache.

Quando um bloco de índice é lido de uma tabela para a cache de chave, ele é colocado no final da sublista quente. Após um certo número de acertos (acessos do bloco), ele é promovido para a sublista quente. Atualmente, o número de acertos necessários para promover um bloco (3) é o mesmo para todos os blocos de índice.

Um bloco promovido para a sublista quente é colocado no final da lista. O bloco, então, circula dentro dessa sublista. Se o bloco permanecer no início da sublista por um período de tempo suficientemente longo, ele é demitido para a sublista quente. Esse tempo é determinado pelo valor do componente `key_cache_age_threshold` da cache de chaves.

O valor limite prescreve que, para uma cache de chave contendo blocos *`N`*, o bloco no início da sublista quente que não foi acessado nas últimas `N * key_cache_age_threshold / 100` de acerto deve ser movido para o início da sublista quente. Ele então se torna o primeiro candidato à expulsão, porque os blocos para substituição são sempre retirados do início da sublista quente.

A estratégia de inserção de ponto médio permite que você mantenha blocos mais valiosos sempre na cache. Se você preferir usar a estratégia LRU simples, deixe o valor `key_cache_division_limit` definido para o seu valor padrão de 100.

A estratégia de inserção de ponto médio ajuda a melhorar o desempenho quando a execução de uma consulta que requer uma varredura de índice efetivamente expulsa todos os blocos do índice correspondentes a nós valiosos de alto nível em forma de árvore B. Para evitar isso, você deve usar uma estratégia de inserção de ponto médio com o `key_cache_division_limit` definido para muito menos que 100. Então, os nós valiosos que são frequentemente atingidos também são preservados na sublista quente durante uma operação de varredura de índice.

#### 8.10.2.4 Pré-carga do índice

Se houver blocos suficientes em uma cache de chave para conter blocos de um índice inteiro, ou pelo menos os blocos correspondentes aos seus nós não-folha, faz sentido precarregar a cache de chave com blocos de índice antes de começar a usá-la. O preenchimento permite que você coloque os blocos do índice da tabela em um buffer da cache de chave da maneira mais eficiente: lendo os blocos do índice do disco sequencialmente.

Sem pré-carregar, os blocos ainda são colocados na cache de chave conforme necessário pelas consultas. Embora os blocos permaneçam na cache, porque há buffers suficientes para todos eles, eles são buscados em ordem aleatória e não sequencialmente a partir do disco.

Para pré-carregar um índice em um cache, use a declaração `LOAD INDEX INTO CACHE`. Por exemplo, a declaração a seguir pré-carrega os nós (blocos de índice) dos índices das tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

O modificador `IGNORE LEAVES` faz com que apenas blocos dos nós não-folha do índice sejam pré-carregados. Assim, a declaração mostrada pré-carrega todos os blocos do índice a partir de `t1`, mas apenas blocos dos nós não-folha a partir de `t2`.

Se um índice foi atribuído a um cache de chave usando uma declaração `CACHE INDEX`, o preenchimento coloca blocos de índice nesse cache. Caso contrário, o índice é carregado no cache de chave padrão.

#### 8.10.2.5 Tamanho do bloco de cache principal

É possível especificar o tamanho dos buffers de bloco para um cache de chave individual usando a variável `key_cache_block_size`. Isso permite ajustar o desempenho das operações de E/S para arquivos de índice.

O melhor desempenho para operações de E/S é alcançado quando o tamanho dos buffers de leitura é igual ao tamanho dos buffers de E/S do sistema operacional nativo. Mas definir o tamanho dos nós-chave iguais ao tamanho do buffer de E/S não garante sempre o melhor desempenho geral. Ao ler os nós-folha grandes, o servidor puxa um monte de dados desnecessários, impedindo efetivamente a leitura de outros nós-folha.

Para controlar o tamanho dos blocos no arquivo de índice `.MYI` das tabelas `MyISAM`, use a opção `--myisam-block-size` na inicialização do servidor.

#### 8.10.2.6 Reestruturação de uma Cache Principal

Uma cache principal pode ser reestruturada a qualquer momento, atualizando seus valores de parâmetros. Por exemplo:

```sql
mysql> SET GLOBAL cold_cache.key_buffer_size=4*1024*1024;
```

Se você atribuir a qualquer um dos componentes de cache `key_buffer_size` ou `key_cache_block_size` um valor que difere do valor atual do componente, o servidor destrói a estrutura antiga do cache e cria uma nova com base nos novos valores. Se o cache contiver blocos sujos, o servidor os salva no disco antes de destruir e recriar o cache. A reestruturação não ocorre se você alterar outros parâmetros de cache de chave.

Ao reestruturar uma cache principal, o servidor primeiro esvazia o conteúdo de quaisquer buffers sujos no disco. Após isso, o conteúdo da cache se torna indisponível. No entanto, a reestruturação não bloqueia consultas que precisam usar índices atribuídos à cache. Em vez disso, o servidor acessa diretamente os índices da tabela usando o cache do sistema de arquivos nativo. O cache do sistema de arquivos não é tão eficiente quanto usar uma cache de chave, então, embora as consultas sejam executadas, pode-se antecipar um atraso. Após a cache ter sido reestruturada, ela se torna disponível novamente para caches de índices atribuídos a ela, e o uso do cache do sistema de arquivos para os índices cessa.

### 8.10.3 Cache de consulta do MySQL

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

O cache de consulta armazena o texto de uma declaração `SELECT` juntamente com o resultado correspondente que foi enviado ao cliente. Se uma declaração idêntica for recebida posteriormente, o servidor recupera os resultados do cache de consulta em vez de analisar e executar a declaração novamente. O cache de consulta é compartilhado entre as sessões, portanto, um conjunto de resultados gerado por um cliente pode ser enviado em resposta à mesma consulta emitida por outro cliente.

O cache de consulta pode ser útil em um ambiente onde você tem tabelas que não mudam com muita frequência e para as quais o servidor recebe muitas consultas idênticas. Esta é uma situação típica para muitos servidores Web que geram muitas páginas dinâmicas com base no conteúdo do banco de dados.

O cache de consulta não retorna dados desatualizados. Quando as tabelas são modificadas, todas as entradas relevantes no cache de consulta são descartadas.

Nota

O cache de consulta não funciona em um ambiente onde você tem vários servidores `mysqld` atualizando as mesmas tabelas `MyISAM`.

O cache de consulta é utilizado para declarações preparadas nas condições descritas na Seção 8.10.3.1, “Como o cache de consulta funciona”.

Nota

O cache de consulta não é suportado para tabelas particionadas e é automaticamente desativado para consultas que envolvem tabelas particionadas. O cache de consulta não pode ser ativado para tais consultas.

Segue-se alguns dados de desempenho do cache de consultas. Esses resultados foram gerados ao executar a suite de benchmarks do MySQL em um sistema Linux Alpha 2×500 MHz com 2 GB de RAM e um cache de consultas de 64 MB.

* Se todas as consultas que você está realizando forem simples (como selecionar uma linha de uma tabela com uma única linha), mas ainda assim diferirem de tal forma que as consultas não possam ser armazenadas em cache, o custo de manter o cache de consultas ativo é de 13%. Isso pode ser considerado o cenário mais crítico. Na vida real, as consultas tendem a ser muito mais complicadas, então o custo normalmente é significativamente menor.

* As pesquisas por uma única linha em uma tabela de uma única linha são 238% mais rápidas com o cache de consulta do que sem ele. Isso pode ser considerado próximo à velocidade mínima esperada para uma consulta que é cacheada.

Para desabilitar o cache de consulta na inicialização do servidor, defina a variável de sistema `query_cache_size` para 0. Ao desabilitar o código do cache de consulta, não há sobrecarga perceptível.

O cache de consultas oferece o potencial para uma melhoria substancial no desempenho, mas não se espere que isso aconteça em todas as circunstâncias. Com algumas configurações de cache de consultas ou cargas de trabalho do servidor, você pode, na verdade, observar uma diminuição no desempenho:

* Tenha cuidado ao dimensionar o cache de consulta excessivamente grande, pois isso aumenta o custo necessário para manter o cache, possivelmente além do benefício de ativá-lo. Tamanhos em dezenas de megabytes geralmente são benéficos. Tamanhos na centena de megabytes podem não ser.

* O peso do servidor tem um efeito significativo na eficiência do cache de consultas. Uma mistura de consultas que consiste quase inteiramente em um conjunto fixo de `SELECT` é muito mais provável de se beneficiar da ativação do cache do que uma mistura na qual as frequentes `INSERT` causam invalidação contínua dos resultados no cache. Em alguns casos, uma solução é usar a opção `SQL_NO_CACHE` para evitar que os resultados entrem até mesmo no cache para as `SELECT` que usam tabelas frequentemente modificadas. (Veja a Seção 8.10.3.2, “Opções de Seleção do Cache de Consulta”.)

Para verificar se a ativação do cache de consulta é benéfica, teste o funcionamento do seu servidor MySQL com o cache ativado e desativado. Em seguida, reteste periodicamente, pois a eficiência do cache de consulta pode mudar conforme as mudanças na carga de trabalho do servidor.

#### 8.10.3.1 Como o Cache de Consulta Funciona

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Esta seção descreve como o cache de consultas funciona quando está operacional. A Seção 8.10.3.3, “Configuração do Cache de Consultas”, descreve como controlar se está operacional.

As consultas recebidas são comparadas às da cache de consulta antes da análise, portanto, as seguintes duas consultas são consideradas diferentes pelo cache de consulta:

```sql
SELECT * FROM tbl_name
Select * from tbl_name
```

As consultas devem ser *exatamente* as mesmas (byte por byte) para serem consideradas idênticas. Além disso, as consultas que são idênticas podem ser tratadas como diferentes por outros motivos. As consultas que utilizam diferentes bancos de dados, diferentes versões de protocolo ou diferentes conjuntos de caracteres padrão são consideradas consultas diferentes e são armazenadas separadamente.

O cache não é utilizado para consultas dos seguintes tipos:

* Consultas que são uma subconsulta de uma consulta externa
* Consultas executadas no corpo de uma função armazenada, gatilho ou evento

Antes que o resultado de uma consulta seja obtido do cache de consultas, o MySQL verifica se o usuário tem o privilégio `SELECT` para todas as bases de dados e tabelas envolvidas. Se não for esse o caso, o resultado armazenado no cache não é utilizado.

Se um resultado de consulta for retornado do cache de consulta, o servidor incrementa a variável de status `Qcache_hits`, não `Com_select`. Veja a Seção 8.10.3.4, “Status do Cache de Consulta e Manutenção”.

Se uma tabela for alterada, todas as consultas armazenadas que utilizam a tabela se tornam inválidas e são removidas do cache. Isso inclui consultas que utilizam tabelas `MERGE` que mapeiam para a tabela alterada. Uma tabela pode ser alterada por muitos tipos de declarações, como `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE`, `ALTER TABLE`, `DROP TABLE` ou `DROP DATABASE`.

O cache de consulta também funciona dentro de transações ao usar as tabelas `InnoDB`.

O resultado de uma consulta `SELECT` em uma visualização é armazenado em cache.

O cache de consulta funciona para consultas `SELECT SQL_CALC_FOUND_ROWS ...` e armazena um valor que é retornado por uma consulta subsequente `SELECT FOUND_ROWS()`. `FOUND_ROWS()` retorna o valor correto mesmo que a consulta anterior tenha sido obtida do cache, porque o número de linhas encontradas também é armazenado no cache. A própria consulta `SELECT FOUND_ROWS()` não pode ser armazenada no cache.

As declarações preparadas que são emitidas usando o protocolo binário usando `mysql_stmt_prepare()` e `mysql_stmt_execute()` (ver C API Interface de Declaração Preparada), estão sujeitas a limitações de cache. A comparação com declarações no cache de consulta é baseada no texto da declaração após a expansão dos marcadores de parâmetros `?`. A declaração é comparada apenas com outras declarações em cache que foram executadas usando o protocolo binário. Isso significa que, para fins de cache de consulta, declarações preparadas emitidas usando o protocolo binário são distintas de declarações preparadas emitidas usando o protocolo de texto (ver Seção 13.5, “Declarações Preparadas”).

Uma consulta não pode ser armazenada em cache se utilizar qualquer uma das seguintes funções:

* `AES_DECRYPT()`
* `AES_ENCRYPT()`
* `BENCHMARK()`
* `CONNECTION_ID()`
* `CONVERT_TZ()`
* `CURDATE()`
* `CURRENT_DATE()`
* `CURRENT_TIME()`
* `CURRENT_TIMESTAMP()`
* `CURRENT_USER()`
* `CURTIME()`
* `DATABASE()`
* `ENCRYPT()` com um parâmetro

* `FOUND_ROWS()`
* `GET_LOCK()`
* `IS_FREE_LOCK()`
* `IS_USED_LOCK()`
* `LAST_INSERT_ID()`
* `LOAD_FILE()`
* `MASTER_POS_WAIT()`
* `NOW()`
* `PASSWORD()`
* `RAND()`
* `RANDOM_BYTES()`
* `RELEASE_ALL_LOCKS()`
* `RELEASE_LOCK()`
* `SLEEP()`
* `SYSDATE()`
* `UNIX_TIMESTAMP()` sem parâmetros

* `USER()`
* `UUID()`
* `UUID_SHORT()`

Uma consulta também não é armazenada em cache nessas condições:

* Se refere a funções carregáveis ou funções armazenadas. * Se refere a variáveis de usuário ou variáveis de programa armazenadas localmente.

* Se refere a tabelas no banco de dados `mysql`, `INFORMATION_SCHEMA` ou `performance_schema`.

* Se refere a qualquer tabela dividida.
* É de qualquer uma das seguintes formas:

  ```sql
  SELECT ... LOCK IN SHARE MODE
  SELECT ... FOR UPDATE
  SELECT ... INTO OUTFILE ...
  SELECT ... INTO DUMPFILE ...
  SELECT * FROM ... WHERE autoincrement_col IS NULL
  ```

A última forma não é armazenada em cache porque é usada como uma solução ODBC para obter o último valor do ID de inserção. Consulte a seção Conectivo/ODBC do Capítulo 27, *Conectivos e APIs*.

As declarações dentro de transações que utilizam o nível de isolamento `SERIALIZABLE` também não podem ser armazenadas em cache, porque elas utilizam o bloqueio `LOCK IN SHARE MODE`.

* Utiliza tabelas `TEMPORARY`. * Não utiliza nenhuma tabela. * Gera avisos. * O usuário tem privilégio de nível de coluna para qualquer uma das tabelas envolvidas.

#### 8.10.3.2 Opções de cache de consulta SELECT

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Duas opções relacionadas ao cache de consulta podem ser especificadas nas declarações `SELECT`:

* `SQL_CACHE`

O resultado da consulta é armazenado em cache se for armazenável e o valor da variável de sistema `query_cache_type` é `ON` ou `DEMAND`.

* `SQL_NO_CACHE`

O servidor não utiliza o cache de consulta. Ele não verifica o cache de consulta para ver se o resultado já está em cache, nem o cacheia o resultado da consulta.

Exemplos:

```sql
SELECT SQL_CACHE id, name FROM customer;
SELECT SQL_NO_CACHE id, name FROM customer;
```

#### 8.10.3.3 Configuração do Cache de Consulta

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

A variável do sistema de servidor `have_query_cache` indica se o cache de consulta está disponível:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Ao usar um binário padrão do MySQL, esse valor é sempre `YES`, mesmo se o cache de consulta estiver desativado.

Várias outras variáveis do sistema controlam a operação do cache de consulta. Essas podem ser definidas em um arquivo de opções ou na linha de comando ao iniciar `mysqld`. Todas as variáveis do sistema de cache de consulta têm nomes que começam com `query_cache_`. Elas são descritas brevemente na Seção 5.1.7, “Variáveis do Sistema do Servidor”, com informações adicionais de configuração fornecidas aqui.

Para definir o tamanho do cache de consulta, defina a variável de sistema `query_cache_size`. Definindo-a como 0, desativa o cache de consulta, assim como definir `query_cache_type=0`. Por padrão, o cache de consulta é desativado. Isso é alcançado usando um tamanho padrão de 1M, com um valor padrão para `query_cache_type` de 0.

Para reduzir significativamente os custos operacionais, inicie o servidor com `query_cache_type=0` se não pretender usar o cache de consulta.

Nota

Ao usar o Assistente de Configuração do Windows para instalar ou configurar o MySQL, o valor padrão para `query_cache_size` é configurado automaticamente para você com base nos diferentes tipos de configuração disponíveis. Ao usar o Assistente de Configuração do Windows, o cache de consultas pode ser habilitado (ou seja, definido para um valor não nulo) devido à configuração selecionada. O cache de consultas também é controlado pelo ajuste da variável `query_cache_type`. Verifique os valores dessas variáveis conforme definido no seu arquivo `my.ini` após a configuração ter sido realizada.

Quando você define `query_cache_size` para um valor não nulo, tenha em mente que o cache de consulta precisa de um tamanho mínimo de cerca de 40 KB para alocar suas estruturas. (O tamanho exato depende da arquitetura do sistema.) Se você definir o valor muito pequeno, você receberá um aviso, como neste exemplo:

```sql
mysql> SET GLOBAL query_cache_size = 40000;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1282
Message: Query cache failed to set size 39936;
         new query cache size is 0

mysql> SET GLOBAL query_cache_size = 41984;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'query_cache_size';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| query_cache_size | 41984 |
+------------------+-------+
```

Para que o cache de consulta possa realmente armazenar quaisquer resultados de consulta, seu tamanho deve ser definido como maior:

```sql
mysql> SET GLOBAL query_cache_size = 1000000;
Query OK, 0 rows affected (0.04 sec)

mysql> SHOW VARIABLES LIKE 'query_cache_size';
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| query_cache_size | 999424 |
+------------------+--------+
1 row in set (0.00 sec)
```

O valor `query_cache_size` é alinhado ao bloco mais próximo de 1024 bytes. O valor reportado pode, portanto, ser diferente do valor que você atribuiu.

Se o tamanho do cache de consulta for maior que 0, a variável `query_cache_type` influencia o seu funcionamento. Essa variável pode ser definida nos seguintes valores:

* Um valor de `0` ou `OFF` impede o armazenamento em cache ou a recuperação de resultados armazenados em cache.

* Um valor de `1` ou `ON` habilita o cache, exceto para as declarações que começam com `SELECT SQL_NO_CACHE`.

* Um valor de `2` ou `DEMAND` faz com que o cache seja armazenado apenas para as declarações que começam com `SELECT SQL_CACHE`.

Se `query_cache_size` for 0, você também deve definir a variável `query_cache_type` para

0. Nesse caso, o servidor não adquire o mutex do cache de consulta de forma alguma, o que significa que o cache de consulta não pode ser habilitado em tempo de execução e há um sobrecarga reduzida na execução da consulta.

Definir o valor `GLOBAL` `query_cache_type` determina o comportamento do cache de consulta para todos os clientes que se conectam após a mudança ser feita. Os clientes individuais podem controlar o comportamento do cache para sua própria conexão, definindo o valor `SESSION` `query_cache_type`. Por exemplo, um cliente pode desabilitar o uso do cache de consulta para suas próprias consultas da seguinte forma:

```sql
mysql> SET SESSION query_cache_type = OFF;
```

Se você definir `query_cache_type` no início da inicialização do servidor (e não no momento da execução com uma declaração `SET`), apenas os valores numéricos são permitidos.

Para controlar o tamanho máximo dos resultados individuais de consulta que podem ser cacheados, defina a variável de sistema `query_cache_limit`. O valor padrão é de 1 MB.

Cuidado para não definir o tamanho do cache como muito grande. Devido à necessidade de os threads bloquear o cache durante as atualizações, você pode encontrar problemas de disputa de bloqueio com um cache muito grande.

Nota

Você pode definir o tamanho máximo que pode ser especificado para o cache de consulta no tempo de execução com a declaração `SET` usando a opção `--maximum-query_cache_size=32M` na linha de comando ou no arquivo de configuração.

Quando uma consulta deve ser cacheada, seu resultado (os dados enviados ao cliente) é armazenado no cache da consulta durante a recuperação do resultado. Portanto, os dados geralmente não são manipulados em um grande bloco. O cache da consulta aloca blocos para armazenar esses dados sob demanda, então, quando um bloco é preenchido, um novo bloco é alocado. Como a operação de alocação de memória é custosa (em termos de tempo), o cache da consulta aloca blocos com um tamanho mínimo dado pela variável de sistema `query_cache_min_res_unit`. Quando uma consulta é executada, o último bloco de resultado é ajustado ao tamanho real dos dados, para que a memória não utilizada seja liberada. Dependendo dos tipos de consultas que seu servidor executa, você pode achar útil ajustar o valor de `query_cache_min_res_unit`:

* O valor padrão de `query_cache_min_res_unit` é de 4 KB. Isso deve ser adequado para a maioria dos casos.

* Se você tiver muitas consultas com resultados pequenos, o tamanho padrão do bloco pode levar à fragmentação de memória, conforme indicado por um grande número de blocos livres. A fragmentação pode forçar o cache de consulta a podar (deletar) consultas do cache devido à falta de memória. Neste caso, diminua o valor de `query_cache_min_res_unit`. O número de blocos livres e consultas removidas devido ao podamento é dado pelos valores das variáveis de status `Qcache_free_blocks` e `Qcache_lowmem_prunes`.

* Se a maioria das suas consultas tiver resultados grandes (ver as variáveis de status `Qcache_total_blocks` e `Qcache_queries_in_cache`), você pode aumentar o desempenho aumentando `query_cache_min_res_unit`. No entanto, tenha cuidado para não torná-lo muito grande (consulte o item anterior).

#### 8.10.3.4 Verificar o estado e a manutenção do cache de consultas

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Para verificar se o cache de consulta está presente no seu servidor MySQL, use a seguinte declaração:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Você pode desfragmentar o cache de consulta para utilizar melhor sua memória com a declaração `FLUSH QUERY CACHE`. A declaração não remove nenhuma consulta do cache.

A declaração `RESET QUERY CACHE` remove todos os resultados da consulta do cache de consulta. A declaração `FLUSH TABLES` também faz isso.

Para monitorar o desempenho do cache de consultas, use `SHOW STATUS` para visualizar as variáveis de status do cache:

```sql
mysql> SHOW STATUS LIKE 'Qcache%';
+-------------------------+--------+
| Variable_name           | Value  |
+-------------------------+--------+
| Qcache_free_blocks      | 36     |
| Qcache_free_memory      | 138488 |
| Qcache_hits             | 79570  |
| Qcache_inserts          | 27087  |
| Qcache_lowmem_prunes    | 3114   |
| Qcache_not_cached       | 22989  |
| Qcache_queries_in_cache | 415    |
| Qcache_total_blocks     | 912    |
+-------------------------+--------+
```

As descrições de cada uma dessas variáveis estão descritas na Seção 5.1.9, “Variáveis de Status do Servidor”. Algumas utilizações para elas são descritas aqui.

O número total de consultas `SELECT` é dado por esta fórmula:

```sql
  Com_select
+ Qcache_hits
+ queries with errors found by parser
```

O valor `Com_select` é dado por esta fórmula:

```sql
  Qcache_inserts
+ Qcache_not_cached
+ queries with errors found during the column-privileges check
```

O cache de consulta utiliza blocos de comprimento variável, portanto, `Qcache_total_blocks` e `Qcache_free_blocks` podem indicar fragmentação da memória do cache de consulta. Após `FLUSH QUERY CACHE`, apenas um único bloco livre permanece.

Cada consulta cacheada requer um mínimo de dois blocos (um para o texto da consulta e um ou mais para os resultados da consulta). Além disso, cada tabela que é usada por uma consulta requer um bloco. No entanto, se duas ou mais consultas usam a mesma tabela, apenas um bloco de tabela precisa ser alocado.

As informações fornecidas pela variável de status `Qcache_lowmem_prunes` podem ajudá-lo a ajustar o tamanho do cache de consultas. Ela conta o número de consultas que foram removidas do cache para liberar memória para o armazenamento de novas consultas. O cache de consultas usa uma estratégia de uso menos recentemente utilizada (LRU) para decidir quais consultas devem ser removidas do cache. As informações de ajuste estão fornecidas na Seção 8.10.3.3, “Configuração do Cache de Consultas”.

### 8.10.4 Cache de declarações preparadas e programas armazenados

Para determinadas declarações que um cliente pode executar várias vezes durante uma sessão, o servidor converte a declaração em uma estrutura interna e armazena essa estrutura para ser usada durante a execução. O armazenamento em cache permite que o servidor realize a execução de forma mais eficiente, pois evita o esforço de reconverter a declaração caso seja necessário novamente durante a sessão. A conversão e o armazenamento em cache ocorrem para essas declarações:

* Declarações preparadas, tanto aquelas processadas no nível SQL (usando a declaração `PREPARE`) quanto aquelas processadas usando o protocolo binário cliente/servidor (usando a função `mysql_stmt_prepare()` da API C). A variável de sistema `max_prepared_stmt_count` controla o número total de declarações que o servidor armazena em cache. (A soma do número de declarações preparadas em todas as sessões.)

* Programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Neste caso, o servidor converte e armazena o corpo inteiro do programa. A variável de sistema `stored_program_cache` indica o número aproximado de programas armazenados que o servidor armazena por sessão.

O servidor mantém caches para declarações preparadas e programas armazenados em uma base por sessão. As declarações cacheadas para uma sessão não são acessíveis para outras sessões. Quando uma sessão termina, o servidor descarta quaisquer declarações cacheadas para ela.

Quando o servidor utiliza uma estrutura de declaração cacheada interna, ele deve garantir que essa estrutura não se torne obsoleta. Alterações de metadados podem ocorrer em um objeto utilizado pela declaração, causando um desajuste entre a definição atual do objeto e a definição representada na estrutura de declaração interna. Alterações de metadados ocorrem em declarações DDL, como aquelas que criam, excluem, alteram, renomeiam ou truncam tabelas, ou que analisam, otimizam ou reparam tabelas. Alterações no conteúdo da tabela (por exemplo, com `INSERT` ou `UPDATE`) não alteram metadados, assim como as declarações `SELECT`.

Aqui está uma ilustração do problema. Suponha que um cliente prepare esta declaração:

```sql
PREPARE s1 FROM 'SELECT * FROM t1';
```

O `SELECT *` se expande na estrutura interna para a lista de colunas na tabela. Se o conjunto de colunas na tabela for modificado com `ALTER TABLE`, a declaração preparada fica desatualizada. Se o servidor não detectar essa mudança na próxima vez que o cliente executar `s1`, a declaração preparada retornará resultados incorretos.

Para evitar problemas causados por alterações de metadados em tabelas ou visualizações referenciadas pela declaração preparada, o servidor detecta essas alterações e refaz automaticamente a declaração quando é executada a próxima vez. Isso significa que o servidor repara a declaração e reconstrui a estrutura interna. A reparação também ocorre após as tabelas ou visualizações referenciadas serem apagadas do cache de definição de tabela, seja implicitamente para fazer espaço para novas entradas no cache, seja explicitamente devido a `FLUSH TABLES`.

Da mesma forma, se houver alterações em objetos utilizados por um programa armazenado, o servidor repara as declarações afetadas no programa.

O servidor também detecta alterações de metadados para objetos em expressões. Essas podem ser usadas em declarações específicas de programas armazenados, como `DECLARE CURSOR` ou declarações de controle de fluxo, como `IF`, `CASE` e `RETURN`.

Para evitar a análise de programas inteiros armazenados, o servidor analisa as declarações ou expressões afetadas em um programa apenas quando necessário. Exemplos:

* Suponha que os metadados de uma tabela ou visão sejam alterados. A reparação ocorre para um `SELECT *` no programa que acessa a tabela ou visão, mas não para um `SELECT *` que não acessa a tabela ou visão.

* Quando uma declaração é afetada, o servidor a repara apenas parcialmente, se possível. Considere esta declaração `CASE`:

  ```sql
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