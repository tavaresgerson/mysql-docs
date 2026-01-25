#### 13.6.7.7 A Diagnostics Area do MySQL

Declarações SQL produzem informações de diagnóstico que preenchem a Diagnostics Area. O SQL padrão possui uma pilha (stack) de Diagnostics Area, contendo uma Diagnostics Area para cada contexto de execução aninhado. O SQL padrão também suporta a sintaxe [`GET STACKED DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") para se referir à segunda Diagnostics Area durante a execução do condition handler. O MySQL suporta a palavra-chave `STACKED` a partir do MySQL 5.7. Antes disso, o MySQL não suportava `STACKED`; havia uma única Diagnostics Area contendo informações da declaração mais recente que a preencheu.

A discussão a seguir descreve a estrutura da Diagnostics Area no MySQL, os itens de informação reconhecidos pelo MySQL, como as declarações limpam e definem a Diagnostics Area, e como as Diagnostics Areas são empurradas (pushed) e retiradas (popped) da stack.

* [Estrutura da Diagnostics Area](diagnostics-area.html#diagnostics-area-structure "Diagnostics Area Structure")
* [Itens de Informação da Diagnostics Area](diagnostics-area.html#diagnostics-area-information-items "Diagnostics Area Information Items")
* [Como a Diagnostics Area é Limpa e Preenchida](diagnostics-area.html#diagnostics-area-populating "How the Diagnostics Area is Cleared and Populated")
* [Como a Stack da Diagnostics Area Funciona](diagnostics-area.html#diagnostics-area-stack "How the Diagnostics Area Stack Works")
* [Variáveis de Sistema Relacionadas à Diagnostics Area](diagnostics-area.html#diagnostics-area-system-variables "Diagnostics Area-Related System Variables")

##### Estrutura da Diagnostics Area

A Diagnostics Area contém dois tipos de informação:

* Informações da declaração (Statement information), como o número de conditions que ocorreram ou a contagem de affected-rows.

* Informações de condition, como o código de error e a mensagem. Se uma declaração gerar múltiplas conditions, esta parte da Diagnostics Area terá uma condition area para cada uma. Se uma declaração não gerar conditions, esta parte da Diagnostics Area estará vazia.

Para uma declaração que produz três conditions, a Diagnostics Area contém informações de declaração e condition como estas:

```sql
Statement information:
  row count
  ... other statement information items ...
Condition area list:
  Condition area 1:
    error code for condition 1
    error message for condition 1
    ... other condition information items ...
  Condition area 2:
    error code for condition 2:
    error message for condition 2
    ... other condition information items ...
  Condition area 3:
    error code for condition 3
    error message for condition 3
    ... other condition information items ...
```

##### Itens de Informação da Diagnostics Area

A Diagnostics Area contém itens de informação de declaração e condition. Itens numéricos são integers. O conjunto de caracteres para itens de caractere é UTF-8. Nenhum item pode ser `NULL`. Se um item de declaração ou condition não for definido por uma declaração que preenche a Diagnostics Area, seu valor é 0 ou a string vazia, dependendo do tipo de dado do item.

A parte de informação de declaração da Diagnostics Area contém estes itens:

* `NUMBER`: Um integer que indica o número de condition areas que contêm informação.

* `ROW_COUNT`: Um integer que indica o número de rows afetadas pela declaração. `ROW_COUNT` tem o mesmo valor que a função [`ROW_COUNT()`](information-functions.html#function_row-count) (consulte a [Seção 12.15, “Information Functions”](information-functions.html "12.15 Information Functions")).

A parte de informação de condition da Diagnostics Area contém uma condition area para cada condition. As condition areas são numeradas de 1 ao valor do item de condition de declaração `NUMBER`. Se `NUMBER` for 0, não há condition areas.

Cada condition area contém os itens na lista a seguir. Todos os itens são SQL padrão, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. As definições se aplicam a conditions geradas de forma diferente de um signal (ou seja, por uma declaração [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") ou [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")). Para conditions que não são signals, o MySQL preenche apenas aqueles itens de condition não descritos como sempre vazios. Os efeitos dos signals na condition area são descritos posteriormente.

* `CLASS_ORIGIN`: Uma string contendo a classe do valor `RETURNED_SQLSTATE`. Se o valor `RETURNED_SQLSTATE` começar com um valor de classe definido no documento de padrões SQL ISO 9075-2 (seção 24.1, SQLSTATE), `CLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `CLASS_ORIGIN` é `'MySQL'`.

* `SUBCLASS_ORIGIN`: Uma string contendo a subclasse do valor `RETURNED_SQLSTATE`. Se `CLASS_ORIGIN` for `'ISO 9075'` ou `RETURNED_SQLSTATE` terminar com `'000'`, `SUBCLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `SUBCLASS_ORIGIN` é `'MySQL'`.

* `RETURNED_SQLSTATE`: Uma string que indica o valor `SQLSTATE` para a condition.

* `MESSAGE_TEXT`: Uma string que indica a mensagem de error para a condition.

* `MYSQL_ERRNO`: Um integer que indica o código de error MySQL para a condition.

* `CONSTRAINT_CATALOG`, `CONSTRAINT_SCHEMA`, `CONSTRAINT_NAME`: Strings que indicam o catalog, schema e name para uma constraint violada. Estão sempre vazias.

* `CATALOG_NAME`, `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Strings que indicam o catalog, schema, table e column relacionados à condition. Estão sempre vazias.

* `CURSOR_NAME`: Uma string que indica o cursor name. Está sempre vazia.

Para os valores `RETURNED_SQLSTATE`, `MESSAGE_TEXT` e `MYSQL_ERRNO` para erros específicos, consulte [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

Se uma declaração [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") (ou [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")) preencher a Diagnostics Area, sua cláusula `SET` pode atribuir a qualquer item de informação de condition, exceto `RETURNED_SQLSTATE`, qualquer valor que seja legal para o tipo de dado do item. [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") também define o valor `RETURNED_SQLSTATE`, mas não diretamente em sua cláusula `SET`. Esse valor vem do argumento `SQLSTATE` da declaração [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

O [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") também define itens de informação de declaração. Ele define `NUMBER` como 1. Ele define `ROW_COUNT` como −1 para errors e 0, caso contrário.

##### Como a Diagnostics Area é Limpa e Preenchida

Declarações SQL não diagnósticas preenchem a Diagnostics Area automaticamente, e seu conteúdo pode ser definido explicitamente com as declarações [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") e [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"). A Diagnostics Area pode ser examinada com [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") para extrair itens específicos, ou com [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") ou [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") para visualizar conditions ou errors.

Declarações SQL limpam e definem a Diagnostics Area da seguinte forma:

* Quando o servidor começa a executar uma declaração após o parsing, ele limpa a Diagnostics Area para declarações não diagnósticas. Declarações diagnósticas não limpam a Diagnostics Area. Estas são as declarações diagnósticas:

  + [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")
  + [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement")
  + [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")
* Se uma declaração gerar uma condition, a Diagnostics Area é limpa das conditions que pertenciam a declarações anteriores. A exceção é que conditions geradas por [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") e [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") são adicionadas à Diagnostics Area sem limpá-la.

Assim, mesmo uma declaração que normalmente não limpa a Diagnostics Area ao iniciar a execução, a limpa se a declaração gerar uma condition.

O exemplo a seguir mostra o efeito de várias declarações na Diagnostics Area, usando [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") para exibir informações sobre as conditions armazenadas nela.

Esta declaração [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") limpa a Diagnostics Area e a preenche quando a condition ocorre:

```sql
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)
```

Esta declaração [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") gera um error, então ela limpa e preenche a Diagnostics Area:

```sql
mysql> SET @x = @@x;
ERROR 1193 (HY000): Unknown system variable 'x'

mysql> SHOW WARNINGS;
+-------+------+-----------------------------+
| Level | Code | Message                     |
+-------+------+-----------------------------+
| Error | 1193 | Unknown system variable 'x' |
+-------+------+-----------------------------+
1 row in set (0.00 sec)
```

A declaração [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") anterior produziu uma única condition, então 1 é o único condition number válido para [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") neste ponto. A declaração a seguir usa um condition number de 2, o que produz um warning que é adicionado à Diagnostics Area sem limpá-la:

```sql
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------+
| Level | Code | Message                      |
+-------+------+------------------------------+
| Error | 1193 | Unknown system variable 'xx' |
| Error | 1753 | Invalid condition number     |
+-------+------+------------------------------+
2 rows in set (0.00 sec)
```

Agora existem duas conditions na Diagnostics Area, então a mesma declaração [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") é bem-sucedida:

```sql
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @p;
+--------------------------+
| @p                       |
+--------------------------+
| Invalid condition number |
+--------------------------+
1 row in set (0.01 sec)
```

##### Como a Stack da Diagnostics Area Funciona

Quando ocorre um push na stack da Diagnostics Area, a primeira Diagnostics Area (current) se torna a segunda Diagnostics Area (stacked) e uma nova Diagnostics Area current é criada como uma cópia dela. As Diagnostics Areas são empurradas (pushed) para e retiradas (popped) da stack nas seguintes circunstâncias:

* Execução de um stored program

  Um push ocorre antes que o program seja executado e um pop ocorre depois. Se o stored program terminar enquanto os handlers estiverem sendo executados, pode haver mais de uma Diagnostics Area para retirar (pop); isso ocorre devido a uma exception para a qual não há handlers apropriados ou devido a [`RETURN`](return.html "13.6.5.7 RETURN Statement") no handler.

  Quaisquer conditions de warning ou error nas Diagnostics Areas retiradas (popped) são então adicionadas à Diagnostics Area current, exceto que, para triggers, apenas errors são adicionados. Quando o stored program termina, o chamador visualiza essas conditions em sua Diagnostics Area current.

* Execução de um condition handler dentro de um stored program

  Quando ocorre um push como resultado da ativação de um condition handler, a Diagnostics Area stacked é a área que era current dentro do stored program antes do push. A nova Diagnostics Area agora current é a Diagnostics Area current do handler. [`GET [CURRENT] DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") e [`GET STACKED DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") podem ser usados dentro do handler para acessar o conteúdo das Diagnostics Areas current (do handler) e stacked (do stored program). Inicialmente, elas retornam o mesmo resultado, mas as declarações executadas dentro do handler modificam a Diagnostics Area current, limpando e definindo seu conteúdo de acordo com as regras normais (consulte [Como a Diagnostics Area é Limpa e Preenchida](diagnostics-area.html#diagnostics-area-populating "How the Diagnostics Area is Cleared and Populated")). A Diagnostics Area stacked não pode ser modificada por declarações executadas dentro do handler, exceto [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement").

  Se o handler for executado com sucesso, a Diagnostics Area current (do handler) é retirada (popped) e a Diagnostics Area stacked (do stored program) volta a ser a Diagnostics Area current. Conditions adicionadas à Diagnostics Area do handler durante a execução do handler são adicionadas à Diagnostics Area current.

* Execução de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")

  A declaração [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") transmite as informações de error condition disponíveis durante a execução de um condition handler dentro de uma compound statement em um stored program. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") pode alterar algumas ou todas as informações antes de transmiti-las, modificando a diagnostics stack conforme descrito na [Seção 13.6.7.4, “RESIGNAL Statement”](resignal.html "13.6.7.4 RESIGNAL Statement").

##### Variáveis de Sistema Relacionadas à Diagnostics Area

Certas variáveis de sistema controlam ou estão relacionadas a alguns aspectos da Diagnostics Area:

* [`max_error_count`](server-system-variables.html#sysvar_max_error_count) controla o número de condition areas na Diagnostics Area. Se ocorrerem mais conditions do que este limite, o MySQL descarta silenciosamente as informações das conditions em excesso. (Conditions adicionadas por [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") são sempre adicionadas, com conditions mais antigas sendo descartadas conforme necessário para abrir espaço.)

* [`warning_count`](server-system-variables.html#sysvar_warning_count) indica o número de conditions que ocorreram. Isso inclui errors, warnings e notes. Normalmente, `NUMBER` e [`warning_count`](server-system-variables.html#sysvar_warning_count) são iguais. No entanto, à medida que o número de conditions geradas excede [`max_error_count`](server-system-variables.html#sysvar_max_error_count), o valor de [`warning_count`](server-system-variables.html#sysvar_warning_count) continua a aumentar, enquanto `NUMBER` permanece limitado a [`max_error_count`](server-system-variables.html#sysvar_max_error_count) porque nenhuma condition adicional é armazenada na Diagnostics Area.

* [`error_count`](server-system-variables.html#sysvar_error_count) indica o número de errors que ocorreram. Este valor inclui conditions de “not found” e exception, mas exclui warnings e notes. Assim como [`warning_count`](server-system-variables.html#sysvar_warning_count), seu valor pode exceder [`max_error_count`](server-system-variables.html#sysvar_max_error_count).

* Se a variável de sistema [`sql_notes`](server-system-variables.html#sysvar_sql_notes) for definida como 0, notes não são armazenadas e não incrementam [`warning_count`](server-system-variables.html#sysvar_warning_count).

Exemplo: Se [`max_error_count`](server-system-variables.html#sysvar_max_error_count) for 10, a Diagnostics Area pode conter um máximo de 10 condition areas. Suponha que uma declaração gere 20 conditions, 12 das quais são errors. Neste caso, a Diagnostics Area contém as primeiras 10 conditions, `NUMBER` é 10, [`warning_count`](server-system-variables.html#sysvar_warning_count) é 20, e [`error_count`](server-system-variables.html#sysvar_error_count) é 12.

Alterações no valor de [`max_error_count`](server-system-variables.html#sysvar_max_error_count) não têm efeito até a próxima tentativa de modificar a Diagnostics Area. Se a Diagnostics Area contém 10 condition areas e [`max_error_count`](server-system-variables.html#sysvar_max_error_count) for definido como 5, isso não terá efeito imediato no tamanho ou conteúdo da Diagnostics Area.