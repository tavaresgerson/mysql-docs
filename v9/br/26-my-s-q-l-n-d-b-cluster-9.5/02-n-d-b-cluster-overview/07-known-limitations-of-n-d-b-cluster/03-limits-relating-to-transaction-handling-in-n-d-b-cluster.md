#### 25.2.7.3 Limitações Relacionadas ao Tratamento de Transações no NDB Cluster

Existem várias limitações no NDB Cluster em relação ao tratamento de transações. Essas incluem:

* **Nível de isolamento de transação.**

  O mecanismo de armazenamento `NDBCLUSTER` suporta apenas o nível de isolamento de transação `READ COMMITTED`. (`InnoDB`, por exemplo, suporta `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`.`) Você deve ter em mente que o `NDB` implementa `READ COMMITTED` em uma base por linha; quando um pedido de leitura chega ao nó de dados que armazena a linha, o que é retornado é a última versão comprometida da linha naquela época.

  Dados não comprometidos nunca são retornados, mas quando uma transação que modifica várias linhas compromete simultaneamente com uma transação que lê as mesmas linhas, a transação que realiza a leitura pode observar valores "antes", valores "depois" ou ambos, para diferentes linhas entre elas, devido ao fato de que um pedido de leitura de linha específico pode ser processado antes ou depois do comprometimento da outra transação.

  Para garantir que uma transação específica leia apenas antes ou depois dos valores, você pode impor bloqueios de linha usando `SELECT ... LOCK IN SHARE MODE`. Nesses casos, o bloqueio é mantido até que a transação proprietária seja comprometida. O uso de bloqueios de linha também pode causar os seguintes problemas:

  + Aumento da frequência de erros de timeout de espera de bloqueio e redução da concorrência

  + Aumento do overhead de processamento de transações devido a leituras que requerem uma fase de comprometimento

  + Possibilidade de esgotar o número disponível de bloqueios concorrentes, que é limitado por `MaxNoOfConcurrentOperations`

O `NDB` usa `READ COMMITTED` para todas as leituras, a menos que seja usado um modificador como `LOCK IN SHARE MODE` ou `FOR UPDATE`. `LOCK IN SHARE MODE` faz com que os bloqueios de linha compartilhados sejam usados; `FOR UPDATE` faz com que os bloqueios de linha exclusivos sejam usados. As leituras de chave única têm seus bloqueios atualizados automaticamente pelo `NDB` para garantir uma leitura autoconsistente; as leituras de `BLOB` também empregam bloqueio extra para consistência.

Consulte a Seção 25.6.8.4, “Solução de Problemas de Backup do NDB Cluster”, para obter informações sobre como a implementação do nível de isolamento de transação do NDB Cluster pode afetar o backup e a restauração das bases de dados `NDB`.

* **Transações e colunas BLOB ou TEXT.** O `NDBCLUSTER` armazena apenas parte do valor de uma coluna que usa qualquer um dos tipos de dados `BLOB` ou `TEXT` do MySQL na tabela visível ao MySQL; o restante do `BLOB` ou `TEXT` é armazenado em uma tabela interna separada que não é acessível ao MySQL. Isso gera dois problemas relacionados dos quais você deve estar ciente ao executar instruções `SELECT` em tabelas que contêm colunas desses tipos:

  1. Para qualquer `SELECT` de uma tabela do NDB Cluster: Se o `SELECT` incluir uma coluna `BLOB` ou `TEXT`, o nível de isolamento de transação `READ COMMITTED` é convertido em uma leitura com bloqueio de leitura. Isso é feito para garantir consistência.

  2. Para qualquer `SELECT` que use uma busca de chave única para recuperar quaisquer colunas que usem qualquer um dos tipos de dados `BLOB` ou `TEXT` e que seja executado dentro de uma transação, um bloqueio de leitura compartilhado é mantido na tabela durante a duração da transação—ou seja, até que a transação seja comprometida ou abortada.

     Esse problema não ocorre para consultas que usam varreduras de índice ou de tabela, mesmo contra tabelas `NDB` que possuem colunas `BLOB` ou `TEXT`.

     Por exemplo, considere a tabela `t` definida pela seguinte instrução `CREATE TABLE`:

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

A seguinte consulta sobre `t` causa um bloqueio de leitura compartilhado, porque usa uma pesquisa de chave única:

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

Isso ocorre porque, dessas quatro consultas, a primeira usa uma varredura de índice, a segunda e a terceira usam varreduras de tabela, e a quarta, embora use uma pesquisa de chave primária, não recupera o valor de nenhuma coluna `BLOB` ou `TEXT`.

Você pode ajudar a minimizar problemas com bloqueios de leitura compartilhados evitando consultas que usam pesquisas de chave única que recuperam colunas `BLOB` ou `TEXT`, ou, em casos em que tais consultas não podem ser evitadas, fechando transações o mais rápido possível depois.

* **Pesquisas de chave única e isolamento de transação.** Índices únicos são implementados em `NDB` usando uma tabela de índice oculta que é mantida internamente. Quando uma tabela `NDB` criada pelo usuário é acessada usando um índice único, a tabela de índice oculta é lida primeiro para encontrar a chave primária que é então usada para ler a tabela criada pelo usuário. Para evitar a modificação do índice durante essa operação de leitura dupla, a linha encontrada na tabela de índice oculta é bloqueada. Quando uma linha referenciada por um índice único na tabela `NDB` criada pelo usuário é atualizada, a tabela de índice oculta está sujeita a um bloqueio exclusivo pela transação na qual a atualização é realizada. Isso significa que qualquer operação de leitura na mesma tabela `NDB` (criada pelo usuário) deve esperar que a atualização seja concluída. Isso é verdade mesmo quando o nível de transação da operação de leitura é `READ COMMITTED`.

Uma solução alternativa que pode ser usada para contornar leituras potencialmente bloqueadas é forçar o nó SQL a ignorar o índice único ao realizar a leitura. Isso pode ser feito usando a dica de índice `IGNORE INDEX` como parte da instrução `SELECT` que lê a tabela (veja a Seção 10.9.4, “Dicas de índice”). Como o servidor MySQL cria um índice ordenado de sombreamento para cada índice único criado no `NDB`, isso permite que o índice ordenado seja lido em vez disso, evitando o bloqueio do acesso ao índice único. A leitura resultante é tão consistente quanto uma leitura confirmada pela chave primária, retornando o último valor confirmado no momento em que a linha é lida.

A leitura via índice ordenado utiliza menos recursos no cluster e pode ter maior latência.

Também é possível evitar o uso do índice único para acesso consultando faixas em vez de valores únicos.

* **Reembolsos.** Não há transações parciais e não há reembolsos parciais de transações. Um erro de chave duplicada ou semelhante faz com que toda a transação seja reembolsada.

Esse comportamento difere do de outros motores de armazenamento transacionais, como o `InnoDB`, que podem reembolsar instruções individuais.

* **Transações e uso de memória.** Como observado em outras partes deste capítulo, o NDB Cluster não lida bem com transações grandes; é melhor realizar um número de pequenas transações com algumas operações cada do que tentar uma única transação grande contendo muitas operações. Entre outras considerações, transações grandes requerem quantidades muito grandes de memória. Por isso, o comportamento transacional de várias instruções MySQL é afetado conforme descrito na lista a seguir:

+ `TRUNCATE TABLE` não é transacional quando usado em tabelas `NDB`. Se uma `TRUNCATE TABLE` não conseguir esvaziar a tabela, ela deve ser executada novamente até que seja bem-sucedida.

+ `DELETE FROM` (mesmo sem cláusula `WHERE`) *é* transacional. Para tabelas com muitas linhas, você pode notar que o desempenho é melhorado ao usar várias instruções `DELETE FROM ... LIMIT ...` para "pedaçar" a operação de exclusão. Se o seu objetivo é esvaziar a tabela, então você pode querer usar `TRUNCATE TABLE` em vez disso.

+ **Instruções `LOAD DATA`.** `LOAD DATA` não é transacional quando usado em tabelas `NDB`.

**Importante**

Ao executar uma instrução `LOAD DATA`, o motor `NDB` realiza commits em intervalos irregulares que permitem uma melhor utilização da rede de comunicação. Não é possível saber com antecedência quando esses commits ocorrem.

+ **ALTER TABLE e transações.** Ao copiar uma tabela `NDB` como parte de uma `ALTER TABLE`, a criação da cópia é não-transacional. (Em qualquer caso, essa operação é revertida quando a cópia é excluída.)

* **Transações e a função COUNT().** Ao usar a Replicação em Cluster do NDB, não é possível garantir a consistência transacional da função `COUNT()` na replica. Em outras palavras, ao executar em uma fonte uma série de instruções (`INSERT`, `DELETE` ou ambas) que alteram o número de linhas em uma tabela dentro de uma única transação, a execução de consultas `SELECT COUNT(*) FROM table` na replica pode gerar resultados intermediários. Isso ocorre porque `SELECT COUNT(...)` pode realizar leituras sujas e não é um bug no motor de armazenamento `NDB`. (Veja o Bug
#31321 para mais informações.)