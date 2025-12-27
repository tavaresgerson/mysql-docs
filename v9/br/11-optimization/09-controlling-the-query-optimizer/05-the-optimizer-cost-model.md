### 10.9.5 O Modelo de Custo do Otimizador

Para gerar planos de execução, o otimizador utiliza um modelo de custo baseado em estimativas do custo de várias operações que ocorrem durante a execução da consulta. O otimizador possui um conjunto de "constantes de custo" padrão compiladas disponíveis para tomar decisões sobre os planos de execução.

O otimizador também possui um banco de dados de estimativas de custo para uso durante a construção do plano de execução. Essas estimativas são armazenadas nas tabelas `server_cost` e `engine_cost` no banco de dados do sistema `mysql` e são configuráveis a qualquer momento. A intenção dessas tabelas é possibilitar a fácil ajuste das estimativas de custo que o otimizador usa ao tentar chegar aos planos de execução da consulta.

* Modelo de Custo Operação Geral
* O Banco de Dados do Modelo de Custo
* Fazendo Alterações no Banco de Dados do Modelo de Custo

#### Operação Geral do Modelo de Custo

O modelo de custo do otimizador configurável funciona da seguinte maneira:

* O servidor lê as tabelas do modelo de custo na memória ao inicializar e usa os valores em memória na execução. Qualquer estimativa de custo não `NULL` especificada nas tabelas tem precedência sobre a constante de custo padrão compilada. Qualquer estimativa `NULL` indica ao otimizador que deve usar a constante de custo padrão compilada.

* Na execução, o servidor pode reler as tabelas de custo. Isso ocorre quando um motor de armazenamento é carregado dinamicamente ou quando uma instrução `FLUSH OPTIMIZER_COSTS` é executada.

* As tabelas de custo permitem que os administradores do servidor ajustem facilmente as estimativas de custo alterando as entradas nas tabelas. Também é fácil retornar a um padrão configurando o custo de uma entrada para `NULL`. O otimizador usa os valores de custo em memória, então as alterações nas tabelas devem ser seguidas por `FLUSH OPTIMIZER_COSTS` para entrar em vigor.

* As estimativas de custo em memória que são atualizadas quando uma sessão do cliente começa são aplicadas durante toda a sessão até o seu término. Em particular, se o servidor reler as tabelas de custo, quaisquer estimativas alteradas aplicam-se apenas a sessões iniciadas posteriormente. As sessões existentes não são afetadas.

* As tabelas de custo são específicas para uma instância do servidor. O servidor não replica as alterações nas tabelas de custo para réplicas.

#### A Base de Dados do Modelo de Custo

A base de dados do modelo de custo do otimizador consiste em duas tabelas no banco de dados do sistema `mysql` que contêm informações de estimativas de custo para operações que ocorrem durante a execução da consulta:

* `server_cost`: Estimações de custo do otimizador para operações gerais do servidor

* `engine_cost`: Estimações de custo do otimizador para operações específicas de motores de armazenamento particulares

A tabela `server_cost` contém as seguintes colunas:

* `cost_name`

  O nome de uma estimativa de custo usada no modelo de custo. O nome não é case-sensitive. Se o servidor não reconhecer o nome do custo ao ler esta tabela, ele escreve uma mensagem de aviso no log de erro.

* `cost_value`

  O valor da estimativa de custo. Se o valor não for `NULL`, o servidor usa-o como o custo. Caso contrário, usa a estimativa padrão (o valor embutido). Os administradores de banco de dados podem alterar uma estimativa de custo atualizando esta coluna. Se o servidor encontrar que o valor do custo é inválido (não positivo) ao ler esta tabela, ele escreve uma mensagem de aviso no log de erro.

  Para substituir uma estimativa de custo padrão (para uma entrada que especifica `NULL`), defina o custo para um valor não `NULL`. Para reverter para o padrão, defina o valor para `NULL`. Em seguida, execute `FLUSH OPTIMIZER_COSTS` para informar ao servidor para reler as tabelas de custo.

* `last_update`

  A hora da última atualização da linha.

* `comment`

Um comentário descritivo associado à estimativa de custo. Os DBA podem usar essa coluna para fornecer informações sobre por que uma linha de estimativa de custo armazena um valor específico.

* `default_value`

  O valor padrão (compilado) para a estimativa de custo. Essa coluna é uma coluna gerada de leitura que retém seu valor mesmo se a estimativa de custo associada for alterada. Para linhas adicionadas à tabela em tempo de execução, o valor dessa coluna é `NULL`.

A chave primária da tabela `server_cost` é a coluna `cost_name`, portanto, não é possível criar várias entradas para qualquer estimativa de custo.

O servidor reconhece esses valores de `cost_name` para a tabela `server_cost`:

* `disk_temptable_create_cost`, `disk_temptable_row_cost`

  As estimativas de custo para tabelas temporárias criadas internamente armazenadas em um motor de armazenamento baseado em disco (seja `InnoDB` ou `MyISAM`). Aumentar esses valores aumenta a estimativa de custo de usar tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menos uso delas. Para informações sobre tais tabelas, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Os valores padrão maiores para esses parâmetros de disco em comparação com os valores padrão dos parâmetros de memória correspondentes (`memory_temptable_create_cost`, `memory_temptable_row_cost`) refletem o maior custo de processamento de tabelas baseadas em disco.

* `key_compare_cost`

  O custo de comparar chaves de registro. Aumentar esse valor faz com que um plano de consulta que compara muitas chaves se torne mais caro. Por exemplo, um plano de consulta que realiza um `filesort` se torna relativamente mais caro em comparação com um plano de consulta que evita a ordenação usando um índice.

* `memory_temptable_create_cost`, `memory_temptable_row_cost`

As estimativas de custo para tabelas temporárias criadas internamente e armazenadas no mecanismo de armazenamento `MEMORY`. Aumentar esses valores aumenta a estimativa de custo de uso de tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menor uso delas. Para informações sobre essas tabelas, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

Os valores padrão menores para esses parâmetros de memória, em comparação com os valores padrão para os parâmetros de disco correspondentes (`disk_temptable_create_cost`, `disk_temptable_row_cost`), refletem o menor custo de processamento de tabelas baseadas em memória.

* `row_evaluate_cost`

  O custo de avaliação de condições de registro. Aumentar esse valor faz com que um plano de consulta que examina muitas linhas se torne mais caro em comparação com um plano de consulta que examina menos linhas. Por exemplo, uma varredura de tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos linhas.

A tabela `engine_cost` contém as seguintes colunas:

* `engine_name`

  O nome do mecanismo de armazenamento ao qual essa estimativa de custo se aplica. O nome não é case-sensitive. Se o valor for `default`, ele se aplica a todos os mecanismos de armazenamento que não têm uma entrada nomeada própria. Se o servidor não reconhecer o nome do motor ao ler essa tabela, ele escreve uma mensagem de aviso no log de erro.

* `device_type`

  O tipo de dispositivo ao qual essa estimativa de custo se aplica. A coluna é destinada a especificar diferentes estimativas de custo para diferentes tipos de dispositivos de armazenamento, como discos rígidos versus unidades de estado sólido. Atualmente, essa informação não é usada e 0 é o único valor permitido.

* `cost_name`

  O mesmo que na tabela `server_cost`.

* `cost_value`

  O mesmo que na tabela `server_cost`.

* `last_update`

  O mesmo que na tabela `server_cost`.

* `comment`

O mesmo que na tabela `server_cost`.

* `default_value`

  O valor padrão (compilado) para a estimativa de custo. Essa coluna é uma coluna gerada de leitura apenas que retém seu valor mesmo se a estimativa de custo associada for alterada. Para linhas adicionadas à tabela em tempo de execução, o valor dessa coluna é `NULL`, com exceção de que, se a linha tiver o mesmo valor de `cost_name` que uma das linhas originais, o valor da coluna `default_value` terá o mesmo valor daquela linha.

A chave primária para a tabela `engine_cost` é uma tupla que compreende as colunas (`cost_name`, `engine_name`, `device_type`), portanto, não é possível criar múltiplas entradas para qualquer combinação de valores nessas colunas.

O servidor reconhece esses valores de `cost_name` para a tabela `engine_cost`:

* `io_block_read_cost`

  O custo de ler um índice ou bloco de dados do disco. Aumentar esse valor faz com que o plano de consulta que lê muitos blocos de disco se torne mais caro em comparação com um plano de consulta que lê menos blocos de disco. Por exemplo, uma varredura da tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos blocos.

* `memory_block_read_cost`

  Semelhante a `io_block_read_cost`, mas representa o custo de ler um índice ou bloco de dados de um buffer de banco de dados em memória.

Se os valores de `io_block_read_cost` e `memory_block_read_cost` forem diferentes, o plano de execução pode mudar entre duas execuções da mesma consulta. Suponha que o custo de acesso à memória seja menor que o custo de acesso ao disco. Nesse caso, na inicialização do servidor antes de os dados serem lidos no pool de buffers, você pode obter um plano diferente do que após a execução da consulta, porque os dados estão na memória.

#### Fazendo Alterações no Banco de Dados do Modelo de Custo

Para os DBAs que desejam alterar os parâmetros do modelo de custo dos seus padrões, tente dobrar ou reduzir pela metade o valor e medir o efeito.

Alterações nos parâmetros `io_block_read_cost` e `memory_block_read_cost` provavelmente produzirão resultados valiosos. Esses valores de parâmetro permitem que os modelos de custo para métodos de acesso a dados considerem os custos de leitura de informações de diferentes fontes; ou seja, o custo de ler informações de disco em comparação com a leitura de informações já em um buffer de memória. Por exemplo, se todas as outras coisas forem iguais, definir `io_block_read_cost` para um valor maior que `memory_block_read_cost` faz com que o otimizador prefira planos de consulta que leem informações já mantidas na memória em relação a planos que precisam ler do disco.

Este exemplo mostra como alterar o valor padrão para `io_block_read_cost`:

```
UPDATE mysql.engine_cost
  SET cost_value = 2.0
  WHERE cost_name = 'io_block_read_cost';
FLUSH OPTIMIZER_COSTS;
```

Este exemplo mostra como alterar o valor de `io_block_read_cost` apenas para o motor de armazenamento `InnoDB`:

```
INSERT INTO mysql.engine_cost
  VALUES ('InnoDB', 0, 'io_block_read_cost', 3.0,
  CURRENT_TIMESTAMP, 'Using a slower disk for InnoDB');
FLUSH OPTIMIZER_COSTS;
```