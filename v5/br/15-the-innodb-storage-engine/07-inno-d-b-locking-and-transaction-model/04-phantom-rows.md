### 14.7.4 Linhas Fantasma

O chamado problema fantasma ocorre dentro de uma `transaction` quando a mesma `query` produz diferentes conjuntos de `rows` em momentos distintos. Por exemplo, se uma `SELECT` é executada duas vezes, mas retorna uma `row` na segunda vez que não havia sido retornada na primeira, essa `row` é uma `row` “fantasma”.

Suponha que haja um `Index` na coluna `id` da tabela `child` e que você queira ler e aplicar `lock` em todas as `rows` da tabela que possuam um valor de identificador maior que 100, com a intenção de atualizar alguma coluna nas `rows` selecionadas posteriormente:

```sql
SELECT * FROM child WHERE id > 100 FOR UPDATE;
```

A `query` escaneia o `Index` começando pelo primeiro registro onde `id` é maior que 100. Suponha que a tabela contenha `rows` com valores de `id` 90 e 102. Se os `locks` definidos nos registros do `Index` no intervalo escaneado não impedirem `inserts` feitos nas `gaps` (neste caso, o `gap` entre 90 e 102), outra sessão pode fazer um `insert` de uma nova `row` na tabela com um `id` de 101. Se você executasse o mesmo `SELECT` dentro da mesma `transaction`, você veria uma nova `row` com um `id` de 101 (um “fantasma”) no conjunto de resultados retornado pela `query`. Se considerarmos um conjunto de `rows` como um item de dados, o novo `child` fantasma violaria o princípio de isolamento de `transactions`, que exige que uma `transaction` possa ser executada de modo que os dados que ela leu não mudem durante a `transaction`.

Para prevenir fantasmas, o `InnoDB` utiliza um algoritmo chamado `next-key locking` que combina `index-row locking` com `gap locking`. O `InnoDB` realiza o `row-level locking` de tal forma que, ao pesquisar ou escanear um `Index` de tabela, ele define `locks` compartilhados ou exclusivos nos registros do `Index` que encontra. Assim, os `row-level locks` são, na verdade, `index-record locks`. Além disso, um `next-key lock` em um registro do `Index` também afeta o “`gap`” antes do registro do `Index`. Ou seja, um `next-key lock` é um `index-record lock` mais um `gap lock` no `gap` que precede o registro do `Index`. Se uma sessão possui um `lock` compartilhado ou exclusivo no registro `R` em um `Index`, outra sessão não pode inserir um novo registro do `Index` no `gap` imediatamente anterior a `R` na ordem do `Index`.

Quando o `InnoDB` escaneia um `Index`, ele também pode aplicar `lock` no `gap` após o último registro do `Index`. Isso é o que acontece no exemplo anterior: Para prevenir qualquer `insert` na tabela onde o `id` seria maior que 100, os `locks` definidos pelo `InnoDB` incluem um `lock` no `gap` que segue o valor de `id` 102.

Você pode usar o `next-key locking` para implementar uma verificação de unicidade em sua aplicação: Se você ler seus dados em `share mode` e não encontrar um duplicado para uma `row` que você está prestes a fazer `insert`, então você pode inserir sua `row` com segurança e saber que o `next-key lock` definido no sucessor de sua `row` durante a leitura impede que alguém insira um duplicado para sua `row` nesse meio tempo. Assim, o `next-key locking` permite que você aplique um “`lock`” na não-existência de algo em sua tabela.

O `Gap locking` pode ser desabilitado conforme discutido na Seção 14.7.1, “`InnoDB Locking`”. Isso pode causar problemas de fantasma porque outras sessões podem inserir novas `rows` nas `gaps` quando o `gap locking` está desabilitado.