#### 14.8.3.6 Salvando e Restaurando o Estado do Buffer Pool

Para reduzir o período de warmup (aquecimento) após reiniciar o servidor, o `InnoDB` salva uma porcentagem das páginas usadas mais recentemente para cada `buffer pool` no desligamento do servidor e restaura essas páginas na inicialização. A porcentagem de páginas usadas recentemente que é armazenada é definida pela opção de configuração `innodb_buffer_pool_dump_pct`.

Após reiniciar um servidor ocupado, geralmente há um período de warmup com throughput (vazão) em constante aumento, à medida que as páginas de disco que estavam no `buffer pool` são trazidas de volta para a memória (à medida que os mesmos dados são consultados, atualizados, etc.). A capacidade de restaurar o `buffer pool` na inicialização encurta o período de warmup recarregando as páginas de disco que estavam no `buffer pool` antes da reinicialização, em vez de esperar que as operações DML acessem as linhas correspondentes. Além disso, as requisições de I/O podem ser executadas em grandes lotes, tornando o I/O geral mais rápido. O carregamento de páginas ocorre em segundo plano e não atrasa a inicialização do Database.

Além de salvar o estado do `buffer pool` no desligamento e restaurá-lo na inicialização, você pode salvar e restaurar o estado do `buffer pool` a qualquer momento, enquanto o servidor estiver em execução. Por exemplo, você pode salvar o estado do `buffer pool` após atingir um throughput estável sob uma workload (carga de trabalho) constante. Você também pode restaurar o estado anterior do `buffer pool` após executar relatórios ou jobs de manutenção que trazem para o `buffer pool` páginas de dados que são necessárias apenas para essas operações, ou após executar alguma outra workload não típica.

Embora um `buffer pool` possa ter muitos gigabytes de tamanho, os dados do `buffer pool` que o `InnoDB` salva no disco são minúsculos em comparação. Apenas os IDs de tablespace e os IDs de página necessários para localizar as páginas apropriadas são salvos no disco. Esta informação é derivada da tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE_LRU`. Por padrão, os dados de ID de tablespace e ID de página são salvos em um arquivo chamado `ib_buffer_pool`, que é salvo no diretório de dados do `InnoDB`. O nome e a localização do arquivo podem ser modificados usando o parâmetro de configuração `innodb_buffer_pool_filename`.

Como os dados são armazenados em cache e retirados (aged out) do `buffer pool` da mesma forma que nas operações normais do Database, não há problema se as páginas de disco forem atualizadas recentemente, ou se uma operação DML envolver dados que ainda não foram carregados. O mecanismo de carregamento ignora as páginas solicitadas que não existem mais.

O mecanismo subjacente envolve uma `thread` de fundo (background thread) que é despachada para executar as operações de dump e load.

As páginas de disco de tabelas compactadas são carregadas no `buffer pool` em sua forma compactada. As páginas são descompactadas como de costume quando o conteúdo da página é acessado durante operações DML. Como a descompactação de páginas é um processo que consome muita CPU, é mais eficiente para a concorrência realizar a operação em uma `thread` de conexão (connection thread) em vez da única `thread` que executa a operação de restauração do `buffer pool`.

As operações relacionadas a salvar e restaurar o estado do `buffer pool` são descritas nos seguintes tópicos:

* Configurando a Porcentagem de Dump para Páginas do Buffer Pool
* Salvando o Estado do Buffer Pool no Desligamento e Restaurando-o na Inicialização
* Salvando e Restaurando o Estado do Buffer Pool Online
* Exibindo o Progresso do Dump do Buffer Pool
* Exibindo o Progresso do Load do Buffer Pool
* Abortando uma Operação de Load do Buffer Pool
* Monitorando o Progresso do Load do Buffer Pool Usando o Performance Schema

##### Configurando a Porcentagem de Dump para Páginas do Buffer Pool

Antes de fazer o dump de páginas do `buffer pool`, você pode configurar a porcentagem das páginas do `buffer pool` usadas mais recentemente que você deseja despejar, configurando a opção `innodb_buffer_pool_dump_pct`. Se você planeja fazer o dump das páginas do `buffer pool` enquanto o servidor está em execução, você pode configurar a opção dinamicamente:

```sql
SET GLOBAL innodb_buffer_pool_dump_pct=40;
```

Se você planeja fazer o dump das páginas do `buffer pool` no desligamento do servidor, defina `innodb_buffer_pool_dump_pct` no seu arquivo de configuração.

```sql
[mysqld]
innodb_buffer_pool_dump_pct=40
```

O valor padrão de `innodb_buffer_pool_dump_pct` foi alterado de 100 (dump de todas as páginas) para 25 (dump de 25% das páginas usadas mais recentemente) no MySQL 5.7, quando `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` foram habilitados por padrão.

##### Salvando o Estado do Buffer Pool no Desligamento e Restaurando-o na Inicialização

Para salvar o estado do `buffer pool` no desligamento do servidor, execute a seguinte instrução antes de desligar o servidor:

```sql
SET GLOBAL innodb_buffer_pool_dump_at_shutdown=ON;
```

`innodb_buffer_pool_dump_at_shutdown` é habilitado por padrão.

Para restaurar o estado do `buffer pool` na inicialização do servidor, especifique a opção `--innodb-buffer-pool-load-at-startup` ao iniciar o servidor:

```sql
mysqld --innodb-buffer-pool-load-at-startup=ON;
```

`innodb_buffer_pool_load_at_startup` é habilitado por padrão.

##### Salvando e Restaurando o Estado do Buffer Pool Online

Para salvar o estado do `buffer pool` enquanto o servidor MySQL estiver em execução, execute a seguinte instrução:

```sql
SET GLOBAL innodb_buffer_pool_dump_now=ON;
```

Para restaurar o estado do `buffer pool` enquanto o MySQL estiver em execução, execute a seguinte instrução:

```sql
SET GLOBAL innodb_buffer_pool_load_now=ON;
```

##### Exibindo o Progresso do Dump do Buffer Pool

Para exibir o progresso ao salvar o estado do `buffer pool` no disco, execute a seguinte instrução:

```sql
SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status';
```

Se a operação ainda não tiver sido iniciada, será retornado "not started". Se a operação estiver concluída, o tempo de conclusão será exibido (ex: Finished at 110505 12:18:02). Se a operação estiver em andamento, serão fornecidas informações de status (ex: Dumping buffer pool 5/7, page 237/2873).

##### Exibindo o Progresso do Load do Buffer Pool

Para exibir o progresso ao carregar o `buffer pool`, execute a seguinte instrução:

```sql
SHOW STATUS LIKE 'Innodb_buffer_pool_load_status';
```

Se a operação ainda não tiver sido iniciada, será retornado "not started". Se a operação estiver concluída, o tempo de conclusão será exibido (ex: Finished at 110505 12:23:24). Se a operação estiver em andamento, serão fornecidas informações de status (ex: Loaded 123/22301 pages).

##### Abortando uma Operação de Load do Buffer Pool

Para abortar uma operação de load do `buffer pool`, execute a seguinte instrução:

```sql
SET GLOBAL innodb_buffer_pool_load_abort=ON;
```

##### Monitorando o Progresso do Load do Buffer Pool Usando o Performance Schema

Você pode monitorar o progresso do load do `buffer pool` usando o Performance Schema.

O exemplo a seguir demonstra como habilitar o instrument de evento de estágio `stage/innodb/buffer pool load` e as tabelas de consumidor relacionadas para monitorar o progresso do load do `buffer pool`.

Para obter informações sobre os procedimentos de dump e load do `buffer pool` usados neste exemplo, consulte a Seção 14.8.3.6, "Salvando e Restaurando o Estado do Buffer Pool". Para obter informações sobre instruments de evento de estágio do Performance Schema e consumidores relacionados, consulte a Seção 25.12.5, "Performance Schema Stage Event Tables".

1. Habilite o instrument `stage/innodb/buffer pool load`:

   ```sql
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/buffer%';
   ```

2. Habilite as tabelas de consumidor de evento de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Faça o dump do estado atual do `buffer pool` habilitando `innodb_buffer_pool_dump_now`.

   ```sql
   mysql> SET GLOBAL innodb_buffer_pool_dump_now=ON;
   ```

4. Verifique o status do dump do `buffer pool` para garantir que a operação foi concluída.

   ```sql
   mysql> SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status'\G
   *************************** 1. row ***************************
   Variable_name: Innodb_buffer_pool_dump_status
           Value: Buffer pool(s) dump completed at 150202 16:38:58
   ```

5. Carregue o `buffer pool` habilitando `innodb_buffer_pool_load_now`:

   ```sql
   mysql> SET GLOBAL innodb_buffer_pool_load_now=ON;
   ```

6. Verifique o status atual da operação de load do `buffer pool` consultando a tabela `events_stages_current` do Performance Schema. A coluna `WORK_COMPLETED` mostra o número de páginas do `buffer pool` carregadas. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante, em páginas.

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           5353 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de load do `buffer pool` tiver sido concluída. Neste caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento concluído. Por exemplo:

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           7167 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

Note

Você também pode monitorar o progresso do load do `buffer pool` usando o Performance Schema ao carregar o `buffer pool` na inicialização usando `innodb_buffer_pool_load_at_startup`. Neste caso, o instrument `stage/innodb/buffer pool load` e os consumidores relacionados devem ser habilitados na inicialização. Para mais informações, consulte a Seção 25.3, "Performance Schema Startup Configuration".