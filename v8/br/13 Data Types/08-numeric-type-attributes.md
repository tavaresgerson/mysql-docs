### 13.1.6 Atributos de Tipo Numérico

O MySQL suporta uma extensão para especificar opcionalmente a largura de exibição dos tipos de dados inteiros entre parênteses após a palavra-chave base para o tipo. Por exemplo, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") especifica um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com uma largura de exibição de quatro dígitos. Essa largura de exibição opcional pode ser usada pelas aplicações para exibir valores inteiros com uma largura menor que a largura especificada para a coluna, preenchendo-a com espaços à esquerda. (Ou seja, essa largura está presente nos metadados retornados com os conjuntos de resultados. Se ela é usada depende da aplicação.)

A largura de exibição *não* restringe o intervalo de valores que podem ser armazenados na coluna. Ela também não impede que valores maiores que a largura de exibição da coluna sejam exibidos corretamente. Por exemplo, uma coluna especificada como `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") tem o intervalo usual de `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de `-32768` a `32767`, e valores fora do intervalo permitido por três dígitos são exibidos completos usando mais de três dígitos.

Quando usado em conjunto com o atributo opcional (não padrão) `ZEROFILL`, o preenchimento padrão de espaços é substituído por zeros. Por exemplo, para uma coluna declarada como  `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), um valor de `5` é recuperado como `0005`.

::: info Nota

O atributo `ZEROFILL` é ignorado para colunas envolvidas em expressões ou consultas `UNION`.

Se você armazenar valores maiores que a largura de exibição em uma coluna inteira que tem o atributo `ZEROFILL`, você pode enfrentar problemas quando o MySQL gera tabelas temporárias para algumas junções complicadas. Nesses casos, o MySQL assume que os valores de dados cabem dentro da largura de exibição da coluna.

O atributo `ZEROFILL` está desatualizado para tipos de dados numéricos, assim como o atributo de largura de exibição para tipos de dados inteiros. Você deve esperar que o suporte para `ZEROFILL` e larguras de exibição para tipos de dados inteiros seja removido em uma versão futura do MySQL. Considere usar um meio alternativo para produzir o efeito desses atributos. Por exemplo, as aplicações podem usar a função `LPAD()` para preenchimento à esquerda de números até a largura desejada, ou podem armazenar os números formatados em colunas `CHAR`.

Todos os tipos inteiros podem ter o atributo opcional (não padrão) `UNSIGNED`. Um tipo não assinado pode ser usado para permitir apenas números não negativos em uma coluna ou quando você precisa de um intervalo numérico maior para a coluna. Por exemplo, se uma coluna `INT` (INTEIRO, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") for `UNSIGNED`, o tamanho do intervalo da coluna é o mesmo, mas seus extremos se deslocam para cima, de `-2147483648` e `2147483647` para `0` e `4294967295`.

Tipos de ponto flutuante e ponto fixo também podem ser `UNSIGNED`. Como com os tipos inteiros, esse atributo impede que valores negativos sejam armazenados na coluna. Ao contrário dos tipos inteiros, o intervalo superior dos valores da coluna permanece o mesmo. `UNSIGNED` está desatualizado para colunas do tipo `FLOAT` (FLOAT, DOUBLE"), `DOUBLE` (FLOAT, DOUBLE"), e `DECIMAL` (DECIMAL, NUMERIC") (e quaisquer sinônimos) e você deve esperar que o suporte seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED`.

Tipos de dados inteiros ou de ponto flutuante podem ter o atributo `AUTO_INCREMENT`. Quando você insere um valor de `NULL` em uma coluna `AUTO_INCREMENT` indexada, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `value+1`, onde *`value`* é o maior valor para a coluna atualmente na tabela. (`Sequências `AUTO_INCREMENT` começam com `1`.`)

Armazenar `0` em uma coluna `AUTO_INCREMENT` tem o mesmo efeito que armazenar `NULL`, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja habilitado.

Inserir `NULL` para gerar valores `AUTO_INCREMENT` requer que a coluna seja declarada como `NOT NULL`. Se a coluna for declarada como `NULL`, inserir `NULL` armazena um `NULL`. Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida para esse valor e a sequência é redefinida para que o próximo valor gerado automaticamente siga sequencialmente a partir do valor inserido.

Valores negativos para colunas `AUTO_INCREMENT` não são suportados.

As restrições `CHECK` não podem se referir a colunas que tenham o atributo `AUTO_INCREMENT`, nem o atributo `AUTO_INCREMENT` pode ser adicionado a colunas existentes que são usadas em restrições `CHECK`.

O `AUTO_INCREMENT` para colunas `FLOAT` - `FLOAT`, `DOUBLE`) e `DOUBLE` - `FLOAT`, `DOUBLE`) não é suportado, a partir do MySQL 8.4.0. Para atualizar uma versão anterior para o MySQL 8.4.0 ou superior, você deve remover o atributo `AUTO_INCREMENT` dessas colunas para evitar problemas de compatibilidade ou convertê-las em um tipo inteiro.