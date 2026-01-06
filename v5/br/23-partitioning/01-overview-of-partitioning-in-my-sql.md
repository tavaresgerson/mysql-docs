## 22.1 Visão geral da partição no MySQL

Esta seção oferece uma visão conceitual da partição no MySQL 5.7.

Para obter informações sobre restrições de particionamento e limitações de recursos, consulte Seção 22.6, “Restrições e Limitações de Particionamento”.

O padrão SQL não oferece muita orientação sobre os aspectos físicos do armazenamento de dados. A própria linguagem SQL é projetada para funcionar de forma independente de quaisquer estruturas de dados ou mídias subjacentes aos esquemas, tabelas, linhas ou colunas com os quais ela trabalha. No entanto, a maioria dos sistemas avançados de gerenciamento de banco de dados evoluiu alguns meios para determinar a localização física a ser usada para armazenar peças específicas de dados em termos do sistema de arquivos, hardware ou até mesmo ambos. No MySQL, o mecanismo de armazenamento `InnoDB` há muito tempo suporta a noção de um espaço de tabelas, e o MySQL Server, mesmo antes da introdução da partição, podia ser configurado para empregar diferentes diretórios físicos para armazenar diferentes bancos de dados (veja Seção 8.12.3, “Usando Links Simbólicos”, para uma explicação de como isso é feito).

A partição leva essa noção um passo adiante, permitindo que você distribua porções de tabelas individuais em um sistema de arquivos de acordo com regras que você pode definir conforme necessário. Na verdade, diferentes porções de uma tabela são armazenadas como tabelas separadas em locais diferentes. A regra selecionada pelo usuário para realizar a divisão dos dados é conhecida como função de partição, que no MySQL pode ser o módulo, correspondência simples contra um conjunto de faixas ou listas de valores, uma função de hashing interna ou uma função de hashing linear. A função é selecionada de acordo com o tipo de partição especificado pelo usuário e recebe como parâmetro o valor de uma expressão fornecida pelo usuário. Essa expressão pode ser um valor de coluna, uma função que atua em um ou mais valores de coluna ou um conjunto de um ou mais valores de coluna, dependendo do tipo de partição utilizado.

No caso da partição `RANGE`, `LIST` e `[`LINEAR`] `HASH`, o valor da coluna de partição é passado para a função de partição, que retorna um valor inteiro que representa o número da partição na qual o registro específico deve ser armazenado. Esta função deve ser não constante e não aleatória. Ela não pode conter consultas, mas pode usar uma expressão SQL válida no MySQL, desde que essa expressão retorne `NULL` ou um inteiro *`intval\`\* tal que

```sql
-MAXVALUE <= intval <= MAXVALUE
```

(`MAXVALUE` é usado para representar o menor limite superior para o tipo de inteiro em questão. `-MAXVALUE` representa o maior limite inferior.)

Para a partição por `LINEAR` `KEY`, `RANGE COLUMNS` e `LIST COLUMNS`, a expressão de partição consiste em uma lista de uma ou mais colunas.

Para a partição `LINEAR` `KEY`, a função de partição é fornecida pelo MySQL.

Para obter mais informações sobre os tipos de coluna de particionamento permitidos e as funções de particionamento, consulte Seção 22.2, “Tipos de Particionamento”, bem como Seção 13.1.18, “Instrução CREATE TABLE”, que fornece descrições da sintaxe de particionamento e exemplos adicionais. Para informações sobre as restrições às funções de particionamento, consulte Seção 22.6.3, “Limitações de Particionamento Relacionadas a Funções”.

Isso é conhecido como particionamento horizontal, ou seja, diferentes linhas de uma tabela podem ser atribuídas a diferentes partições físicas. O MySQL 5.7 não suporta particionamento vertical, no qual diferentes colunas de uma tabela são atribuídas a diferentes partições físicas. Não há planos para introduzir o particionamento vertical no MySQL neste momento.

Para obter informações sobre como determinar se o binário do seu servidor MySQL suporta partição definida pelo usuário, consulte \[Capítulo 22, *Partição*] (partitioning.html).

Para criar tabelas particionadas, você pode usar a maioria dos mecanismos de armazenamento suportados pelo seu servidor MySQL; o mecanismo de particionamento do MySQL funciona em uma camada separada e pode interagir com qualquer um deles. No MySQL 5.7, todas as partições da mesma tabela particionada devem usar o mesmo mecanismo de armazenamento; por exemplo, você não pode usar `MyISAM` para uma partição e `InnoDB` para outra. No entanto, não há nada que impeça você de usar diferentes mecanismos de armazenamento para diferentes tabelas particionadas no mesmo servidor MySQL ou até mesmo na mesma base de dados.

A partição do MySQL não pode ser usada com os mecanismos de armazenamento `MERGE`, `CSV` ou `FEDERATED`.

A partição por `KEY` ou `LINEAR KEY` é possível com `NDB`, mas outros tipos de partição definidos pelo usuário não são suportados para tabelas que utilizam esse mecanismo de armazenamento. Além disso, uma tabela `NDB` que emprega partição definida pelo usuário deve ter uma chave primária explícita, e quaisquer colunas referenciadas na expressão de partição da tabela devem fazer parte da chave primária. No entanto, se nenhuma coluna estiver listada na cláusula `PARTITION BY KEY` ou `PARTITION BY LINEAR KEY` da instrução `CREATE TABLE` ou `ALTER TABLE` usada para criar ou modificar uma tabela `NDB` com partição definida pelo usuário, então a tabela não precisa ter uma chave primária explícita. Para mais informações, consulte Seção 21.2.7.1, “Não conformidade com a sintaxe SQL no NDB Cluster”.

Para utilizar um motor de armazenamento específico para uma tabela particionada, é necessário apenas usar a opção `[STORAGE] ENGINE`, assim como faria com uma tabela não particionada. No entanto, você deve ter em mente que `[STORAGE] ENGINE` (e outras opções de tabela) precisam ser listadas *antes* de quaisquer opções de particionamento serem usadas em uma declaração `[CREATE TABLE]` (create-table.html). Este exemplo mostra como criar uma tabela que é particionada por hash em 6 partições e que utiliza o motor de armazenamento `InnoDB`:

```sql
CREATE TABLE ti (id INT, amount DECIMAL(7,2), tr_date DATE)
    ENGINE=INNODB
    PARTITION BY HASH( MONTH(tr_date) )
    PARTITIONS 6;
```

Cada cláusula `PARTITION` pode incluir uma opção `[STORAGE] ENGINE`, mas no MySQL 5.7 isso não tem efeito.

Importante

A partição se aplica a todos os dados e índices de uma tabela; você não pode particionar apenas os dados e não os índices, ou vice-versa, nem pode particionar apenas uma parte da tabela.

Os dados e índices de cada partição podem ser atribuídos a um diretório específico usando as opções `DATA DIRECTORY` e `INDEX DIRECTORY` para a cláusula `PARTITION` da instrução `CREATE TABLE` (create-table.html) usada para criar a tabela particionada.

`DATA DIRECTORY` e `INDEX DIRECTORY` não são suportados para partições individuais ou subpartições de tabelas `MyISAM` no Windows.

Apenas a opção `DATA DIRECTORY` é suportada para partições individuais e subpartições de tabelas `InnoDB`.

Todas as colunas usadas na expressão de particionamento da tabela devem fazer parte de cada chave única que a tabela possa ter, incluindo qualquer chave primária. Isso significa que uma tabela como esta, criada pela seguinte instrução SQL, não pode ser particionada:

```sql
CREATE TABLE tnp (
    id INT NOT NULL AUTO_INCREMENT,
    ref BIGINT NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
);
```

Como as chaves `pk` e `uk` não têm colunas em comum, não há colunas disponíveis para serem usadas em uma expressão de particionamento. Possíveis soluções para essa situação incluem adicionar a coluna `name` à chave primária da tabela, adicionar a coluna `id` a `uk`, ou simplesmente remover a chave única completamente. Consulte Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas” para obter mais informações.

Além disso, `MAX_ROWS` e `MIN_ROWS` podem ser usados para determinar o número máximo e mínimo de linhas, respectivamente, que podem ser armazenadas em cada partição. Consulte Seção 22.3, “Gestão de Partições” para obter mais informações sobre essas opções.

A opção `MAX_ROWS` também pode ser útil para criar tabelas do NDB Cluster com partições extras, permitindo assim um maior armazenamento de índices de hash. Consulte a documentação do parâmetro de configuração do nó de dados `DataMemory`, bem como a Seção 21.2.2, “Nodos do NDB Cluster, Grupos de Nodos, Replicas de Fragmento e Partições”, para obter mais informações.

Algumas vantagens da partição estão listadas aqui:

- A partição permite armazenar mais dados em uma única tabela do que o que pode ser mantido em uma única partição de disco ou sistema de arquivos.

- Os dados que perdem sua utilidade podem ser facilmente removidos de uma tabela particionada ao descartar a(s) partição(ões) que contêm apenas esses dados. Por outro lado, o processo de adicionar novos dados pode, em alguns casos, ser muito facilitado ao adicionar uma ou mais novas partições para armazenar especificamente esses dados.

- Algumas consultas podem ser muito otimizadas devido ao fato de que os dados que satisfazem uma cláusula `WHERE` específica podem ser armazenados apenas em uma ou mais partições, o que exclui automaticamente quaisquer partições restantes da pesquisa. Como as partições podem ser alteradas após a criação de uma tabela particionada, você pode reorganizar seus dados para melhorar consultas frequentes que podem não ter sido usadas com frequência quando o esquema de particionamento foi configurado pela primeira vez. Essa capacidade de excluir partições que não correspondem (e, portanto, quaisquer linhas que elas contenham) é frequentemente referida como poda de partição. Para mais informações, consulte Seção 22.4, “Poda de Partição”.

  Além disso, o MySQL suporta a seleção explícita de partições para consultas. Por exemplo, `SELECT * FROM t PARTITION (p0,p1) WHERE c < 5` seleciona apenas as linhas nas partições `p0` e `p1` que correspondem à condição `WHERE`. Neste caso, o MySQL não verifica outras partições da tabela `t`; isso pode acelerar muito as consultas quando você já sabe qual(is) partição(ões) deseja examinar. A seleção de partições também é suportada para as instruções de modificação de dados `DELETE`, `INSERT`, `REPLACE`, `UPDATE` e `LOAD DATA`, `LOAD XML`. Consulte as descrições dessas instruções para obter mais informações e exemplos.
