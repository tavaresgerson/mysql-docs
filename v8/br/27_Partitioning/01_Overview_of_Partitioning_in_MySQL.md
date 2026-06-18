## 26.1 Visão geral da partição no MySQL

Esta seção oferece uma visão conceitual da partição no MySQL 8.0.

Para obter informações sobre restrições de particionamento e limitações de recursos, consulte a Seção 26.6, “Restrições e Limitações de Particionamento”.

O padrão SQL não oferece muita orientação sobre os aspectos físicos do armazenamento de dados. A própria linguagem SQL é projetada para funcionar de forma independente de quaisquer estruturas de dados ou mídias subjacentes aos esquemas, tabelas, linhas ou colunas com os quais ela trabalha. No entanto, a maioria dos sistemas avançados de gerenciamento de banco de dados evoluiu para fornecer algum meio de determinar a localização física a ser usada para armazenar peças específicas de dados em termos do sistema de arquivos, hardware ou até mesmo ambos. No MySQL, o mecanismo de armazenamento `InnoDB` há muito tempo suporta a noção de um espaço de tabelas (veja a Seção 17.6.3, “Espaços de Tabelas”), e o MySQL Server, mesmo antes da introdução da partição, podia ser configurado para empregar diferentes diretórios físicos para armazenar diferentes bancos de dados (veja a Seção 10.12.2, “Usando Links Simbólicos”, para uma explicação de como isso é feito).

A partição leva essa noção um passo adiante, permitindo que você distribua porções de tabelas individuais em um sistema de arquivos de acordo com regras que você pode definir conforme necessário. Na verdade, diferentes porções de uma tabela são armazenadas como tabelas separadas em locais diferentes. A regra selecionada pelo usuário para realizar a divisão dos dados é conhecida como função de partição, que no MySQL pode ser o módulo, correspondência simples contra um conjunto de faixas ou listas de valores, uma função de hashing interna ou uma função de hashing linear. A função é selecionada de acordo com o tipo de partição especificado pelo usuário e recebe como parâmetro o valor de uma expressão fornecida pelo usuário. Essa expressão pode ser um valor de coluna, uma função que atua em um ou mais valores de coluna ou um conjunto de um ou mais valores de coluna, dependendo do tipo de partição utilizado.

No caso da partição `RANGE`, `LIST`, e \[`LINEAR`] `HASH`, o valor da coluna de partição é passado para a função de partição, que retorna um valor inteiro representando o número da partição na qual esse registro específico deve ser armazenado. Essa função deve ser não constante e não aleatória. Ela não pode conter consultas, mas pode usar uma expressão SQL válida no MySQL, desde que essa expressão retorne `NULL` ou um inteiro `intval` tal que

```
-MAXVALUE <= intval <= MAXVALUE
```

(O `MAXVALUE` é usado para representar o menor limite superior para o tipo de inteiro em questão. `-MAXVALUE` representa o maior limite inferior.)

Para a partição `LINEAR`, `KEY`, `RANGE COLUMNS` e `LIST COLUMNS`, a expressão de partição consiste em uma lista de uma ou mais colunas.

Para a partição \[`LINEAR`] `KEY`, a função de partição é fornecida pelo MySQL.

Para obter mais informações sobre os tipos de coluna de particionamento permitidos e as funções de particionamento, consulte a Seção 26.2, “Tipos de Particionamento”, bem como a Seção 15.1.20, “Instrução CREATE TABLE”, que fornece descrições da sintaxe de particionamento e exemplos adicionais. Para informações sobre as restrições às funções de particionamento, consulte a Seção 26.6.3, “Limitações de Particionamento Relacionadas a Funções”.

Isso é conhecido como particionamento horizontal, ou seja, diferentes linhas de uma tabela podem ser atribuídas a diferentes partições físicas. O MySQL 8.0 não suporta particionamento vertical, no qual diferentes colunas de uma tabela são atribuídas a diferentes partições físicas. Não há planos para introduzir particionamento vertical no MySQL neste momento.

Para criar tabelas particionadas, você deve usar um mecanismo de armazenamento que as suporte. No MySQL 8.0, todas as partições da mesma tabela particionada devem usar o mesmo mecanismo de armazenamento. No entanto, não há nada que impeça você de usar diferentes mecanismos de armazenamento para diferentes tabelas particionadas no mesmo servidor MySQL ou até mesmo na mesma base de dados.

No MySQL 8.0, os únicos motores de armazenamento que suportam particionamento são `InnoDB` e `NDB`. O particionamento não pode ser usado com motores de armazenamento que não o suportam; esses incluem os motores de armazenamento `MyISAM`, `MERGE`, `CSV` e `FEDERATED`.

A partição por `KEY` ou `LINEAR KEY` é possível com `NDB`, mas outros tipos de partição definidos pelo usuário não são suportados para tabelas que utilizam esse mecanismo de armazenamento. Além disso, uma tabela `NDB` que emprega partição definida pelo usuário deve ter uma chave primária explícita, e quaisquer colunas referenciadas na expressão de partição da tabela devem fazer parte da chave primária. No entanto, se nenhuma coluna estiver listada na cláusula `PARTITION BY KEY` ou `PARTITION BY LINEAR KEY` da declaração `CREATE TABLE` ou `ALTER TABLE` usada para criar ou modificar uma tabela `NDB` com partição definida pelo usuário, então a tabela não precisa ter uma chave primária explícita. Para mais informações, consulte a Seção 25.2.7.1, “Não conformidade com a sintaxe SQL no NDB Cluster”.

Ao criar uma tabela particionada, o mecanismo de armazenamento padrão é usado da mesma forma que ao criar qualquer outra tabela; para sobrescrever esse comportamento, é necessário apenas usar a opção `[STORAGE] ENGINE`, da mesma forma que faria com uma tabela que não esteja particionada. O mecanismo de armazenamento alvo deve fornecer suporte nativo para particionamento, ou a instrução falhará. Você deve ter em mente que `[STORAGE] ENGINE` (e outras opções de tabela) precisam ser listadas *antes* de quaisquer opções de particionamento serem usadas em uma instrução `CREATE TABLE`. Este exemplo mostra como criar uma tabela particionada por hash em 6 partições e que usa o mecanismo de armazenamento `InnoDB` (independentemente do valor de `default_storage_engine`):

```
CREATE TABLE ti (id INT, amount DECIMAL(7,2), tr_date DATE)
    ENGINE=INNODB
    PARTITION BY HASH( MONTH(tr_date) )
    PARTITIONS 6;
```

Cada cláusula `PARTITION` pode incluir uma opção `[STORAGE] ENGINE`, mas no MySQL 8.0 isso não tem efeito.

A menos que especificado de outra forma, os exemplos restantes nesta discussão assumem que `default_storage_engine` é `InnoDB`.

Importante

A partição se aplica a todos os dados e índices de uma tabela; você não pode particionar apenas os dados e não os índices, ou vice-versa, nem pode particionar apenas uma parte da tabela.

Os dados e índices de cada partição podem ser atribuídos a um diretório específico usando as opções `DATA DIRECTORY` e `INDEX DIRECTORY` para a cláusula `PARTITION` da instrução `CREATE TABLE` usada para criar a tabela particionada.

Apenas a opção `DATA DIRECTORY` é suportada para partições individuais e subpartições de tabelas `InnoDB`. A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

Todas as colunas usadas na expressão de particionamento da tabela devem fazer parte de cada chave única que a tabela possa ter, incluindo qualquer chave primária. Isso significa que uma tabela como esta, criada pela seguinte instrução SQL, não pode ser particionada:

```
CREATE TABLE tnp (
    id INT NOT NULL AUTO_INCREMENT,
    ref BIGINT NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
);
```

Como as chaves `pk` e `uk` não têm colunas em comum, não há colunas disponíveis para serem usadas em uma expressão de particionamento. As soluções possíveis nessa situação incluem adicionar a coluna `name` à chave primária da tabela, adicionar a coluna `id` a `uk`, ou simplesmente remover a chave única completamente. Consulte a Seção 26.6.1, “Chaves de Particionamento, Chaves Primárias e Chaves Únicas”, para obter mais informações.

Além disso, `MAX_ROWS` e `MIN_ROWS` podem ser usados para determinar o número máximo e mínimo de linhas, respectivamente, que podem ser armazenadas em cada partição. Consulte a Seção 26.3, “Gestão de Partições”, para obter mais informações sobre essas opções.

A opção `MAX_ROWS` também pode ser útil para criar tabelas do NDB Cluster com partições extras, permitindo assim um maior armazenamento de índices de hash. Consulte a documentação do parâmetro de configuração do nó de dados `DataMemory`, bem como a Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nodos, Replicas de Fragmento e Partições”, para obter mais informações.

Algumas vantagens da partição estão listadas aqui:

- A partição permite armazenar mais dados em uma única tabela do que o que pode ser mantido em uma única partição de disco ou sistema de arquivos.

- Os dados que perdem sua utilidade podem ser facilmente removidos de uma tabela particionada ao descartar a(s) partição(ões) que contêm apenas esses dados. Por outro lado, o processo de adicionar novos dados pode, em alguns casos, ser muito facilitado ao adicionar uma ou mais novas partições para armazenar especificamente esses dados.

- Algumas consultas podem ser muito otimizadas devido ao fato de que os dados que satisfazem uma cláusula `WHERE` podem ser armazenados apenas em uma ou mais partições, o que exclui automaticamente quaisquer partições restantes da pesquisa. Como as partições podem ser alteradas após a criação de uma tabela particionada, você pode reorganizar seus dados para melhorar consultas frequentes que podem não ter sido usadas com frequência quando o esquema de particionamento foi configurado pela primeira vez. Essa capacidade de excluir partições que não correspondem (e, portanto, quaisquer linhas que elas contenham) é frequentemente referida como poda de partição. Para mais informações, consulte a Seção 26.4, “Poda de Partição”.

  Além disso, o MySQL suporta a seleção explícita de partições para consultas. Por exemplo, `SELECT * FROM t PARTITION (p0,p1) WHERE c < 5` seleciona apenas as linhas nas partições `p0` e `p1` que correspondem à condição `WHERE`. Neste caso, o MySQL não verifica outras partições da tabela `t`; isso pode acelerar muito as consultas quando você já sabe qual(is) partição(ões) deseja examinar. A seleção de partições também é suportada para as declarações de modificação de dados `DELETE`, `INSERT`, `REPLACE`, `UPDATE` e `LOAD DATA`, `LOAD XML`. Consulte as descrições dessas declarações para obter mais informações e exemplos.
