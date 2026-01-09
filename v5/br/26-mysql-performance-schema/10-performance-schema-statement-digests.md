## 25.10 Resumo das declarações do esquema de desempenho

O servidor MySQL é capaz de manter informações sobre o resumo das instruções. O processo de digestão converte cada instrução SQL para uma forma normalizada (o resumo da instrução) e calcula um valor de hash MD5 (o valor de hash do digest) a partir do resultado normalizado. A normalização permite que instruções semelhantes sejam agrupadas e resumidas para expor informações sobre os tipos de instruções que o servidor está executando e com que frequência elas ocorrem. Esta seção descreve como ocorre a digestão das instruções e como ela pode ser útil.

A digestão ocorre no analisador, independentemente de o Schema de Desempenho estar disponível, para que outros componentes do servidor, como o MySQL Enterprise Firewall e os plugins de reescrita de consultas, tenham acesso às digests de instruções.

- Resumo de declarações conceitos gerais do esquema de desempenho
- Resumo de declarações no esquema de desempenho
- Resumo de declaração sobre o uso da memória dos esquemas de execução

### Resumo da Declaração Conceitos Gerais

Quando o analisador recebe uma instrução SQL, ele calcula um resumo da instrução, se esse resumo for necessário, o que é verdadeiro se qualquer uma das seguintes condições for verdadeira:

- A instrumentação do esquema de desempenho digest está habilitada
- O Firewall Empresarial MySQL está ativado
- Um plugin de reescrita de consulta está ativado

O valor da variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis por sessão para a computação de digestos normalizados de declarações. Uma vez que essa quantidade de espaço é usada durante a computação do digest, ocorre a redução: nenhum token adicional de uma declaração analisada é coletado ou incluído em seu valor de digest. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo digest normalizado de declaração e são consideradas idênticas se comparadas ou se agregadas para estatísticas de digest.

Aviso

Definir a variável de sistema `max_digest_length` para zero desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests.

Após a declaração normalizada ter sido calculada, um valor de hash MD5 é calculado a partir dela. Além disso:

- Se o MySQL Enterprise Firewall estiver ativado, ele será chamado e o digest calculado estará disponível para ele.

- Se algum plugin de reescrita de consulta estiver ativado, ele será chamado e o resumo da declaração e o valor do resumo estarão disponíveis para ele.

- Se a instrumentação de digestão do Schema de Desempenho estiver habilitada, ela faz uma cópia do digestão normalizada da declaração, alocando um máximo de [`performance_schema_max_digest_length`]\(performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length] bytes para isso. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, a cópia é truncada em relação ao original. A cópia do digestão normalizada da declaração é armazenada nas tabelas apropriadas do Schema de Desempenho, juntamente com o valor do hash MD5 calculado a partir da declaração normalizada original. (Se o Schema de Desempenho truncar sua cópia do digestão normalizada em relação ao original, ele não recompõe o valor do hash MD5.)

A normalização de declarações transforma o texto da declaração em uma representação de string de digest mais padronizada, que preserva a estrutura geral da declaração, ao mesmo tempo em que remove informações não essenciais para a estrutura:

- Os identificadores de objetos, como nomes de banco de dados e tabelas, são preservados.

- Os valores literais são convertidos em marcadores de parâmetros. Uma declaração normalizada não retém informações como nomes, senhas, datas, etc.

- Os comentários são removidos e o espaço em branco é ajustado.

Considere essas declarações:

```sql
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

Para normalizar essas declarações, o analisador substitui os valores de dados por `?` e ajusta o espaço em branco. Ambas as declarações produzem a mesma forma normalizada e, portanto, são consideradas “iguais”:

```sql
SELECT * FROM orders WHERE customer_id = ? AND quantity > ?
```

A declaração normalizada contém menos informações, mas ainda é representativa da declaração original. Outras declarações semelhantes que têm valores de dados diferentes têm a mesma forma normalizada.

Agora, considere essas declarações:

```sql
SELECT * FROM customers WHERE customer_id = 1000
SELECT * FROM orders WHERE customer_id = 1000
```

Neste caso, as declarações normalizadas diferem porque os identificadores dos objetos diferem:

```sql
SELECT * FROM customers WHERE customer_id = ?
SELECT * FROM orders WHERE customer_id = ?
```

Se a normalização produzir uma declaração que exceda o espaço disponível no buffer de digestão (determinado por `max_digest_length`), ocorre a troncamento e o texto termina com “...”. Declarações normalizadas longas que diferem apenas na parte que ocorre após o “...” são consideradas iguais. Considere estas declarações:

```sql
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

Se o corte acontecer logo após o `AND`, ambas as declarações terão essa forma normalizada:

```sql
SELECT * FROM mytable WHERE cola = ? AND ...
```

Nesse caso, a diferença no nome da segunda coluna é perdida e ambas as declarações são consideradas iguais.

### Resumo de declarações no esquema de desempenho

No Schema de Desempenho, a digestão de declarações envolve esses elementos:

- Um consumidor `statements_digest` na tabela `setup_consumers` controla se o Schema de Desempenho mantém as informações do digest. Veja Consumidor de Digest de Declarações.

- As tabelas de eventos de declarações (`events_statements_current`, `events_statements_history` e `events_statements_history_long`) têm colunas para armazenar os valores normalizados de hashes MD5 dos registros de declaração e os valores correspondentes de hash MD5 do registro de declaração:

  - `DIGEST_TEXT` é o texto do resumo normalizado da declaração. Esta é uma cópia da declaração original normalizada que foi calculada até um máximo de `max_digest_length` bytes, posteriormente truncada conforme necessário para `performance_schema_max_digest_length` bytes.

  - `DIGEST` é o valor de hash MD5 da digest gerado a partir da declaração original normalizada.

  Consulte Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

- A tabela de resumo de `eventos_estatuto_resumo_por_digest` fornece informações agregadas sobre o resumo dos estatutos. Esta tabela agrega informações para estatutos por combinação de `SCHEMA_NAME` e `DIGEST`. O Schema de Desempenho usa valores de hash MD5 para agregação porque são rápidos de calcular e têm uma distribuição estatística favorável que minimiza colisões. Veja Seção 25.12.15.3, “Tabelas de Resumo de Estatutos”.

As tabelas de eventos de declarações também possuem uma coluna `SQL_TEXT` que contém a declaração SQL original. O espaço máximo disponível para exibição da declaração é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor.

A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por declaração para o armazenamento do valor do digest no Schema de Desempenho. No entanto, o comprimento de exibição dos digests das declarações pode ser maior que o tamanho do buffer disponível devido à codificação interna dos elementos das declarações, como palavras-chave e valores literais. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos das declarações podem parecer exceder o valor da variável `performance_schema_max_digest_length`.

A tabela de resumo de `[`eventos_estatísticas_resumo_por_digest\`]\(performance-schema-statement-summary-tables.html) fornece um perfil das estatísticas executadas pelo servidor. Ela mostra que tipos de estatísticas uma aplicação está executando e com que frequência. Um desenvolvedor de aplicativos pode usar essas informações juntamente com outras informações na tabela para avaliar as características de desempenho do aplicativo. Por exemplo, as colunas da tabela que mostram tempos de espera, tempos de bloqueio ou uso de índices podem destacar tipos de consultas que são ineficientes. Isso dá ao desenvolvedor uma visão sobre quais partes do aplicativo precisam de atenção.

A tabela de resumo de ``events_statements_summary_by_digest` tem um tamanho fixo. Por padrão, o Schema de Desempenho estima o tamanho a ser usado no início. Para especificar explicitamente o tamanho da tabela, defina a variável de sistema ``performance_schema_digests_size` no início do servidor. Se a tabela ficar cheia, o Schema de Desempenho agrupa as declarações que têm valores de `SCHEMA_NAME` e `DIGEST` que não correspondem aos valores existentes na tabela em uma linha especial com `SCHEMA_NAME` e `DIGEST` definidos como `NULL`. Isso permite que todas as declarações sejam contadas. No entanto, se a linha especial representar uma porcentagem significativa das declarações executadas, pode ser desejável aumentar o tamanho da tabela de resumo aumentando `[`performance_schema_digests_size\`]\(performance-schema-system-variables.html#sysvar_performance_schema_digests_size).

### Resumo da declaração sobre o uso da memória

Para aplicações que geram declarações muito longas que diferem apenas no final, aumentar `max_digest_length` permite a computação de digests que distinguem declarações que, de outra forma, seriam agregadas ao mesmo digest. Por outro lado, diminuir `max_digest_length` faz com que o servidor dedique menos memória ao armazenamento do digest, mas aumenta a probabilidade de declarações mais longas serem agregadas ao mesmo digest. Os administradores devem ter em mente que valores maiores resultam em requisitos de memória correspondentemente aumentados, especialmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

Como descrito anteriormente, os resumos de declarações normalizados calculados pelo analisador estão limitados a um máximo de `max_digest_length` bytes, enquanto os resumos de declarações normalizados armazenados no Performance Schema utilizam `performance_schema_max_digest_length` bytes. As seguintes considerações sobre o uso de memória se aplicam aos valores relativos de `max_digest_length` e `performance_schema_max_digest_length`:

- Se `max_digest_length` for menor que `performance_schema_max_digest_length`:

  - Os componentes do servidor, além do Schema de Desempenho, utilizam descriptografias de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho não trunca mais os resumos de declarações normalizados que ele armazena, mas aloca mais memória do que os bytes de `max_digest_length`, o que é desnecessário.

- Se `max_digest_length` for igual a `performance_schema_max_digest_length`:

  - Os componentes do servidor, além do Schema de Desempenho, utilizam descriptografias de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho não trunca mais os resumos de declarações normalizados que ele armazena e aloca a mesma quantidade de memória em bytes que `max_digest_length`, por digest.

- Se `max_digest_length` for maior que `performance_schema_max_digest_length`:

  - Os componentes do servidor, além do Schema de Desempenho, utilizam descriptografias de instruções normalizadas que ocupam até `max_digest_length` bytes.

  - O Schema de Desempenho também trunca os resumos de declarações normalizados que ele armazena e aloca menos memória do que `max_digest_length` bytes por digest.

Como as tabelas de eventos das declarações do Schema de Desempenho podem armazenar muitos digests, definir `performance_schema_max_digest_length` menor que `max_digest_length` permite que os administradores equilibrem esses fatores:

- A necessidade de ter resumos de declarações normalizados por longos períodos disponíveis para componentes do servidor fora do Schema de Desempenho

- Muitas sessões concorrentes, cada uma das quais aloca memória para cálculo de digestão

- A necessidade de limitar o consumo de memória das tabelas de eventos de declaração do Gerenciamento de Desempenho ao armazenar muitos registros de declaração

O ajuste `performance_schema_max_digest_length` não é por sessão, é por declaração, e uma sessão pode armazenar múltiplas declarações na tabela `events_statements_history`. Um número típico de declarações nesta tabela é de 10 por sessão, então cada sessão consome 10 vezes a memória indicada pelo valor de `performance_schema_max_digest_length`, apenas para esta tabela.

Além disso, existem muitas declarações (e resumos) coletadas globalmente, principalmente na tabela `events_statements_history_long`. Aqui, também, as declarações armazenadas consumindo *`N`* vezes a memória indicada pelo valor da variável `performance_schema_max_digest_length` consomem *`N`* vezes a memória indicada pelo valor da variável `performance_schema_max_digest_length`.

Para avaliar a quantidade de memória usada para o armazenamento de instruções SQL e o cálculo do digest, use a instrução `SHOW ENGINE PERFORMANCE_SCHEMA STATUS`, ou monitore esses instrumentos:

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
