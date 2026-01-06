### 14.7.4 Linhas Fantoma

O chamado problema de fantasma ocorre dentro de uma transação quando a mesma consulta produz diferentes conjuntos de linhas em momentos diferentes. Por exemplo, se uma consulta `SELECT` for executada duas vezes, mas retornar uma linha na segunda vez que não foi retornada na primeira, a linha é uma linha "fantasma".

Suponha que haja um índice na coluna `id` da tabela `child` e que você queira ler e bloquear todas as linhas da tabela com um valor de identificador maior que 100, com a intenção de atualizar alguma coluna nas linhas selecionadas mais tarde:

```sql
SELECT * FROM child WHERE id > 100 FOR UPDATE;
```

A consulta examina o índice a partir do primeiro registro em que o `id` é maior que 100. Suponha que a tabela contenha linhas com valores de `id` de 90 e 102. Se os bloqueios definidos nos registros do índice no intervalo escaneado não bloqueiam inserções feitas nos intervalos (neste caso, o intervalo entre 90 e 102), outra sessão pode inserir uma nova linha na tabela com um `id` de 101. Se você executar a mesma consulta dentro da mesma transação, verá uma nova linha com um `id` de 101 (um "fantasma") no conjunto de resultados retornado pela consulta. Se considerarmos um conjunto de linhas como um item de dados, a nova criança fantasma violaria o princípio de isolamento das transações, que uma transação deve ser capaz de executar para que os dados que ela leu não mudem durante a transação.

Para evitar fantasmas, o `InnoDB` usa um algoritmo chamado bloqueio de próxima chave que combina o bloqueio de linha de índice com o bloqueio de lacuna. O `InnoDB` realiza o bloqueio de nível de linha de forma que, ao pesquisar ou percorrer um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que encontra. Assim, os bloqueios de nível de linha são, na verdade, bloqueios de registro de índice. Além disso, um bloqueio de próxima chave em um registro de índice também afeta a "lacuna" antes do registro de índice. Ou seja, um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de lacuna na lacuna que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice na lacuna imediatamente antes de `R` na ordem do índice.

Quando o `InnoDB` examina um índice, ele também pode bloquear o intervalo após o último registro no índice. Isso é exatamente o que acontece no exemplo anterior: para impedir qualquer inserção na tabela onde o `id` seria maior que 100, os bloqueios definidos pelo `InnoDB` incluem um bloqueio no intervalo após o valor `id` 102.

Você pode usar o bloqueio de próxima chave para implementar uma verificação de unicidade em sua aplicação: se você ler seus dados no modo compartilhado e não vir um duplicado para uma linha que você vai inserir, então você pode inserir sua linha com segurança e saber que o bloqueio de próxima chave definido no sucessor da sua linha durante a leitura impede que alguém, entretanto, insira um duplicado para sua linha. Assim, o bloqueio de próxima chave permite que você "bloqueie" a inexistência de algo em sua tabela.

O bloqueio de lacunas pode ser desativado conforme discutido na Seção 14.7.1, “Bloqueio InnoDB”. Isso pode causar problemas fantasmáticos, pois outras sessões podem inserir novas linhas nas lacunas quando o bloqueio de lacunas está desativado.
