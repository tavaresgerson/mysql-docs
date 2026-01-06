### 11.1.6 Atributos de Tipo Numérico

O MySQL suporta uma extensão para especificar opcionalmente a largura de exibição dos tipos de dados inteiros entre parênteses após a palavra-chave base para o tipo. Por exemplo, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") especifica um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com uma largura de exibição de quatro dígitos. Essa largura de exibição opcional pode ser usada pelas aplicações para exibir valores inteiros com uma largura menor que a largura especificada para a coluna, preenchendo-os com espaços à esquerda. (Ou seja, essa largura está presente nos metadados retornados com os conjuntos de resultados. Se ela será usada depende da aplicação.)

A largura do display *não* limita a faixa de valores que podem ser armazenados na coluna. Também não impede que valores mais largos que a largura do display da coluna sejam exibidos corretamente. Por exemplo, uma coluna especificada como `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") tem a faixa usual de `-32768` a `32767` para `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e valores fora da faixa permitida por três dígitos são exibidos completos usando mais de três dígitos.

Quando usado em conjunto com o atributo opcional (não padrão) `ZEROFILL`, o preenchimento padrão de espaços é substituído por zeros. Por exemplo, para uma coluna declarada como `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), um valor de `5` é recuperado como `0005`.

Nota

O atributo `ZEROFILL` é ignorado para as colunas envolvidas em expressões ou consultas `UNION`.

Se você armazenar valores maiores que a largura de exibição em uma coluna inteira que tem o atributo `ZEROFILL`, você pode enfrentar problemas quando o MySQL gerar tabelas temporárias para algumas junções complicadas. Nesses casos, o MySQL assume que os valores dos dados cabem dentro da largura de exibição da coluna.

Todos os tipos inteiros podem ter o atributo opcional (não padrão) `UNSIGNED`. Um tipo não assinado pode ser usado para permitir apenas números não negativos em uma coluna ou quando você precisa de uma faixa numérica superior maior para a coluna. Por exemplo, se uma coluna `INT` (INTEIRO), INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") for `UNSIGNED`, o tamanho da faixa da coluna será o mesmo, mas seus pontos finais serão deslocados para cima, de `-2147483648` e `2147483647` para `0` e `4294967295`.

Os tipos de ponto flutuante e ponto fixo também podem ser `UNSIGNED`. Assim como com os tipos de inteiro, esse atributo impede que valores negativos sejam armazenados na coluna. Ao contrário dos tipos de inteiro, o intervalo superior dos valores da coluna permanece o mesmo.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED`.

Os tipos de dados inteiros ou de ponto flutuante podem ter o atributo `AUTO_INCREMENT`. Quando você insere um valor de `NULL` em uma coluna `AUTO_INCREMENT` indexada, a coluna é definida para o próximo valor da sequência. Normalmente, isso é `valor + 1`, onde *`valor`* é o maior valor para a coluna atualmente na tabela. (`AUTO_INCREMENT` sequências começam com `1`.)

Armazenar `0` em uma coluna `AUTO_INCREMENT` tem o mesmo efeito que armazenar `NULL`, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja habilitado.

Para inserir `NULL` e gerar valores `AUTO_INCREMENT`, é necessário que a coluna seja declarada como `NOT NULL`. Se a coluna for declarada como `NULL`, inserir `NULL` armazenará um `NULL`. Quando você inserir qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna será definida com esse valor e a sequência será redefinida para que o próximo valor gerado automaticamente siga sequencialmente a partir do valor inserido.

Valores negativos para as colunas `AUTO_INCREMENT` não são suportados.
