### 27.3.4 Tipos de dados de programa armazenado JavaScript e manipulação de argumentos

A maioria dos tipos de dados do MySQL é suportada para argumentos de entrada e saída de programas armazenados MLE, bem como para tipos de dados de retorno. Os tipos de dados estão listados aqui:

* *Inteiro*: São suportados todas as variantes e aliases dos tipos de dados inteiros do MySQL, incluindo `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

`SIGNED` e `UNSIGNED` são suportados para todos esses tipos.

`BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `SERIAL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") também são suportados e tratados como tipos inteiros.

* *String*: Os tipos de string `CHAR`, `VARCHAR`, `TEXT` e `BLOB` são suportados.

Esses tipos são suportados como no servidor MySQL com as seguintes exceções:

1. Os tipos de argumento e retorno de string podem usar os conjuntos de caracteres `utf8mb4` ou binários; o uso de outros conjuntos de caracteres para esses tipos gera um erro. Essa restrição se aplica às declarações de tipos de argumento e retorno; o servidor tenta converter os *valores* dos argumentos usando outros conjuntos de caracteres para `utfmb4` sempre que necessário, como com programas armazenados em SQL.

2. O comprimento máximo suportado para um valor `LONGTEXT` é de 1073741799 (230 - 24 - 23 - 1) caracteres; para `LONGBLOB`, o comprimento máximo suportado é de 2147483639 (231 - 28 - 1).

O suporte para tipos `BLOB` inclui suporte para `BINARY` e `VARBINARY`.

O tipo de dados `JSON` do MySQL também é suportado.

* *Tipos de ponto flutuante*: `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") são suportados, juntamente com seus aliases. `REAL` - FLOAT, DOUBLE") também é tratado como ponto flutuante, mas `UNSIGNED FLOAT` e `UNSIGNED DOUBLE` são desaconselhados no MySQL e não são suportados pelo MLE.

* *Tipos temporais*: `DATE`, `DATETIME` e `TIMESTAMP` são suportados e são convertidos em valores de `Date` em JavaScript. Os valores de `TIME` são tratados como strings; os valores de `YEAR` são tratados como números.

* A primeira vez que um procedimento armazenado JavaScript específico é executado, ele é associado ao fuso horário de sessão MySQL atual, e este fuso horário continua sendo usado pelo programa armazenado, mesmo que o fuso horário de sessão MySQL seja alterado simultaneamente, durante a duração da sessão do componente MLE, ou até que `mle_session_reset()` seja invocado. Para mais informações, consulte Suporte a fuso horário, mais adiante nesta seção.

* Os tipos `VECTOR`, `DECIMAL` - DECIMAL, NUMERIC"), `NUMERIC` - DECIMAL, NUMERIC"), e `BIT` são todos suportados no MySQL 9.5.

Os argumentos de entrada (`IN` e `INOUT` parâmetros) são convertidos automaticamente em tipos JavaScript com base na mapeo mostrado na tabela a seguir:

**Tabela 27.1 Conversão de tipos de dados MySQL para tipos JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">Tipo de MySQL</th> <th scope="col">Tipo de JavaScript</th> </tr></thead><tbody><tr> <td><code class="literal">TINYINT</code>, <code class="literal">SMALLINT</code>, <code class="literal">MEDIUMINT</code>, <code class="literal">INT</code>, <code class="literal">BOOL</code>, <code class="literal">BIGINT</code>, ou <code class="literal">SERIAL</code></td> <td>Se seguro: <code class="literal">Number</code>; caso contrário: <code class="literal">String</code></td> </tr><tr> <td><code class="literal">FLOAT</code> ou <code class="literal">DOUBLE</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">CHAR</code>, <code class="literal">VARCHAR</code>, <code class="literal">TINYTEXT</code>, <code class="literal">TEXT</code>, <code class="literal">MEDIUMTEXT</code>, ou <code class="literal">LONGTEXT</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">TINYBLOB</code>, <code class="literal">BLOB</code>, <code class="literal">MEDIUMBLOB</code>, <code class="literal">LONGBLOB</code>, <code class="literal">BINARY</code>, ou <code class="literal">VARBINARY</code></td> <td><code class="literal">Uint8Array</code></td> </tr><tr> <td><code class="literal">DATE</code>, <code class="literal">DATETIME</code>, ou <code class="literal">TIMESTAMP</code></td> <td><code class="literal">Date</code></td> </tr><tr> <td><code class="literal">TIME</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">YEAR</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">VECTOR</code></td> <td><code class="literal">Float32Array</code></td> </tr><tr> <td><code class="literal">DECIMAL</code></td> <td><code class="literal">String</code> ou <code class="literal">Number</code>, dependendo do valor de <code class="literal">session.options.decimalType</code> (<code class="literal">STRING</code> ou <code class="literal">NUMBER</code>, respectivamente). Por padrão, convertido em <code class="literal">String</code>.</td> </tr><tr> <td><code class="literal">BIT(<em class="replaceable"><code>M</code></em>)</code></td> <td> <div class="itemizedlist" style="list-style-type: disc; "><ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code class="literal">BIT(<em class="replaceable"><code>M</code></em>)</code> &lt;= <code class="literal">JavaScript.MAX_SAFE_INTEGER</code>: <code class="literal">Number</code> </p></li><li class="listitem"><p> <code class="literal">BIT(<em class="replaceable"><code>M</code></em>)</code> &gt; <code class="literal">JavaScript.MAX_SAFE_INTEGER</code>: <code class="literal">BigInt</code> </p></li></ul> </div> </td> </tr></tbody></table>

A conversão para ou a partir de um inteiro MySQL cujo valor esteja fora da faixa de -253-1 (-9007199254740991) a 253-1 (9007199254740991) é perda de dados. Como a conversão de inteiros MySQL para JavaScript é realizada, pode ser alterada para a sessão atual usando `mle_set_session_state()`; o comportamento padrão é equivalente a chamar essa função usando `UNSAFE_STRING` como o valor para `integer_type`. Consulte a descrição daquela função para obter mais informações.

O `NULL` do SQL é suportado para todos os tipos listados e é convertido para e a partir de `null` do JavaScript conforme necessário.

O JavaScript (ao contrário do SQL) é uma linguagem dinamicamente tipada, o que significa que os tipos de retorno são conhecidos apenas no momento da execução. O valor de retorno e os argumentos de saída do JavaScript (`OUT` e `INOUT` parâmetros) são convertidos automaticamente de volta para o tipo MySQL esperado com base nas mapes mostradas na tabela a seguir:

**Tabela 27.2 Conversão de Tipo: JavaScript para MySQL**

<table border="1" class="table" summary="Conversão de tipos de dados JavaScript para tipos MySQL"><colgroup><col/><col/><col/><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">Tipo de Dados JavaScript</th><th scope="col">Para MySQL <code class="literal">TINYINT</code>, <code class="literal">SMALLINT</code>, <code class="literal">MEDIUMINT</code>, <code class="literal">INT</code>, <code class="literal">BIGINT</code>, <code class="literal">BOOLEAN</code>, ou <code class="literal">SERIAL</code></th><th scope="col">Para MySQL <code class="literal">CHAR</code> ou <code class="literal">VARCHAR</code></th><th scope="col">Para MySQL <code class="literal">FLOAT</code> ou <code class="literal">DOUBLE</code></th><th scope="col">Para MySQL <code class="literal">TINYTEXT</code>, <code class="literal">TEXT</code>, <code class="literal">MEDIUMTEXT</code>, ou <code class="literal">LONGTEXT</code></th><th scope="col">Para MySQL <code class="literal">TINYBLOB</code>, <code class="literal">BLOB</code>, <code class="literal">MEDIUMBLOB</code>, <code class="literal">LONGBLOB</code>, <code class="literal">BINARY</code>, <code class="literal">VARBINARY</code></th><th scope="col">Para MySQL <code class="literal">VECTOR</code></th><th scope="col">Para MySQL <code class="literal">DECIMAL</code> (<code class="literal">NUMERIC</code>)</th><th scope="col">Para MySQL <code class="literal">BIT</code></th></tr></thead><tbody><tr><td scope="row"><code class="literal">Boolean</code></td><td>Converter para <code class="literal">Integer</code></td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Converter para <code class="literal">Float</code></td><td>Se <code class="literal">Boolean</code> JavaScript <code class="literal">true</code>: converter para <span class="quote">“<span class="quote">true</span>”</span>; se <code class="literal">Boolean</code> JavaScript <code class="literal">false</code>: converter para <span class="quote">“<span class="quote">false</span>”</span></td><td>Erro</td><td>Erro</td><td>Converter para <code class="literal">Decimal</code></td><td>Converter para <code class="literal">Bit</code></td></tr><tr><td scope="row"><code class="literal">Number</code></td><td>Arredondar o valor para <code class="literal">Integer</code>; verificar se o valor está fora da faixa</td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Retirar o valor; verificar se este está fora da faixa</td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Erro</td><td>Erro</td><td>Converter para <code class="literal">Decimal</code></td><td>Converter para <code class="literal">Bit</code></td></tr><tr><td scope="row"><code class="literal">BigInteger</code></td><td>Retirar o valor; verificar se está fora da faixa</td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Converter para <code class="literal">Float</code>; verificar se o resultado está fora da faixa</td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Erro</td><td>Erro</td><td>Converter para <code class="literal">Decimal</code></td><td>Converter para <code class="literal">Bit</code></td></tr><tr><td scope="row"><code class="literal">String</code></td><td>Converter como número e arredondar para <code class="literal">Integer</code>; verificar se o valor está fora da faixa</td><td>Retirar o valor; verificar se o comprimento está dentro da faixa</td><td>Converter o valor para <code class="literal">Float</code>; verificar se o valor está fora da faixa</td><td>Usar o valor existente; verificar se o comprimento da string está dentro da faixa esperada</td><td>Erro</td><td>Erro</td><td>Converter para <code class="literal">Decimal</code></td><td>Converter para <code class="literal">Bit</code></td></tr><tr><td scope="row"><code class="literal">Symbol</code> ou <code class="literal">Object</code></td><td>Lançar erro de conversão de tipo inválida</td><td>Converter para <code class="literal">String</code>; verificar se o comprimento do resultado está dentro da faixa esperada</td><td>Lançar erro de conversão de tipo inválida</td><td>Converter para <code

Observações:

* O JavaScript `Infinity` e `-Infinity` são tratados como valores fora do intervalo.

* O JavaScript `NaN` gera um erro de conversão de tipo inválida.

* Todos os arredondamentos são realizados usando `Math.round()`.

* Tentar converter um `BigInt` ou `String` com um valor não numérico para `FLOAT` no MySQL gera um erro de conversão de tipo inválida.

* O comprimento máximo suportado para strings é 1073741799.

* O comprimento máximo suportado para valores `BLOB` é 2147483639.

* `JavaScript.MAX_SAFE_INTEGER` é igual a 9007199254740991 (253-1).

**Tabela 27.3 Conversão de Tipo: JavaScript para MySQL**

<table border="1" class="table" summary="Conversão de valores de data JavaScript para tipos temporais do MySQL"><colgroup><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">Tipo JavaScript</th><th scope="col">MySQL <code class="literal">DATE</code></th><th scope="col">MySQL <code class="literal">DATETIME</code>, <code class="literal">TIMESTAMP</code></th><th scope="col">MySQL YEAR</th></tr></thead><tbody><tr><td scope="row"><code class="literal">null</code> or <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td></tr><tr><td scope="row"><code class="literal">Date</code></td><td>Retem o valor como está, arredondando qualquer parte de tempo para o segundo mais próximo.</td><td>Mantenham o valor como está.</td><td>Extraem o ano do <code class="literal">Date</code></td></tr><tr><td scope="row">Tipo conversível para JavaScript <code class="literal">Date</code> (string formatado)</td><td>Convertirem o valor para JavaScript <code class="literal">Date</code> e lidem conforme necessário</td><td>Convertirem o valor para JavaScript <code class="literal">Date</code> e lidem conforme necessário</td><td>Se o valor contiver um ano de 4 dígitos, use-o.</td></tr><tr><td scope="row">Tipo não conversível para JavaScript <code class="literal">Date</code></td><td>Erro de conversão de tipo inválido</td><td>Erro de conversão de tipo inválido</td><td>Se o valor contiver um ano de 4 dígitos, use-o.</td></tr></tbody></table>

A passagem de uma data MySQL zero (`00-00-0000`) ou um valor de data zero (como `00-01-2023`) leva à criação de uma instância `Invalid Date` do tipo `Date`. Quando passada uma data MySQL que é inválida (por exemplo, 31 de fevereiro), o MLE chama um construtor de `Date` JavaScript com valores inválidos de componentes de data e hora individuais.

O tipo `TIME` do MySQL é tratado como uma string e é validado dentro do MySQL. Consulte a Seção 13.2.3, “O Tipo TIME”, para obter mais informações.

**Tabela 27.4 Conversão de tipos JSON do MySQL para JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">Tipo JSON do MySQL</th> <th scope="col">Tipo JavaScript</th> </tr></thead><tbody><tr> <td><code class="literal">NULL</code>, <code class="literal">JSON NULL</code></td> <td><code class="literal">null</code></td> </tr><tr> <td><code class="literal">JSON OBJECT</code></td> <td><code class="literal">Object</code></td> </tr><tr> <td><code class="literal">JSON ARRAY</code></td> <td><code class="literal">Array</code></td> </tr><tr> <td><code class="literal">JSON BOOLEAN</code></td> <td><code class="literal">Boolean</code></td> </tr><tr> <td><code class="literal">JSON INTEGER</code>, <code class="literal">JSON DOUBLE</code>, <code class="literal">JSON DECIMAL</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">JSON STRING</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">JSON DATETIME</code>, <code class="literal">JSON DATE</code>, <code class="literal">JSON TIME</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">JSON BLOB</code>, <code class="literal">JSON OPAQUE</code></td> <td><code class="literal">String</code></td> </tr></tbody></table>

Observação

Uma string JSON do MySQL, quando convertida para uma string JavaScript, torna-se não-cotada.

**Tabela 27.5 Conversão de tipos JavaScript para JSON do MySQL**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">Tipo de JavaScript</th> <th scope="col">Tipo de JSON MySQL</th> </tr></thead><tbody><tr> <td><code class="literal">null</code>, <code class="literal">undefined</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <td><code class="literal">Boolean</code></td> <td>Erro</td> </tr><tr> <td><code class="literal">Number</code></td> <td>Erro</td> </tr><tr> <td><code class="literal">String</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Pode ser convertido para JSON: string JSON, objeto JSON ou array JSON </p></li><li class="listitem"><p> Não pode ser convertido para JSON: Erro </p></li><li class="listitem"><p> <code class="literal">'null'</code>: JSON <code class="literal">null</code> </p></li></ul> </div> </td> </tr><tr> <td><code class="literal">BigInt</code></td> <td>Erro</td> </tr><tr> <td><code class="literal">Object</code></td> <td>Objeto JSON ou erro (consulte o texto após a tabela)</td> </tr><tr> <td><code class="literal">Array</code></td> <td>Array JSON</td> </tr><tr> <td><code class="literal">Symbol</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Dentro de um objeto: ignorado </p></li><li class="listitem"><p> Dentro de um array: JSON <code class="literal">null</code> </p></li></ul> </div> </div> Valor escalar: Erro</td> </tr></tbody></table>

Notas:

* Um valor dentro de um contêiner, como um array JSON ou objeto JSON, é convertido (possível perda de precisão para valores de `Number`). Um valor escalar lança um erro.

* Os valores de `BigInt` do JavaScript não podem ser convertidos para JSON do MySQL; tentar realizar essa conversão sempre gera um erro, independentemente de o valor estar dentro de um contêiner ou não.

* Pode ser ou não possível converter um `Object` do JavaScript para JSON do MySQL, dependendo de como o método `toJSON()` é implementado para o objeto em questão. Alguns exemplos estão listados aqui:

  + O método `toJSON()` da classe `Date` do JavaScript converte uma `Date` em uma string com sintaxe JSON inválida, gerando assim um erro de conversão.

  + Para a classe `Set`, `toJSON()` retorna `"{}"`, que é uma string JSON válida.

  + Para objetos semelhantes ao JSON, `toJSON()` retorna uma string JSON válida.

**Conversão para e a partir de MySQL ENUM e SET.** O `ENUM` converte para uma string do JavaScript; o `SET` converte para um objeto do JavaScript `Set`, como mostrado na tabela a seguir:

**Tabela 27.6 Conversão dos tipos MySQL ENUM e SET para JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <td>Tipo MySQL</td> <td>Tipo JavaScript</td> </tr></thead><tbody><tr> <td><a class="link" href="enum.html" title="13.3.6 O tipo ENUM"><code class="literal">ENUM</code></a></td> <td><code class="literal">String</code></td> </tr><tr> <td><a class="link" href="set.html" title="13.3.7 O tipo SET"><code class="literal">SET</code></a></td> <td><code class="literal"><a class="ulink" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference//Global_Objects/Set" target="_blank">Set</a></code></td> </tr></tbody></table>

A tabela a seguir mostra as regras para converter um tipo do JavaScript para um tipo MySQL `ENUM` ou `SET`:

**Tabela 27.7 Conversão de tipo: tipos JavaScript para MySQL ENUM e SET**

<table border="1" class="table" summary="Conversão de tipos JavaScript para os tipos ENUM e SET do MySQL"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">Tipo JavaScript</th><th scope="col">Para MySQL <code class="literal">ENUM</code></th><th scope="col">Para MySQL <code class="literal">SET</code></th></tr></thead><tbody><tr><td scope="row">String</td><td>Preserva o valor; verifique se a string é um valor válido <code class="literal">ENUM</code></td><td>Preserva o valor; verifique se a string é um valor válido <code class="literal">SET</code></td></tr><tr><td scope="row"><code class="literal">null</code>, <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td></tr><tr><td scope="row"><code class="literal">Set</code></td><td>Erro</td><td>Converte para uma string separada por vírgula; verifique se a string é um valor válido <code class="literal">SET</code></td></tr><tr><td scope="row">Qualquer outro tipo</td><td>Erro</td><td>Erro</td></tr></tbody></table>

Observações adicionais

* Todos os valores usados em ou para valores `ENUM` ou `SET` ou seus equivalentes em JavaScript devem utilizar o conjunto de caracteres `utf8mb4`. Consulte a Seção 12.9.1, “O conjunto de caracteres utf8mb4 (codificação Unicode UTF-8 de 4 bytes)”), para obter mais informações.

* O modo SQL do servidor pode afetar como um valor JavaScript inválido é tratado ao tentar inseri-lo em uma coluna `ENUM` ou `SET`. Quando o modo rigoroso está em vigor (o padrão), um valor inválido lança um erro; caso contrário, uma string vazia é inserida, com um aviso. Consulte a Seção 7.1.11, “Modos SQL do servidor”.

**Conversão para e a partir de MySQL DECIMAL e NUMERIC.** Os tipos `DECIMAL` (`DECIMAL`, `NUMERIC`) e `NUMERIC` (`DECIMAL`, `NUMERIC`)) do MySQL são convertidos para `String` ou `Number` no JavaScript, dependendo do valor de `session.options.decimalType` (`STRING` ou `NUMBER`, respectivamente). O comportamento padrão é converter esses valores para `String`.

Para definir essa variável no nível da sessão de modo que os tipos `DECIMAL` do MySQL sejam convertidos para `Number` por padrão, chame `mle_set_session_state()` da seguinte forma:

```
mle_set_session_state("decimalType":"NUMBER")
```

O cache de programas armazenados MLE deve estar vazio quando essa função for invocada; ele não está vazio, você pode limpá-lo usando `mle_session_reset()`. Veja a descrição de `mle_set_session_state()` para mais informações.

Para definir a opção `decimalType` dentro de uma rotina armazenada em JavaScript, use `Session.setOptions()`, como mostrado aqui:

```
session.setOptions('{"decimalType":"mysql.DecimalType.NUMBER"}')
```

Isso define o padrão para a conversão de valores `DECIMAL` do MySQL para `Number` para a vida útil da rotina. Use `mysql.DecimalType.STRING` para tornar `String` o padrão.

As regras para a conversão de valores JavaScript para o tipo `DECIMAL` do MySQL (ou seu alias `NUMERIC`) são mostradas na tabela a seguir:

**Tabela 27.8 Conversão de Tipo: Tipos JavaScript para MySQL DECIMAL**

<table border="1" class="table" summary="Conversão de tipos JavaScript para o tipo DECIMAL do MySQL"><colgroup><col/><col/></colgroup><thead><tr><th scope="col">Tipo JavaScript</th><th scope="col">Retorna</th></tr></thead><tbody><tr><td scope="row"><code class="literal">Object</code>, <code class="literal">Array</code>, ou <code class="literal">Symbol</code></td><td>Erro: Conversão não suportada</td></tr><tr><td scope="row"><code class="literal">Boolean</code>, <code class="literal">Number</code>, <code class="literal">String</code>, ou <code class="literal">BigInt</code></td><td><code class="literal">DECIMAL</code> valor</td></tr><tr><td scope="row"><code class="literal">null</code>, <code class="literal">undefined</code></td><td>SQL <code class="literal">NULL</code></td></tr></tbody></table>

O máximo que um valor decimal pode armazenar é determinado pela precisão e escala de `DECIMAL(M, D)`, onde *`M`* é a precisão (número máximo de dígitos) no intervalo de 1-65, e *`D`* é a escala (número de dígitos à direita da vírgula, com o intervalo de 0-30. Além disso, *`M`* deve ser maior ou igual a *`D`*. (Veja a Seção 13.1.3, “Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC” - DECIMAL, NUMERIC), para mais informações.)

No caso de um valor decimal exceder o intervalo especificado por `DECIMAL(M, D)` ou não poder ser armazenado dentro das restrições de `DECIMAL(M, D)`, o comportamento depende do modo SQL do servidor (veja a Seção 7.1.11, “Modos SQL do Servidor”), conforme segue:

* *Modo SQL Estrito*: Um erro é gerado, e a operação falha.

* *Caso contrário*: O valor é automaticamente limitado ao valor mínimo ou máximo mais próximo do intervalo dado, e um aviso é emitido.

**Suporte a fuso horário.** Um programa armazenado em JavaScript usa o fuso horário da sessão MySQL em vigor no momento em que é invocado pela primeira vez. Esse fuso horário permanece em vigor para esse programa armazenado durante a sessão na sessão.

A mudança do fuso horário da sessão MySQL não é refletida automaticamente em programas armazenados que foram usados e, portanto, já estão em cache. Para fazer com que eles usem o novo fuso horário, chame `mle_session_reset()` para limpar o cache; depois disso, os programas armazenados usam o novo fuso horário.

Os tipos de fuso horário suportados estão listados aqui:

* Deslocamentos de fuso horário em relação ao UTC, como `+11:00` ou `-07:15`.

Os [bancos de dados de fuso horário da IANA](https://www.iana.org/time-zones) são suportados, com exceção de configurações que usam segundos intercalares. Por exemplo, `Pacific/Nauru`, `Japan` e `MET` são suportados, enquanto `leap/Pacific/Nauru` e `right/Pacific/Nauru` não.

Verificações de intervalo e verificações de conversão de tipo inválida são realizadas após a execução do programa armazenado. A conversão é feita dentro do JavaScript usando construtores de tipo como `Number()` e `String()`; a arredondagem para `Integer` é realizada usando `Math.round()`.

Um argumento de entrada (`IN` ou `INOUT` no parâmetro) nomeado em uma definição de programa armazenado em JavaScript é acessível dentro do corpo da rotina usando o mesmo identificador de argumento. Argumentos de saída (`INOUT` e `OUT` no parâmetro) também estão disponíveis em procedimentos armazenados em JavaScript. O mesmo identificador de argumento pode ser usado para definir o valor usando o operador de atribuição JavaScript (`=`). Como no argumento `OUT` do procedimento armazenado em SQL, o valor inicial é definido como `null` em JavaScript.

Cuidado

Você *não* deve sobrescrever argumentos de programa usando `let`, `var` ou `const` dentro de programas armazenados em JavaScript. Fazer isso os transforma em variáveis locais do programa, e torna quaisquer valores passados para o programa usando os parâmetros com o mesmo nome inacessíveis.

Exemplo:

```
mysql> CREATE FUNCTION myfunc(x INT)
    ->   RETURNS INT LANGUAGE JAVASCRIPT AS
    -> $$
    $>   var x
    $>
    $>   return 2*x
    $> $$
    -> ;
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT myfunc(10);
ERROR 6000 (HY000): MLE-Type> Cannot convert value 'NaN' to INT
from MLE in 'myfunc(10)'
```

A instrução `return` do JavaScript deve ser usada para retornar valores escalares em funções armazenadas. Em procedimentos armazenados, essa instrução não retorna um valor, e apenas sai do bloco de código (isso pode ou não sair da rotina, dependendo do fluxo do programa). `return` não pode ser usado para definir valores de argumentos `OUT` ou `INOUT` de procedimentos armazenados; esses devem ser definidos explicitamente dentro da rotina.

Para obter informações sobre como acessar procedimentos armazenados MySQL e funções armazenadas a partir de rotinas armazenadas em JavaScript, consulte a Seção 27.3.6.10, “API de Rotina Armazenada”.