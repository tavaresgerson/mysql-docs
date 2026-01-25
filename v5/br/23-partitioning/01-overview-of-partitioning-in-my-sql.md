## 22.1 Visão Geral de Partitioning no MySQL

Esta seção fornece uma visão geral conceitual de *partitioning* no MySQL 5.7.

Para obter informações sobre restrições de *partitioning* e limitações de recursos, consulte [Seção 22.6, “Restrições e Limitações sobre Partitioning”](partitioning-limitations.html "22.6 Restrições e Limitações sobre Partitioning").

O padrão SQL não oferece muita orientação em relação aos aspectos físicos do armazenamento de dados. A própria linguagem SQL se destina a funcionar independentemente de quaisquer estruturas de dados ou mídias subjacentes aos schemas, tabelas, linhas ou colunas com os quais ela trabalha. Não obstante, a maioria dos sistemas avançados de gerenciamento de Database (banco de dados) evoluiu algum meio de determinar a localização física a ser usada para armazenar partes específicas de dados em termos de *file system* (sistema de arquivos), hardware ou até mesmo ambos. No MySQL, o *storage engine* `InnoDB` há muito tempo oferece suporte à noção de *tablespace*, e o MySQL Server, mesmo antes da introdução do *partitioning*, podia ser configurado para empregar diferentes diretórios físicos para armazenar diferentes *Databases* (consulte [Seção 8.12.3, “Usando Symbolic Links”](symbolic-links.html "8.12.3 Usando Symbolic Links"), para uma explicação de como isso é feito).

O *Partitioning* leva essa noção um passo adiante, permitindo distribuir porções de tabelas individuais por um *file system* de acordo com regras que você pode definir amplamente conforme a necessidade. Na prática, diferentes porções de uma tabela são armazenadas como tabelas separadas em diferentes locais. A regra selecionada pelo usuário pela qual a divisão dos dados é realizada é conhecida como uma *partitioning function* (função de particionamento), que no MySQL pode ser o módulo, correspondência simples contra um conjunto de *ranges* (intervalos) ou listas de valores, uma função de *hashing* interna, ou uma função de *hashing* linear. A função é selecionada de acordo com o tipo de *partitioning* especificado pelo usuário e usa como seu parâmetro o valor de uma expressão fornecida pelo usuário. Esta expressão pode ser um valor de coluna, uma função atuando em um ou mais valores de coluna, ou um conjunto de um ou mais valores de coluna, dependendo do tipo de *partitioning* que é usado.

No caso de *partitioning* `RANGE`, `LIST` e [`LINEAR`] `HASH`, o valor da coluna de *partitioning* é passado para a *partitioning function*, que retorna um valor inteiro representando o número da *partition* na qual aquele registro específico deve ser armazenado. Esta função deve ser não-constante e não-aleatória. Ela não pode conter nenhuma *Query* (consulta), mas pode usar uma expressão SQL válida no MySQL, contanto que essa expressão retorne `NULL` ou um inteiro *`intval`* tal que

```sql
-MAXVALUE <= intval <= MAXVALUE
```

(`MAXVALUE` é usado para representar o limite superior mínimo para o tipo de inteiro em questão. `-MAXVALUE` representa o limite inferior máximo.)

Para *partitioning* [`LINEAR`] `KEY`, `RANGE COLUMNS` e `LIST COLUMNS`, a expressão de *partitioning* consiste em uma lista de uma ou mais colunas.

Para *partitioning* [`LINEAR`] `KEY`, a *partitioning function* é fornecida pelo MySQL.

Para mais informações sobre os tipos de colunas de *partitioning* e *partitioning functions* permitidas, consulte [Seção 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types"), bem como [Seção 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), que fornece descrições de sintaxe de *partitioning* e exemplos adicionais. Para obter informações sobre restrições em *partitioning functions*, consulte [Seção 22.6.3, “Partitioning Limitations Relating to Functions”](partitioning-limitations-functions.html "22.6.3 Partitioning Limitations Relating to Functions").

Isso é conhecido como *horizontal partitioning* (particionamento horizontal)—ou seja, diferentes linhas de uma tabela podem ser atribuídas a diferentes *partitions* físicas. O MySQL 5.7 não suporta *vertical partitioning* (particionamento vertical), no qual diferentes colunas de uma tabela são atribuídas a diferentes *partitions* físicas. Não há planos neste momento para introduzir *vertical partitioning* no MySQL.

Para obter informações sobre como determinar se o seu binário do MySQL Server suporta *user-defined partitioning* (particionamento definido pelo usuário), consulte [Capítulo 22, *Partitioning*](partitioning.html "Capítulo 22 Partitioning").

Para criar tabelas particionadas, você pode usar a maioria dos *storage engines* que são suportados pelo seu MySQL server; o motor de *partitioning* do MySQL é executado em uma camada separada e pode interagir com qualquer um deles. No MySQL 5.7, todas as *partitions* da mesma tabela particionada devem usar o mesmo *storage engine*; por exemplo, você não pode usar `MyISAM` para uma *partition* e `InnoDB` para outra. No entanto, não há nada que impeça você de usar diferentes *storage engines* para diferentes tabelas particionadas no mesmo MySQL server ou mesmo no mesmo *Database*.

O *Partitioning* no MySQL não pode ser usado com os *storage engines* `MERGE`, `CSV` ou `FEDERATED`.

O *Partitioning* por `KEY` ou `LINEAR KEY` é possível com [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), mas outros tipos de *user-defined partitioning* não são suportados para tabelas que usam este *storage engine*. Além disso, uma tabela [`NDB`] que emprega *user-defined partitioning* deve ter uma *Primary Key* explícita, e quaisquer colunas referenciadas na expressão de *partitioning* da tabela devem fazer parte da *Primary Key*. No entanto, se nenhuma coluna for listada na cláusula `PARTITION BY KEY` ou `PARTITION BY LINEAR KEY` do comando [`CREATE TABLE`] ou [`ALTER TABLE`] usado para criar ou modificar uma tabela [`NDB`] particionada pelo usuário, a tabela não é obrigada a ter uma *Primary Key* explícita. Para mais informações, consulte [Seção 21.2.7.1, “Noncompliance with SQL Syntax in NDB Cluster”](mysql-cluster-limitations-syntax.html "21.2.7.1 Noncompliance with SQL Syntax in NDB Cluster").

Para empregar um *storage engine* específico para uma tabela particionada, é necessário apenas usar a opção `[STORAGE] ENGINE` assim como faria para uma tabela não particionada. No entanto, você deve ter em mente que `[STORAGE] ENGINE` (e outras opções de tabela) precisam ser listadas *antes* que quaisquer opções de *partitioning* sejam usadas em um comando [`CREATE TABLE`]. Este exemplo mostra como criar uma tabela que é particionada por *hash* em 6 *partitions* e que usa o *storage engine* `InnoDB`:

```sql
CREATE TABLE ti (id INT, amount DECIMAL(7,2), tr_date DATE)
    ENGINE=INNODB
    PARTITION BY HASH( MONTH(tr_date) )
    PARTITIONS 6;
```

Cada cláusula `PARTITION` pode incluir uma opção `[STORAGE] ENGINE`, mas no MySQL 5.7 isso não tem efeito.

Importante

O *Partitioning* se aplica a todos os dados e *Indexes* (índices) de uma tabela; você não pode particionar apenas os dados e não os *Indexes*, ou vice-versa, nem pode particionar apenas uma porção da tabela.

Dados e *Indexes* para cada *partition* podem ser atribuídos a um diretório específico usando as opções `DATA DIRECTORY` e `INDEX DIRECTORY` para a cláusula `PARTITION` do comando [`CREATE TABLE`] usado para criar a tabela particionada.

`DATA DIRECTORY` e `INDEX DIRECTORY` não são suportados para *partitions* ou *subpartitions* individuais de tabelas `MyISAM` no Windows.

Apenas a opção `DATA DIRECTORY` é suportada para *partitions* e *subpartitions* individuais de tabelas `InnoDB`.

Todas as colunas usadas na expressão de *partitioning* da tabela devem fazer parte de toda *unique key* (chave única) que a tabela possa ter, incluindo qualquer *Primary Key*. Isso significa que uma tabela como esta, criada pelo seguinte comando SQL, não pode ser particionada:

```sql
CREATE TABLE tnp (
    id INT NOT NULL AUTO_INCREMENT,
    ref BIGINT NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
);
```

Como as chaves `pk` e `uk` não têm colunas em comum, não há colunas disponíveis para uso em uma expressão de *partitioning*. Soluções alternativas possíveis nesta situação incluem adicionar a coluna `name` à *Primary Key* da tabela, adicionar a coluna `id` à `uk`, ou simplesmente remover a *unique key* por completo. Consulte [Seção 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys"), para mais informações.

Além disso, `MAX_ROWS` e `MIN_ROWS` podem ser usados para determinar os números máximo e mínimo de linhas, respectivamente, que podem ser armazenados em cada *partition*. Consulte [Seção 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management"), para mais informações sobre essas opções.

A opção `MAX_ROWS` também pode ser útil para criar tabelas NDB Cluster com *partitions* extras, permitindo assim maior armazenamento de *hash indexes*. Consulte a documentação para o parâmetro de configuração do nó de dados [`DataMemory`], bem como [Seção 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"), para mais informações.

Algumas vantagens do *partitioning* estão listadas aqui:

*   O *Partitioning* torna possível armazenar mais dados em uma tabela do que pode ser mantido em um único disco ou *file system partition*.

*   Dados que perdem sua utilidade podem ser facilmente removidos de uma tabela particionada através do *dropping* (remoção) da *partition* (ou *partitions*) que contenham apenas esses dados. Inversamente, o processo de adição de novos dados pode, em alguns casos, ser bastante facilitado pela adição de uma ou mais novas *partitions* para armazenar especificamente esses dados.

*   Algumas *Queries* podem ser otimizadas significativamente em virtude do fato de que os dados que satisfazem uma determinada cláusula `WHERE` podem ser armazenados apenas em uma ou mais *partitions*, o que exclui automaticamente quaisquer *partitions* restantes da busca. Como as *partitions* podem ser alteradas depois que uma tabela particionada foi criada, você pode reorganizar seus dados para aprimorar *queries* frequentes que podem não ter sido usadas com frequência quando o esquema de *partitioning* foi configurado pela primeira vez. Essa capacidade de excluir *partitions* não correspondentes (e, portanto, quaisquer linhas que contenham) é frequentemente referida como *partition pruning*. Para mais informações, consulte [Seção 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning").

    Além disso, o MySQL suporta seleção explícita de *partition* para *queries*. Por exemplo, [`SELECT * FROM t PARTITION (p0,p1) WHERE c < 5`] seleciona apenas as linhas nas *partitions* `p0` e `p1` que correspondem à condição `WHERE`. Neste caso, o MySQL não verifica nenhuma outra *partition* da tabela `t`; isso pode acelerar muito as *queries* quando você já sabe qual *partition* ou *partitions* você deseja examinar. A seleção de *partition* também é suportada para os comandos de modificação de dados [`DELETE`], [`INSERT`], [`REPLACE`], [`UPDATE`] e [`LOAD DATA`], [`LOAD XML`]. Consulte as descrições desses comandos para mais informações e exemplos.