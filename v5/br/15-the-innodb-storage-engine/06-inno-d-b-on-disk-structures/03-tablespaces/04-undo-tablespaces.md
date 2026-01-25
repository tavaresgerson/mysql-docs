#### 14.6.3.4 Undo Tablespaces

Os Undo tablespaces contêm undo logs, que são coleções de registros que contêm informações sobre como desfazer a alteração mais recente feita por uma transaction em um registro de clustered index.

Por padrão, os undo logs são armazenados no system tablespace, mas podem ser armazenados em um ou mais undo tablespaces. O uso de undo tablespaces pode reduzir a quantidade de espaço necessária para undo logs em qualquer tablespace. Os padrões de I/O para undo logs também tornam os undo tablespaces bons candidatos para armazenamento em SSD.

O número de undo tablespaces utilizados pelo `InnoDB` é controlado pela opção `innodb_undo_tablespaces`. Esta opção só pode ser configurada durante a inicialização da instância MySQL. Não pode ser alterada posteriormente.

Note

A opção `innodb_undo_tablespaces` está obsoleta (deprecated); espera-se que seja removida em uma versão futura.

Os Undo tablespaces e segmentos individuais dentro desses tablespaces não podem ser descartados (dropped). No entanto, os undo logs armazenados em undo tablespaces podem ser truncados. Para mais informações, consulte Truncating Undo Tablespaces.

##### Configurando Undo Tablespaces

Este procedimento descreve como configurar undo tablespaces. Quando os undo tablespaces são configurados, os undo logs são armazenados neles em vez do system tablespace.

O número de undo tablespaces só pode ser configurado ao inicializar uma instância MySQL e é fixo durante toda a vida útil da instância. Portanto, é recomendável que você execute o procedimento a seguir em uma instância de teste com uma workload representativa antes de implantar a configuração em um sistema de produção.

Para configurar undo tablespaces:

1. Especifique um local de diretório para os undo tablespaces usando a variável `innodb_undo_directory`. Se um local de diretório não for especificado, os undo tablespaces serão criados no data directory.

2. Defina o número de rollback segments usando a variável `innodb_rollback_segments`. Comece com um valor relativamente baixo e aumente-o incrementalmente ao longo do tempo para examinar o efeito no desempenho. A configuração padrão para `innodb_rollback_segments` é 128, que também é o valor máximo.

   Um rollback segment é sempre atribuído ao system tablespace, e 32 rollback segments são reservados para o temporary tablespace (`ibtmp1`). Portanto, para alocar rollback segments para undo tablespaces, defina `innodb_rollback_segments` com um valor maior que 33. Por exemplo, se você tiver dois undo tablespaces, defina `innodb_rollback_segments` como 35 para atribuir um rollback segment a cada um dos dois undo tablespaces. Os rollback segments são distribuídos entre os undo tablespaces de forma circular.

   Quando você adiciona undo tablespaces, o rollback segment no system tablespace se torna inativo.

3. Defina o número de undo tablespaces usando a opção `innodb_undo_tablespaces`. O número especificado de undo tablespaces é fixo para a vida útil da instância MySQL, portanto, se você não tiver certeza sobre um valor ideal, estime um valor alto.

4. Crie uma nova instância de teste MySQL usando as configurações escolhidas.

5. Use uma workload realista em sua instância de teste com volume de dados semelhante ao de seus servidores de produção para testar a configuração.

6. Faça um Benchmark do desempenho de workloads com uso intensivo de I/O.
7. Aumente periodicamente o valor de `innodb_rollback_segments` e execute novamente os testes de desempenho até que não haja mais melhorias no desempenho de I/O.

##### Truncando Undo Tablespaces

Para truncar undo tablespaces, é necessário que a instância MySQL tenha um mínimo de dois undo tablespaces ativos, o que garante que um undo tablespace permaneça ativo enquanto o outro é retirado de operação para ser truncado. O número de undo tablespaces é definido pela variável `innodb_undo_tablespaces`. O valor padrão é 0. Use esta instrução para verificar o valor de `innodb_undo_tablespaces`:

```sql
mysql> SELECT @@innodb_undo_tablespaces;
+---------------------------+
| @@innodb_undo_tablespaces |
+---------------------------+
|                         2 |
+---------------------------+
```

Para que os undo tablespaces sejam truncados, habilite a variável `innodb_undo_log_truncate`. Por exemplo:

```sql
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

Quando a variável `innodb_undo_log_truncate` está habilitada, os undo tablespaces que excedem o limite de tamanho definido pela variável `innodb_max_undo_log_size` estão sujeitos a Truncation. A variável `innodb_max_undo_log_size` é dinâmica e tem um valor padrão de 1073741824 bytes (1024 MiB).

```sql
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

Quando a variável `innodb_undo_log_truncate` está habilitada:

1. Os Undo tablespaces que excedem a configuração de `innodb_max_undo_log_size` são marcados para Truncation. A seleção de um undo tablespace para Truncation é realizada de forma circular para evitar truncar o mesmo undo tablespace repetidamente.

2. Os Rollback segments que residem no undo tablespace selecionado são tornados inativos para que não sejam atribuídos a novas transactions. As transactions existentes que estão atualmente usando rollback segments podem ser concluídas.

3. O sistema de purge esvazia os rollback segments, liberando undo logs que não estão mais em uso.

4. Depois que todos os rollback segments no undo tablespace são liberados, a operação de Truncate é executada e trunca o undo tablespace para o seu tamanho inicial. O tamanho inicial de um undo tablespace depende do valor de `innodb_page_size`. Para o page size padrão de 16KB, o tamanho inicial do arquivo undo tablespace é 10MiB. Para page sizes de 4KB, 8KB, 32KB e 64KB, os tamanhos iniciais dos arquivos undo tablespace são 7MiB, 8MiB, 20MiB e 40MiB, respectivamente.

   O tamanho de um undo tablespace após uma operação de Truncate pode ser maior do que o tamanho inicial devido ao uso imediato após a conclusão da operação.

   A variável `innodb_undo_directory` define a localização dos arquivos undo tablespace. Se a variável `innodb_undo_directory` não estiver definida, os undo tablespaces residem no data directory.

5. Os Rollback segments são reativados para que possam ser atribuídos a novas transactions.

###### Acelerando o Truncation de Undo Tablespaces

O purge thread é responsável por esvaziar e truncar os undo tablespaces. Por padrão, o purge thread procura por undo tablespaces para truncar uma vez a cada 128 invocações do purge. A frequência com que o purge thread procura por undo tablespaces para truncar é controlada pela variável `innodb_purge_rseg_truncate_frequency`, que tem uma configuração padrão de 128.

```sql
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

Para aumentar a frequência, diminua a configuração de `innodb_purge_rseg_truncate_frequency`. Por exemplo, para que o purge thread procure por undo tablespaces uma vez a cada 32 invocações do purge, defina `innodb_purge_rseg_truncate_frequency` como 32.

```sql
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

Quando o purge thread encontra um undo tablespace que requer Truncation, o purge thread retorna com frequência aumentada para esvaziar e truncar rapidamente o undo tablespace.

###### Impacto no Desempenho ao Truncar Arquivos de Undo Tablespace

Quando um undo tablespace é truncado, os rollback segments no undo tablespace são desativados. Os rollback segments ativos em outros undo tablespaces assumem a responsabilidade por toda a carga do sistema, o que pode resultar em uma leve degradação no desempenho. A extensão em que o desempenho é afetado depende de uma série de fatores:

* Número de undo tablespaces
* Número de undo logs
* Tamanho do undo tablespace
* Velocidade do subsistema de I/O
* Transactions existentes de longa duração
* Carga do sistema (System load)

A maneira mais fácil de evitar o potencial impacto no desempenho é aumentar o número de undo tablespaces.

Além disso, duas operações de checkpoint são realizadas durante uma operação de Truncate de undo tablespace. A primeira operação de checkpoint remove as páginas antigas do undo tablespace do Buffer Pool. O segundo checkpoint descarrega as páginas iniciais do novo undo tablespace para o disco. Em um sistema ocupado, o primeiro checkpoint, em particular, pode afetar temporariamente o desempenho do sistema se houver um grande número de páginas a serem removidas.

###### Recuperação de Truncation de Undo Tablespace

Uma operação de Truncate de undo tablespace cria um arquivo temporário `undo_space_number_trunc.log` no diretório de log do servidor. Esse diretório de log é definido por `innodb_log_group_home_dir`. Se ocorrer uma falha do sistema durante a operação de Truncate, o arquivo de log temporário permite que o processo de inicialização identifique os undo tablespaces que estavam sendo truncados e continue a operação.