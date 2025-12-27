## 26.1 Visão Geral da Partição no MySQL

Esta seção fornece uma visão conceitual da partição no MySQL 9.5.

Para informações sobre restrições de partição e limitações de recursos, consulte a Seção 26.6, “Restrições e Limitações na Partição”.

O padrão SQL não fornece muita orientação sobre os aspectos físicos do armazenamento de dados. A própria linguagem SQL é destinada a funcionar de forma independente de quaisquer estruturas de dados ou mídias subjacentes aos esquemas, tabelas, linhas ou colunas com os quais ela trabalha. No entanto, a maioria dos sistemas avançados de gerenciamento de banco de dados evoluiu para determinar a localização física a ser usada para armazenar peças específicas de dados em termos do sistema de arquivos, hardware ou até mesmo ambos. No MySQL, o motor de armazenamento `InnoDB` há muito tempo suporta a noção de um espaço de tabelas (veja a Seção 17.6.3, “Espaços de Tabelas”), e o MySQL Server, mesmo antes da introdução da partição, poderia ser configurado para empregar diferentes diretórios físicos para armazenar diferentes bancos de dados (veja a Seção 10.12.2, “Uso de Links Simbólicos”, para uma explicação de como isso é feito).

A partição leva essa noção um passo adiante, permitindo que você distribua porções de tabelas individuais em um sistema de arquivos de acordo com regras que você pode definir conforme necessário. Na verdade, diferentes porções de uma tabela são armazenadas como tabelas separadas em locais diferentes. A regra selecionada pelo usuário para realizar a divisão dos dados é conhecida como função de partição, que, no MySQL, pode ser o módulo, correspondência simples com um conjunto de faixas ou listas de valores, uma função de hashing interno ou uma função de hashing linear. A função é selecionada de acordo com o tipo de partição especificado pelo usuário e recebe como parâmetro o valor de uma expressão fornecida pelo usuário. Essa expressão pode ser o valor de uma coluna, uma função que atua em uma ou mais valores de coluna ou um conjunto de uma ou mais valores de coluna, dependendo do tipo de partição utilizado.

No caso da partição `RANGE`, `LIST` e `[`LINEAR]` `HASH`, o valor da coluna de partição é passado para a função de partição, que retorna um valor inteiro representando o número da partição na qual esse registro particular deve ser armazenado. Essa função deve ser não constante e não aleatória. Ela não pode conter consultas, mas pode usar uma expressão SQL válida no MySQL, desde que essa expressão retorne `NULL` ou um inteiro *`intval`*, de modo que

```
-MAXVALUE <= intval <= MAXVALUE
```TfvrYxjZdH```
CREATE TABLE ti (id INT, amount DECIMAL(7,2), tr_date DATE)
    ENGINE=INNODB
    PARTITION BY HASH( MONTH(tr_date) )
    PARTITIONS 6;
```MwpmchF9AX```

Como as chaves `pk` e `uk` não têm colunas em comum, não há colunas disponíveis para uso em uma expressão de partição. Possíveis soluções nessa situação incluem adicionar a coluna `name` à chave primária da tabela, adicionar a coluna `id` a `uk`, ou simplesmente remover a chave única completamente. Consulte a Seção 26.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”, para mais informações.

Além disso, `MAX_ROWS` e `MIN_ROWS` podem ser usados para determinar o número máximo e mínimo de linhas, respectivamente, que podem ser armazenadas em cada partição. Consulte a Seção 26.3, “Gestão de Partições”, para mais informações sobre essas opções.

A opção `MAX_ROWS` também pode ser útil para criar tabelas do NDB Cluster com partições extras, permitindo assim um maior armazenamento de índices de hash. Consulte a documentação do parâmetro de configuração do nó de dados `DataMemory`, bem como a Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nodos, Replicas de Fragmento e Partições”, para obter mais informações.

Algumas vantagens da partição são listadas aqui:

* A partição permite armazenar mais dados em uma única tabela do que pode ser mantido em uma única partição de disco ou sistema de arquivos.

* Dados que perdem sua utilidade podem ser facilmente removidos de uma tabela particionada, simplesmente eliminando a(s) partição(ões) que contêm apenas esses dados. Por outro lado, o processo de adicionar novos dados pode, em alguns casos, ser muito facilitado ao adicionar uma ou mais novas partições para armazenar especificamente esses dados.

* Algumas consultas podem ser muito otimizadas devido ao fato de que os dados que satisfazem uma cláusula `WHERE` específica podem ser armazenados apenas em uma ou mais partições, o que exclui automaticamente quaisquer partições restantes da busca. Como as partições podem ser alteradas após a criação de uma tabela particionada, você pode reorganizar seus dados para melhorar consultas frequentes que podem não ter sido usadas com frequência quando o esquema de particionamento foi configurado pela primeira vez. Essa capacidade de excluir partições não correspondentes (e, portanto, quaisquer linhas que elas contêm) é frequentemente referida como poda de partição. Para mais informações, consulte a Seção 26.4, “Poda de Partição”.

Além disso, o MySQL suporta a seleção explícita de partições para consultas. Por exemplo, `SELECT * FROM t PARTITION (p0,p1) WHERE c < 5` seleciona apenas as linhas nas partições `p0` e `p1` que correspondem à condição `WHERE`. Neste caso, o MySQL não verifica outras partições da tabela `t`; isso pode acelerar muito as consultas quando você já sabe qual(is) partição(ões) deseja examinar. A seleção de partições também é suportada para as instruções de modificação de dados `DELETE`, `INSERT`, `REPLACE`, `UPDATE` e `LOAD DATA`, `LOAD XML`. Consulte as descrições dessas instruções para obter mais informações e exemplos.