#### 7.4.2.6 Filtragem do Log de Erros Baseada em Regras (log_filter_dragnet)

O componente de filtro de log `log_filter_dragnet` permite a filtragem de logs com base em regras definidas pelo usuário.

Para habilitar o filtro `log_filter_dragnet`, carregue primeiro o componente de filtro e, em seguida, modifique o valor de `log_error_services`. O exemplo a seguir habilita `log_filter_dragnet` em combinação com o sink de log integrado:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

Para definir que o `log_error_services` entre em vigor na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erros”. Essas instruções também se aplicam a outras variáveis de sistema de registro de erros.

Com `log_filter_dragnet` habilitado, defina suas regras de filtro definindo a variável de sistema `dragnet.log_error_filter_rules`. Um conjunto de regras consiste em zero ou mais regras, onde cada regra é uma declaração `IF` terminada por um caractere ponto (`.`). Se o valor da variável estiver vazio (zero regras), nenhum filtro ocorrerá.

Exemplo 1. Este conjunto de regras exclui eventos de informações e, para outros eventos, remove o campo `source_line`:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

O efeito é semelhante ao da filtragem realizada pelo filtro `log_sink_internal` com uma configuração de `log_error_verbosity=2`.

Para melhor legibilidade, você pode preferir listar as regras em linhas separadas. Por exemplo:

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Exemplo 2: Este conjunto de regras limita os eventos de informações a não mais de um a cada 60 segundos:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Uma vez que a configuração de filtragem esteja configurada conforme desejado, considere atribuir `dragnet.log_error_filter_rules` usando `SET PERSIST` em vez de `SET GLOBAL` para que a configuração permaneça válida após reinicializações do servidor. Alternativamente, adicione a configuração ao arquivo de opções do servidor.

Ao usar `log_filter_dragnet`, o `log_error_suppression_list` é ignorado.

Para parar de usar o idioma de filtragem, primeiro remova-o do conjunto de componentes de registro de erros. Geralmente, isso significa usar um componente de filtro diferente, em vez de nenhum componente de filtro. Por exemplo:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Novamente, considere usar `SET PERSIST` em vez de `SET GLOBAL` para que a configuração persista após reinicializações do servidor.

Em seguida, desinstale o componente de filtro `log_filter_dragnet`:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

As seções a seguir descrevem aspectos da operação do `log_filter_dragnet` com mais detalhes:

* Gramática para a Linguagem de Regras do Filtro log_filter_dragnet
* Ações para as Regras do log_filter_dragnet
* Referências de Campo nas Regras do log_filter_dragnet

##### Gramática para a Linguagem de Regras do Filtro log_filter_dragnet

A seguinte gramática define a linguagem para as regras de filtro `log_filter_dragnet`. Cada regra é uma declaração `IF` terminada por um caractere ponto (`.`). A linguagem não é case-sensitive.

```
rule:
    IF condition THEN action
    [ELSEIF condition THEN action] ...
    [ELSE action]
    .

condition: {
    field comparator value
  | [NOT] EXISTS field
  | condition {AND | OR}  condition
}

action: {
    drop
  | throttle {count | count / window_size}
  | set field [:= | =] value
  | unset [field]
}

field: {
    core_field
  | optional_field
  | user_defined_field
}

core_field: {
    time
  | msg
  | prio
  | err_code
  | err_symbol
  | SQL_state
  | subsystem
}

optional_field: {
    OS_errno
  | OS_errmsg
  | label
  | user
  | host
  | thread
  | query_id
  | source_file
  | source_line
  | function
  | component
}

user_defined_field:
    sequence of characters in [a-zA-Z0-9_] class

comparator: {== | != | <> | >= | => | <= | =< | < | >}

value: {
    string_literal
  | integer_literal
  | float_literal
  | error_symbol
  | priority
}

count: integer_literal
window_size: integer_literal

string_literal:
    sequence of characters quoted as '...' or "..."

integer_literal:
    sequence of characters in [0-9] class

float_literal:
    integer_literal[.integer_literal]

error_symbol:
    valid MySQL error symbol such as ER_ACCESS_DENIED_ERROR or ER_STARTUP

priority: {
    ERROR
  | WARNING
  | INFORMATION
}
```

Condições simples comparam um campo a um valor ou testam a existência de um campo. Para construir condições mais complexas, use os operadores `AND` e `OR`. Ambos os operadores têm a mesma precedência e são avaliados da esquerda para a direita.

Para escapar um caractere dentro de uma string, anteceda-o com uma barra invertida (`\`). Uma barra invertida é necessária para incluir a barra invertida em si ou o caractere de citação de string, opcional para outros caracteres.

Para conveniência, o `log_filter_dragnet` suporta nomes simbólicos para comparações a certos campos. Para legibilidade e portabilidade, os valores simbólicos são preferíveis (onde aplicável) aos valores numéricos.

* Os valores de prioridade de evento 1, 2 e 3 podem ser especificados como `ERROR`, `WARNING` e `INFORMATION`. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

* Os códigos de erro podem ser especificados na forma numérica ou como o símbolo de erro correspondente. Por exemplo, `ER_STARTUP` é o nome simbólico para o erro `1408`, então essas comparações são equivalentes:

  ```
  IF err_code == ER_STARTUP THEN ...
  IF err_code == 1408 THEN ...
  ```

  Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário.

  Para encontrar o símbolo de erro correspondente a um número de código de erro específico, use um desses métodos:

  + Verifique a lista de erros do servidor na Referência de Mensagem de Erro do Servidor.

  + Use o comando **perror**. Dado um argumento de número de erro, o **perror** exibe informações sobre o erro, incluindo seu símbolo.

  Suponha que um conjunto de regras com números de erro pareça assim:

  ```
  IF err_code == 10927 OR err_code == 10914 THEN drop.
  IF err_code == 1131 THEN drop.
  ```

  Usando **perror**, determine os símbolos de erro:

  ```
  $> perror 10927 10914 1131
  MySQL error code MY-010927 (ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED):
  Access denied for user '%-.48s'@'%-.64s'. Account is locked.
  MySQL error code MY-010914 (ER_ABORTING_USER_CONNECTION):
  Aborted connection %u to db: '%-.192s' user: '%-.48s' host:
  '%-.64s' (%-.64s).
  MySQL error code MY-001131 (ER_PASSWORD_ANONYMOUS_USER):
  You are using MySQL as an anonymous user and anonymous users
  are not allowed to change passwords
  ```

  Substituindo os símbolos de erro pelos números, o conjunto de regras se torna:

  ```
  IF err_code == ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED
    OR err_code == ER_ABORTING_USER_CONNECTION THEN drop.
  IF err_code == ER_PASSWORD_ANONYMOUS_USER THEN drop.
  ```

  Nomes simbólicos podem ser especificados como strings citadas para comparação com campos de string, mas, nesse caso, os nomes são strings que não têm significado especial e `log_filter_dragnet` não os resolve para o valor numérico correspondente. Além disso, erros podem passar despercebidos, enquanto um erro ocorre imediatamente na instrução `SET` para tentativas de usar um símbolo não citado desconhecido pelo servidor.

##### Ações para regras de log_filter_dragnet

`log_filter_dragnet` suporta essas ações em regras de filtro:

* `drop`: Armazene o evento de log atual (não o registre).

* `throttle`: Aplicar limitação de taxa para reduzir a verbosidade do log para eventos que correspondem a condições específicas. O argumento indica uma taxa, na forma *`count`* ou *`count`*/*`window_size`*. O valor *`count`* indica o número permitido de ocorrências de eventos para serem registrados por janela de tempo. O valor *`window_size`* é a janela de tempo em segundos; se omitido, a janela padrão é de 60 segundos. Ambos os valores devem ser literais inteiros.

Esta regra limita as mensagens de `plugin-shutdown` a 5 ocorrências por 60 segundos:

```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

Esta regra limita erros e avisos a 1000 ocorrências por hora e mensagens de informação a 100 ocorrências por hora:

```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```

* `set`: Atribuir um valor a um campo (e fazer com que o campo exista se ele não existisse já). Em regras subsequentes, as verificações `EXISTS` contra o nome do campo são verdadeiras, e o novo valor pode ser testado por condições de comparação.

* `unset`: Descartar um campo. Em regras subsequentes, as verificações `EXISTS` contra o nome do campo são falsas, e as comparações do campo com qualquer valor são falsas.

No caso especial de que a condição se refere exatamente a um nome de campo, o nome do campo após `unset` é opcional e `unset` descarta o campo nomeado. Essas regras são equivalentes:

```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Referências de Campo nas regras log_filter_dragnet

As regras `log_filter_dragnet` suportam referências a campos principais, opcionais e definidos pelo usuário em eventos de erro.

* Referências de Campo Principal
* Referências de Campo Opcional
* Referências de Campo Definido pelo Usuário

###### Referências de Campo Principal
```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

A gramática `log_filter_dragnet` na Linguagem de Regras para o Idioma de Regras log_filter_dragnet nomeia os campos principais que as regras de filtragem reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de Evento de Erro”, com os quais você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos principais usadas dentro das regras `log_filter_dragnet`.

* `prio`

  A prioridade do evento, para indicar um evento de erro, aviso ou nota/informação. Em comparações, cada prioridade pode ser especificada como um nome de prioridade simbólico ou um literal numérico. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio > WARNING THEN drop.
  ```

  A tabela a seguir mostra os níveis de prioridade permitidos.

  <table summary="Níveis de prioridade de eventos de erro."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Tipo de Evento</th> <th>Símbolo de Prioridade</th> <th>Prioridade Numérica</th> </tr></thead><tbody><tr> <th align="left">Evento de Erro</th> <td><code>ERROR</code></td> <td>1</td> </tr><tr> <th align="left">Evento de Aviso</th> <td><code>WARNING</code></td> <td>2</td> </tr><tr> <th align="left">Evento de Nota/Informação</th> <td><code>INFORMATION</code></td> <td>3</td> </tr></tbody></table>

  Há também uma prioridade de mensagem de `SYSTEM`, mas mensagens de sistema não podem ser filtradas e são sempre escritas no log de erro.

Os valores de prioridade seguem o princípio de que valores de prioridade mais altos têm valores menores, e vice-versa. Os valores de prioridade começam em 1 para os eventos mais graves (erros) e aumentam para eventos com prioridade decrescente. Por exemplo, para descartar eventos com prioridade menor que avisos, teste valores de prioridade maiores que `AVISO`:

```
    IF prio > ERROR THEN drop.
    ```

Os seguintes exemplos mostram as regras do `log_filter_dragnet` para obter um efeito semelhante a cada valor `log_error_verbosity` permitido pelo filtro `log_filter_internal`:

+ Erros apenas (`log_error_verbosity=1`):

```
    IF prio > WARNING THEN drop.
    ```

+ Erros e avisos (`log_error_verbosity=2`):

```
    IF prio > INFORMATION THEN drop.
    ```

+ Erros, avisos e notas (`log_error_verbosity=3`):

```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```

Essa regra pode ser omitida porque não há valores `prio` maiores que `INFORMACAO`, então, efetivamente, não descarta nada.

* `err_code`

  O código numérico do erro do evento. Em comparações, o valor a ser testado pode ser especificado como um nome de erro simbólico ou um literal inteiro. Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário. Essas comparações são equivalentes:

```
  IF source_file == "distance.cc" THEN ...
  ```

* `err_symbol`

  O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`. Os valores de `err_symbol` são mais para identificar linhas específicas na saída do log do que para uso em comparações de regras de filtro, porque o `log_filter_dragnet` não resolve valores de comparação especificados como strings para o código numérico de erro equivalente. (Para que isso ocorra, um erro deve ser especificado usando seu símbolo não citado.)

###### Referências de Campo Opcionais


A gramática `log_filter_dragnet` na Linguagem de Regras para o Idioma de Regras `log_filter_dragnet` nomeia os campos opcionais que as regras de filtro reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de Evento de Erro”, com os quais você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos opcionais, conforme usados nas regras `log_filter_dragnet`.

* `label`

  O rótulo correspondente ao valor `prio`, como uma string. As regras de filtro podem alterar o rótulo para os sinks de log que suportam rótulos personalizados. Os valores de `label` são destinados mais para identificar linhas específicas na saída do log do que para uso em comparações de regras de filtro, porque o `log_filter_dragnet` não resolve valores de comparação especificados como strings para a prioridade numérica equivalente.

* `source_file`

  O arquivo de origem no qual o evento ocorreu, sem nenhum caminho inicial. Por exemplo, para testar o arquivo `sql/gis/distance.cc`, escreva a comparação assim:

  

###### Referências de Campo Definidas pelo Usuário

Qualquer nome de campo em uma regra de filtro `log_filter_dragnet` que não seja reconhecido como um nome de campo central ou opcional é considerado uma referência a um campo definido pelo usuário.