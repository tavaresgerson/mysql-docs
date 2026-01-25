#### 14.8.11.2 Configurando Parâmetros de Estatísticas do Optimizer Não Persistentes

Esta seção descreve como configurar estatísticas do Optimizer não persistentes. As estatísticas do Optimizer não são persistidas em disco quando `innodb_stats_persistent=OFF` ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Em vez disso, as estatísticas são armazenadas na memória e são perdidas quando o servidor é desligado. As estatísticas também são atualizadas periodicamente por certas operações e sob certas condições.

A partir do MySQL 5.6.6, as estatísticas do Optimizer são persistidas em disco por padrão, ativadas pela opção de configuração `innodb_stats_persistent`. Para obter informações sobre estatísticas do Optimizer persistentes, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistentes”.

##### Atualizações de Estatísticas do Optimizer

As estatísticas do Optimizer não persistentes são atualizadas quando:

* Executar `ANALYZE TABLE`.
* Executar `SHOW TABLE STATUS`, `SHOW INDEX`, ou consultar as tabelas `TABLES` ou `STATISTICS` do Information Schema com a opção `innodb_stats_on_metadata` ativada.

  A configuração padrão para `innodb_stats_on_metadata` foi alterada para `OFF` quando as estatísticas do Optimizer persistentes foram habilitadas por padrão no MySQL 5.6.6. Habilitar `innodb_stats_on_metadata` pode reduzir a velocidade de acesso para schemas que possuem um grande número de tabelas ou Indexes, e reduzir a estabilidade dos *Execution Plans* para Queries que envolvem tabelas `InnoDB`. `innodb_stats_on_metadata` é configurada globalmente usando uma instrução `SET`.

  ```sql
  SET GLOBAL innodb_stats_on_metadata=ON
  ```

  Nota

  `innodb_stats_on_metadata` aplica-se apenas quando as estatísticas do Optimizer estão configuradas para serem não persistentes (quando `innodb_stats_persistent` está desativado).

* Iniciar um cliente **mysql** com a opção `--auto-rehash` ativada, que é o padrão. A opção `auto-rehash` faz com que todas as tabelas `InnoDB` sejam abertas, e as operações de abertura de tabela causam o recálculo das estatísticas.

  Para melhorar o tempo de inicialização do cliente **mysql** e a atualização das estatísticas, você pode desativar `auto-rehash` usando a opção `--disable-auto-rehash`. O recurso `auto-rehash` permite a conclusão automática de nomes de Database, tabela e coluna para usuários interativos.

* Uma tabela é aberta pela primeira vez.
* O `InnoDB` detecta que 1 / 16 da tabela foi modificado desde a última vez em que as estatísticas foram atualizadas.

##### Configurando o Número de Páginas Amostradas (*Sampled Pages*)

O Optimizer de Query do MySQL usa estatísticas estimadas sobre as distribuições de chaves para escolher os Indexes para um *Execution Plan*, com base na seletividade relativa do Index. Quando o `InnoDB` atualiza as estatísticas do Optimizer, ele amostra páginas aleatórias de cada Index em uma tabela para estimar a *Cardinality* do Index. (Essa técnica é conhecida como *random dives*.)

Para permitir que você controle a qualidade da estimativa das estatísticas (e, portanto, forneça melhor informação para o Optimizer de Query), você pode alterar o número de páginas amostradas usando o parâmetro `innodb_stats_transient_sample_pages`. O número padrão de páginas amostradas é 8, o que pode ser insuficiente para produzir uma estimativa precisa, levando a escolhas ruins de Index por parte do Optimizer de Query. Esta técnica é especialmente importante para tabelas grandes e tabelas usadas em JOINs. *Full Table Scans* desnecessários para tais tabelas podem ser um problema substancial de performance. Consulte a Seção 8.2.1.20, “Evitando Full Table Scans” para obter dicas sobre o ajuste dessas Queries. `innodb_stats_transient_sample_pages` é um parâmetro global que pode ser definido em tempo de execução (*runtime*).

O valor de `innodb_stats_transient_sample_pages` afeta a amostragem de Index para todas as tabelas e Indexes `InnoDB` quando `innodb_stats_persistent=0`. Esteja ciente dos seguintes impactos potencialmente significativos ao alterar o tamanho da amostra de Index:

* Valores pequenos, como 1 ou 2, podem resultar em estimativas imprecisas de *Cardinality*.

* Aumentar o valor de `innodb_stats_transient_sample_pages` pode exigir mais leituras de disco (*disk reads*). Valores muito maiores que 8 (digamos, 100) podem causar uma lentidão significativa no tempo necessário para abrir uma tabela ou executar `SHOW TABLE STATUS`.

* O Optimizer pode escolher *Query Plans* muito diferentes com base em diferentes estimativas de seletividade de Index.

Seja qual for o valor de `innodb_stats_transient_sample_pages` que funcione melhor para um sistema, defina a opção e mantenha esse valor. Escolha um valor que resulte em estimativas razoavelmente precisas para todas as tabelas no seu Database sem exigir I/O excessiva. Como as estatísticas são recalculadas automaticamente em vários momentos, além da execução de `ANALYZE TABLE`, não faz sentido aumentar o tamanho da amostra do Index, executar `ANALYZE TABLE` e depois diminuir o tamanho da amostra novamente.

Tabelas menores geralmente exigem menos amostras de Index do que tabelas maiores. Se o seu Database tiver muitas tabelas grandes, considere usar um valor mais alto para `innodb_stats_transient_sample_pages` do que se você tiver principalmente tabelas menores.