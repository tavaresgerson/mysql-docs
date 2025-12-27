### 15.5.1 Declaração `PREPARE`

```
PREPARE stmt_name FROM preparable_stmt
```

A declaração `PREPARE` prepara uma declaração SQL e atribui a ela um nome, *`stmt_name`*, pelo qual se referirá à declaração mais tarde. A declaração preparada é executada com `EXECUTE` e liberada com `DEALLOCATE PREPARE`. Para exemplos, consulte a Seção 15.5, “Declarações Preparadas”.

Os nomes das declarações não são sensíveis a maiúsculas e minúsculas. *`preparable_stmt`* é uma literal de string ou uma variável de usuário que contém o texto da declaração SQL. O texto deve representar uma única declaração, não múltiplas declarações. Dentro da declaração, os caracteres `?` podem ser usados como marcadores de parâmetro para indicar onde os valores de dados devem ser vinculados à consulta mais tarde quando você executá-la. Os caracteres `?` não devem ser incluídos entre aspas, mesmo que você pretenda vinculá-los a valores de string. Os marcadores de parâmetro podem ser usados apenas onde os valores de dados devem aparecer, não para palavras-chave SQL, identificadores, etc.

Se uma declaração preparada com o nome fornecido já existir, ela é liberada implicitamente antes que a nova declaração seja preparada. Isso significa que, se a nova declaração contiver um erro e não puder ser preparada, um erro é retornado e nenhuma declaração com o nome fornecido existe.

O escopo de uma declaração preparada é a sessão na qual ela é criada, o que tem várias implicações:

* Uma declaração preparada criada em uma sessão não está disponível para outras sessões.

* Quando uma sessão termina, seja normalmente ou anormalmente, suas declarações preparadas deixam de existir. Se o controle de reconexão automática estiver habilitado, o cliente não é notificado de que a conexão foi perdida. Por essa razão, os clientes podem desejar desabilitar o controle de reconexão automática. Veja Controle de Reconexão Automática.

* Uma declaração preparada criada dentro de um programa armazenado continua a existir após o término da execução do programa e pode ser executada fora do programa mais tarde.

* Uma declaração preparada no contexto de um programa armazenado não pode referenciar parâmetros de procedimentos ou funções armazenados ou variáveis locais, pois esses parâmetros deixam de estar no escopo quando o programa termina e não estariam disponíveis se a declaração fosse executada mais tarde fora do programa. Como solução alternativa, consulte as variáveis definidas pelo usuário, que também têm escopo de sessão; veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

O tipo de um parâmetro usado em uma declaração preparada é determinado quando a declaração é preparada pela primeira vez; ele mantém esse tipo sempre que `EXECUTE` é invocado para essa declaração preparada (a menos que a declaração seja preparada novamente, conforme explicado mais adiante nesta seção). As regras para determinar o tipo de um parâmetro estão listadas aqui:

* Um parâmetro que é um operando de um operador aritmético binário tem o mesmo tipo de dados que o outro operando.

* Se ambos os operandos de um operador aritmético binário são parâmetros, o tipo dos parâmetros é decidido pelo contexto do operador.

* Se um parâmetro é o operando de um operador aritmético unário, o tipo do parâmetro é decidido pelo contexto do operador.

* Se um operador aritmético não tiver um contexto determinante de tipo, o tipo derivado para quaisquer parâmetros envolvidos é `DOUBLE PRECISION` - FLOAT, DOUBLE"). Isso pode acontecer, por exemplo, quando o parâmetro é um nó de nível superior em uma lista `SELECT`, ou quando faz parte de um operador de comparação.

* Um parâmetro que é um operando de um operador de cadeia de caracteres tem o mesmo tipo derivado que o tipo agregado dos outros operantes. Se todos os operantes do operador são parâmetros, o tipo derivado é `VARCHAR`; sua ordenação é determinada pelo valor de `collation_connection`.

* Um parâmetro que é um operando de um operador temporal tem o tipo `DATETIME` se o operador retornar um `DATETIME`, `TIME` se o operador retornar um `TIME` e `DATE` se o operador retornar um `DATE`.

* Um parâmetro que é um operando de um operador de comparação binária tem o mesmo tipo derivado que o outro operando da comparação.

* Um parâmetro que é um operando de um operador de comparação ternário, como `BETWEEN`, tem o mesmo tipo derivado que o tipo agregado dos outros operantes.

* Se todos os operantes de um operador de comparação são parâmetros, o tipo derivado para cada um deles é `VARCHAR`, com a ordenação determinada pelo valor de `collation_connection`.

* Um parâmetro que é um operando de saída de qualquer `CASE`, `COALESCE`, `IF`, `IFNULL` ou `NULLIF` tem o mesmo tipo derivado que o tipo agregado dos outros operantes de saída do operador.

* Se todos os operantes de saída de qualquer `CASE`, `COALESCE`, `IF`, `IFNULL` ou `NULLIF` são parâmetros ou são todos `NULL`, o tipo do parâmetro é decidido pelo contexto do operador.

* Se o parâmetro é um operando de qualquer `CASE`, `COALESCE()`, `IF` ou `IFNULL`, e não tem um contexto determinante de tipo, o tipo derivado para cada um dos parâmetros envolvidos é `VARCHAR`, e sua ordenação é determinada pelo valor de `collation_connection`.

* Um parâmetro que é o operando de um `CAST()` tem o mesmo tipo especificado pelo `CAST()`.

* Se um parâmetro for um membro imediato de uma lista `SELECT` que não faça parte de uma instrução `INSERT`, o tipo derivado do parâmetro é `VARCHAR` e sua ordenação é determinada pelo valor de `collation_connection`.

* Se um parâmetro for um membro imediato de uma lista `SELECT` que faça parte de uma instrução `INSERT`, o tipo derivado do parâmetro é o tipo da coluna correspondente na qual o parâmetro é inserido.

* Se um parâmetro for usado como fonte para uma atribuição em uma cláusula `SET` de uma instrução `UPDATE` ou em uma cláusula `ON DUPLICATE KEY UPDATE` de uma instrução `INSERT`, o tipo derivado do parâmetro é o tipo da coluna correspondente que é atualizada pela cláusula `SET` ou `ON DUPLICATE KEY UPDATE`.

* Se um parâmetro for um argumento de uma função, o tipo derivado depende do tipo de retorno da função.

Para algumas combinações de tipo real e tipo derivado, uma reparação automática da instrução é acionada, para garantir uma compatibilidade mais próxima com versões anteriores do MySQL. A reparação não ocorre se qualquer uma das seguintes condições for verdadeira:

* `NULL` é usado como valor do parâmetro real.
* Um parâmetro é um operando de uma `CAST()`. (Em vez disso, tenta-se um cast para o tipo derivado, e uma exceção é lançada se o cast falhar.)

* Um parâmetro é uma string. (Neste caso, é realizada um `CAST(? AS derived_type)` implícito.)

* O tipo derivado e o tipo real do parâmetro são ambos `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e têm o mesmo sinal.

* O tipo derivado do parâmetro é `DECIMAL` - DECIMAL, NUMERIC") e seu tipo real é `DECIMAL` ou `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

* O tipo derivado é `DOUBLE` - FLOAT, DOUBLE") e o tipo real é qualquer tipo numérico.

* Tanto o tipo derivado quanto o tipo real são tipos de string.
* Se o tipo derivado for temporal e o tipo real for temporal. *Exceções*: O tipo derivado é `TIME` e o tipo real não é `TIME`; o tipo derivado é `DATE` e o tipo real não é `DATE`.

* O tipo derivado é temporal e o tipo real é numérico.

Para casos diferentes dos listados acima, a declaração é recriada e os tipos de parâmetros reais são usados em vez dos tipos de parâmetros derivados.

Essas regras também se aplicam a uma variável de usuário referenciada em uma declaração preparada.

Usar um tipo de dado diferente para um parâmetro ou variável de usuário dentro de uma declaração preparada para execuções da declaração subsequentes à primeira execução faz com que a declaração seja recriada. Isso é menos eficiente; também pode levar o tipo real do parâmetro (ou variável) a variar, e, assim, para resultados inconsistentes, com execuções subsequentes da declaração preparada. Por essas razões, é aconselhável usar o mesmo tipo de dado para um parâmetro dado ao reexecutar uma declaração preparada.