## 29.10 Análise de digestos de declarações de desempenho e amostragem

O servidor MySQL é capaz de manter informações sobre o resumo das declarações. O processo de digestão converte cada declaração SQL em uma forma normalizada (o resumo da declaração) e calcula um valor de hash SHA-256 (o valor de hash do digest) a partir do resultado normalizado. A normalização permite que declarações semelhantes sejam agrupadas e resumidas para expor informações sobre os tipos de declarações que o servidor está executando e quantas vezes elas ocorrem. Para cada digest, uma declaração representativa que produz o digest é armazenada como uma amostra. Esta seção descreve como a digestão e a amostragem de declarações ocorrem e como elas podem ser úteis.

A digestão ocorre no analisador, independentemente de o Schema de Desempenho estar disponível, de modo que outros recursos, como o MySQL Enterprise Firewall e os plugins de reescrita de consultas, tenham acesso a digests de declarações.

* Diagrama de declaração Conceitos gerais
* Diagrama de declaração no esquema de desempenho
* Diagrama de declaração Uso de memória
* Amostragem de declaração

### Diagrama de Declarações Conceitos Gerais

Quando o analisador recebe uma declaração SQL, ele calcula um digest de declaração se esse digest for necessário, o que é verdadeiro se alguma das seguintes condições for verdadeira:

* A instrumentação do esquema de desempenho é habilitada
* O Firewall Empresarial MySQL é habilitado
* O plugin de reescrita de consulta é habilitado

O analisador também é utilizado pelas funções `STATEMENT_DIGEST_TEXT()` e `STATEMENT_DIGEST()`, que as aplicações podem chamar para calcular um resumo normalizado de declaração e um valor de hash de digestão, respectivamente, a partir de uma declaração SQL.

O valor da variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis por sessão para o cálculo de digests de declarações normalizados. Uma vez que esse espaço é utilizado durante o cálculo do digest, ocorre a truncagem: não são coletados mais tokens de uma declaração analisada ou incluídos em seu valor de digest. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo digest de declaração normalizada e são consideradas idênticas se comparadas ou se agregadas para estatísticas de digest.

Aviso

Definir a variável de sistema `max_digest_length` como zero desativa a produção de digestão, o que também desativa a funcionalidade do servidor que requer digestões.

Após a declaração normalizada ter sido calculada, um valor de hash SHA-256 é calculado a partir dela. Além disso:

* Se o MySQL Enterprise Firewall estiver habilitado, ele é chamado e o digest calculado está disponível para ele.

* Se qualquer plugin de reescrita de consulta estiver habilitado, ele é chamado e o digest do enunciado e o valor do digest estão disponíveis para ele.

* Se o Schema de Desempenho tiver instrumentação de digest ativada, ele faz uma cópia do digest normalizado da declaração, alocando um máximo de `performance_schema_max_digest_length` bytes para ela. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, a cópia é truncada em relação ao original. A cópia do digest normalizado da declaração é armazenada nas tabelas apropriadas do Schema de Desempenho, juntamente com o valor de hash SHA-256 calculado a partir da declaração normalizada original. (Se o Schema de Desempenho truncar sua cópia do digest normalizado em relação ao original, ele não recompõe o valor de hash SHA-256.)

A normalização de declarações transforma o texto da declaração em uma representação mais padronizada de string de digest que preserva a estrutura geral da declaração, ao mesmo tempo em que remove informações que não são essenciais para a estrutura:

* Os identificadores de objeto, como nomes de banco de dados e tabelas, são preservados.

* Os valores literais são convertidos em marcadores de parâmetro. Uma declaração normalizada não retém informações como nomes, senhas, datas, etc.

* Os comentários são removidos e o espaço em branco é ajustado.

Considere essas declarações:

```
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

Para normalizar essas declarações, o analisador substitui os valores dos dados por `?` e ajusta o espaço em branco. Ambas as declarações produzem a mesma forma normalizada e, portanto, são consideradas “as mesmas”:

```
SELECT * FROM orders WHERE customer_id = ? AND quantity > ?
```

A declaração normalizada contém menos informações, mas ainda é representativa da declaração original. Outras declarações semelhantes que têm valores de dados diferentes têm a mesma forma normalizada.

Agora, considere essas declarações:

```
SELECT * FROM customers WHERE customer_id = 1000
SELECT * FROM orders WHERE customer_id = 1000
```

Neste caso, as declarações normalizadas diferem porque os identificadores dos objetos diferem:

```
SELECT * FROM customers WHERE customer_id = ?
SELECT * FROM orders WHERE customer_id = ?
```

Se a normalização produzir uma declaração que exceda o espaço disponível no buffer de digestão (determinado por `max_digest_length`), ocorre a troncamento e o texto termina com “...”. Declarações longas normalizadas que diferem apenas na parte que ocorre após o “...” são consideradas iguais. Considere essas declarações:

```
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

Se o corte acontecer imediatamente após o `AND`, ambas as declarações têm essa forma normalizada:

```
SELECT * FROM mytable WHERE cola = ? AND ...
```

Neste caso, a diferença no nome da segunda coluna é perdida e ambas as declarações são consideradas iguais.

### Resumos de declaração no Schema de desempenho

No Schema de Desempenho, a digestão de declarações envolve esses elementos:

* Um consumidor `statements_digest` na tabela `setup_consumers` controla se o Schema de Desempenho mantém informações de digestão. Veja o Consumidor de Digestão de Declaração.

* As tabelas de eventos de declaração (`events_statements_current`, `events_statements_history` e `events_statements_history_long`) possuem colunas para armazenar descriptografias normalizadas de declarações e os valores correspondentes de hash SHA-256 do descriptograma:

+ `DIGEST_TEXT` é o texto do resumo da declaração normalizada. Esta é uma cópia da declaração original normalizada que foi calculada até um máximo de `max_digest_length` bytes, posteriormente reduzida conforme necessário para `performance_schema_max_digest_length` bytes.

+ `DIGEST` é o valor de hash SHA-256 da digesta computada a partir da declaração original normalizada.

Veja a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

* A tabela de resumo `events_statements_summary_by_digest` fornece informações agregadas do extrato de declarações. Esta tabela agrega informações para declarações por combinação de `SCHEMA_NAME` e `DIGEST`. O Schema de Desempenho utiliza valores de hash SHA-256 para agregação, pois são rápidos de calcular e têm uma distribuição estatística favorável que minimiza colisões. Veja a Seção 29.12.20.3, “Tabelas de Resumo de Declarações”.

Algumas tabelas de desempenho têm uma coluna que armazena declarações SQL originais das quais os digests são calculados:

* A coluna `SQL_TEXT` das tabelas de eventos de declaração `events_statements_current`, `events_statements_history` e `events_statements_history_long`.

* A coluna `QUERY_SAMPLE_TEXT` da tabela de resumo `events_statements_summary_by_digest`.

O espaço máximo disponível para exibição de declaração é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor. As alterações afetam o armazenamento necessário para todas as colunas mencionadas acima.

A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por declaração para armazenamento do valor do digest no Schema de Desempenho. No entanto, o comprimento de exibição dos digests das declarações pode ser maior que o tamanho do buffer disponível devido à codificação interna dos elementos das declarações, como palavras-chave e valores literais. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de declaração podem parecer exceder o valor do `performance_schema_max_digest_length`.

A tabela de resumo `events_statements_summary_by_digest` fornece um perfil das declarações executadas pelo servidor. Ela mostra que tipos de declarações uma aplicação está executando e com que frequência. Um desenvolvedor de aplicativos pode usar essas informações juntamente com outras informações na tabela para avaliar as características de desempenho da aplicação. Por exemplo, as colunas da tabela que mostram tempos de espera, tempos de bloqueio ou uso de índices podem destacar tipos de consultas que são ineficientes. Isso dá ao desenvolvedor uma visão sobre quais partes da aplicação precisam de atenção.

A tabela de resumo `events_statements_summary_by_digest` tem um tamanho fixo. Por padrão, o Schema de Desempenho estima o tamanho a ser usado no início. Para especificar explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_digests_size` no início do servidor. Se a tabela ficar cheia, o Schema de Desempenho agrupa as declarações que têm os valores `SCHEMA_NAME` e `DIGEST` que não correspondem aos valores existentes na tabela em uma linha especial com `SCHEMA_NAME` e `DIGEST` definidos como `NULL`. Isso permite que todas as declarações sejam contadas. No entanto, se a linha especial representar uma porcentagem significativa das declarações executadas, pode ser desejável aumentar o tamanho da tabela de resumo aumentando `performance_schema_digests_size`.

### Diálogo sobre o uso da memória ###

Para aplicações que geram declarações muito longas que diferem apenas no final, aumentar `max_digest_length` permite o cálculo de digests que distinguem declarações que, de outra forma, seriam agregadas ao mesmo digest. Por outro lado, diminuir `max_digest_length` faz com que o servidor dedique menos memória ao armazenamento do digest, mas aumenta a probabilidade de declarações mais longas serem agregadas ao mesmo digest. Os administradores devem ter em mente que valores maiores resultam em requisitos de memória correspondentemente aumentados, particularmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

Como descrito anteriormente, os compêndios de declaração normalizados calculados pelo analisador são limitados a um máximo de `max_digest_length` bytes, enquanto os compêndios de declaração normalizados armazenados no Performance Schema utilizam `performance_schema_max_digest_length` bytes. As seguintes considerações sobre o uso de memória se aplicam em relação aos valores relativos de `max_digest_length` e `performance_schema_max_digest_length`:

* Se `max_digest_length` for menor que `performance_schema_max_digest_length`:

+ Os servidores que utilizam recursos além do Schema de Desempenho utilizam descriptografias de declarações normalizadas que ocupam até `max_digest_length` bytes.

+ O Schema de Desempenho não corta mais os resumos de declarações normalizadas que ele armazena, mas aloca mais memória do que os `max_digest_length` bytes por digest, o que é desnecessário.

* Se `max_digest_length` for igual a `performance_schema_max_digest_length`:

+ Os servidores que utilizam recursos além do Schema de Desempenho utilizam descriptografias de declarações normalizadas que ocupam até `max_digest_length` bytes.

+ O Schema de Desempenho não corta ainda mais os compêndios de declarações normalizadas que ele armazena e aloca a mesma quantidade de memória que `max_digest_length` bytes por compêndio.

* Se `max_digest_length` for maior que `performance_schema_max_digest_length`:

+ Os servidores que utilizam recursos além do Schema de Desempenho utilizam descriptografias de declarações normalizadas que ocupam até `max_digest_length` bytes.

+ O Schema de Desempenho ainda trunca os resumos de declarações normalizados que ele armazena e aloca menos memória do que `max_digest_length` bytes por digest.

Como as tabelas de eventos de declarações do Schema de desempenho podem armazenar muitos descriptografias, definir `performance_schema_max_digest_length` menor que `max_digest_length` permite que os administradores equilibrem esses fatores:

* A necessidade de ter resumos de declarações longos normalizados disponíveis para recursos do servidor fora do Schema de Desempenho

* Muitas sessões concorrentes, cada uma das quais aloca memória para cálculo de digestão

* A necessidade de limitar o consumo de memória das tabelas de eventos de declaração do Schema de desempenho ao armazenar muitos digests de declaração

O ajuste `performance_schema_max_digest_length` não é por sessão, é por declaração, e uma sessão pode armazenar várias declarações na tabela `events_statements_history`. Um número típico de declarações nesta tabela é de 10 por sessão, então cada sessão consome 10 vezes a memória indicada pelo valor `performance_schema_max_digest_length`, apenas para esta tabela.

Além disso, existem muitas declarações (e resumos) coletadas globalmente, principalmente na tabela `events_statements_history_long`. Aqui, também, as declarações de *`N`* armazenadas consomem *`N`* vezes a memória indicada pelo valor `performance_schema_max_digest_length`.

Para avaliar a quantidade de memória usada para o armazenamento de declarações SQL e o cálculo do digest, use a declaração `SHOW ENGINE PERFORMANCE_SCHEMA STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement"), ou monitore esses instrumentos:

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

### Amostragem de declarações

O Schema de Desempenho usa a amostragem de declarações para coletar declarações representativas que produzem cada valor de digestão na tabela `events_statements_summary_by_digest`. Essas colunas armazenam informações de declarações amostradas: `QUERY_SAMPLE_TEXT` (o texto da declaração), `QUERY_SAMPLE_SEEN` (quando a declaração foi vista) e `QUERY_SAMPLE_TIMER_WAIT` (o tempo de espera ou execução da declaração). O Schema de Desempenho atualiza todas as três colunas cada vez que escolhe uma declaração amostrada.

Quando uma nova linha de tabela é inserida, a declaração que produziu o valor do resumo da linha é armazenada como a declaração atual associada ao resumo. Posteriormente, quando o servidor vê outras declarações com o mesmo valor do resumo, ele determina se deve usar a nova declaração para substituir a declaração de amostra atual (ou seja, se deve fazer uma nova amostragem). A política de amostragem é baseada nos tempos de espera comparativos da declaração de amostra atual e da nova declaração e, opcionalmente, na idade da declaração de amostra atual:

* Resampling baseado em tempos de espera: Se o novo tempo de espera da declaração tiver um tempo de espera maior do que o da declaração atual da amostra, ela se torna a declaração atual da amostra.

* Resampling baseado na idade: Se a variável de sistema `performance_schema_max_digest_sample_age` tiver um valor maior que zero e a declaração de amostra atual tiver mais de tantos segundos, a declaração atual é considerada “muito antiga” e a nova declaração a substitui. Isso ocorre mesmo se o tempo de espera da nova declaração for menor que o da declaração de amostra atual.

Por padrão, `performance_schema_max_digest_sample_age` é de 60 segundos (1 minuto). Para alterar a rapidez com que as declarações de amostra "expiram" devido à idade, aumente ou reduza o valor. Para desabilitar a parte baseada na idade da política de resampling, defina `performance_schema_max_digest_sample_age` como 0.