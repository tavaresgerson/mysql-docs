#### 25.2.7.3 Limitações relacionadas ao processamento de transações no NDB Cluster

Existem várias limitações no NDB Cluster em relação ao tratamento de transações, incluindo as seguintes:

- **Nível de isolamento de transação.**

  O mecanismo de armazenamento `NDBCLUSTER` suporta apenas o nível de isolamento de transação `READ COMMITTED`. (`InnoDB`, por exemplo, suporta `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`). Você deve ter em mente que `NDB` implementa `READ COMMITTED` em uma base por linha; quando um pedido de leitura chega ao nó de dados que armazena a linha, o que é retornado é a última versão comprometida da linha naquela época.

  Os dados não comprometidos nunca são devolvidos, mas quando uma transação que modifica várias linhas é comprometida simultaneamente com uma transação que lê as mesmas linhas, a transação que realiza a leitura pode observar valores “antes” e “depois” ou ambos para diferentes linhas, devido ao fato de que um pedido de leitura de uma linha específica pode ser processado antes ou depois do comprometimento da outra transação.

  Para garantir que uma transação específica leia apenas valores antes ou depois, você pode impor bloqueios de linha usando `SELECT ... LOCK IN SHARE MODE`. Nesse caso, o bloqueio é mantido até que a transação proprietária seja confirmada. O uso de bloqueios de linha também pode causar os seguintes problemas:

  - Aumento da frequência de erros de tempo de espera de bloqueio e redução da concorrência

  - Aumento do overhead de processamento de transações devido a leituras que exigem uma fase de commit

  - Possibilidade de esgotar o número disponível de bloqueios simultâneos, que é limitado por `MaxNoOfConcurrentOperations`

  `NDB` usa `READ COMMITTED` para todas as leituras, a menos que um modificador como `LOCK IN SHARE MODE` ou `FOR UPDATE` seja usado. `LOCK IN SHARE MODE` faz com que as bloqueadoras de linha compartilhadas sejam usadas; `FOR UPDATE` faz com que as bloqueadoras de linha exclusivas sejam usadas. As leituras de chave única têm suas bloqueadoras atualizadas automaticamente por `NDB` para garantir uma leitura autoconsistente; as leituras `BLOB` também empregam bloqueio extra para consistência.

  Consulte a Seção 25.6.8.4, “Solução de problemas de backup do cluster NDB”, para obter informações sobre como a implementação do nível de isolamento de transações do NDB Cluster pode afetar o backup e a restauração dos bancos de dados `NDB`.

- **Transações e colunas BLOB ou TEXT.** `NDBCLUSTER` armazena apenas parte do valor de uma coluna que utiliza qualquer um dos tipos de dados `BLOB` ou `TEXT` do MySQL na tabela visível ao MySQL; o restante do `BLOB` ou `TEXT` é armazenado em uma tabela interna separada que não é acessível ao MySQL. Isso gera dois problemas relacionados dos quais você deve estar ciente sempre que executar instruções `SELECT` em tabelas que contêm colunas desses tipos:

  1. Para qualquer `SELECT` de uma tabela de um cluster NDB: Se o `SELECT` incluir uma coluna `BLOB` ou `TEXT`, o nível de isolamento de transação `READ COMMITTED` é convertido para leitura com bloqueio de leitura. Isso é feito para garantir a consistência.

  2. Para qualquer `SELECT` que utilize uma pesquisa de chave única para recuperar quaisquer colunas que utilizem qualquer um dos tipos de dados `BLOB` ou `TEXT` e que seja executado dentro de uma transação, um bloqueio de leitura compartilhado é mantido na tabela durante a duração da transação — ou seja, até que a transação seja confirmada ou abortada.

     Este problema não ocorre para consultas que utilizam varreduras de índice ou de tabela, mesmo contra tabelas `NDB` que possuem colunas `BLOB` ou `TEXT`.

     Por exemplo, considere a tabela `t` definida pela seguinte declaração `CREATE TABLE`:

     ```
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

     A consulta a seguir sobre `t` causa um bloqueio de leitura compartilhado, porque usa uma pesquisa de chave única:

     ```
     SELECT * FROM t WHERE c = 1;
     ```

     No entanto, nenhuma das quatro consultas mostradas aqui causa um bloqueio de leitura compartilhado:

     ```
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

     Isso ocorre porque, dessas quatro consultas, a primeira utiliza uma varredura de índice, a segunda e a terceira utilizam varreduras de tabela, e a quarta, embora utilize uma pesquisa de chave primária, não recupera o valor de nenhuma das colunas `BLOB` ou `TEXT`.

     Você pode ajudar a minimizar problemas com bloqueios de leitura compartilhada evitando consultas que utilizam consultas de busca de chave única que recuperam as colunas `BLOB` ou `TEXT`, ou, nos casos em que tais consultas não possam ser evitadas, ao realizar transações o mais rápido possível depois.

- Consultas de chave únicas e isolamento de transações. Índices únicos são implementados em `NDB` usando uma tabela de índice oculta que é mantida internamente. Quando uma tabela `NDB` criada pelo usuário é acessada usando um índice único, a tabela de índice oculta é lida primeiro para encontrar a chave primária que é então usada para ler a tabela criada pelo usuário. Para evitar a modificação do índice durante essa operação de leitura dupla, a linha encontrada na tabela de índice oculta é bloqueada. Quando uma linha referenciada por um índice único na tabela `NDB` criada pelo usuário é atualizada, a tabela de índice oculta está sujeita a um bloqueio exclusivo pela transação na qual a atualização é realizada. Isso significa que qualquer operação de leitura na mesma tabela `NDB` (criada pelo usuário) deve esperar que a atualização seja concluída. Isso é verdade mesmo quando o nível de transação da operação de leitura é `READ COMMITTED`.

  Uma solução alternativa que pode ser usada para contornar leituras potencialmente bloqueadas é forçar o nó SQL a ignorar o índice único ao realizar a leitura. Isso pode ser feito usando a dica de índice `IGNORE INDEX` como parte da instrução `SELECT` que lê a tabela (veja a Seção 10.9.4, “Dicas de índice”). Como o servidor MySQL cria um índice ordenado de sombreamento para cada índice único criado em `NDB`, isso permite que o índice ordenado seja lido em vez disso, evitando o bloqueio do acesso ao índice único. A leitura resultante é tão consistente quanto uma leitura confirmada pela chave primária, retornando o último valor confirmado no momento em que a linha é lida.

  A leitura por meio de um índice ordenado utiliza menos recursos no cluster e pode ter maior latência.

  Também é possível evitar o uso do índice único para acesso, realizando consultas por intervalos em vez de por valores únicos.

- **Reversões.** Não há transações parciais e não há reversões parciais de transações. Um erro de chave duplicada ou semelhante faz com que toda a transação seja revertida.

  Esse comportamento difere do de outros motores de armazenamento transacional, como `InnoDB`, que podem reverter declarações individuais.

- **Transações e uso da memória.** Como mencionado em outros lugares deste capítulo, o NDB Cluster não lida bem com grandes transações; é melhor realizar várias pequenas transações com poucas operações cada vez do que tentar uma única grande transação que contenha muitas operações. Entre outras considerações, grandes transações exigem quantidades muito grandes de memória. Por isso, o comportamento transacional de várias instruções do MySQL é afetado, conforme descrito na lista a seguir:

  - `TRUNCATE TABLE` não é transacional quando usado em tabelas `NDB`. Se um `TRUNCATE TABLE` não conseguir esvaziar a tabela, ele deve ser executado novamente até que seja bem-sucedido.

  - `DELETE FROM` (mesmo sem a cláusula `WHERE` *é* transacional. Para tabelas que contêm muitas linhas, você pode notar que o desempenho é melhorado ao usar várias instruções `DELETE FROM ... LIMIT ...` para "dividir" a operação de exclusão. Se o seu objetivo é esvaziar a tabela, então você pode querer usar `TRUNCATE TABLE` em vez disso.

  - **Instruções de LOAD DATA.** `LOAD DATA` não é transacional quando usado em tabelas `NDB`.

    Importante

    Ao executar uma instrução `LOAD DATA`, o motor `NDB` realiza commits em intervalos irregulares que permitem uma melhor utilização da rede de comunicação. Não é possível saber com antecedência quando esses commits ocorrem.

  - **ALTER TABLE e transações.** Ao copiar uma tabela `NDB` como parte de uma `ALTER TABLE`, a criação da cópia é não-transacional. (Em qualquer caso, essa operação é revertida quando a cópia é excluída.)

- **Transações e a função COUNT().** Ao usar a Replicação em NDB Cluster, não é possível garantir a consistência transacional da função `COUNT()` na replica. Em outras palavras, ao executar em uma única transação uma série de instruções (`INSERT`, `DELETE` ou ambas) que alteram o número de linhas em uma tabela, a execução de consultas `SELECT COUNT(*) FROM table` na replica pode gerar resultados intermediários. Isso ocorre porque `SELECT COUNT(...)` pode realizar leituras sujas e não é um erro no mecanismo de armazenamento `NDB` (Consulte o bug #31321 para mais informações).
