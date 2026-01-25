#### 14.21.5.3 Otimizando o Desempenho do Plugin InnoDB memcached

Como o uso do `InnoDB` em combinação com o **memcached** envolve a escrita de todos os dados no disco, seja imediatamente ou em algum momento posterior, espera-se que o desempenho bruto seja um pouco mais lento do que usando o **memcached** por si só. Ao usar o plugin `InnoDB` **memcached**, concentre os objetivos de tuning (ajustes) para operações **memcached** em alcançar um desempenho superior ao das operações SQL equivalentes.

Benchmarks sugerem que as Queries e operações DML (inserts, updates e deletes) que utilizam a interface **memcached** são mais rápidas do que o SQL tradicional. As operações DML geralmente apresentam melhorias maiores. Portanto, considere adaptar primeiro as aplicações com alta intensidade de escrita (write-intensive) para usar a interface **memcached**. Considere também priorizar a adaptação de aplicações write-intensive que utilizam mecanismos rápidos e leves que carecem de confiabilidade.

##### Adaptando Queries SQL

Os tipos de Queries que são mais adequados para requisições `GET` simples são aquelas com uma única cláusula ou um conjunto de condições `AND` na cláusula `WHERE`:

```sql
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

Para obter o melhor desempenho, implante o plugin `daemon_memcached` em máquinas que estejam configuradas como servidores Database típicos, onde a maior parte da RAM do sistema é dedicada ao `InnoDB` buffer pool, através da opção de configuração `innodb_buffer_pool_size`. Para sistemas com buffer pools de multi-gigabytes, considere aumentar o valor de `innodb_buffer_pool_instances` para obter throughput máximo quando a maioria das operações envolver dados que já estão em cache na memória.

##### Reduzindo I/O Redundante

O `InnoDB` possui uma série de configurações que permitem escolher o equilíbrio entre alta confiabilidade, em caso de falha (crash), e a quantidade de overhead de I/O durante workloads de alta escrita. Por exemplo, considere definir `innodb_doublewrite` para `0` e `innodb_flush_log_at_trx_commit` para `2`. Meça o desempenho com diferentes configurações de `innodb_flush_method`.

Nota

`innodb_support_xa` está deprecated (obsoleto); espere que seja removido em uma versão futura. A partir do MySQL 5.7.10, o suporte do `InnoDB` para two-phase commit em XA transactions está sempre habilitado, e desabilitar `innodb_support_xa` não é mais permitido.

Para outras formas de reduzir ou otimizar (tune) o I/O para operações de tabela, consulte a Seção 8.5.8, “Otimizando I/O de Disco do InnoDB”.

##### Reduzindo o Overhead Transacional

Um valor default (padrão) de 1 para `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` é destinado à máxima confiabilidade dos resultados e segurança dos dados armazenados ou atualizados.

Dependendo do tipo de aplicação, você pode aumentar uma ou ambas as configurações para reduzir o overhead de operações de commit frequentes. Em um sistema ocupado, você pode aumentar `daemon_memcached_r_batch_size`, sabendo que as alterações nos dados feitas através do SQL podem não se tornar visíveis para o **memcached** imediatamente (ou seja, até que mais *`N`* operações `get` sejam processadas). Ao processar dados onde cada operação de write deve ser armazenada de forma confiável, mantenha `daemon_memcached_w_batch_size` definido como `1`. Aumente a configuração ao processar um grande número de updates destinados apenas à análise estatística, onde a perda dos últimos *`N`* updates em uma saída inesperada é um risco aceitável.

Por exemplo, imagine um sistema que monitora o tráfego que atravessa uma ponte movimentada, registrando dados para aproximadamente 100.000 veículos por dia. Se a aplicação contar diferentes tipos de veículos para analisar padrões de tráfego, mudar `daemon_memcached_w_batch_size` de `1` para `100` reduz o overhead de I/O para operações de commit em 99%. Em caso de interrupção (outage), um máximo de 100 registros são perdidos, o que pode ser uma margem de erro aceitável. Se, em vez disso, a aplicação realizasse a cobrança automática de pedágio para cada carro, você definiria `daemon_memcached_w_batch_size` como `1` para garantir que cada registro de pedágio seja imediatamente salvo em disco.

Devido à maneira como o `InnoDB` organiza os valores das chaves **memcached** no disco, se você tiver um grande número de chaves para criar, pode ser mais rápido ordenar os itens de dados por valor de chave na aplicação e `add` (adicioná-los) em ordem classificada, em vez de criar chaves em ordem arbitrária.

O comando **memslap**, que faz parte da distribuição regular do **memcached**, mas não está incluído no plugin `daemon_memcached`, pode ser útil para fazer o benchmarking de diferentes configurações. Ele também pode ser usado para gerar pares de chave-valor de amostra para serem usados em seus próprios benchmarks.