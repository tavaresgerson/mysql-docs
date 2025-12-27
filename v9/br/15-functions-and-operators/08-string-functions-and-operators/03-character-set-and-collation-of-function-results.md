### 14.8.3 Conjunto de caracteres e ordenação dos resultados de funções

O MySQL tem muitos operadores e funções que retornam uma string. Esta seção responde à pergunta: Qual é o conjunto de caracteres e a ordenação daquela string?

Para funções simples que aceitam entrada de string e retornam uma string como resultado, o conjunto de caracteres e a ordenação da saída são os mesmos do valor principal de entrada. Por exemplo, `UPPER(X)` retorna uma string com o mesmo conjunto de caracteres e ordenação que *`X`*. O mesmo se aplica a `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()` e `UPPER()`.

Observação

A função `REPLACE()` , ao contrário de todas as outras funções, sempre ignora a ordenação da string de entrada e realiza uma comparação sensível ao caso.

Se uma string de entrada ou resultado de função for uma string binária, a string terá o conjunto de caracteres `binary` e a ordenação `binary`. Isso pode ser verificado usando as funções `CHARSET()` e `COLLATION()`, ambas que retornam `binary` para um argumento de string binária:

```
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

Para operações que combinam múltiplas entradas de string e retornam uma única saída de string, as regras de agregação do SQL padrão se aplicam para determinar a ordenação do resultado:

* Se ocorrer uma `COLLATE Y` explícita, use *`Y`*.

* Se ocorrer `COLLATE Y` e `COLLATE Z` explícitas, levante um erro.

* Caso contrário, se todas as ordenações forem *`Y`*, use *`Y`*.

* Caso contrário, o resultado não tem ordenação.

Por exemplo, com `CASE ... WHEN a THEN b WHEN b THEN c COLLATE X END`, a ordenação resultante é *`X`*. O mesmo se aplica a `UNION`, `||`, `CONCAT()`, `ELT()`, `GREATEST()`, `IF()` e `LEAST()`.

Para operações que convertem em dados de caracteres, o conjunto de caracteres e a ordenação das cadeias resultantes das operações são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o conjunto de caracteres e a ordenação de conexão padrão (consulte a Seção 12.4, “Conjunto de caracteres de conexão e ordenação”). Isso se aplica apenas a `BIN_TO_UUID()`, `CAST()`, `CONV()`, `FORMAT()`, `HEX()` e `SPACE()`.

Uma exceção ao princípio anterior ocorre para expressões de colunas geradas virtualmente. Nessas expressões, o conjunto de caracteres da tabela é usado para os resultados de `BIN_TO_UUID()`, `CONV()` ou `HEX()`, independentemente do conjunto de caracteres de conexão.

Se houver alguma dúvida sobre o conjunto de caracteres ou ordenação do resultado retornado por uma função de string, use a função `CHARSET()` ou `COLLATION()` para descobrir:

```
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+--------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER())  |
+----------------+-----------------+--------------------+
| test@localhost | utf8mb3         | utf8mb3_general_ci |
+----------------+-----------------+--------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```