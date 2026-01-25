### 12.8.3 Character Set e Collation de Resultados de Função

O MySQL possui muitos operadores e funções que retornam uma string. Esta seção responde à pergunta: Qual é o Character Set e a Collation de tal string?

Para funções simples que aceitam uma string como input e retornam um resultado string como output, o Character Set e a Collation do output são os mesmos do valor de input principal. Por exemplo, `UPPER(X)` retorna uma string com o mesmo Character Set e Collation que *`X`*. O mesmo se aplica a `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()` e `UPPER()`.

Note

A função `REPLACE()`, diferentemente de todas as outras funções, sempre ignora a Collation da string de input e executa uma comparação case-sensitive.

Se um input string ou resultado de função for uma string Binary, a string possui o Character Set e Collation `binary`. Isso pode ser verificado usando as funções `CHARSET()` e `COLLATION()`, ambas retornando `binary` para um argumento string Binary:

```sql
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

Para operações que combinam múltiplos inputs string e retornam um único output string, as “regras de agregação” do SQL padrão se aplicam para determinar a Collation do resultado:

* Se ocorrer um `COLLATE Y` explícito, use *`Y`*.

* Se ocorrerem `COLLATE Y` e `COLLATE Z` explícitos, gere um erro.

* Caso contrário, se todas as Collations forem *`Y`*, use *`Y`*.

* Caso contrário, o resultado não possui Collation.

Por exemplo, com `CASE ... WHEN a THEN b WHEN b THEN c COLLATE X END`, a Collation resultante é *`X`*. O mesmo se aplica a `UNION`, `||`, `CONCAT()`, `ELT()`, `GREATEST()`, `IF()` e `LEAST()`.

Para operações que convertem para dados de caractere, o Character Set e a Collation das strings resultantes das operações são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o Character Set e a Collation de conexão padrão (consulte a Seção 10.4, “Connection Character Sets and Collations”). Isso se aplica somente a `CAST()`, `CONV()`, `FORMAT()`, `HEX()` e `SPACE()`.

A partir do MySQL 5.7.19, ocorre uma exceção ao princípio anterior para expressões em colunas geradas virtuais. Nessas expressões, o Character Set da tabela é usado para resultados de `CONV()` ou `HEX()`, independentemente do Character Set de conexão.

Se houver qualquer dúvida sobre o Character Set ou a Collation do resultado retornado por uma função de string, use a função `CHARSET()` ou `COLLATION()` para descobrir:

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