### 11.1.6 Atributos de Tipos Numéricos

O MySQL suporta uma extensão para a especificação opcional da largura de exibição (display width) de tipos de dados inteiros entre parênteses, após a palavra-chave base para o tipo. Por exemplo, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") especifica um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com uma largura de exibição de quatro dígitos. Esta largura de exibição opcional pode ser usada por aplicações para exibir valores inteiros com uma largura menor do que a especificada para a coluna, preenchendo-os à esquerda com espaços (left-padding). (Ou seja, essa largura está presente nos metadata retornados com os result sets. Se ela será usada ou não, cabe à aplicação.)

A largura de exibição *não* restringe o range de valores que podem ser armazenados na coluna. Nem impede que valores mais largos do que a largura de exibição da coluna sejam exibidos corretamente. Por exemplo, uma coluna especificada como `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") tem o range usual de `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), de `-32768` a `32767`, e valores fora do range permitido por três dígitos são exibidos por completo, usando mais de três dígitos.

Quando usado em conjunto com o atributo opcional (não padrão) `ZEROFILL`, o preenchimento padrão de espaços é substituído por zeros. Por exemplo, para uma coluna declarada como `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), um valor de `5` é recuperado como `0005`.

Note

O atributo `ZEROFILL` é ignorado para colunas envolvidas em expressions ou em `UNION` queries.

Se você armazenar valores maiores que a largura de exibição em uma coluna de inteiro que possui o atributo `ZEROFILL`, você pode ter problemas quando o MySQL gerar temporary tables para alguns joins complicados. Nesses casos, o MySQL assume que os valores de dados cabem na largura de exibição da coluna.

Todos os tipos de inteiros podem ter um atributo opcional (não padrão) `UNSIGNED`. Um tipo `UNSIGNED` pode ser usado para permitir apenas números não negativos em uma coluna ou quando você precisa de um range numérico superior maior para a coluna. Por exemplo, se uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") for `UNSIGNED`, o tamanho do range da coluna é o mesmo, mas seus endpoints são deslocados para cima, de `-2147483648` e `2147483647` para `0` e `4294967295`.

Tipos floating-point (ponto flutuante) e fixed-point (ponto fixo) também podem ser `UNSIGNED`. Assim como nos tipos inteiros, este atributo impede que valores negativos sejam armazenados na coluna. Ao contrário dos tipos inteiros, o range superior dos valores da coluna permanece o mesmo.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED`.

Tipos de dados integer ou floating-point podem ter o atributo `AUTO_INCREMENT`. Quando você insere um valor `NULL` em uma coluna `AUTO_INCREMENT` indexed, a coluna é definida para o próximo valor da sequence. Tipicamente, este é `valor+1`, onde *`valor`* é o maior valor atual para a coluna na tabela. (As sequences `AUTO_INCREMENT` começam com `1`.)

Armazenar `0` em uma coluna `AUTO_INCREMENT` tem o mesmo efeito que armazenar `NULL`, a menos que o SQL mode `NO_AUTO_VALUE_ON_ZERO` esteja habilitado.

Inserir `NULL` para gerar valores `AUTO_INCREMENT` exige que a coluna seja declarada como `NOT NULL`. Se a coluna for declarada como `NULL`, a inserção de `NULL` armazena um `NULL`. Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida para esse valor e a sequence é redefinida para que o próximo valor gerado automaticamente siga sequencialmente a partir do valor inserido.

Valores negativos para colunas `AUTO_INCREMENT` não são suportados.
