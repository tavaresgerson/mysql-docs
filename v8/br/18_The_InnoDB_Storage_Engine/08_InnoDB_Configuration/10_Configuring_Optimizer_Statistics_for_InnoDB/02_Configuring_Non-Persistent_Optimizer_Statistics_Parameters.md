#### 17.8.10.2 Configurando parâmetros de estatísticas do otimizador não persistentes

Esta seção descreve como configurar estatísticas de otimizador não persistentes. As estatísticas do otimizador não são armazenadas em disco quando `innodb_stats_persistent=OFF` ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Em vez disso, as estatísticas são armazenadas na memória e são perdidas quando o servidor é desligado. As estatísticas também são atualizadas periodicamente por certas operações e sob certas condições.

As estatísticas do otimizador são persistidas no disco por padrão, habilitadas pela opção de configuração `innodb_stats_persistent`. Para obter informações sobre estatísticas persistentes do otimizador, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas Otimizadoras Persistentes”.

##### Atualizações de estatísticas do otimizador

As estatísticas do otimizador não persistentes são atualizadas quando:

- Executando `ANALYZE TABLE`.

- Executando `SHOW TABLE STATUS`, `SHOW INDEX` ou consultando as tabelas do esquema de informações `TABLES` ou `STATISTICS` com a opção `innodb_stats_on_metadata` habilitada.

  A configuração padrão para `innodb_stats_on_metadata` é `OFF`. Ativação de `innodb_stats_on_metadata` pode reduzir a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices, e reduzir a estabilidade dos planos de execução para consultas que envolvem tabelas `InnoDB`. `innodb_stats_on_metadata` é configurado globalmente usando uma declaração `SET`.

  ```
  SET GLOBAL innodb_stats_on_metadata=ON
  ```

  Nota

  `innodb_stats_on_metadata` só se aplica quando as estatísticas do otimizador estão configuradas para não serem persistentes (quando `innodb_stats_persistent` está desativado).

- Iniciar um cliente **mysql** com a opção `--auto-rehash` habilitada, que é a opção padrão. A opção `auto-rehash` faz com que todas as tabelas `InnoDB` sejam abertas, e as operações de abertura de tabelas fazem com que as estatísticas sejam recalculadas.

  Para melhorar o tempo de inicialização do cliente **mysql** e atualizar as estatísticas, você pode desativar `auto-rehash` usando a opção `--disable-auto-rehash`. O recurso `auto-rehash` permite a autocompletar automaticamente os nomes de banco de dados, tabelas e colunas para usuários interativos.

- Primeiro, uma tabela é aberta.

- `InnoDB` detecta que 1/16 da tabela foi modificada desde a última atualização das estatísticas.

##### Configurar o número de páginas amostradas

O otimizador de consultas do MySQL usa estatísticas estimadas sobre as distribuições de chaves para escolher os índices para um plano de execução, com base na seletividade relativa do índice. Quando o `InnoDB` atualiza as estatísticas do otimizador, ele amostra páginas aleatórias de cada índice em uma tabela para estimar a cardinalidade do índice. (Essa técnica é conhecida como mergulhos aleatórios.)

Para lhe dar controle sobre a qualidade da estimativa estatística (e, assim, melhores informações para o otimizador de consultas), você pode alterar o número de páginas amostradas usando o parâmetro `innodb_stats_transient_sample_pages`. O número padrão de páginas amostradas é 8, o que pode ser insuficiente para produzir uma estimativa precisa, levando a escolhas de índices inadequadas pelo otimizador de consultas. Essa técnica é especialmente importante para tabelas grandes e tabelas usadas em junções. Escaneamentos completos de tabelas desnecessários para essas tabelas podem ser um problema de desempenho substancial. Consulte a Seção 10.2.1.23, “Evitar Escaneamentos Completos de Tabelas”, para dicas sobre o ajuste dessas consultas. `innodb_stats_transient_sample_pages` é um parâmetro global que pode ser definido em tempo de execução.

O valor de `innodb_stats_transient_sample_pages` afeta a amostragem do índice para todas as tabelas e índices `InnoDB` quando `innodb_stats_persistent=0`. Esteja ciente dos seguintes impactos potencialmente significativos ao alterar o tamanho da amostra do índice:

- Valores pequenos, como 1 ou 2, podem resultar em estimativas imprecisas de cardinalidade.

- Aumentar o valor de `innodb_stats_transient_sample_pages` pode exigir mais leituras de disco. Valores muito maiores que 8 (por exemplo, 100) podem causar um atraso significativo no tempo necessário para abrir uma tabela ou executar `SHOW TABLE STATUS`.

- O otimizador pode escolher planos de consulta muito diferentes com base em diferentes estimativas de seletividade do índice.

Seja qual for o valor de `innodb_stats_transient_sample_pages` que funcione melhor para um sistema, defina a opção e deixe-a nesse valor. Escolha um valor que resulte em estimativas razoavelmente precisas para todas as tabelas do seu banco de dados sem exigir um I/O excessivo. Como as estatísticas são recalculadas automaticamente em vários momentos, além da execução de `ANALYZE TABLE`, não faz sentido aumentar o tamanho da amostra do índice, executar `ANALYZE TABLE` e, em seguida, diminuir o tamanho da amostra novamente.

Tabelas menores geralmente exigem menos amostras de índice do que tabelas maiores. Se o seu banco de dados tiver muitas tabelas grandes, considere usar um valor maior para `innodb_stats_transient_sample_pages` do que se você tiver principalmente tabelas menores.
