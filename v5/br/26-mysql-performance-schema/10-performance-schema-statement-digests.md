## 25.10 Digests de Instruções (Statement Digests) do Performance Schema

O MySQL server é capaz de manter informações de *statement digest*. O processo de *digesting* converte cada instrução SQL para uma forma normalizada (o *statement digest*) e calcula um valor *hash* MD5 (*digest hash value*) a partir do resultado normalizado. A normalização permite que instruções semelhantes sejam agrupadas e sumarizadas para expor informações sobre os tipos de instruções que o *server* está executando e com que frequência elas ocorrem. Esta seção descreve como o *statement digesting* ocorre e como ele pode ser útil.

O *digesting* ocorre no *parser*, independentemente de o *Performance Schema* estar disponível, para que outros componentes do *server*, como o MySQL Enterprise Firewall e os *plugins* de reescrita de *query*, tenham acesso aos *statement digests*.

* [Conceitos Gerais de Statement Digest](performance-schema-statement-digests.html#statement-digests-general "Conceitos Gerais de Statement Digest")
* [Statement Digests no Performance Schema](performance-schema-statement-digests.html#statement-digests-performance-schema "Statement Digests no Performance Schema")
* [Uso de Memória de Statement Digest](performance-schema-statement-digests.html#statement-digests-memory-use "Uso de Memória de Statement Digest")

### Conceitos Gerais de Statement Digest

Quando o *parser* recebe uma instrução SQL, ele calcula um *statement digest* se esse *digest* for necessário, o que é verdadeiro se qualquer uma das seguintes condições for atendida:

* A instrumentação de *digest* do *Performance Schema* está habilitada
* O MySQL Enterprise Firewall está habilitado
* Um *query rewrite plugin* está habilitado

O valor da variável de sistema [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) determina o número máximo de *bytes* disponíveis por sessão para o cálculo de *statement digests* normalizados. Assim que essa quantidade de espaço é usada durante o cálculo do *digest*, ocorre o *truncation* (truncamento): nenhum *token* adicional de uma instrução analisada é coletado ou considerado em seu valor de *digest*. Instruções que diferem apenas após essa quantidade de *bytes* de *tokens* analisados produzem o mesmo *statement digest* normalizado e são consideradas idênticas se comparadas ou se agregadas para estatísticas de *digest*.

Aviso

Definir a variável de sistema [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) como zero desabilita a produção de *digests*, o que também desabilita funcionalidades do *server* que requerem *digests*.

Após o cálculo da instrução normalizada, um valor *hash* MD5 é calculado a partir dela. Além disso:

* Se o MySQL Enterprise Firewall estiver habilitado, ele é chamado e o *digest* conforme calculado fica disponível para ele.

* Se qualquer *query rewrite plugin* estiver habilitado, ele é chamado e o *statement digest* e o valor do *digest* ficam disponíveis para ele.

* Se o *Performance Schema* tiver a instrumentação de *digest* habilitada, ele faz uma cópia do *statement digest* normalizado, alocando um máximo de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) *bytes* para ela. Consequentemente, se [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) for menor que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length), a cópia é truncada em relação à original. A cópia do *statement digest* normalizado é armazenada nas tabelas apropriadas do *Performance Schema*, juntamente com o valor *hash* MD5 calculado a partir da instrução normalizada original. (Se o *Performance Schema* truncar sua cópia do *statement digest* normalizado em relação ao original, ele não recalcula o valor *hash* MD5.)

A normalização de instrução transforma o texto da instrução em uma representação de *digest string* mais padronizada que preserva a estrutura geral da instrução, removendo informações não essenciais à estrutura:

* Identificadores de objeto, como nomes de *database* e *table*, são preservados.

* Valores literais são convertidos em marcadores de parâmetro. Uma instrução normalizada não retém informações como nomes, senhas, datas, etc.

* Comentários são removidos e o espaço em branco é ajustado.

Considere estas instruções:

```sql
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

Para normalizar essas instruções, o *parser* substitui os valores de dados por `?` e ajusta o espaço em branco. Ambas as instruções resultam na mesma forma normalizada e, portanto, são consideradas “iguais”:

```sql
SELECT * FROM orders WHERE customer_id = ? AND quantity > ?
```

O *statement* normalizado contém menos informação, mas ainda é representativo da instrução original. Outras instruções semelhantes que têm diferentes valores de dados têm a mesma forma normalizada.

Agora considere estas instruções:

```sql
SELECT * FROM customers WHERE customer_id = 1000
SELECT * FROM orders WHERE customer_id = 1000
```

Neste caso, as instruções normalizadas diferem porque os identificadores de objeto são diferentes:

```sql
SELECT * FROM customers WHERE customer_id = ?
SELECT * FROM orders WHERE customer_id = ?
```

Se a normalização produzir uma instrução que exceda o espaço disponível no *digest buffer* (conforme determinado por [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length)), ocorre o truncamento e o texto termina com “...”. Instruções normalizadas longas que diferem apenas na parte que ocorre após o “...” são consideradas iguais. Considere estas instruções:

```sql
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

Se o ponto de corte for logo após o `AND`, ambas as instruções têm esta forma normalizada:

```sql
SELECT * FROM mytable WHERE cola = ? AND ...
```

Neste caso, a diferença no segundo nome da coluna é perdida e ambas as instruções são consideradas iguais.

### Statement Digests no Performance Schema

No *Performance Schema*, o *statement digesting* envolve estes elementos:

* Um *consumer* `statements_digest` na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") controla se o *Performance Schema* mantém informações de *digest*. Consulte [Statement Digest Consumer](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-statement-digest "Statement Digest Consumer").

* As tabelas de eventos de instrução ([`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 A Tabela events_statements_current"), [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 A Tabela events_statements_history") e [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long")) têm colunas para armazenar *statement digests* normalizados e os correspondentes valores *hash* MD5 do *digest*:

  + `DIGEST_TEXT` é o texto do *statement digest* normalizado. Esta é uma cópia da instrução normalizada original que foi calculada para um máximo de [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes*, posteriormente truncada conforme necessário para [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) *bytes*.

  + `DIGEST` é o valor *hash* MD5 do *digest* calculado a partir da instrução normalizada original.

  Consulte [Seção 25.12.6, “Tabelas de Eventos de Instrução do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Tabelas de Eventos de Instrução do Performance Schema").

* A tabela de resumo [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Instrução") fornece informações agregadas de *statement digest*. Esta tabela agrega informações para instruções por combinação de `SCHEMA_NAME` e `DIGEST`. O *Performance Schema* usa valores *hash* MD5 para agregação porque são rápidos de calcular e têm uma distribuição estatística favorável que minimiza colisões. Consulte [Seção 25.12.15.3, “Tabelas de Resumo de Instrução”](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Instrução").

As tabelas de eventos de instrução também têm uma coluna `SQL_TEXT` que contém a instrução SQL original. O espaço máximo disponível para exibição da instrução é de 1024 *bytes* por padrão. Para alterar esse valor, defina a variável de sistema [`performance_schema_max_sql_text_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length) na inicialização do *server*.

A variável de sistema [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) determina o número máximo de *bytes* disponíveis por instrução para o armazenamento do valor do *digest* no *Performance Schema*. No entanto, o comprimento de exibição dos *statement digests* pode ser maior do que o tamanho do *buffer* disponível devido à codificação interna de elementos da instrução, como *keywords* e valores literais. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de instrução podem parecer exceder o valor de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length).

A tabela de resumo [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Instrução") fornece um perfil das instruções executadas pelo *server*. Ela mostra quais tipos de instruções um aplicativo está executando e com que frequência. Um desenvolvedor de aplicativos pode usar essas informações juntamente com outras informações na tabela para avaliar as características de *performance* do aplicativo. Por exemplo, colunas da tabela que mostram tempos de espera (*wait times*), tempos de *lock* ou uso de *Index* podem destacar tipos de *queries* que são ineficientes. Isso dá ao desenvolvedor *insight* sobre quais partes do aplicativo precisam de atenção.

A tabela de resumo [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Instrução") tem um tamanho fixo. Por padrão, o *Performance Schema* estima o tamanho a ser usado na inicialização. Para especificar o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size) na inicialização do *server*. Se a tabela ficar cheia, o *Performance Schema* agrupa instruções que têm valores `SCHEMA_NAME` e `DIGEST` que não correspondem aos valores existentes na tabela em uma linha especial com `SCHEMA_NAME` e `DIGEST` definidos como `NULL`. Isso permite que todas as instruções sejam contadas. No entanto, se a linha especial for responsável por uma porcentagem significativa das instruções executadas, pode ser desejável aumentar o tamanho da tabela de resumo aumentando [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size).

### Uso de Memória de Statement Digest

Para aplicativos que geram instruções muito longas que diferem apenas no final, aumentar [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) permite o cálculo de *digests* que distinguem instruções que, de outra forma, se agregariam ao mesmo *digest*. Inversamente, diminuir [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) faz com que o *server* dedique menos memória ao armazenamento de *digest*, mas aumenta a probabilidade de instruções mais longas se agregarem ao mesmo *digest*. Os administradores devem ter em mente que valores maiores resultam em requisitos de memória correspondentemente aumentados, particularmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o *server* aloca [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes* por sessão).

Conforme descrito anteriormente, os *statement digests* normalizados calculados pelo *parser* são limitados a um máximo de [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes*, enquanto os *statement digests* normalizados armazenados no *Performance Schema* usam [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) *bytes*. As seguintes considerações de uso de memória se aplicam em relação aos valores relativos de [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) e [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

* Se [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) for menor que [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Componentes do *server* diferentes do *Performance Schema* usam *statement digests* normalizados que ocupam até [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes*.

  + O *Performance Schema* não trunca ainda mais os *statement digests* normalizados que armazena, mas aloca mais memória do que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes* por *digest*, o que é desnecessário.

* Se [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) for igual a [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Componentes do *server* diferentes do *Performance Schema* usam *statement digests* normalizados que ocupam até [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes*.

  + O *Performance Schema* não trunca ainda mais os *statement digests* normalizados que armazena e aloca a mesma quantidade de memória que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes* por *digest*.

* Se [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) for maior que [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Componentes do *server* diferentes do *Performance Schema* usam *statement digests* normalizados que ocupam até [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes*.

  + O *Performance Schema* trunca ainda mais os *statement digests* normalizados que armazena e aloca menos memória do que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) *bytes* por *digest*.

Como as tabelas de eventos de instrução do *Performance Schema* podem armazenar muitos *digests*, definir [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) menor que [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) permite aos administradores equilibrar estes fatores:

* A necessidade de ter *statement digests* normalizados longos disponíveis para componentes do *server* fora do *Performance Schema*.

* Muitas sessões concorrentes, cada uma alocando memória de cálculo de *digest*.

* A necessidade de limitar o consumo de memória pelas tabelas de eventos de instrução do *Performance Schema* ao armazenar muitos *statement digests*.

A configuração de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) não é por sessão, é por instrução, e uma sessão pode armazenar múltiplas instruções na tabela [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 A Tabela events_statements_history"). Um número típico de instruções nesta tabela é 10 por sessão, então cada sessão consome 10 vezes a memória indicada pelo valor de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length), apenas para esta tabela.

Além disso, muitas instruções (*e digests*) são coletadas globalmente, principalmente na tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long"). Aqui também, *N* instruções armazenadas consomem *N* vezes a memória indicada pelo valor de [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length).

Para avaliar a quantidade de memória usada para armazenamento de instruções SQL e cálculo de *digest*, use a instrução [`SHOW ENGINE PERFORMANCE_SCHEMA STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") ou monitore estes *instruments*:

```sql
mysql> SELECT NAME
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE '%.sqltext';
+------------------------------------------------------------------+
| NAME                                                             |
+------------------------------------------------------------------+
| memory/performance_schema/events_statements_history.sqltext      |
| memory/performance_schema/events_statements_current.sqltext      |
| memory/performance_schema/events_statements_history_long.sqltext |
+------------------------------------------------------------------+

mysql> SELECT NAME
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'memory/performance_schema/%.tokens';
+----------------------------------------------------------------------+
| NAME                                                                 |
+----------------------------------------------------------------------+
| memory/performance_schema/events_statements_history.tokens           |
| memory/performance_schema/events_statements_current.tokens           |
| memory/performance_schema/events_statements_summary_by_digest.tokens |
| memory/performance_schema/events_statements_history_long.tokens      |
+----------------------------------------------------------------------+
```