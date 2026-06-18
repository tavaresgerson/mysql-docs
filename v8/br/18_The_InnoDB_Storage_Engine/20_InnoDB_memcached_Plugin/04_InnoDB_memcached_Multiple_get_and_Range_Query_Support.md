### 17.20.4 Suporte a múltiplas consultas get e Range Query do InnoDB memcached

O plugin `daemon_memcached` suporta várias operações de obtenção (recuperação de múltiplos pares chave-valor em uma única consulta **memcached**) e consultas de intervalo.

#### Operações de múltiplos selecionamentos

A capacidade de recuperar múltiplos pares chave-valor em uma única consulta ao **memcached** melhora o desempenho de leitura, reduzindo o tráfego de comunicação entre o cliente e o servidor. Para `InnoDB`, isso significa menos transações e operações de tabela aberta.

O exemplo a seguir demonstra o suporte a múltiplos registros. O exemplo utiliza a tabela `test.city` descrita na criação de uma nova tabela e mapeamento de colunas.

```
mysql> USE test;
mysql> SELECT * FROM test.city;
+---------+-----------+-------------+---------+-------+------+--------+
| city_id | name      | state       | country | flags | cas  | expiry |
+---------+-----------+-------------+---------+-------+------+--------+
| B       | BANGALORE | BANGALORE   | IN      |     0 |    1 |      0 |
| C       | CHENNAI   | TAMIL NADU  | IN      |     0 |    0 |      0 |
| D       | DELHI     | DELHI       | IN      |     0 |    0 |      0 |
| H       | HYDERABAD | TELANGANA   | IN      |     0 |    0 |      0 |
| M       | MUMBAI    | MAHARASHTRA | IN      |     0 |    0 |      0 |
+---------+-----------+-------------+---------+-------+------+--------+
```

Execute um comando `get` para recuperar todos os valores da tabela `city`. Os resultados são retornados em uma sequência de pares chave-valor.

```
telnet 127.0.0.1 11211
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
get B C D H M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
END
```

Ao recuperar múltiplos valores em um único comando `get`, você pode alternar entre tabelas (usando a notação `@@containers.name`) para recuperar o valor da primeira chave, mas não pode alternar entre tabelas para chaves subsequentes. Por exemplo, a alternância de tabela neste exemplo é válida:

```
get @@aaa.AA BB
VALUE @@aaa.AA 8 12
HELLO, HELLO
VALUE BB 10 16
GOODBYE, GOODBYE
END
```

Tentar alternar as tabelas novamente no mesmo comando `get` para recuperar um valor de chave de uma tabela diferente não é suportado.

Não há limite para o número de chaves que podem ser recuperadas por uma operação de múltiplos get, mas há um limite de memória de 128 MB para armazenar o resultado.

#### Consultas de intervalo

Para consultas de intervalo, o plugin `daemon_memcached` suporta os seguintes operadores de comparação: `<`, `>`, `<=`, `>=`. Um operador deve ser precedido por um símbolo `@`. Quando uma consulta de intervalo encontra múltiplas pares chave-valor correspondentes, os resultados são retornados em uma sequência de pares chave-valor.

Os exemplos a seguir demonstram o suporte a consultas de intervalo. Os exemplos utilizam a tabela `test.city` descrita na criação de uma nova tabela e mapeamento de coluna.

```
mysql> SELECT * FROM test.city;
+---------+-----------+-------------+---------+-------+------+--------+
| city_id | name      | state       | country | flags | cas  | expiry |
+---------+-----------+-------------+---------+-------+------+--------+
| B       | BANGALORE | BANGALORE   | IN      |     0 |    1 |      0 |
| C       | CHENNAI   | TAMIL NADU  | IN      |     0 |    0 |      0 |
| D       | DELHI     | DELHI       | IN      |     0 |    0 |      0 |
| H       | HYDERABAD | TELANGANA   | IN      |     0 |    0 |      0 |
| M       | MUMBAI    | MAHARASHTRA | IN      |     0 |    0 |      0 |
+---------+-----------+-------------+---------+-------+------+--------+
```

Abra uma sessão de telnet:

```
telnet 127.0.0.1 11211
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
```

Para obter todos os valores maiores que `B`, insira `get @>B`:

```
get @>B
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
END
```

Para obter todos os valores menores que `M`, insira `get @<M`:

```
get @<M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
END
```

Para obter todos os valores menores ou iguais a `M`, insira `get @<=M`:

```
get @<=M
VALUE B 0 22
BANGALORE|BANGALORE|IN
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
VALUE M 0 21
MUMBAI|MAHARASHTRA|IN
```

Para obter valores maiores que `B`, mas menores que `M`, insira `get @>B@<M`:

```
get @>B@<M
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
END
```

No máximo, dois operadores de comparação podem ser analisados, sendo um deles um operador de "menor que" (`@<`) ou "menor ou igual a" (`@<=`) e o outro um operador de "maior que" (`@>`) ou "maior ou igual a" (`@>=`). Qualquer operador adicional é considerado parte da chave. Por exemplo, se você emitir um comando `get` com três operadores, o terceiro operador (`@>C`) é tratado como parte da chave, e o comando `get` busca por valores menores que `M` e maiores que `B@>C`.

```
get @<M@>B@>C
VALUE C 0 21
CHENNAI|TAMIL NADU|IN
VALUE D 0 14
DELHI|DELHI|IN
VALUE H 0 22
HYDERABAD|TELANGANA|IN
```
