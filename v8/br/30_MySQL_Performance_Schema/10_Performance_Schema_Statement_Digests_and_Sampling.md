## 29.10 Digestas e Amostragem de Declarações do Schema de Desempenho

O servidor MySQL é capaz de manter informações sobre o resumo das instruções. O processo de digestão converte cada instrução SQL em um formato normalizado (o resumo da instrução) e calcula um valor de hash SHA-256 (o valor de hash do resumo) a partir do resultado normalizado. A normalização permite que instruções semelhantes sejam agrupadas e resumidas para expor informações sobre os tipos de instruções que o servidor está executando e com que frequência elas ocorrem. Para cada resumo, uma instrução representativa que produz o resumo é armazenada como uma amostra. Esta seção descreve como a digestão e a amostragem das instruções ocorrem e como elas podem ser úteis.

A digestão ocorre no analisador, independentemente de o Schema de Desempenho estar disponível, para que outros recursos, como o MySQL Enterprise Firewall e os plugins de reescrita de consultas, tenham acesso às digests de instruções.

- Resumo da Declaração Conceitos Gerais
- Resumo de declarações no esquema de desempenho
- Resumo da declaração sobre o uso da memória
- Amostragem de declarações

### Resumo da Declaração Conceitos Gerais

Quando o analisador recebe uma instrução SQL, ele calcula um resumo da instrução, se esse resumo for necessário, o que é verdadeiro se qualquer uma das seguintes condições for verdadeira:

- A instrumentação do esquema de desempenho digest está habilitada
- O Firewall Empresarial MySQL está ativado
- Um plugin de reescrita de consulta está ativado

O analisador também é usado pelas funções `STATEMENT_DIGEST_TEXT()` e `STATEMENT_DIGEST()`, que as aplicações podem chamar para calcular um resumo normalizado de uma declaração e um valor de hash de resumo, respectivamente, a partir de uma declaração SQL.

O valor da variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis por sessão para a computação de resumos normalizados de declarações. Uma vez que essa quantidade de espaço é usada durante a computação do resumo, ocorre a redução: nenhum token adicional de uma declaração analisada é coletado ou incluído no valor do resumo. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo resumo normalizado de declarações e são consideradas idênticas se comparadas ou se agregadas para estatísticas de resumo.

Aviso

Definir a variável de sistema `max_digest_length` para zero desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests.

Após a declaração normalizada ter sido calculada, um valor de hash SHA-256 é calculado a partir dela. Além disso:

- Se o MySQL Enterprise Firewall estiver ativado, ele será chamado e o digest calculado estará disponível para ele.

- Se algum plugin de reescrita de consulta estiver ativado, ele será chamado e o resumo da declaração e o valor do resumo estarão disponíveis para ele.

- Se o Schema de Desempenho tiver a instrumentação de digest ativada, ele faz uma cópia do digest normalizado da declaração, alocando um máximo de `performance_schema_max_digest_length` bytes para ela. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, a cópia é truncada em relação ao original. A cópia do digest normalizado da declaração é armazenada nas tabelas apropriadas do Schema de Desempenho, juntamente com o valor de hash SHA-256 calculado a partir da declaração normalizada original. (Se o Schema de Desempenho truncar sua cópia do digest normalizado em relação ao original, ele não recompõe o valor de hash SHA-256.)

A normalização de declarações transforma o texto da declaração em uma representação de string de digest mais padronizada, que preserva a estrutura geral da declaração, ao mesmo tempo em que remove informações não essenciais para a estrutura:

- Os identificadores de objetos, como nomes de banco de dados e tabelas, são preservados.

- Os valores literais são convertidos em marcadores de parâmetros. Uma declaração normalizada não retém informações como nomes, senhas, datas, etc.

- Os comentários são removidos e o espaço em branco é ajustado.

Considere essas declarações:

```
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

Para normalizar essas declarações, o analisador substitui os valores dos dados por `?` e ajusta o espaço em branco. Ambas as declarações produzem a mesma forma normalizada e, portanto, são consideradas “iguais”:

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

Se a normalização produzir uma declaração que exceda o espaço disponível no buffer de digestão (determinado por `max_digest_length`), ocorre a troncamento e o texto termina com “...”. Declarações normalizadas longas que diferem apenas na parte que ocorre após o “...” são consideradas iguais. Considere estas declarações:

```
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

Se o corte acontecer logo após o `AND`, ambas as declarações terão essa forma normalizada:

```
SELECT * FROM mytable WHERE cola = ? AND ...
```

Nesse caso, a diferença no nome da segunda coluna é perdida e ambas as declarações são consideradas iguais.

### Resumo de declarações no esquema de desempenho

No Schema de Desempenho, a digestão de declarações envolve esses elementos:

- Um consumidor `statements_digest` na tabela `setup_consumers` controla se o Schema de Desempenho mantém as informações de digestão. Veja Consumidor de Digestão de Declaração.

- As tabelas de eventos de declaração (`events_statements_current`, `events_statements_history` e `events_statements_history_long`) têm colunas para armazenar os resumos normalizados das declarações e os valores correspondentes de hash SHA-256 do resumo:

  - `DIGEST_TEXT` é o texto do resumo normalizado da declaração. Esta é uma cópia da declaração normalizada original que foi calculada até um máximo de `max_digest_length` bytes, posteriormente truncada conforme necessário para `performance_schema_max_digest_length` bytes.

  - `DIGEST` é o valor de hash SHA-256 da digest gerado a partir da declaração original normalizada.

  Consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

- A tabela de resumo `events_statements_summary_by_digest` fornece informações agregadas do resumo das declarações. Esta tabela agrega informações para declarações por combinação de `SCHEMA_NAME` e `DIGEST`. O Schema de Desempenho usa valores de hash SHA-256 para agregação, pois eles são rápidos de calcular e têm uma distribuição estatística favorável que minimiza colisões. Veja a Seção 29.12.20.3, “Tabelas de Resumo de Declarações”.

Algumas tabelas de desempenho têm uma coluna que armazena instruções SQL originais das quais os digests são calculados:

- A coluna `SQL_TEXT` das tabelas de eventos das declarações `events_statements_current`, `events_statements_history` e `events_statements_history_long`.

- A coluna `QUERY_SAMPLE_TEXT` da tabela de resumo `events_statements_summary_by_digest`.

O espaço máximo disponível para exibição de declarações é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` no início do servidor. As alterações afetam o armazenamento necessário para todas as colunas mencionadas acima.

A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por declaração para armazenamento do valor do digest no Schema de Desempenho. No entanto, o comprimento da exibição dos digests das declarações pode ser maior que o tamanho do buffer disponível devido à codificação interna dos elementos das declarações, como palavras-chave e valores literais. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos das declarações podem parecer exceder o valor `performance_schema_max_digest_length`.

A tabela de resumo `events_statements_summary_by_digest` fornece um perfil das declarações executadas pelo servidor. Ela mostra que tipos de declarações uma aplicação está executando e com que frequência. Um desenvolvedor de aplicativos pode usar essas informações, juntamente com outras informações na tabela, para avaliar as características de desempenho do aplicativo. Por exemplo, as colunas da tabela que mostram tempos de espera, tempos de bloqueio ou uso de índices podem destacar tipos de consultas que são ineficientes. Isso dá ao desenvolvedor uma visão sobre quais partes do aplicativo precisam de atenção.

A tabela de resumo `events_statements_summary_by_digest` tem um tamanho fixo. Por padrão, o Schema de Desempenho estima o tamanho a ser usado no início. Para especificar explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_digests_size` no início do servidor. Se a tabela ficar cheia, o Schema de Desempenho agrupa as instruções que têm os valores `SCHEMA_NAME` e `DIGEST` que não correspondem aos valores existentes na tabela em uma linha especial com os valores `SCHEMA_NAME` e `DIGEST` definidos como `NULL`. Isso permite que todas as instruções sejam contadas. No entanto, se a linha especial representar uma porcentagem significativa das instruções executadas, pode ser desejável aumentar o tamanho da tabela de resumo aumentando `performance_schema_digests_size`.

### Resumo da declaração sobre o uso da memória

Para aplicações que geram declarações muito longas que diferem apenas no final, aumentar `max_digest_length` permite a computação de digests que distinguem declarações que, de outra forma, seriam agregadas ao mesmo digest. Por outro lado, diminuir `max_digest_length` faz com que o servidor dedique menos memória ao armazenamento do digest, mas aumenta a probabilidade de declarações mais longas serem agregadas ao mesmo digest. Os administradores devem ter em mente que valores maiores resultam em requisitos de memória correspondentemente aumentados, especialmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

Como descrito anteriormente, os resumos de declarações normalizados calculados pelo analisador são limitados a um máximo de `max_digest_length` bytes, enquanto os resumos de declarações normalizados armazenados no Performance Schema utilizam `performance_schema_max_digest_length` bytes. As seguintes considerações sobre o uso de memória se aplicam aos valores relativos de `max_digest_length` e `performance_schema_max_digest_length`:

- Se `max_digest_length` for menor que `performance_schema_max_digest_length`:

  - Os recursos do servidor que não fazem parte do Schema de Desempenho utilizam descrições de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho não trunca mais os resumos de instruções normalizados que ele armazena, mas aloca mais memória do que `max_digest_length` bytes por resumo, o que é desnecessário.

- Se `max_digest_length` for igual a `performance_schema_max_digest_length`:

  - Os recursos do servidor que não fazem parte do Schema de Desempenho utilizam descrições de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho não trunca mais os resumos de instruções normalizados que ele armazena e aloca a mesma quantidade de memória em `max_digest_length` bytes por resumo.

- Se `max_digest_length` for maior que `performance_schema_max_digest_length`:

  - Os recursos do servidor que não fazem parte do Schema de Desempenho utilizam descrições de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho também trunca os resumos de declarações normalizados que ele armazena e aloca menos memória do que `max_digest_length` bytes por resumo.

Como as tabelas de eventos das declarações do Schema de Desempenho podem armazenar muitos digests, definir `performance_schema_max_digest_length` menor que `max_digest_length` permite que os administradores equilibrem esses fatores:

- A necessidade de ter resumos de declarações normalizados por longos períodos disponíveis para recursos do servidor fora do Schema de Desempenho

- Muitas sessões concorrentes, cada uma das quais aloca memória para cálculo de digestão

- A necessidade de limitar o consumo de memória das tabelas de eventos de declaração do Gerenciamento de Desempenho ao armazenar muitos registros de declaração

O ajuste `performance_schema_max_digest_length` não é por sessão, é por declaração, e uma sessão pode armazenar múltiplas declarações na tabela `events_statements_history`. Um número típico de declarações nesta tabela é de 10 por sessão, então cada sessão consome 10 vezes a memória indicada pelo valor `performance_schema_max_digest_length`, apenas para esta tabela.

Além disso, existem muitas declarações (e resumos) coletadas globalmente, principalmente na tabela `events_statements_history_long`. Aqui, também, as declarações de `N` armazenadas consomem `N` vezes a memória indicada pelo valor de `performance_schema_max_digest_length`.

Para avaliar a quantidade de memória usada para o armazenamento de instruções SQL e o cálculo do digest, use a instrução `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` ou monitore esses instrumentos:

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

O Schema de Desempenho usa a amostragem de declarações para coletar declarações representativas que produzem cada valor de digestão na tabela `events_statements_summary_by_digest`. Essas colunas armazenam informações de declarações amostradas: `QUERY_SAMPLE_TEXT` (o texto da declaração), `QUERY_SAMPLE_SEEN` (quando a declaração foi vista) e `QUERY_SAMPLE_TIMER_WAIT` (o tempo de espera ou execução da declaração). O Schema de Desempenho atualiza todas as três colunas toda vez que escolhe uma declaração amostral.

Quando uma nova linha de tabela é inserida, a instrução que produziu o valor do resumo da linha é armazenada como a instrução de amostra atual associada ao resumo. Em seguida, quando o servidor vê outras instruções com o mesmo valor do resumo, ele determina se deve usar a nova instrução para substituir a instrução de amostra atual (ou seja, se deve resampler). A política de resampling é baseada nos tempos de espera comparativos da instrução de amostra atual e da nova instrução e, opcionalmente, na idade da instrução de amostra atual:

- Reescalonamento com base nos tempos de espera: Se o novo tempo de espera da declaração for maior que o da declaração da amostra atual, ela se torna a declaração da amostra atual.

- Reescalonamento com base na idade: Se a variável de sistema `performance_schema_max_digest_sample_age` tiver um valor maior que zero e a declaração de amostra atual tiver mais de tantos segundos, a declaração atual é considerada “muito antiga” e a nova declaração a substitui. Isso ocorre mesmo se o tempo de espera da nova declaração for menor que o da declaração de amostra atual.

Por padrão, `performance_schema_max_digest_sample_age` é de 60 segundos (1 minuto). Para alterar a rapidez com que as declarações de amostra "expiram" devido à idade, aumente ou diminua o valor. Para desabilitar a parte baseada na idade da política de reamostragem, defina `performance_schema_max_digest_sample_age` para 0.
