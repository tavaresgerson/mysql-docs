#### 14.8.3.6 Salvar e restaurar o estado do pool de buffers

Para reduzir o período de aquecimento após o reinício do servidor, o `InnoDB` salva uma porcentagem das páginas mais recentemente usadas para cada pool de buffers ao desligar o servidor e restaura essas páginas ao iniciar o servidor. A porcentagem de páginas recentemente usadas que é armazenada é definida pela opção de configuração `innodb_buffer_pool_dump_pct`.

Após reiniciar um servidor ocupado, geralmente há um período de aquecimento com um aumento constante no desempenho, à medida que as páginas do disco que estavam no pool de buffer são trazidas de volta à memória (já que os mesmos dados são consultados, atualizados, etc.). A capacidade de restaurar o pool de buffer na inicialização reduz o período de aquecimento recarregando as páginas do disco que estavam no pool de buffer antes do reinício, em vez de esperar pelas operações DML acessarem as linhas correspondentes. Além disso, as solicitações de E/S podem ser realizadas em lotes grandes, tornando o E/S geral mais rápido. O carregamento das páginas acontece em segundo plano e não retarda o início da inicialização do banco de dados.

Além de salvar o estado do pool de buffers ao desligar e restaurá-lo ao ligar, você pode salvar e restaurar o estado do pool de buffers a qualquer momento, enquanto o servidor estiver em execução. Por exemplo, você pode salvar o estado do pool de buffers após atingir um desempenho estável sob uma carga de trabalho constante. Você também pode restaurar o estado anterior do pool de buffers após executar relatórios ou trabalhos de manutenção que levem páginas de dados para o pool de buffers que são necessárias apenas para essas operações, ou após executar algum outro tipo de carga de trabalho não típico.

Embora um pool de buffers possa ter vários gigabytes de tamanho, os dados do pool de buffers que o `InnoDB` salva no disco são pequenos em comparação. Apenas os IDs de espaço de tabela e IDs de página necessários para localizar as páginas apropriadas são salvos no disco. Essas informações são derivadas da tabela `INNODB_BUFFER_PAGE_LRU` do `INFORMATION_SCHEMA`. Por padrão, os dados de IDs de espaço de tabela e IDs de página são salvos em um arquivo chamado `ib_buffer_pool`, que é salvo no diretório de dados do `InnoDB`. O nome e a localização do arquivo podem ser modificados usando o parâmetro de configuração `innodb_buffer_pool_filename`.

Como os dados são armazenados na memória cache e excluídos dela conforme as operações normais do banco de dados, não há problema se as páginas do disco forem atualizadas recentemente ou se uma operação de manipulação de dados (DML) envolver dados que ainda não foram carregados. O mecanismo de carregamento ignora as páginas solicitadas que já não existem.

O mecanismo subjacente envolve um fio de fundo que é enviado para realizar as operações de dump e carregamento.

As páginas de disco de tabelas compactadas são carregadas no pool de buffers na sua forma compactada. As páginas são descompactadas normalmente quando o conteúdo das páginas é acessado durante operações DML. Como a descompactação das páginas é um processo intensivo em CPU, é mais eficiente que a concorrência realize a operação em um fio de conexão em vez de no único fio que realiza a operação de restauração do pool de buffers.

As operações relacionadas à salvamento e restauração do estado do pool de buffers são descritas nos seguintes tópicos:

- Configurando a porcentagem de descarte para páginas do pool de buffers
- Salvar o estado do Pool de Buffer ao desligar e restaurá-lo ao iniciar
- Salvar e restaurar o estado do pool de buffers online
- Exibir o progresso da varredura do pool de tampão
- Exibir o progresso da carga do Pool de Buffer
- Interrompendo uma operação de carregamento de um pool de buffers
- Monitoramento do progresso da carga do Pool de Buffer usando o Schema de Desempenho

##### Configurando a porcentagem de descarte para páginas do pool de buffers

Antes de descartar páginas do pool de buffer, você pode configurar a porcentagem de páginas do pool de buffer mais recentemente usadas que você deseja descartar, definindo a opção `innodb_buffer_pool_dump_pct`. Se você planeja descartar páginas do pool de buffer enquanto o servidor estiver em execução, você pode configurar a opção dinamicamente:

```sql
SET GLOBAL innodb_buffer_pool_dump_pct=40;
```

Se você planeja descartar as páginas do buffer pool ao desligar o servidor, defina `innodb_buffer_pool_dump_pct` no arquivo de configuração.

```sql
[mysqld]
innodb_buffer_pool_dump_pct=40
```

O valor padrão de `innodb_buffer_pool_dump_pct` foi alterado de 100 (descartar todas as páginas) para 25 (descartar 25% das páginas mais recentemente usadas) no MySQL 5.7 quando `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup` foram habilitados por padrão.

##### Salvar o estado do Pool de Buffer ao desligar e restaurá-lo ao iniciar

Para salvar o estado do pool de buffers ao desligar o servidor, execute a seguinte instrução antes de desligar o servidor:

```sql
SET GLOBAL innodb_buffer_pool_dump_at_shutdown=ON;
```

`innodb_buffer_pool_dump_at_shutdown` está habilitado por padrão.

Para restaurar o estado do pool de tampão ao iniciar o servidor, especifique a opção `--innodb-buffer-pool-load-at-startup` ao iniciar o servidor:

```sql
mysqld --innodb-buffer-pool-load-at-startup=ON;
```

`innodb_buffer_pool_load_at_startup` está habilitado por padrão.

##### Salvar e restaurar o estado do pool de buffers online

Para salvar o estado do pool de buffers enquanto o servidor MySQL estiver em execução, execute a seguinte instrução:

```sql
SET GLOBAL innodb_buffer_pool_dump_now=ON;
```

Para restaurar o estado do pool de tampão enquanto o MySQL estiver em execução, execute a seguinte instrução:

```sql
SET GLOBAL innodb_buffer_pool_load_now=ON;
```

##### Exibir o progresso da varredura do pool de tampão

Para exibir o progresso ao salvar o estado do pool de buffers no disco, execute a seguinte instrução:

```sql
SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status';
```

Se a operação ainda não tiver começado, é retornado o valor “não iniciada”. Se a operação estiver concluída, o tempo de conclusão é impresso (por exemplo, Concluído em 110505 12:18:02). Se a operação estiver em andamento, são fornecidas informações de status (por exemplo, Dumping buffer pool 5/7, página 237/2873).

##### Exibir o progresso da carga do Pool de Buffer

Para exibir o progresso durante o carregamento do pool de buffer, execute a seguinte instrução:

```sql
SHOW STATUS LIKE 'Innodb_buffer_pool_load_status';
```

Se a operação ainda não tiver começado, será retornado “não iniciada”. Se a operação estiver concluída, o tempo de conclusão será impresso (por exemplo, Concluído em 110505 12:23:24). Se a operação estiver em andamento, serão fornecidas informações de status (por exemplo, Carregando 123/22301 páginas).

##### Interrompendo uma operação de carregamento de um pool de buffers

Para abortar uma operação de carregamento do pool de buffers, execute a seguinte declaração:

```sql
SET GLOBAL innodb_buffer_pool_load_abort=ON;
```

##### Monitoramento do progresso da carga do Pool de Buffer usando o Schema de Desempenho

Você pode monitorar o progresso da carga do pool de buffers usando o Schema de Desempenho.

O exemplo a seguir demonstra como habilitar o instrumento de evento `stage/innodb/buffer pool load` e as tabelas de consumidor relacionadas para monitorar o progresso da carga do pool de buffer.

Para obter informações sobre os procedimentos de exclusão e carregamento do pool de buffers usados neste exemplo, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”. Para obter informações sobre os instrumentos de eventos de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative a ferramenta `stage/innodb/buffer pool load`:

   ```sql
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/buffer%';
   ```

2. Ative as tabelas de consumidores de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Descarte o estado atual do pool de buffer habilitando `innodb_buffer_pool_dump_now`.

   ```sql
   mysql> SET GLOBAL innodb_buffer_pool_dump_now=ON;
   ```

4. Verifique o status do dump do pool de buffer para garantir que a operação tenha sido concluída.

   ```sql
   mysql> SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status'\G
   *************************** 1. row ***************************
   Variable_name: Innodb_buffer_pool_dump_status
           Value: Buffer pool(s) dump completed at 150202 16:38:58
   ```

5. Carregue o pool de buffer habilitando `innodb_buffer_pool_load_now`:

   ```sql
   mysql> SET GLOBAL innodb_buffer_pool_load_now=ON;
   ```

6. Verifique o status atual da operação de carga do pool de buffers consultando a tabela `events_stages_current` do Schema de Desempenho. A coluna `WORK_COMPLETED` mostra o número de páginas do pool de buffers carregadas. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante, em páginas.

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           5353 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de carga do pool de buffers tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento concluído. Por exemplo:

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           7167 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

Nota

Você também pode monitorar o progresso da carga do pool de buffers usando o Schema de Desempenho ao carregar o pool de buffers no início usando `innodb_buffer_pool_load_at_startup`. Nesse caso, o instrumento `stage/innodb/buffer pool load` e os consumidores relacionados devem ser habilitados no início. Para mais informações, consulte a Seção 25.3, “Configuração de Inicialização do Schema de Desempenho”.
