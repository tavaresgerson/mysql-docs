### 8.9.5 O Modelo de Custo do Optimizer

Para gerar planos de execução, o optimizer utiliza um modelo de custo (cost model) baseado em estimativas do custo de várias operações que ocorrem durante a execução de Querys. O optimizer possui um conjunto de "constantes de custo" (cost constants) padrão compiladas disponíveis para tomar decisões sobre os planos de execução.

O optimizer também possui um Database de estimativas de custo para usar durante a construção do plano de execução. Essas estimativas são armazenadas nas tabelas `server_cost` e `engine_cost` no Database de sistema `mysql` e são configuráveis a qualquer momento. O objetivo dessas tabelas é possibilitar o ajuste fácil das estimativas de custo que o optimizer usa ao tentar chegar a planos de execução de Querys.

* Operação Geral do Modelo de Custo
* O Database do Modelo de Custo
* Fazendo Alterações no Database do Modelo de Custo

#### Operação Geral do Modelo de Custo

O modelo de custo do optimizer configurável funciona da seguinte forma:

* O servidor lê as tabelas do modelo de custo para a memória na inicialização e usa os valores em memória durante o runtime. Qualquer estimativa de custo não-`NULL` especificada nas tabelas tem precedência sobre a constante de custo padrão compilada correspondente. Qualquer estimativa `NULL` indica ao optimizer para usar o padrão compilado.

* Durante o runtime, o servidor pode reler as tabelas de custo. Isso ocorre quando um Storage Engine é carregado dinamicamente ou quando uma instrução `FLUSH OPTIMIZER_COSTS` é executada.

* As tabelas de custo permitem que os administradores do servidor ajustem facilmente as estimativas de custo alterando as entradas nas tabelas. Também é fácil reverter para um padrão definindo o custo de uma entrada como `NULL`. O optimizer usa os valores de custo em memória, então as alterações nas tabelas devem ser seguidas por `FLUSH OPTIMIZER_COSTS` para entrarem em vigor.

* As estimativas de custo em memória que estão atuais quando uma sessão de cliente começa se aplicam durante toda essa sessão até que ela termine. Em particular, se o servidor reler as tabelas de custo, quaisquer estimativas alteradas se aplicam apenas às sessões iniciadas subsequentemente. As sessões existentes não são afetadas.

* As tabelas de custo são específicas para uma determinada instância do servidor. O servidor não replica as alterações da tabela de custo para as réplicas.

#### O Database do Modelo de Custo

O Database do modelo de custo do optimizer consiste em duas tabelas no Database de sistema `mysql` que contêm informações de estimativa de custo para operações que ocorrem durante a execução de Querys:

* `server_cost`: Estimativas de custo do Optimizer para operações gerais do servidor.

* `engine_cost`: Estimativas de custo do Optimizer para operações específicas de Storage Engines específicos.

A tabela `server_cost` contém as seguintes colunas:

| Coluna | Descrição |
| :--- | :--- |
| `cost_name` | O nome de uma estimativa de custo usada no modelo de custo. O nome não diferencia maiúsculas de minúsculas (case-sensitive). Se o servidor não reconhecer o nome do custo ao ler esta tabela, ele escreverá um aviso no log de erros. |
| `cost_value` | O valor da estimativa de custo. Se o valor não for `NULL`, o servidor o usa como custo. Caso contrário, ele usa a estimativa padrão (o valor compilado). DBAs podem alterar uma estimativa de custo atualizando esta coluna. Se o servidor descobrir que o valor do custo é inválido (não positivo) ao ler esta tabela, ele escreverá um aviso no log de erros. Para substituir uma estimativa de custo padrão (para uma entrada que especifica `NULL`), defina o custo como um valor não-`NULL`. Para reverter para o padrão, defina o valor como `NULL`. Em seguida, execute `FLUSH OPTIMIZER_COSTS` para instruir o servidor a reler as tabelas de custo. |
| `last_update` | A hora da última atualização da linha. |
| `comment` | Um comentário descritivo associado à estimativa de custo. DBAs podem usar esta coluna para fornecer informações sobre por que uma linha de estimativa de custo armazena um determinado valor. |

A Primary Key para a tabela `server_cost` é a coluna `cost_name`, portanto, não é possível criar múltiplas entradas para qualquer estimativa de custo.

O servidor reconhece estes valores de `cost_name` para a tabela `server_cost`:

* `disk_temptable_create_cost` (padrão 40.0), `disk_temptable_row_cost` (padrão 1.0)

  As estimativas de custo para tabelas temporárias criadas internamente armazenadas em um Storage Engine baseado em disco (seja `InnoDB` ou `MyISAM`). Aumentar esses valores aumenta a estimativa de custo de usar tabelas temporárias internas e faz com que o optimizer prefira planos de Query com menos uso delas. Para obter informações sobre essas tabelas, consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

  Os valores padrão maiores para esses parâmetros de disco em comparação com os valores padrão para os parâmetros de memória correspondentes (`memory_temptable_create_cost`, `memory_temptable_row_cost`) refletem o custo maior do processamento de tabelas baseadas em disco.

* `key_compare_cost` (padrão 0.1)

  O custo de comparação de chaves de registro (record keys). Aumentar esse valor faz com que um plano de Query que compara muitas chaves se torne mais caro. Por exemplo, um plano de Query que executa um `filesort` torna-se relativamente mais caro em comparação com um plano de Query que evita a ordenação usando um Index.

* `memory_temptable_create_cost` (padrão 2.0), `memory_temptable_row_cost` (padrão 0.2)

  As estimativas de custo para tabelas temporárias criadas internamente armazenadas no Storage Engine `MEMORY`. Aumentar esses valores aumenta a estimativa de custo de usar tabelas temporárias internas e faz com que o optimizer prefira planos de Query com menos uso delas. Para obter informações sobre essas tabelas, consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

  Os valores padrão menores para esses parâmetros de memória em comparação com os parâmetros de disco correspondentes (`disk_temptable_create_cost`, `disk_temptable_row_cost`) refletem o custo menor do processamento de tabelas baseadas em memória.

* `row_evaluate_cost` (padrão 0.2)

  O custo de avaliação de condições de registro (record conditions). Aumentar esse valor faz com que um plano de Query que examina muitas linhas se torne mais caro em comparação com um plano de Query que examina menos linhas. Por exemplo, um table scan torna-se relativamente mais caro em comparação com um range scan que lê menos linhas.

A tabela `engine_cost` contém as seguintes colunas:

| Coluna | Descrição |
| :--- | :--- |
| `engine_name` | O nome do Storage Engine ao qual esta estimativa de custo se aplica. O nome não diferencia maiúsculas de minúsculas. Se o valor for `default`, ele se aplica a todos os Storage Engines que não têm uma entrada nomeada própria. Se o servidor não reconhecer o nome do Engine ao ler esta tabela, ele escreverá um aviso no log de erros. |
| `device_type` | O tipo de dispositivo ao qual esta estimativa de custo se aplica. A coluna se destina a especificar diferentes estimativas de custo para diferentes tipos de dispositivos de Storage, como discos rígidos (hard disk drives) versus unidades de estado sólido (solid state drives). Atualmente, esta informação não é usada, e 0 é o único valor permitido. |
| `cost_name` | O mesmo que na tabela `server_cost`. |
| `cost_value` | O mesmo que na tabela `server_cost`. |
| `last_update` | O mesmo que na tabela `server_cost`. |
| `comment` | O mesmo que na tabela `server_cost`. |

A Primary Key para a tabela `engine_cost` é uma tupla compreendendo as colunas (`cost_name`, `engine_name`, `device_type`), portanto, não é possível criar múltiplas entradas para qualquer combinação de valores nessas colunas.

O servidor reconhece estes valores de `cost_name` para a tabela `engine_cost`:

* `io_block_read_cost` (padrão 1.0)

  O custo da leitura de um Index ou bloco de dados do disco. Aumentar esse valor faz com que um plano de Query que lê muitos blocos de disco se torne mais caro em comparação com um plano de Query que lê menos blocos de disco. Por exemplo, um table scan torna-se relativamente mais caro em comparação com um range scan que lê menos blocos.

* `memory_block_read_cost` (padrão 1.0)

  Semelhante a `io_block_read_cost`, mas representa o custo de leitura de um Index ou bloco de dados de um Buffer de Database em memória.

Se os valores de `io_block_read_cost` e `memory_block_read_cost` diferirem, o plano de execução pode mudar entre duas execuções da mesma Query. Suponha que o custo para acesso à memória seja menor do que o custo para acesso ao disco. Nesse caso, na inicialização do servidor, antes que os dados tenham sido lidos no Buffer Pool, você pode obter um plano diferente do que depois que a Query foi executada, pois então os dados estão em memória.

#### Fazendo Alterações no Database do Modelo de Custo

Para DBAs que desejam alterar os parâmetros do modelo de custo a partir de seus padrões, tente dobrar ou reduzir pela metade o valor e medir o efeito.

É mais provável que alterações nos parâmetros `io_block_read_cost` e `memory_block_read_cost` gerem resultados que valham a pena. Esses valores de parâmetro permitem que os modelos de custo para métodos de acesso a dados levem em consideração os custos de leitura de informações de diferentes fontes; ou seja, o custo de leitura de informações do disco versus a leitura de informações já em um Buffer de memória. Por exemplo, mantendo todo o resto igual, definir `io_block_read_cost` para um valor maior que `memory_block_read_cost` faz com que o optimizer prefira planos de Query que leiam informações já mantidas na memória em vez de planos que precisem ler do disco.

Este exemplo mostra como alterar o valor padrão para `io_block_read_cost`:

```sql
UPDATE mysql.engine_cost
  SET cost_value = 2.0
  WHERE cost_name = 'io_block_read_cost';
FLUSH OPTIMIZER_COSTS;
```

Este exemplo mostra como alterar o valor de `io_block_read_cost` apenas para o Storage Engine `InnoDB`:

```sql
INSERT INTO mysql.engine_cost
  VALUES ('InnoDB', 0, 'io_block_read_cost', 3.0,
  CURRENT_TIMESTAMP, 'Using a slower disk for InnoDB');
FLUSH OPTIMIZER_COSTS;
```