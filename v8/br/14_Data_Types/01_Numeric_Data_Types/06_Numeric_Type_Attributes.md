### 13.1.6 Atributos de Tipo Numérico

O MySQL suporta uma extensão para especificar opcionalmente a largura de exibição dos tipos de dados inteiros entre parênteses após a palavra-chave base para o tipo. Por exemplo, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") especifica um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com uma largura de exibição de quatro dígitos. Essa largura de exibição opcional pode ser usada pelas aplicações para exibir valores inteiros com uma largura menor que a largura especificada para a coluna, preenchendo-os com espaços à esquerda. (Ou seja, essa largura está presente nos metadados retornados com os conjuntos de resultados. Se ela será usada depende da aplicação.)

A largura do display *não* limita a faixa de valores que podem ser armazenados na coluna. Também não impede que valores mais largos que a largura do display da coluna sejam exibidos corretamente. Por exemplo, uma coluna especificada como `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") tem a faixa usual `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de `-32768` a `32767` e valores fora da faixa permitida por três dígitos são exibidos completos usando mais de três dígitos.

Quando usado em conjunto com o atributo opcional (não padrão) `ZEROFILL`, o alinhamento padrão de espaços é substituído por zeros. Por exemplo, para uma coluna declarada como `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), um valor de `5` é recuperado como `0005`.

Nota

O atributo `ZEROFILL` é ignorado para as colunas envolvidas em expressões ou consultas `UNION`.

Se você armazenar valores maiores que a largura de exibição em uma coluna inteira que possui o atributo `ZEROFILL`, você pode enfrentar problemas quando o MySQL gerar tabelas temporárias para algumas junções complicadas. Nesses casos, o MySQL assume que os valores dos dados cabem dentro da largura de exibição da coluna.

A partir do MySQL 8.0.17, o atributo `ZEROFILL` é desatualizado para tipos de dados numéricos, assim como o atributo de largura de exibição para tipos de dados inteiros. Você deve esperar que o suporte para `ZEROFILL` e larguras de exibição para tipos de dados inteiros seja removido em uma versão futura do MySQL. Considere usar um meio alternativo para produzir o efeito desses atributos. Por exemplo, as aplicações podem usar a função `LPAD()` para zero-padar números até a largura desejada ou podem armazenar os números formatados nas colunas `CHAR`.

Todos os tipos inteiros podem ter um atributo opcional (não padrão) `UNSIGNED`. Um tipo sem sinal pode ser usado para permitir apenas números não negativos em uma coluna ou quando você precisa de uma faixa numérica superior maior para a coluna. Por exemplo, se uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") for `UNSIGNED`, o tamanho da faixa da coluna será o mesmo, mas seus pontos finais serão deslocados para cima, de `-2147483648` e `2147483647` para `0` e `4294967295`.

Os tipos de ponto flutuante e ponto fixo também podem ser `UNSIGNED`. Assim como com os tipos inteiros, este atributo impede que valores negativos sejam armazenados na coluna. Ao contrário dos tipos inteiros, o intervalo superior dos valores da coluna permanece o mesmo. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é desaconselhado para colunas do tipo `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos) e você deve esperar que o suporte seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED`.

Os tipos de dados inteiros ou de ponto flutuante podem ter o atributo `AUTO_INCREMENT`. Quando você insere um valor de `NULL` em uma coluna indexada `AUTO_INCREMENT`, a coluna é definida para o próximo valor da sequência. Normalmente, isso é `value+1`, onde `value` é o maior valor para a coluna atualmente na tabela. (As sequências `AUTO_INCREMENT` começam com `1`.)

Armazenar `0` em uma coluna `AUTO_INCREMENT` tem o mesmo efeito que armazenar `NULL`, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja ativado.

Para inserir `NULL` para gerar valores `AUTO_INCREMENT`, é necessário que a coluna seja declarada `NOT NULL`. Se a coluna for declarada `NULL`, inserir `NULL` armazena um `NULL`. Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida para esse valor e a sequência é redefinida para que o próximo valor automaticamente gerado siga sequencialmente a partir do valor inserido.

Valores negativos para as colunas `AUTO_INCREMENT` não são suportados.

As restrições `CHECK` não podem se referir a colunas que possuem o atributo `AUTO_INCREMENT`, e o atributo `AUTO_INCREMENT` também não pode ser adicionado a colunas existentes que são usadas em restrições `CHECK`.

A partir do MySQL 8.0.17, o suporte ao `AUTO_INCREMENT` para as colunas `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") foi descontinuado; você deve esperar que ele seja removido em uma versão futura do MySQL. Considere remover o atributo `AUTO_INCREMENT` dessas colunas ou convertê-las para um tipo inteiro.
