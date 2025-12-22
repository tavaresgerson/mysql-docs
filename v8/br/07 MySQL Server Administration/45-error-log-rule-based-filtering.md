#### 7.4.2.6 Filtragem do registo de erros baseada em regras (log\_filter\_dragnet)

O componente de filtro de log `log_filter_dragnet` permite a filtragem de log com base em regras definidas pelo usuário.

Para habilitar o filtro `log_filter_dragnet`, primeiro carregue o componente do filtro e, em seguida, modifique o valor `log_error_services`. O exemplo a seguir habilita `log_filter_dragnet` em combinação com o sumidouro de registro embutido:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

Para configurar o `log_error_services` para ter efeito na inicialização do servidor, use as instruções na Seção 7.4.2.1, Configuração do Registro de Erros. Estas instruções também se aplicam a outras variáveis do sistema de registro de erros.

Com `log_filter_dragnet` habilitado, defina suas regras de filtro definindo a variável de sistema `dragnet.log_error_filter_rules`. Um conjunto de regras consiste em zero ou mais regras, onde cada regra é uma instrução `IF` terminada por um caráter de ponto (`.`). Se o valor da variável for vazio (regras zero), nenhuma filtragem ocorre.

Exemplo 1. Este conjunto de regras elimina eventos de informação e, para outros eventos, remove o campo `source_line`:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

O efeito é semelhante à filtragem realizada pelo filtro `log_sink_internal` com uma configuração de `log_error_verbosity=2`.

Para facilitar a leitura, pode ser preferível enumerar as regras em linhas separadas.

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Exemplo 2: Esta regra limita os eventos de informação a não mais de um por cada 60 segundos:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Uma vez que você tenha a configuração de filtragem configurada como deseja, considere atribuir `dragnet.log_error_filter_rules` usando `SET PERSIST` em vez de `SET GLOBAL` para fazer a configuração persistir em reinicializações de servidor. Alternativamente, adicione a configuração ao arquivo de opções do servidor.

Ao usar `log_filter_dragnet`, `log_error_suppression_list` é ignorado.

Para parar de usar a linguagem de filtragem, primeiro remova-a do conjunto de componentes de registro de erros. Normalmente isso significa usar um componente de filtro diferente em vez de nenhum componente de filtro. Por exemplo:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Mais uma vez, considere usar `SET PERSIST` em vez de `SET GLOBAL` para fazer a configuração persistir nas reinicializações do servidor.

Em seguida, desinstale o componente de filtro `log_filter_dragnet`:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

As seções a seguir descrevem aspectos da operação \[`log_filter_dragnet`] com mais detalhes:

- Gramática para a linguagem de regra log\_filter\_dragnet
- Ações para Regras de log\_filter\_dragnet
- Referências de campo nas regras de filtragem log\_filter\_dragnet

##### Gramática para a linguagem de regra log\_filter\_dragnet

A gramática a seguir define a linguagem para as regras de filtro PH. Cada regra é uma instrução PH terminada por um caráter ponto. A linguagem não é sensível a maiúsculas e minúsculas.

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

Condições simples comparam um campo com uma existência de valor ou campo de teste. Para construir condições mais complexas, use os operadores `AND` e `OR`. Ambos os operadores têm a mesma precedência e são avaliados da esquerda para a direita.

Para escapar de um caractere dentro de uma string, precede-o por um backslash (`\`). Um backslash é necessário para incluir o próprio backslash ou o caractere de citação de string, opcional para outros caracteres.

Para conveniência, o `log_filter_dragnet` suporta nomes simbólicos para comparações com certos campos. Para legibilidade e portabilidade, os valores simbólicos são preferíveis (quando aplicável) aos valores numéricos.

- Os valores de prioridade de evento 1, 2 e 3 podem ser especificados como `ERROR`, `WARNING`, e `INFORMATION`.

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

  Para encontrar o símbolo de erro correspondente a um determinado número de código de erro, utilizar um dos seguintes métodos:

  - Verifique a lista de erros do servidor em Server Error Message Reference.
  - Use o comando **perror**. Dado um argumento de número de erro, **perror** exibe informações sobre o erro, incluindo seu símbolo.

  Suponha que um conjunto de regras com números de erro se pareça com isto:

  ```
  IF err_code == 10927 OR err_code == 10914 THEN drop.
  IF err_code == 1131 THEN drop.
  ```

  Utilizando **perror**, determinar os símbolos de erro:

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

  Substituindo símbolos de erro por números, o conjunto de regras se torna:

  ```
  IF err_code == ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED
    OR err_code == ER_ABORTING_USER_CONNECTION THEN drop.
  IF err_code == ER_PASSWORD_ANONYMOUS_USER THEN drop.
  ```

Nomes simbólicos podem ser especificados como strings com citações para comparação com campos de string, mas em tais casos os nomes são strings que não têm nenhum significado especial e o `log_filter_dragnet` não os resolve para o valor numérico correspondente. Além disso, erros de digitação podem não ser detectados, enquanto um erro ocorre imediatamente no `SET` para tentativas de usar um símbolo não citado desconhecido para o servidor.

##### Ações para Regras de log\_filter\_dragnet

`log_filter_dragnet` suporta estas ações em regras de filtro:

- `drop`: Esqueça o evento de registro atual (não o registre).
- `throttle`: Aplicar limitação de taxa para reduzir a verbosidade de log para eventos que correspondem a condições particulares. O argumento indica uma taxa, na forma `count` ou `count`/`window_size`. O valor `count` indica o número permitido de ocorrências de eventos para registrar por janela de tempo. O valor `window_size` é a janela de tempo em segundos; se omitido, a janela padrão é de 60 segundos. Ambos os valores devem ser literais inteiros.

  Esta regra limita as mensagens de desligamento do plug-in a 5 ocorrências por 60 segundos:

  ```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

  Esta regra limita os erros e avisos a 1000 ocorrências por hora e as mensagens de informação a 100 ocorrências por hora:

  ```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```
- `set`: Atribua um valor a um campo (e faça com que o campo exista se ele ainda não existe). Em regras subsequentes, os testes de `EXISTS` contra o nome do campo são verdadeiros, e o novo valor pode ser testado por condições de comparação.
- `unset`: Descarte um campo. Em regras subsequentes, os testes de `EXISTS` contra o nome do campo são falsos, e as comparações do campo contra qualquer valor são falsas.

  No caso especial em que a condição se refere exatamente a um nome de campo, o nome de campo após `unset` é opcional e `unset` descartará o campo nomeado.

  ```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Referências de campo nas regras de filtragem log\_filter\_dragnet

Regras de `log_filter_dragnet` suportam referências a campos principais, opcionais e definidos pelo usuário em eventos de erro.

- Referências do campo principal
- Referências de campo opcionais
- Referências de campo definidas pelo utilizador

###### Referências do campo principal

A gramática do `log_filter_dragnet` na Grammar for log\_filter\_dragnet Rule Language nomeia os campos principais que as regras de filtro reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, "Error Event Fields", com a qual você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos principais usadas nas regras do `log_filter_dragnet`.

- `prio`

  A prioridade de evento, para indicar um erro, aviso, ou evento de nota/informação. Em comparações, cada prioridade pode ser especificada como um nome de prioridade simbólico ou um literal inteiro. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Estas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

  O quadro a seguir apresenta os níveis de prioridade permitidos.

  <table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Tipo de evento</th> <th scope="col">Símbolo de prioridade</th> <th scope="col">Prioridade numérica</th> </tr></thead><tbody><tr> <th align="left">Evento de erro</th> <td>[[<code>ERROR</code>]]</td> <td>1 .</td> </tr><tr> <th align="left">Evento de alerta</th> <td>[[<code>WARNING</code>]]</td> <td>2 .</td> </tr><tr> <th align="left">Nota/evento de informação</th> <td>[[<code>INFORMATION</code>]]</td> <td>3 .</td> </tr></tbody></table>

  Há também uma prioridade de mensagem de `SYSTEM`, mas as mensagens do sistema não podem ser filtradas e são sempre escritas no registro de erros.

  Os valores de prioridade seguem o princípio de que as prioridades mais altas têm valores mais baixos e vice-versa. Os valores de prioridade começam em 1 para os eventos mais graves (erros) e aumentam para eventos com prioridade decrescente. Por exemplo, para descartar eventos com prioridade menor do que avisos, teste para valores de prioridade maiores do que \[`WARNING`]:

  ```
  IF prio > WARNING THEN drop.
  ```

  Os exemplos a seguir mostram as regras `log_filter_dragnet` para alcançar um efeito semelhante a cada valor `log_error_verbosity` permitido pelo filtro `log_filter_internal`:

  - Apenas erros (`log_error_verbosity=1`):

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

    Esta regra pode realmente ser omitida porque não há valores de `prio` maiores do que `INFORMATION`, então efetivamente não deixa cair nada.
- `err_code`

  O código de erro de evento numérico. Em comparações, o valor a ser testado pode ser especificado como um nome de erro simbólico ou um literal inteiro. Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário. Essas comparações são equivalentes:

  ```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```
- `err_symbol`

  O símbolo de erro de evento, como uma string (por exemplo, `'ER_DUP_KEY'`). Os valores de `err_symbol` são mais destinados a identificar linhas particulares na saída do log do que para uso em comparações de regras de filtro porque `log_filter_dragnet` não resolve valores de comparação especificados como strings para o código de erro numérico equivalente. (Para que isso ocorra, um erro deve ser especificado usando seu símbolo não citado.)

###### Referências de campo opcionais

A gramática do `log_filter_dragnet` na Grammar for log\_filter\_dragnet Rule Language nomeia os campos opcionais que as regras de filtro reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, "Error Event Fields", com a qual você deve estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campo opcionais usadas nas regras do `log_filter_dragnet`.

- `label`

  O rótulo correspondente ao valor `prio`, como uma string. Regras de filtro podem alterar o rótulo para sinks de log que suportam rótulos personalizados. `label` valores são destinados mais para identificar linhas particulares na saída de log do que para uso em comparações de regras de filtro porque `log_filter_dragnet` não resolve valores de comparação especificados como strings para a prioridade numérica equivalente.
- `source_file`

  O arquivo de origem no qual o evento ocorreu, sem qualquer caminho principal. Por exemplo, para testar o arquivo `sql/gis/distance.cc`, escreva a comparação assim:

  ```
  IF source_file == "distance.cc" THEN ...
  ```

###### Referências de campo definidas pelo utilizador

Qualquer nome de campo em uma regra de filtro `log_filter_dragnet` não reconhecido como um nome de campo principal ou opcional é tomado para se referir a um campo definido pelo usuário.
