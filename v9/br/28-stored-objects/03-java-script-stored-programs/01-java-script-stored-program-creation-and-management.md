### 27.3.1 Criação e Gerenciamento de Programas Armazenados em JavaScript

Uma função ou procedimento armazenado escrito em JavaScript é criado, invocado e mantido da mesma maneira que um escrito em SQL, sujeito às diferenças listadas aqui:

* A linguagem do programa armazenado deve ser declarada explicitamente usando `LANGUAGE JAVASCRIPT` na instrução `CREATE FUNCTION` ou `CREATE PROCEDURE` usada para criar o programa armazenado; caso contrário, o MySQL assume que a linguagem pretendida é SQL.

O corpo da rotina é verificado na hora da criação; quaisquer erros fazem com que a instrução `CREATE` seja rejeitada e o programa armazenado não seja criado.

* O corpo do programa deve ser demarcado usando a palavra-chave `AS` mais delimitadores com aspas, como `$$`, `$js$`, `$mysql$`, e assim por diante. Você deve usar o mesmo delimitador para marcar tanto o início quanto o fim do corpo da rotina. É possível usar aspas para delimitar o corpo da rotina, mas delimitadores com aspas são preferidos, pois isso evita problemas com a citação de strings no código da função ou procedimento. Após o primeiro delimitador com aspas, o prompt do cliente **mysql** muda para `$>` para cada nova linha dentro do corpo da rotina, até atingir um delimitador com aspas fechado, após o qual o prompt retorna ao padrão (normalmente `->`). Isso pode ser visto na instrução `CREATE FUNCTION` usada para criar a função `add_nos()` anteriormente.

* Não é necessário especificar um delimitador ou terminador de declaração, como é para rotinas armazenadas em SQL. Se você usar o caractere opcional `;` para separar declarações JavaScript, isso é interpretado corretamente como parte da rotina JavaScript, e não como um delimitador de declaração SQL, como mostrado aqui:

  ```
  mysql> CREATE FUNCTION js_pow(arg1 INT, arg2 INT)
      -> RETURNS INT LANGUAGE JAVASCRIPT
      -> AS
      ->   $$
      $>     let x = Math.pow(arg1, arg2);
      $>     return x;
      $>   $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT js_pow(2,3);
  +-------------+
  | js_pow(2,3) |
  +-------------+
  |           8 |
  +-------------+
  1 row in set (0.00 sec)
  ```

Para minimizar possíveis confusões, não usamos o separador `;` para quaisquer declarações de JavaScript nos exemplos restantes desta seção.

* O texto do corpo da rotina é sempre tratado como `utfmb4`, independentemente do conjunto de caracteres realmente usado. O que isso significa é que, independentemente do conjunto de caracteres usado pelo cliente para o corpo da rotina, o servidor o converte para `utf8mb4` antes de armazená-lo no dicionário de dados. Como o `utf8mb4` subsume todos os outros conjuntos de caracteres suportados, isso não deve ser um problema.

  Os argumentos do programa JavaScript e os nomes das rotinas devem usar o conjunto de caracteres `utfmb3`, como com os programas armazenados em SQL. Veja a Seção 12.9, “Suporte a Unicode”.

* Os argumentos de string e os tipos de retorno devem ser esperados como `utf8mb4`; isso significa que, se o conjunto de caracteres padrão do esquema ao qual o programa armazenado em JavaScript pertence for algum outro conjunto de caracteres, todos os seus argumentos devem ser declarados explicitamente como `utf8mb4`.

  Os nomes dos argumentos de entrada devem seguir as regras para identificadores de JavaScript: Eles podem conter letras Unicode, `$`, `_` e dígitos (0-9), mas não podem começar com um dígito.

  Usar uma palavra que é reservada em JavaScript (como `var` ou `function`) como o nome de um argumento gera um erro. Como os programas armazenados em JavaScript de MySQL sempre usam o modo estrito, isso também inclui palavras-chave como `package` e `let`. Veja [Palavras Reservadas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words) para uma lista completa dessas. Além disso, as palavras-chave `mysql`, `console` e `graal` também são reservadas pelo componente MLE e não podem ser usadas como nomes de variáveis ou argumentos em programas armazenados em JavaScript de MySQL.

* Você pode modificar um programa armazenado em JavaScript usando `ALTER FUNCTION` e `ALTER PROCEDURE`, da mesma forma que faria com uma função ou procedimento armazenado em SQL. A alteração da linguagem usando `ALTER` não é suportada; nesses casos, você deve usar `DROP FUNCTION` ou `DROP PROCEDURE`, conforme aplicável, e depois recriar o programa armazenado usando a declaração `CREATE` apropriada.

Para obter uma lista de todos os programas armazenados em JavaScript em todos os bancos de dados no servidor, execute a consulta na tabela do Esquema de Informações `ROUTINES` da seguinte forma:

```
mysql> SELECT CONCAT(ROUTINE_SCHEMA, '.', ROUTINE_NAME) AS "JS Stored Routines"
    ->   FROM INFORMATION_SCHEMA.ROUTINES
    ->   WHERE EXTERNAL_LANGUAGE="JAVASCRIPT";
+------------------------+
| JS Stored Routines     |
+------------------------+
| test.pc1               |
| test.pc2               |
| world.jssp_simple1     |
| test.jssp_vsimple      |
| test.jssp_simple       |
| world.jssp_vsimple     |
| world.jssp_vsimple2    |
| world.jssp_simple_meta |
+------------------------+
8 rows in set (0.00 sec)
```