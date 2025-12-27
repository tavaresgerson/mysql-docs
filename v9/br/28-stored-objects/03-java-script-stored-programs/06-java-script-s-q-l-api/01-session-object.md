#### 27.3.6.1 Objeto de Sessão

O objeto `Session` está sempre disponível como a propriedade `session` do objeto global. `Session` possui os métodos listados aqui:

* `createSchema(String nome)`: Cria um banco de dados com o *`nome`* especificado e retorna o objeto `Schema` correspondente.

* `dropSchema(String nome)`: Exclui o banco de dados com o *`nome`* especificado. O valor de retorno é indefinido.

* `getDefaultSchema()`: Retorna um `Schema` correspondente ao banco de dados padrão (atual).

* `getOption(String nome)`: Obtém o valor da opção de declaração *`nome`*. Retorna uma string ou um valor `true/false`, dependendo do tipo da opção.

* `getSchema(String nome)`: Obtém o objeto `Schema` com o *`nome`* fornecido, se o esquema correspondente existir, caso contrário, lança um erro.

* `getSchemas()`: Retorna uma lista de todos os objetos `Schema` disponíveis.

* `prepare(String sql, {passResultToClient: Bool, charsetName: String})`: Habilita a execução de uma declaração preparada; recebe uma declaração SQL e retorna um objeto `PreparedStatement`.

* `quoteName(String nome)`: Retorna *`nome`*, após escapará-lo.

* `runSql(String consulta[[, Array parâmetros da declaração], Opções opções)`: Executa uma consulta, com quaisquer opções especificadas, e usando uma lista opcional de parâmetros da declaração; retorna um `SqlResult`.

* `setOptions(Object opções)`: Define os valores padrão das opções de declaração. Opções não especificadas assumem seus valores padrão. Veja a descrição de `Session.sql()` para os nomes das opções e valores possíveis.

* `sql(String sql, {passResultToClient: Bool, charsetName: String, integerType: IntegerType, decimalType: DecimalType})`: Executa uma instrução SQL simples. Também pode ser usado para fornecer atributos que sobrescrevem os valores `passResultToClient` e `charsetName` definidos na sessão. Retorna um objeto `SqlExecute`.

  *`IntegerType`* consiste em um par de chave-valor JSON cuja chave é `IntegerType`, e cujos valores possíveis e seus efeitos estão listados aqui:

  + `mysql.IntegerType.BIGINT`: Converte todos os valores inteiros MySQL para `BigInt` em JavaScript.

  + `mysql.IntegerType.STRING`: Converte todos os valores inteiros MySQL para `String` em JavaScript

  + `mysql.IntegerType.UNSAFE_BIGINT`: Se o valor MySQL for seguro, converta-o para `Number` em JavaScript; caso contrário, converta-o para `BigInt` em JavaScript. Se o valor for seguro, converta para `Number` em JavaScript; caso contrário, converta para `String` em JavaScript. Esse é o comportamento padrão se nenhuma regra for especificada.

  + `mysql.IntegerType.UNSAFE_STRING`: Se o valor MySQL for seguro, converta-o para `Number` em JavaScript; caso contrário, converta-o para `String` em JavaScript. Esse é o comportamento padrão se nenhuma regra for especificada.

  O conjunto de regras definido por esse valor determina como os valores inteiros MySQL são convertidos para JavaScript por essa instrução SQL. Seus nomes (menos referências a objetos) correspondem aos usados com a chave `integer_type` usada com `mle_set_session_state()`. O comportamento padrão é equivalente a ter definido `mysql.IntegerType.UNSAFE_STRING`, ou ter chamado `mle_set_session_state('{"integer_type":"STRING"}')`.

  *`DecimalType`* consiste em um par de chave-valor JSON cuja chave é `DecimalType`, e cujos valores possíveis e seus efeitos estão listados aqui:

+ `mysql.DecimalType.STRING`: Converte valores decimais do MySQL (`DECIMAL` - DECIMAL, NUMERIC") e seu alias `NUMERIC`) para valores `String` em JavaScript. (Esse é o comportamento padrão.)

+ `mysql.DecimalType.NUMBER`: Converte valores decimais do MySQL para números em JavaScript.

Essas opções também podem ser definidas para uma determinada instrução usando `runSQL()` ou `prepare()`. Para defini-las no nível de sessão ou rotina, você também pode usar `setOptions()`.

As funções transacionais do JavaScript também são métodos da `Session`. Consulte a Seção 27.3.6.11, “API de Transação JavaScript” para descrições e exemplos.

##### Acessando Variáveis de Sessão do JavaScript

Você pode acessar variáveis de sessão do MySQL como propriedades do objeto `Session`, como mostrado neste exemplo:

```
mysql> SET @myvar = 27;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE PROCEDURE get_session_var() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>     let the_var = session.myvar
    $>
    $>     console.log("the_var: " + the_var)
    $>     console.log("typeof the_var: " + typeof the_var)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL get_session_var();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): the_var: 27
typeof the_var: number

mysql> SET @myvar = "Something that is not 27";
Query OK, 0 rows affected (0.00 sec)

mysql> CALL get_session_var();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): the_var: Something that is not 27
typeof the_var: string

1 row in set (0.00 sec)
```

Você também pode definir variáveis de sessão acessando-as da mesma maneira, como mostrado aqui:

```
mysql> CREATE PROCEDURE set_session_var(IN x INT) LANGUAGE JAVASCRIPT
    -> AS $$
    $>   session.myvar = x
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL set_session_var(72);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @myvar;
+--------+
| @myvar |
+--------+
|     72 |
+--------+
1 row in set (0.00 sec)
```

As variáveis de sessão acessadas como propriedades da `Session` em JavaScript são criadas automaticamente se ainda não existirem, como mostrado neste exemplo:

```
mysql> CREATE PROCEDURE set_any_var(IN name VARCHAR, IN val INT)
    ->   LANGUAGE JAVASCRIPT
    -> AS $$
    $>   session[name] = val
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @yourvar;
+--------------------+
| @yourvar           |
+--------------------+
| NULL               |
+--------------------+
1 row in set (0.00 sec)

mysql> CALL set_any_var("myvar", 25);
Query OK, 0 rows affected (0.01 sec)

mysql> CALL set_any_var("yourvar", 100);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @myvar, @yourvar;
+--------+----------+
| @myvar | @yourvar |
+--------+----------+
|     25 |      100 |
+--------+----------+
1 row in set (0.00 sec)
```

As regras para a conversão de tipos de variáveis de sessão do MySQL para variáveis de JavaScript são mostradas na tabela a seguir:

<table border="1" class="informaltable" summary="Conversão de tipos: variáveis de sessão do MySQL para variáveis JavaScript">
<colgroup><col/><col/><col/></colgroup>
<thead><tr><th>Tipo MySQL</th><th>Tipo JavaScript</th><th>Comentários</th></tr></thead>
<tbody><tr><td scope="row"><code class="literal">NULL</code></td><td><code class="literal">null</code></td><td>-</td></tr>
<tr><td scope="row"><a class="link" href="integer-types.html" title="13.1.2 Tipos inteiros (Valor exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code class="literal">BIGINT</code></a></td><td><code class="literal">Número</code>, <code class="literal">String</code> ou <code class="literal">BigInt</code></td><td>Depende do valor da opção <a class="link" href="srjsapi-session.html#srjsapi-session-sql"><code class="literal">integerType</code></a> do método <code class="literal">session.sql()</code></td></tr>
<tr><td scope="row"><a class="link" href="fixed-point-types.html" title="13.1.3 Tipos de ponto fixo (Valor exato) - DECIMAL, NUMERIC"><code class="literal">DECIMAL</code></a> ou <code class="literal">NUMERIC</code></td><td><code class="literal">String</code> ou <code class="literal">Número</code></td><td>Depende do valor da opção <a class="link" href="srjsapi-session.html#srjsapi-session-sql"><code class="literal">decimalType</code></a> do método <code class="literal">session.sql()</code></td></tr>
<tr><td scope="row"><a class="link" href="floating-point-types.html" title="13.1.4 Tipos de ponto flutuante (Valor aproximado) - FLOAT, DOUBLE"><code class="literal">DOUBLE</code></a></td><td><code class="literal">Número</code></td><td>-</td></tr>
<tr><td scope="row">String binária</td><td><code class="literal">Uint8Array</code></td><td>-</td></tr>
<tr><td scope="row">String</td><td><code class="literal">String</code></td><td>-</td></tr>
</tbody></table>

As regras para a conversão de tipos de variáveis JavaScript para variáveis de sessão do MySQL estão mostradas na tabela a seguir:

<table border="1" class="informaltable" summary="Conversão de tipos: variáveis JavaScript para variáveis de sessão MySQL">
<colgroup><col/><col/><col/></colgroup>
<thead><tr><th>Tipo JavaScript</th><th>Tipo MySQL</th><th>Comentário</th></tr></thead>
<tbody><tr><td scope="row"><code class="literal">null</code> ou <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td>-</td></tr>
<tr><td scope="row"><code class="literal">Boolean</code></td><td><a class="link" href="integer-types.html" title="13.1.2 Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code class="literal">BIGINT</code></a></td><td>-</td></tr>
<tr><td scope="row"><code class="literal">Number</code></td><td><a class="link" href="integer-types.html" title="13.1.2 Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code class="literal">BIGINT</code></a>, <a class="link" href="fixed-point-types.html" title="13.1.3 Tipos de Ponto Fijo (Valor Exato) - DECIMAL, NUMERIC"><code class="literal">DECIMAL</code></a>, ou <a class="link" href="floating-point-types.html" title="13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE"><code class="literal">DOUBLE</code></a></td><td>-</td></tr>
<tr><td scope="row"><code class="literal">Infinity</code>, <code class="literal">NaN</code>, ou <code class="literal">Symbol</code></td><td>-</td><td>Erro: Tipo não pode ser usado para variáveis de sessão</td></tr>
<tr><td scope="row"><code class="literal">String</code></td><td>string</td><td>-</td></tr>
<tr><td scope="row"><code class="literal">BigInt</code></td><td><a class="link" href="integer-types.html" title="13.1.2 Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code class="literal">BIGINT</code></a></td><td>-</td></tr>
<tr><td scope="row"><code class="literal">TypedArray</code> ou <code class="literal">Float32Array</code></td><td><a class="link" href="binary-varbinary.html" title="13.3.3 Os Tipos BINARY e VARBINARY"><code class="literal">BINARY</code></a></td><td>-</td></tr>
<tr><td scope="row"><code class="literal">Object</code></td><td>string</td><td>-</td></tr>
<tr><td scope="row"><code class="literal">Array</code></td><td>string</td><td>-</td></tr></tbody></table>

##### Localização e Internacionalização do JavaScript

Os programas armazenados no JavaScript suportam locais do MySQL. A localização e a internacionalização são gerenciadas usando o objeto global `Intl`.

Os nomes dos locais do MySQL são mapeados para os nomes dos locais do JavaScript, substituindo o caractere sublinhado por uma barra. Isso pode ser visto no exemplo seguinte, que mostra como recuperar o local atual:

```
mysql> SET @@lc_time_names = "sv_SE";

mysql> CREATE PROCEDURE lc1() LANGUAGE JAVASCRIPT
mysql>   AS
mysql>   $$
mysql>     const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale
mysql>     console.log("Default Locale: ", defaultLocale)
mysql>   $$;

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: sv-SE |
+-----------------------------+
1 row in set (0.04 sec)
```

Também é possível sobrescrever o local da sessão dentro de um programa armazenado em JavaScript; aqui, mostramos o mesmo número exibido duas vezes consecutivas usando um local diferente cada vez:

```
mysql> SET @@lc_time_names = "fr_FR";
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE PROCEDURE lc2() LANGUAGE JAVASCRIPT
mysql>   AS
mysql>   $$
mysql>     const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale
mysql>     const n = 1234567.89;
mysql>     console.log("Default Locale (", defaultLocale, "): ", n.toLocaleString());
mysql>     console.log("ja_JP Locale: ", n.toLocaleString("ja-JP"));
mysql>   $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL lc2();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+--------------------------------------+
| mle_session_state("stdout")          |
+--------------------------------------+
| Default Locale (fr-FR): 1 234 567,89
  Using ja_JP locale: 1,234,567.89     |
+--------------------------------------+
1 row in set (0.04 sec)
```

Você pode usar `toLocaleString()` e outros métodos semelhantes para especificar o local para números e datas. Para moeda e outros valores numéricos especiais, crie uma instância de `NumberFormat` com as propriedades apropriadas.

Um programa armazenado em JavaScript continua usando, por padrão, o ajuste do local de sessão que estava em vigor na primeira vez que foi invocado e executado durante uma sessão específica permanece em vigor, mesmo que o ajuste do local de sessão seja alterado, até que a sessão seja reinicializada. (Isso não afeta o resultado de `toLocaleString()` ou `NumberFormat` chamado com um local explícito.) Se `lc_time_names` for atualizado, chame `mle_session_reset()` para fazer com que todos os programas armazenados usem o novo ajuste de local padrão. Um exemplo é mostrado aqui:

```
mysql> SELECT @@lc_time_names;
+-----------------+
| @@lc_time_names |
+-----------------+
| fr_FR           |
+-----------------+
1 row in set (0.00 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: fr-FR |
+-----------------------------+
1 row in set (0.04 sec)

mysql> SET @@lc_time_names = "ja_JP";
+-----------------+
| @@lc_time_names |
+-----------------+
| ja_JP           |
+-----------------+
1 row in set (0.00 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: fr-FR |
+-----------------------------+
1 row in set (0.04 sec)

mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.01 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: ja-JP |
+-----------------------------+
1 row in set (0.04 sec)
```