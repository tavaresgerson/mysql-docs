#### 15.6.7.7 Área de Diagnóstico do MySQL

As instruções SQL produzem informações de diagnóstico que preenchem a área de diagnóstico. O SQL padrão tem uma pilha de área de diagnóstico, contendo uma área de diagnóstico para cada contexto de execução aninhado. O SQL padrão também suporta a sintaxe `GET STACKED DIAGNOSTICS` para referenciar a segunda área de diagnóstico durante a execução do manipulador de condições.

A discussão a seguir descreve a estrutura da área de diagnóstico no MySQL, os itens de informações reconhecidos pelo MySQL, como as instruções limpam e definem a área de diagnóstico e como as áreas de diagnóstico são empilhadas e desempilhadas da pilha.

* Estrutura da Área de Diagnóstico
* Itens de Informações da Área de Diagnóstico
* Como a Área de Diagnóstico é Limpada e Preenchida
* Como a Pilha da Área de Diagnóstico Funciona
* Variáveis de Sistema Relacionadas à Área de Diagnóstico

##### Estrutura da Área de Diagnóstico

A área de diagnóstico contém dois tipos de informações:

* Informações da instrução, como o número de condições que ocorreram ou o número de linhas afetadas.

* Informações da condição, como o código de erro e a mensagem. Se uma instrução gerar várias condições, essa parte da área de diagnóstico tem uma área de condição para cada uma. Se uma instrução não gerar condições, essa parte da área de diagnóstico está vazia.

Para uma instrução que gera três condições, a área de diagnóstico contém informações de instrução e condição como esta:

```
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

##### Itens de Informações da Área de Diagnóstico

A área de diagnóstico contém itens de informações de instrução e condição. Os itens numéricos são inteiros. O conjunto de caracteres para os itens de caracteres é UTF-8. Nenhum item pode ser `NULL`. Se uma instrução ou item de condição não for definido por uma instrução que preenche a área de diagnóstico, seu valor é 0 ou a string vazia, dependendo do tipo de dados do item.

A parte de informações de condição da área de diagnóstico contém os seguintes itens:

* `NUMBER`: Um inteiro que indica o número de áreas de condição que possuem informações.

* `ROW_COUNT`: Um inteiro que indica o número de linhas afetadas pela condição. `ROW_COUNT` tem o mesmo valor que a função `ROW_COUNT()` (consulte a Seção 14.15, “Funções de Informação”).

A parte de informações de condição da área de diagnóstico contém uma área de condição para cada condição. As áreas de condição são numeradas de 1 até o valor do item de condição da declaração `NUMBER`. Se `NUMBER` for 0, não há áreas de condição.

Cada área de condição contém os itens da lista a seguir. Todos os itens são padrão SQL, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. As definições se aplicam a condições geradas, exceto por um sinal (ou seja, por uma declaração `SIGNAL` ou `RESIGNAL`). Para condições não sinal, o MySQL preenche apenas os itens de condição que não são descritos como sempre vazios. Os efeitos dos sinais na área de condição são descritos mais adiante.

* `CLASS_ORIGIN`: Uma string que contém a classe do valor `RETURNED_SQLSTATE`. Se o valor `RETURNED_SQLSTATE` começar com um valor de classe definido no documento de padrões SQL ISO 9075-2 (seção 24.1, SQLSTATE), `CLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `CLASS_ORIGIN` é `'MySQL'`.

* `SUBCLASS_ORIGIN`: Uma string que contém a subclasse do valor `RETURNED_SQLSTATE`. Se `CLASS_ORIGIN` for `'ISO 9075'` ou `RETURNED_SQLSTATE` terminar com `'000'`, `SUBCLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `SUBCLASS_ORIGIN` é `'MySQL'`.

* `RETURNED_SQLSTATE`: Uma string que indica o valor `SQLSTATE` para a condição.

* `MESSAGE_TEXT`: Uma string que indica o texto do erro para a condição.

* `MYSQL_ERRNO`: Um inteiro que indica o código de erro MySQL para a condição.

* `CONSTRAINT_CATALOG`, `CONSTRAINT_SCHEMA`, `CONSTRAINT_NAME`: Strings que indicam o catálogo, o esquema e o nome de uma restrição violada. Eles são sempre vazios.

* `CATALOG_NAME`, `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Strings que indicam o catálogo, o esquema, a tabela e a coluna relacionadas à condição. Eles são sempre vazios.

* `CURSOR_NAME`: Uma string que indica o nome do cursor. Isso é sempre vazio.

Para os valores `RETURNED_SQLSTATE`, `MESSAGE_TEXT` e `MYSQL_ERRNO` para erros específicos, consulte a Referência de Mensagem de Erro do Servidor.

Se uma instrução `SIGNAL` (ou `RESIGNAL`) preencher a área de diagnóstico, sua cláusula `SET` pode atribuir a qualquer item de informação de condição, exceto `RETURNED_SQLSTATE`, qualquer valor que seja legal para o tipo de dados do item. O `SIGNAL` também define o valor `RETURNED_SQLSTATE`, mas não diretamente em sua cláusula `SET`. Esse valor vem do argumento `SQLSTATE` da instrução `SIGNAL`.

O `SIGNAL` também define itens de informações de instruções. Ele define `NUMBER` para 1. Ele define `ROW_COUNT` para −1 para erros e 0 de outra forma.

##### Como a Área de Diagnóstico é Limpada e Preenchida

Instruções SQL não diagnósticas preenchem a área de diagnóstico automaticamente, e seu conteúdo pode ser definido explicitamente com as instruções `SIGNAL` e `RESIGNAL`. A área de diagnóstico pode ser examinada com `GET DIAGNOSTICS` para extrair itens específicos, ou com `SHOW WARNINGS` ou `SHOW ERRORS` para ver condições ou erros.

Instruções SQL limpam e definem a área de diagnóstico da seguinte forma:

* Quando o servidor começa a executar uma instrução após analisá-la, ele limpa a área de diagnóstico para instruções não diagnósticas. Instruções diagnósticas não limpam a área de diagnóstico. Essas instruções são diagnósticas:

+ `OBTER DIAGNÓSTICOS`
+ `EXIBIR ERROS`
+ `EXIBIR ATENÇÕES`
* Se uma instrução gerar uma condição, a área de diagnósticos é limpa das condições que pertencem a instruções anteriores. A exceção é que as condições geradas por `OBTER DIAGNÓSTICOS` e `RESIGNAL` são adicionadas à área de diagnósticos sem serem limpas.

Assim, mesmo uma instrução que normalmente não limpa a área de diagnósticos ao começar a ser executada a limpa a área se a instrução gerar uma condição.

O exemplo a seguir mostra o efeito de várias instruções na área de diagnósticos, usando `EXIBIR ATENÇÕES` para exibir informações sobre as condições armazenadas lá.

Esta instrução `DROP TABLE` limpa a área de diagnósticos e a preenche quando a condição ocorre:

```
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

Esta instrução `SET` gera um erro, então ela limpa e preenche a área de diagnósticos:

```
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

A instrução `SET` anterior produziu uma única condição, então 1 é o único número de condição válido para `OBTER DIAGNÓSTICOS` neste ponto. A instrução seguinte usa um número de condição de 2, o que gera uma alerta que é adicionado à área de diagnósticos sem ser limpa:

```
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

Agora há duas condições na área de diagnósticos, então a mesma instrução `OBTER DIAGNÓSTICOS` tem sucesso:

```
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

##### Como a Pilha de Áreas de Diagnósticos Funciona

Quando ocorre um empurrão para a pilha de áreas de diagnósticos, a primeira (atual) área de diagnósticos se torna a segunda (em pilha) área de diagnósticos e uma nova área de diagnósticos atual é criada como uma cópia dela. As áreas de diagnósticos são empurradas para e tiradas da pilha nas seguintes circunstâncias:

* Execução de um programa armazenado

Uma empurrão ocorre antes que o programa seja executado e uma empurrada ocorre depois. Se o programa armazenado terminar enquanto os manipuladores estão executando, pode haver mais de uma área de diagnóstico para ser empurrada; isso ocorre devido a uma exceção para a qual não há manipuladores apropriados ou devido ao `RETURN` no manipulador.

Eventuais condições de aviso ou erro nas áreas de diagnóstico empurradas são então adicionadas à área de diagnóstico atual, exceto que, para gatilhos, apenas erros são adicionados. Quando o programa armazenado termina, o chamador vê essas condições em sua área de diagnóstico atual.

* Execução de um manipulador de condição dentro de um programa armazenado

Quando ocorre uma empurrada como resultado da ativação do manipulador de condição, a área de diagnóstico empilhada é a área que estava atual dentro do programa armazenado antes da empurrada. A nova área de diagnóstico atual é a área de diagnóstico atual do manipulador. `GET [CURRENT] DIAGNOSTICS` e `GET STACKED DIAGNOSTICS` podem ser usados dentro do manipulador para acessar o conteúdo das áreas de diagnóstico atual (manipulador) e empilhada (programa armazenado). Inicialmente, eles retornam o mesmo resultado, mas as instruções que executam dentro do manipulador modificam a área de diagnóstico atual, limpando e definindo seu conteúdo de acordo com as regras normais (veja Como a Área de Diagnóstico é Limpada e Populada). A área de diagnóstico empilhada não pode ser modificada por instruções que executam dentro do manipulador, exceto `RESIGNAL`.

Se o manipulador for executado com sucesso, a área de diagnóstico atual (manipulador) é empurrada e a área de diagnóstico empilhada (programa armazenado) novamente se torna a área de diagnóstico atual. As condições adicionadas à área de diagnóstico do manipulador durante a execução do manipulador são adicionadas à área de diagnóstico atual.

* Execução de `RESIGNAL`

A declaração `RESIGNAL` transmite as informações da condição de erro disponíveis durante a execução de um manipulador de condição dentro de uma instrução composta dentro de um programa armazenado. `RESIGNAL` pode alterar algumas ou todas as informações antes de transmiti-las, modificando a pilha de diagnóstico conforme descrito na Seção 15.6.7.4, “Declaração RESIGNAL”.

##### Variáveis de Sistema Relacionadas à Área de Diagnóstico

Algumas variáveis de sistema controlam ou estão relacionadas a alguns aspectos da área de diagnóstico:

* `max_error_count` controla o número de áreas de condição na área de diagnóstico. Se ocorrerem mais condições do que esse número, o MySQL descarta silenciosamente as informações para as condições em excesso. (Condições adicionadas por `RESIGNAL` são sempre adicionadas, com condições mais antigas sendo descartadas conforme necessário para fazer espaço.)

* `warning_count` indica o número de condições que ocorreram. Isso inclui erros, avisos e notas. Normalmente, `NUMBER` e `warning_count` são os mesmos. No entanto, à medida que o número de condições geradas excede `max_error_count`, o valor de `warning_count` continua a aumentar enquanto `NUMBER` permanece limitado a `max_error_count` porque nenhuma condição adicional é armazenada na área de diagnóstico.

* `error_count` indica o número de erros que ocorreram. Esse valor inclui condições de “não encontrado” e exceções, mas exclui avisos e notas. Como `warning_count`, seu valor pode exceder `max_error_count`.

* Se a variável de sistema `sql_notes` for definida como 0, as notas não são armazenadas e não aumentam `warning_count`.

Exemplo: Se `max_error_count` for 10, a área de diagnóstico pode conter um máximo de 10 áreas de condição. Suponha que uma declaração gere 20 condições, das quais 12 são erros. Nesse caso, a área de diagnóstico contém as primeiras 10 condições, `NUMBER` é 10, `warning_count` é 20 e `error_count` é 12.

Alterações no valor de `max_error_count` não têm efeito até a próxima tentativa de modificar a área de diagnóstico. Se a área de diagnóstico contiver 10 áreas de condição e `max_error_count` for definido para 5, isso não tem efeito imediato no tamanho ou conteúdo da área de diagnóstico.