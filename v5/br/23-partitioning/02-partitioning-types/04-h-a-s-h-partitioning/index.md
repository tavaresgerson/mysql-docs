### 22.2.4 Partição HASH

22.2.4.1 Partição por Hash Linear

A partição por `HASH` é usada principalmente para garantir uma distribuição uniforme dos dados entre um número predeterminado de partições. Com a partição por intervalo ou lista, você deve especificar explicitamente em qual partição um determinado valor de coluna ou conjunto de valores de coluna será armazenado; com a partição por hash, o MySQL cuida disso por você, e você precisa apenas especificar um valor de coluna ou expressão com base em um valor de coluna que será hash e o número de partições em que a tabela particionada será dividida.

Para particionar uma tabela usando a partição `HASH`, é necessário adicionar à instrução `CREATE TABLE` a cláusula `PARTITION BY HASH (expr)`, onde *`expr`* é uma expressão que retorna um inteiro. Isso pode ser simplesmente o nome de uma coluna cujo tipo é um dos tipos inteiros do MySQL. Além disso, você provavelmente deseja seguir isso com `PARTITIONS num`, onde *`num`* é um inteiro positivo representando o número de partições em que a tabela deve ser dividida.

Nota

Por simplicidade, as tabelas nos exemplos a seguir não usam nenhuma chave. Você deve estar ciente de que, se uma tabela tiver quaisquer chaves únicas, todas as colunas usadas na expressão de particionamento para essa tabela devem fazer parte de cada chave única, incluindo a chave primária. Consulte Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas” para obter mais informações.

A seguinte declaração cria uma tabela que usa hashing na coluna `store_id` e é dividida em 4 partições:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH(store_id)
PARTITIONS 4;
```

Se você não incluir uma cláusula `PARTITIONS`, o número de partições será definido como padrão por `1`.

Usar a palavra-chave `PARTITIONS` sem um número após ela resulta em um erro de sintaxe.

Você também pode usar uma expressão SQL que retorne um inteiro para *`expr`*. Por exemplo, você pode querer particionar com base no ano em que um funcionário foi contratado. Isso pode ser feito conforme mostrado aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH( YEAR(hired) )
PARTITIONS 4;
```

*`expr`* deve retornar um valor inteiro não constante e não aleatório (ou seja, deve variar, mas ser determinístico) e não deve conter nenhuma construção proibida conforme descrito na Seção 22.6, “Restrições e Limitações de Partição”. Você também deve ter em mente que essa expressão é avaliada sempre que uma linha é inserida ou atualizada (ou possivelmente excluída); isso significa que expressões muito complexas podem gerar problemas de desempenho, especialmente ao realizar operações (como inserções em lote) que afetam muitas linhas de uma só vez.

A função de hashing mais eficiente é aquela que opera sobre uma única coluna de uma tabela e cujo valor aumenta ou diminui de forma consistente com o valor da coluna, pois isso permite a "poda" em faixas de partições. Ou seja, quanto mais próxima a expressão variar com o valor da coluna em que se baseia, mais eficientemente o MySQL pode usar a expressão para a partição por hash.

Por exemplo, quando `date_col` é uma coluna do tipo `DATE`, a expressão `TO_DAYS(date_col)` é dita variar diretamente com o valor de `date_col`, porque, para cada mudança no valor de `date_col`, o valor da expressão muda de maneira consistente. A variância da expressão `YEAR(date_col)` em relação a `date_col` não é tão direta quanto a de `TO_DAYS(date_col)`, porque nem toda mudança possível em `date_col` produz uma mudança equivalente em `YEAR(date_col)`. Mesmo assim, `YEAR(date_col)` é um bom candidato para uma função de hashing, porque varia diretamente com uma parte de `date_col` e não há nenhuma mudança possível em `date_col` que produza uma mudança desproporcional em `YEAR(date_col)`.

Em contraste, suponha que você tenha uma coluna chamada `int_col` cujo tipo é `INT`. Agora, considere a expressão `POW(5-int_col,3) + 6`. Esta seria uma escolha ruim para uma função de hashing, porque não é garantido que uma mudança no valor de `int_col` produza uma mudança proporcional no valor da expressão. Mudar o valor de `int_col` em um determinado valor pode produzir mudanças muito diferentes no valor da expressão. Por exemplo, mudar `int_col` de `5` para `6` produz uma mudança de `-1` no valor da expressão, mas mudar o valor de `int_col` de `6` para `7` produz uma mudança de `-7` no valor da expressão.

Em outras palavras, quanto mais próxima a curva do valor da coluna em relação ao valor da expressão seguir uma linha reta, conforme traçada pela equação `y=cx`, onde *`c`* é uma constante não nula, melhor a expressão se adapta ao hashing. Isso tem a ver com o fato de que quanto mais não linear for uma expressão, mais desigual será a distribuição dos dados entre as partições que ela tende a produzir.

Em teoria, a poda também é possível para expressões que envolvem mais de um valor de coluna, mas determinar quais dessas expressões são adequadas pode ser bastante difícil e demorado. Por essa razão, o uso de expressões de hashing que envolvem múltiplas colunas não é particularmente recomendado.

Quando o `PARTITION BY HASH` é usado, o MySQL determina qual partição das partições de *`num`* deve ser utilizada com base no módulo do resultado da expressão. Em outras palavras, para uma expressão dada *`expr`*, a partição na qual o registro é armazenado é o número de partição *`N`*, onde `N = MOD(expr, num)`. Suponha que a tabela `t1` seja definida da seguinte forma, de modo que ela tenha 4 partições:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY HASH( YEAR(col3) )
    PARTITIONS 4;
```

Se você inserir um registro no `t1` cujo valor de `col3` é `'2005-09-15'`, então a partição na qual ele é armazenado é determinada da seguinte forma:

```sql
MOD(YEAR('2005-09-01'),4)
=  MOD(2005,4)
=  1
```

O MySQL 5.7 também suporta uma variante da partição `HASH`, conhecida como hashing linear, que utiliza um algoritmo mais complexo para determinar o local onde as novas linhas inseridas na tabela particionada serão colocadas. Consulte Seção 22.2.4.1, “Partição Linear Hash” para uma descrição desse algoritmo.

A expressão fornecida pelo usuário é avaliada sempre que um registro é inserido ou atualizado. Dependendo das circunstâncias, ela também pode ser avaliada quando os registros são excluídos.
