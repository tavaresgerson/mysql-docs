#### 8.2.1.4 Otimização da Depressão do Estado do Motor

Essa otimização melhora a eficiência das comparações diretas entre uma coluna não indexada e uma constante. Nesse caso, a condição é "empurrada" para o mecanismo de armazenamento para avaliação. Essa otimização só pode ser usada pelo mecanismo de armazenamento `NDB`.

Para o NDB Cluster, essa otimização pode eliminar a necessidade de enviar linhas não correspondentes pela rede entre os nós de dados do cluster e o servidor MySQL que emitiu a consulta, e pode acelerar as consultas onde é usada em um fator de 5 a 10 vezes em relação aos casos em que a projeção de condições poderia ser usada, mas não é.

Suponha que uma tabela de um cluster NDB seja definida da seguinte forma:

```sql
CREATE TABLE t1 (
    a INT,
    b INT,
    KEY(a)
) ENGINE=NDB;
```

O comando pushdown de condição do motor pode ser usado com consultas como a mostrada aqui, que inclui uma comparação entre uma coluna não indexada e uma constante:

```sql
SELECT a, b FROM t1 WHERE b = 10;
```

O uso do comando `EXPLAIN` para obter informações sobre o estado do motor pode ser visto na saída:

```sql
mysql> EXPLAIN SELECT a,b FROM t1 WHERE b = 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using where with pushed condition
```

No entanto, o comando de empurrar para baixo a condição do motor *não pode* ser usado com nenhuma dessas duas consultas:

```sql
SELECT a,b FROM t1 WHERE a = 10;
SELECT a,b FROM t1 WHERE b + 1 = 10;
```

O empurrão de condição do motor não é aplicável à primeira consulta porque existe um índice na coluna `a`. (Um método de acesso ao índice seria mais eficiente e, portanto, seria escolhido preferencialmente em vez do empurrão de condição do motor.) O empurrão de condição do motor não pode ser empregado para a segunda consulta porque a comparação envolvendo a coluna não indexada `b` é indireta. (No entanto, o empurrão de condição do motor poderia ser aplicado se você reduzisse `b + 1 = 10` para `b = 9` na cláusula `WHERE`.)

A operação de empurrar para baixo da condição do motor também pode ser usada quando uma coluna indexada é comparada com uma constante usando um operador `>` ou `<`:

```sql
mysql> EXPLAIN SELECT a, b FROM t1 WHERE a < 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: range
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 2
        Extra: Using where with pushed condition
```

Outras comparações suportadas para a análise da condição do motor incluem as seguintes:

- `coluna [NÃO] LIKE padrão`

  O caractere `*` deve ser uma literal de string que contenha o padrão a ser correspondido. Para obter informações sobre a sintaxe, consulte a Seção 12.8.1, “Funções e operadores de comparação de strings”.

- `coluna É [NÃO] NULL`

- `coluna EM (lista_de_valores)`

  Cada item na lista *`value_list`* deve ser um valor constante, literal.

- `coluna ENTRE constante1 E constante2`

  *`constant1`* e *`constant2`* devem ser constantes, valores literais.

Em todos os casos da lista anterior, é possível converter a condição para a forma de uma ou mais comparações diretas entre uma coluna e uma constante.

A opção de empurrar a condição do motor é ativada por padrão. Para desativá-la ao iniciar o servidor, defina a bandeira `engine_condition_pushdown` da variável de sistema `optimizer_switch` para `off`. Por exemplo, em um arquivo `my.cnf`, use as seguintes linhas:

```sql
[mysqld]
optimizer_switch=engine_condition_pushdown=off
```

Em tempo de execução, desative a empilhamento de condições da seguinte forma:

```sql
SET optimizer_switch='engine_condition_pushdown=off';
```

**Limitações.** A empurrada da condição do motor está sujeita às seguintes limitações:

- O empurrão de condição do motor é suportado apenas pelo motor de armazenamento `NDB`.

- As colunas podem ser comparadas apenas com constantes; no entanto, isso inclui expressões que retornam valores constantes.

- As colunas usadas em comparações não podem ser de nenhum dos tipos `BLOB` ou `TEXT`. Essa exclusão também se estende às colunas `JSON`, `BIT` e `ENUM`.

- Um valor de cadeia a ser comparado com uma coluna deve usar a mesma concordância que a coluna.

- As junções não são suportadas diretamente; as condições que envolvem múltiplas tabelas são empurradas separadamente, sempre que possível. Use o resultado do `EXPLAIN` estendido para determinar quais condições são realmente empurradas para baixo. Veja a Seção 8.8.3, “Formato de Resultado do EXPLAIN Estendido”.
