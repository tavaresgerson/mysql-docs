### 12.8.3 Conjunto de caracteres e comparação dos resultados das funções

O MySQL tem muitos operadores e funções que retornam uma string. Esta seção responde à pergunta: Qual é o conjunto de caracteres e a ordenação dessa string?

Para funções simples que aceitam entrada de string e retornam um resultado de string como saída, o conjunto de caracteres e a ordenação da saída são os mesmos da principal entrada. Por exemplo, `UPPER(X)` retorna uma string com o mesmo conjunto de caracteres e ordenação da string *`X`*. O mesmo se aplica a `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()` e `UPPER()`.

Nota

A função `REPLACE()` , ao contrário de todas as outras funções, sempre ignora a collation da entrada de string e realiza uma comparação sensível a maiúsculas e minúsculas.

Se uma entrada de string ou resultado de função for uma string binária, a string possui o conjunto de caracteres `binary` e a ordenação. Isso pode ser verificado usando as funções `CHARSET()` e `COLLATION()`, ambas as quais retornam `binary` para um argumento de string binária:

```sql
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

Para operações que combinam várias entradas de string e retornam uma única saída de string, as regras de agregação do SQL padrão são aplicadas para determinar a collation do resultado:

- Se ocorrer uma `COLLATE Y` explícita, use *`Y`*.

- Se ocorrerem `COLLATE Y` e `COLLATE Z` explícitos, levante um erro.

- Caso contrário, se todas as colatações forem *`Y`*, use *`Y`*.

- Caso contrário, o resultado não tem ordenação.

Por exemplo, com `CASE ... WHEN a THEN b WHEN b THEN c COLLATE X END`, a collation resultante é *`X`*. O mesmo se aplica a `UNION`, `||`, `CONCAT()`, `ELT()`, `GREATEST()`, `IF()` e `LEAST()`.

Para operações que convertem para dados de caracteres, o conjunto de caracteres e a ordenação das cadeias resultantes das operações são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o conjunto de caracteres e a ordenação de conexão padrão (consulte a Seção 10.4, “Conjunto de caracteres e ordenação de conexão”). Isso se aplica apenas a `CAST()`, `CONV()`, `FORMAT()`, `HEX()` e `SPACE()`.

A partir do MySQL 5.7.19, uma exceção ao princípio anterior ocorre para expressões de colunas geradas virtualmente. Nessas expressões, o conjunto de caracteres da tabela é usado para os resultados de `CONV()` ou `HEX()`, independentemente do conjunto de caracteres da conexão.

Se houver alguma dúvida sobre o conjunto de caracteres ou a ordenação do resultado retornado por uma função de string, use a função `CHARSET()` ou `COLLATION()` para descobrir:

```sql
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+-------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER()) |
+----------------+-----------------+-------------------+
| test@localhost | utf8            | utf8_general_ci   |
+----------------+-----------------+-------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```
