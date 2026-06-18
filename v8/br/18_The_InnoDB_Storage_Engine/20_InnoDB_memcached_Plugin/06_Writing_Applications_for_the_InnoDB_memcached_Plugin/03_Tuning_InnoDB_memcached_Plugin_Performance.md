#### 17.20.6.3 Ajuste do desempenho do plugin InnoDB memcached

Como o uso de `InnoDB` em combinação com o **memcached** envolve a gravação de todos os dados no disco, seja imediatamente ou em algum momento posterior, espera-se que o desempenho bruto seja um pouco mais lento do que o uso do **memcached** por si só. Ao usar o plugin **memcached** `InnoDB`, foque nos objetivos de ajuste para as operações do **memcached** em alcançar um melhor desempenho do que as operações SQL equivalentes.

Os benchmarks sugerem que as consultas e operações de manipulação de dados (inserções, atualizações e exclusões) que utilizam a interface **memcached** são mais rápidas do que as operações SQL tradicionais. As operações de manipulação de dados geralmente apresentam melhorias maiores. Portanto, considere adaptar primeiro as aplicações intensivas em escrita para usar a interface **memcached**. Além disso, considere priorizar a adaptação de aplicações intensivas em escrita que utilizam mecanismos rápidos e leves que não oferecem confiabilidade.

##### Adaptando Consultas SQL

Os tipos de consultas mais adequados para solicitações simples do `GET` são aquelas com uma única cláusula ou um conjunto de condições do `AND` na cláusula do `WHERE`:

```
SQL:
SELECT col FROM tbl WHERE key = 'key_value';

memcached:
get key_value

SQL:
SELECT col FROM tbl WHERE col1 = val1 and col2 = val2 and col3 = val3;

memcached:
# Since you must always know these 3 values to look up the key,
# combine them into a unique string and use that as the key
# for all ADD, SET, and GET operations.
key_value = val1 + ":" + val2 + ":" + val3
get key_value

SQL:
SELECT 'key exists!' FROM tbl
  WHERE EXISTS (SELECT col1 FROM tbl WHERE KEY = 'key_value') LIMIT 1;

memcached:
# Test for existence of key by asking for its value and checking if the call succeeds,
# ignoring the value itself. For existence checking, you typically only store a very
# short value such as "1".
get key_value
```

##### Usando a Memória do Sistema

Para obter o melhor desempenho, implante o plugin `daemon_memcached` em máquinas configuradas como servidores de banco de dados típicos, onde a maioria da RAM do sistema é dedicada ao pool de buffers `InnoDB`, por meio da opção de configuração `innodb_buffer_pool_size`. Para sistemas com pools de buffers de vários gigabytes, considere aumentar o valor de `innodb_buffer_pool_instances` para obter o máximo desempenho quando a maioria das operações envolve dados que já estão em cache na memória.

##### Reduzir o I/O redundante

`InnoDB` tem várias configurações que permitem escolher o equilíbrio entre alta confiabilidade, em caso de falha, e a quantidade de overhead de E/S durante cargas de trabalho de escrita elevadas. Por exemplo, considere definir `innodb_doublewrite` para `0` e `innodb_flush_log_at_trx_commit` para `2`. Meça o desempenho com diferentes configurações de `innodb_flush_method`.

Para outras maneiras de reduzir ou ajustar o I/O para operações de tabela, consulte a Seção 10.5.8, “Otimização do I/O de Disco do InnoDB”.

##### Reduzindo o custo operacional das transações

Um valor padrão de 1 para `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` é destinado à máxima confiabilidade dos resultados e segurança dos dados armazenados ou atualizados.

Dependendo do tipo de aplicação, você pode aumentar um ou ambos esses ajustes para reduzir o overhead das operações de commit frequentes. Em um sistema ocupado, você pode aumentar `daemon_memcached_r_batch_size`, sabendo que as alterações nos dados feitas por meio do SQL podem não se tornar visíveis para o **memcached** imediatamente (ou seja, até que mais `N` operações `get` sejam processadas). Ao processar dados onde cada operação de escrita deve ser armazenada de forma confiável, deixe `daemon_memcached_w_batch_size` definido como `1`. Aumente o ajuste ao processar um grande número de atualizações destinadas apenas à análise estatística, onde perder as últimas `N` atualizações em uma saída inesperada é um risco aceitável.

Por exemplo, imagine um sistema que monitora o tráfego que passa por uma ponte movimentada, registrando dados de aproximadamente 100.000 veículos por dia. Se o aplicativo contar diferentes tipos de veículos para analisar os padrões de tráfego, alterar `daemon_memcached_w_batch_size` de `1` para `100` reduz o overhead de I/O para operações de commit em 99%. Em caso de uma interrupção, no máximo 100 registros são perdidos, o que pode ser uma margem de erro aceitável. Se, em vez disso, o aplicativo realizasse a cobrança automatizada de pedágio para cada carro, você configuraria `daemon_memcached_w_batch_size` para `1` para garantir que cada registro de pedágio seja salvo imediatamente no disco.

Devido à forma como o `InnoDB` organiza os valores de chave do **memcached** no disco, se você tiver um grande número de chaves a serem criadas, pode ser mais rápido ordenar os itens de dados por valor de chave no aplicativo e `add`-os em ordem ordenada, em vez de criar chaves em ordem aleatória.

O comando **memslap**, que faz parte da distribuição regular do **memcached**, mas não está incluído no plugin `daemon_memcached`, pode ser útil para avaliar diferentes configurações. Ele também pode ser usado para gerar pares de chave-valor de amostra para uso em seus próprios benchmarks.
