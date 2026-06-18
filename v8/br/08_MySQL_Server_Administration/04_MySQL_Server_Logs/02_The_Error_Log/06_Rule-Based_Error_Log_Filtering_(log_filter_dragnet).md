#### 7.4.2.6 Filtro do Diário de Erros Baseado em Regras (log\_filter\_dragnet)

O componente de filtro de log `log_filter_dragnet` permite o filtro de log com base em regras definidas pelo usuário.

Para habilitar o filtro `log_filter_dragnet`, carregue primeiro o componente do filtro e, em seguida, modifique o valor `log_error_services`. O exemplo a seguir habilita `log_filter_dragnet` em combinação com o canal de registro integrado:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

Para definir que o `log_error_services` entre em vigor ao iniciar o servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erros”. Essas instruções também se aplicam a outras variáveis do sistema de registro de erros.

Com o `log_filter_dragnet` habilitado, defina suas regras de filtro definindo a variável de sistema `dragnet.log_error_filter_rules`. Um conjunto de regras consiste em zero ou mais regras, onde cada regra é uma declaração `IF` terminada por um caractere de ponto (`.`). Se o valor da variável estiver vazio (zero regras), não ocorrerá filtragem.

Exemplo 1. Este conjunto de regras exclui eventos de informação e, para outros eventos, remove o campo `source_line`:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

O efeito é semelhante ao da filtragem realizada pelo filtro `log_sink_internal` com uma configuração de `log_error_verbosity=2`.

Para melhorar a legibilidade, você pode preferir listar as regras em linhas separadas. Por exemplo:

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Exemplo 2: Esta regra limita os eventos de informação a não mais de um a cada 60 segundos:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Depois de configurar a configuração de filtragem conforme desejar, considere atribuir `dragnet.log_error_filter_rules` usando `SET PERSIST` em vez de `SET GLOBAL` para que a configuração persista após reinicializações do servidor. Alternativamente, adicione a configuração ao arquivo de opções do servidor.

Ao usar `log_filter_dragnet`, `log_error_suppression_list` é ignorado.

Para parar de usar o idioma de filtro, primeiro remova-o do conjunto de componentes de registro de erros. Normalmente, isso significa usar um componente de filtro diferente, em vez de nenhum componente de filtro. Por exemplo:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Novamente, considere usar `SET PERSIST` em vez de `SET GLOBAL` para que o ajuste persista após reinicializações do servidor.

Em seguida, desinstale o componente do filtro `log_filter_dragnet`:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

As seções a seguir descrevem aspectos da operação do `log_filter_dragnet` com mais detalhes:

- Gramática para a linguagem de regras log\_filter\_dragnet
- Ações para regras log\_filter\_dragnet
- Referências de campo nos Regras log\_filter\_dragnet

##### Gramática para a linguagem de regras log\_filter\_dragnet

A seguinte gramática define a linguagem para as regras de filtro `log_filter_dragnet`. Cada regra é uma declaração `IF` terminada por um caractere de ponto (`.`). A linguagem não é case-sensitive.

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

Para escapar uma caractere dentro de uma string, anteceda-o com uma barra invertida (`\`). Uma barra invertida é necessária para incluir a própria barra invertida ou o caractere de citação de string, opcional para outros caracteres.

Para conveniência, o `log_filter_dragnet` suporta nomes simbólicos para comparações a certos campos. Para melhor legibilidade e portabilidade, os valores simbólicos são preferíveis (quando aplicável) aos valores numéricos.

- Os valores de prioridade de evento 1, 2 e 3 podem ser especificados como `ERROR`, `WARNING` e `INFORMATION`. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

- Os códigos de erro podem ser especificados em forma numérica ou como o símbolo de erro correspondente. Por exemplo, `ER_STARTUP` é o nome simbólico para o erro `1408`, então essas comparações são equivalentes:

  ```
  IF err_code == ER_STARTUP THEN ...
  IF err_code == 1408 THEN ...
  ```

  Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário.

  Para encontrar o símbolo de erro correspondente a um número de código de erro específico, use um desses métodos:

  - Consulte a lista de erros do servidor na Referência de Mensagem de Erro do Servidor.

  - Use o comando **perror**. Dado um argumento de número de erro, o **perror** exibe informações sobre o erro, incluindo seu símbolo.

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

Os nomes simbólicos podem ser especificados como cadeias de caracteres entre aspas para comparação com campos de cadeia, mas, nesses casos, os nomes são cadeias de caracteres que não têm significado especial e `log_filter_dragnet` não os resolve para o valor numérico correspondente. Além disso, erros de digitação podem passar despercebidos, enquanto um erro ocorre imediatamente em `SET` para tentativas de usar um símbolo não citado desconhecido pelo servidor.

##### Ações para regras log\_filter\_dragnet

`log_filter_dragnet` suporta essas ações nas regras de filtro:

- `drop`: Desmarque o evento de registro atual (não registre).

- `throttle`: Aplicar limitação de taxa para reduzir a verbosidade do log para eventos que correspondem a condições específicas. O argumento indica uma taxa, na forma `count` ou `count`/`window_size`. O valor `count` indica o número permitido de ocorrências de eventos para serem registrados por janela de tempo. O valor `window_size` é a janela de tempo em segundos; se omitido, a janela padrão é de 60 segundos. Ambos os valores devem ser literais inteiros.

  Essa regra limita as mensagens de desligamento de plugins para 5 ocorrências a cada 60 segundos:

  ```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

  Essa regra limita erros e avisos para 1000 ocorrências por hora e mensagens de informação para 100 ocorrências por hora:

  ```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```

- `set`: Atribua um valor a um campo (e faça com que o campo exista, se ainda não existisse). Em regras subsequentes, os testes `EXISTS` contra o nome do campo são verdadeiros, e o novo valor pode ser testado por condições de comparação.

- `unset`: Descarte um campo. Nas regras subsequentes, os testes `EXISTS` contra o nome do campo são falsos e as comparações do campo contra qualquer valor são falsas.

  No caso especial em que a condição se refere exatamente a um nome de campo, o nome do campo que vem após `unset` é opcional e `unset` descarta o campo nomeado. Essas regras são equivalentes:

  ```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Referências de campo nos Regras log\_filter\_dragnet

As regras do `log_filter_dragnet` suportam referências a campos principais, opcionais e definidos pelo usuário em eventos de erro.

- Referências de Campo Principal
- Referências de campos opcionais
- Referências de campos definidos pelo usuário

###### Referências de Campo Principal

A gramática `log_filter_dragnet` na Linguagem de Regras para o Idioma do Filtro log\_filter\_dragnet nomeia os campos principais que as regras de filtragem reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de Eventos de Erro”, com os quais você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos principais usadas nas regras `log_filter_dragnet`.

- `prio`

  A prioridade do evento, para indicar um erro, aviso ou nota/informação. Em comparações, cada prioridade pode ser especificada como um nome simbólico de prioridade ou um literal inteiro. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

  A tabela a seguir mostra os níveis de prioridade permitidos.

  <table summary="Níveis de prioridade de eventos de erro."><thead><tr> <th scope="col">Tipo de evento</th> <th scope="col">Símbolo de Prioridade</th> <th scope="col">Prioridade Numérica</th> </tr></thead><tbody><tr> <th align="left">Evento de erro</th> <td>[[<code>ERROR</code>]]</td> <td>1</td> </tr><tr> <th align="left">Evento de alerta</th> <td>[[<code>WARNING</code>]]</td> <td>2</td> </tr><tr> <th align="left">Nota/evento de informação</th> <td>[[<code>INFORMATION</code>]]</td> <td>3</td> </tr></tbody></table>

  Há também uma prioridade de mensagem de `SYSTEM`, mas as mensagens do sistema não podem ser filtradas e são sempre escritas no log de erro.

  Os valores de prioridade seguem o princípio de que valores mais altos indicam prioridades mais baixas e vice-versa. Os valores de prioridade começam em 1 para os eventos mais graves (erros) e aumentam para eventos com prioridade decrescente. Por exemplo, para descartar eventos com prioridade menor que avisos, teste valores de prioridade maiores que `WARNING`:

  ```
  IF prio > WARNING THEN drop.
  ```

  Os exemplos a seguir mostram as regras `log_filter_dragnet` para obter um efeito semelhante a cada valor `log_error_verbosity` permitido pelo filtro `log_filter_internal`:

  - Erros apenas (`log_error_verbosity=1`):

    ```
    IF prio > ERROR THEN drop.
    ```

  - Erros e avisos (`log_error_verbosity=2`):

    ```
    IF prio > WARNING THEN drop.
    ```

  - Erros, avisos e notas (`log_error_verbosity=3`):

    ```
    IF prio > INFORMATION THEN drop.
    ```

    Essa regra pode ser omitida porque não há valores `prio` maiores que `INFORMATION`, então, na prática, ela não exclui nada.

- `err_code`

  O código de erro numérico do evento. Nas comparações, o valor a ser testado pode ser especificado como um nome de erro simbólico ou um literal inteiro. Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário. Essas comparações são equivalentes:

  ```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```

- `err_symbol`

  O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`). Os valores `err_symbol` são mais destinados a identificar linhas específicas na saída do log do que para serem usados em comparações de regras de filtro, pois `log_filter_dragnet` não resolve valores de comparação especificados como strings para o código de erro numérico equivalente. (Para que isso ocorra, um erro deve ser especificado usando seu símbolo não citado.)

###### Referências de campos opcionais

A gramática `log_filter_dragnet` na Linguagem de Regras para o Idioma do Filtro log\_filter\_dragnet nomeia os campos opcionais que as regras de filtro reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de Eventos de Erro”, com os quais você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos opcionais usadas nas regras `log_filter_dragnet`.

- `label`

  O rótulo correspondente ao valor `prio`, como uma string. As regras de filtro podem alterar o rótulo para os pontos de saída de log que suportam rótulos personalizados. Os valores `label` são mais destinados a identificar linhas específicas na saída do log do que para serem usados em comparações de regras de filtro, pois `log_filter_dragnet` não resolve valores de comparação especificados como strings para a prioridade numérica equivalente.

- `source_file`

  O arquivo fonte no qual o evento ocorreu, sem nenhum caminho inicial. Por exemplo, para testar o arquivo `sql/gis/distance.cc`, escreva a comparação da seguinte forma:

  ```
  IF source_file == "distance.cc" THEN ...
  ```

###### Referências de campos definidos pelo usuário

Qualquer nome de campo em uma regra de filtro `log_filter_dragnet` que não seja reconhecido como um nome de campo principal ou opcional é considerado um campo definido pelo usuário.
