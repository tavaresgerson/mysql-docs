## 29.10 Análises de Digestas de Estruturas de Estruturas de Estruturas e Amostragem

O servidor MySQL é capaz de manter informações de digestas de estruturas de estruturas. O processo de digestas converte cada instrução SQL para uma forma normalizada (a digestas da instrução) e calcula um valor de hash SHA-256 (o valor de hash da digestas) a partir do resultado normalizado. A normalização permite que instruções semelhantes sejam agrupadas e resumidas para expor informações sobre os tipos de instruções que o servidor está executando e com que frequência elas ocorrem. Para cada digestas, uma instrução representativa que produz a digestas é armazenada como uma amostra. Esta seção descreve como a digestas de estruturas e a amostragem ocorrem e como elas podem ser úteis.

A digestas ocorre no analisador, independentemente de o Schema de Desempenho estar disponível, para que outras funcionalidades, como o Firewall Empresarial MySQL e os plugins de reescrita de consultas, tenham acesso às digestas de estruturas.

* Conceitos Gerais de Digestas de Estruturas
* Digestas de Estruturas no Schema de Desempenho
* Uso de Memória de Digestas de Estruturas
* Amostragem de Estruturas

### Conceitos Gerais de Digestas de Estruturas

Quando o analisador recebe uma instrução SQL, ele calcula uma digestas da instrução se essa digestas for necessária, o que é verdadeiro se qualquer uma das seguintes condições for verdadeira:

* A instrumentação de digestas do Schema de Desempenho está habilitada
* O Firewall Empresarial MySQL está habilitado
* Um plugin de reescrita de consultas está habilitado

O analisador também é usado pelas funções `STATEMENT_DIGEST_TEXT()` e `STATEMENT_DIGEST()`, que as aplicações podem chamar para calcular uma digestas da instrução normalizada e um valor de hash de digestas, respectivamente, a partir de uma instrução SQL.

O valor da variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis por sessão para a computação de digests de declarações normalizados. Uma vez que essa quantidade de espaço é usada durante a computação do digest, ocorre a redução: nenhum token adicional de uma declaração analisada é coletado ou incluído em seu valor de digest. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo digest de declaração normalizada e são consideradas idênticas quando comparadas ou quando agregadas para estatísticas de digest.

Aviso

Definir o valor da variável de sistema `max_digest_length` para zero desativa a produção de digestes, o que também desativa a funcionalidade do servidor que requer digests.

Após a declaração normalizada ter sido computada, um valor de hash SHA-256 é calculado a partir dela. Além disso:

* Se o MySQL Enterprise Firewall estiver habilitado, ele é chamado e o digest calculado está disponível para ele.

* Se qualquer plugin de reescrita de consulta estiver habilitado, ele é chamado e o digest da declaração e o valor de digest estão disponíveis para ele.

* Se o Schema de Desempenho tiver instrumentação de digest habilitada, ele faz uma cópia do digest de declaração normalizada, alocando um máximo de `performance_schema_max_digest_length` bytes para ele. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, a cópia é reduzida em relação ao original. A cópia do digest de declaração normalizada é armazenada nas tabelas apropriadas do Schema de Desempenho, juntamente com o valor de hash SHA-256 calculado a partir da declaração normalizada original. (Se o Schema de Desempenho reduzir sua cópia do digest de declaração normalizada em relação ao original, ele não recompõe o valor de hash SHA-256.)

A normalização de declarações transforma o texto da declaração em uma representação de string de digest mais padronizada, que preserva a estrutura geral da declaração, enquanto remove informações não essenciais para a estrutura:

* Identificadores de objetos, como nomes de banco de dados e tabelas, são preservados.
* Valores literais são convertidos em marcadores de parâmetros. Uma declaração normalizada não retém informações como nomes, senhas, datas, etc.
* Comentários são removidos e o espaço em branco é ajustado.

Considere estas declarações:

```
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

Para normalizar essas declarações, o analisador substitui os valores de dados por `?` e ajusta o espaço em branco. Ambas as declarações produzem a mesma forma normalizada e, portanto, são consideradas “iguais”:

```
SELECT * FROM orders WHERE customer_id = ? AND quantity > ?
```

A declaração normalizada contém menos informações, mas ainda é representativa da declaração original. Outras declarações semelhantes que têm valores de dados diferentes têm a mesma forma normalizada.

Agora, considere estas declarações:

```
SELECT * FROM customers WHERE customer_id = 1000
SELECT * FROM orders WHERE customer_id = 1000
```

Neste caso, as declarações normalizadas diferem porque os identificadores de objetos diferem:

```
SELECT * FROM customers WHERE customer_id = ?
SELECT * FROM orders WHERE customer_id = ?
```

Se a normalização produz uma declaração que excede o espaço disponível no buffer de digest (determinado por `max_digest_length`), ocorre a troncamento e o texto termina com “...”. Declarações normalizadas longas que diferem apenas na parte que ocorre após o “...” são consideradas iguais. Considere estas declarações:

```
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

Se o corte acontecer imediatamente após o `AND`, ambas as declarações têm esta forma normalizada:

```
SELECT * FROM mytable WHERE cola = ? AND ...
```

Neste caso, a diferença no nome da segunda coluna é perdida e ambas as declarações são consideradas iguais.

### Digests de Declarações no Schema de Desempenho

No Schema de Desempenho, a digest de declarações envolve esses elementos:

* Um consumidor `statements_digest` na tabela `setup_consumers` controla se o Schema de Desempenho mantém as informações do digest. Veja o Consumidor de Digest de Declarações.

* As tabelas de eventos de declarações (`events_statements_current`, `events_statements_history` e `events_statements_history_long`) têm colunas para armazenar digests de declarações normalizados e os valores correspondentes de hash SHA-256 do digest:

  + `DIGEST_TEXT` é o texto do digest de declaração normalizado. Esta é uma cópia da declaração normalizada original que foi calculada até um máximo de `max_digest_length` bytes, subsequentemente truncada conforme necessário para `performance_schema_max_digest_length` bytes.

  + `DIGEST` é o valor de hash SHA-256 do digest calculado a partir da declaração normalizada original.

Veja a Seção 29.12.6, “Tabelas de Eventos de Declarações do Schema de Desempenho”.

* A tabela de resumo `events_statements_summary_by_digest` fornece informações agregadas sobre digests de declarações. Esta tabela agrega informações para declarações por combinação de `SCHEMA_NAME` e `DIGEST`. O Schema de Desempenho usa valores de hash SHA-256 para agregação porque são rápidos de calcular e têm uma distribuição estatística favorável que minimiza colisões. Veja a Seção 29.12.20.3, “Tabelas de Resumo de Declarações”.

Algumas Tabelas de Desempenho têm uma coluna que armazena declarações SQL originais a partir das quais os digests são calculados:

* A coluna `SQL_TEXT` das tabelas de eventos de declarações `events_statements_current`, `events_statements_history` e `events_statements_history_long`.

* A coluna `QUERY_SAMPLE_TEXT` da tabela de resumo `events_statements_summary_by_digest`.

O espaço máximo disponível para exibição de declarações é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. As alterações afetam o armazenamento necessário para todas as colunas mencionadas.

A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por declaração para o armazenamento do valor do digest no Schema de Desempenho. No entanto, o comprimento de exibição dos digests das declarações pode ser maior que o tamanho do buffer disponível devido à codificação interna dos elementos das declarações, como palavras-chave e valores literais. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de declarações podem parecer exceder o valor de `performance_schema_max_digest_length`.

A tabela de resumo `events_statements_summary_by_digest` fornece um perfil das declarações executadas pelo servidor. Ela mostra que tipos de declarações uma aplicação está executando e com que frequência. Um desenvolvedor de aplicações pode usar essas informações juntamente com outras informações na tabela para avaliar as características de desempenho da aplicação. Por exemplo, as colunas da tabela que mostram tempos de espera, tempos de bloqueio ou uso de índices podem destacar tipos de consultas que são ineficientes. Isso dá ao desenvolvedor uma visão sobre quais partes da aplicação precisam de atenção.

A tabela de resumo `events_statements_summary_by_digest` tem um tamanho fixo. Por padrão, o Schema de Desempenho estima o tamanho a ser usado no início. Para especificar explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_digests_size` no início do servidor. Se a tabela ficar cheia, o Schema de Desempenho agrupa as declarações que têm valores de `SCHEMA_NAME` e `DIGEST` que não correspondem aos valores existentes na tabela em uma linha especial com `SCHEMA_NAME` e `DIGEST` definidos como `NULL`. Isso permite que todas as declarações sejam contadas. No entanto, se a linha especial representar uma porcentagem significativa das declarações executadas, pode ser desejável aumentar o tamanho da tabela de resumo aumentando `performance_schema_digests_size`.

### Uso de Memória do Digest de Declarações

Para aplicações que geram declarações muito longas que diferem apenas no final, aumentar `max_digest_length` permite a computação de digests que distinguem declarações que, de outra forma, seriam agregadas ao mesmo digest. Por outro lado, diminuir `max_digest_length` faz com que o servidor dedique menos memória ao armazenamento do digest, mas aumenta a probabilidade de declarações mais longas serem agregadas ao mesmo digest. Os administradores devem ter em mente que valores maiores resultam em requisitos de memória correspondentemente aumentados, particularmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

Como descrito anteriormente, os resumos de declarações normalizados calculados pelo analisador são limitados a um máximo de `max_digest_length` bytes, enquanto os resumos de declarações normalizados armazenados no Performance Schema usam `performance_schema_max_digest_length` bytes. As seguintes considerações sobre o uso de memória se aplicam aos valores relativos de `max_digest_length` e `performance_schema_max_digest_length`:

* Se `max_digest_length` for menor que `performance_schema_max_digest_length`:

  + Recursos do servidor, exceto o Performance Schema, usam resumos de declarações normalizados que ocupam até `max_digest_length` bytes.

  + O Performance Schema não corta mais os resumos de declarações normalizados que armazena, mas aloca mais memória do que `max_digest_length` bytes por digest, o que é desnecessário.

* Se `max_digest_length` for igual a `performance_schema_max_digest_length`:

  + Recursos do servidor, exceto o Performance Schema, usam resumos de declarações normalizados que ocupam até `max_digest_length` bytes.

  + O Performance Schema não corta mais os resumos de declarações normalizados que armazena, e aloca a mesma quantidade de memória que `max_digest_length` bytes por digest.

* Se `max_digest_length` for maior que `performance_schema_max_digest_length`:

  + Recursos do servidor, exceto o Performance Schema, usam resumos de declarações normalizados que ocupam até `max_digest_length` bytes.

  + O Performance Schema corta ainda mais os resumos de declarações normalizados que armazena, e aloca menos memória do que `max_digest_length` bytes por digest.

Como as tabelas de eventos de declarações do Performance Schema podem armazenar muitos resumos, definir `performance_schema_max_digest_length` menor que `max_digest_length` permite que os administradores equilibrem esses fatores:

* A necessidade de ter resumos de declarações normalizados por longo prazo disponíveis para recursos do servidor fora do Schema de Desempenho
* Muitas sessões concorrentes, cada uma das quais aloca memória para a computação de resumos
* A necessidade de limitar o consumo de memória pelo evento de declaração do Schema de Desempenho ao armazenar muitos resumos de declarações
O ajuste `performance_schema_max_digest_length` não é por sessão, é por declaração, e uma sessão pode armazenar várias declarações na tabela `events_statements_history`. Um número típico de declarações nesta tabela é de 10 por sessão, então cada sessão consome 10 vezes a memória indicada pelo valor `performance_schema_max_digest_length`, apenas para esta tabela.

Além disso, há muitos resumos (e declarações) coletados globalmente, notavelmente na tabela `events_statements_history_long`. Aqui, também, *`N`* declarações armazenadas consomem *`N`* vezes a memória indicada pelo valor `performance_schema_max_digest_length`.

Para avaliar a quantidade de memória usada para o armazenamento de declarações SQL e a computação de resumos, use a declaração `SHOW ENGINE PERFORMANCE_SCHEMA STATUS`, ou monitore esses instrumentos:

```
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

### Amostragem de Declarações

O Schema de Desempenho usa a amostragem de declarações para coletar declarações representativas que produzem cada valor de resumo na tabela `events_statements_summary_by_digest`. Essas colunas armazenam informações de declarações de amostra: `QUERY_SAMPLE_TEXT` (o texto da declaração), `QUERY_SAMPLE_SEEN` (quando a declaração foi vista) e `QUERY_SAMPLE_TIMER_WAIT` (o tempo de espera ou execução da declaração). O Schema de Desempenho atualiza todas as três colunas toda vez que escolhe uma declaração de amostra.

Quando uma nova linha de tabela é inserida, a instrução que produziu o valor do resumo da amostra é armazenada como a instrução atual associada ao resumo. Em seguida, quando o servidor vê outras instruções com o mesmo valor de resumo, ele determina se deve usar a nova instrução para substituir a instrução atual da amostra (ou seja, se deve fazer uma nova amostragem). A política de amostragem baseia-se nos tempos de espera comparativos da instrução atual da amostra e da nova instrução e, opcionalmente, na idade da instrução atual da amostra:

* Amostragem baseada em tempos de espera: Se o tempo de espera da nova instrução for maior que o da instrução atual da amostra, ela se torna a instrução atual da amostra.

* Amostragem baseada em idade: Se a variável de sistema `performance_schema_max_digest_sample_age` tiver um valor maior que zero e a instrução atual da amostra tiver mais de tantos segundos de idade, a instrução atual é considerada “muito antiga” e a nova instrução a substitui. Isso ocorre mesmo se o tempo de espera da nova instrução for menor que o da instrução atual da amostra.

Por padrão, `performance_schema_max_digest_sample_age` é de 60 segundos (1 minuto). Para alterar a rapidez com que as instruções da amostra “expiram” devido à idade, aumente ou diminua o valor. Para desabilitar a parte baseada em idade da política de amostragem, defina `performance_schema_max_digest_sample_age` para 0.