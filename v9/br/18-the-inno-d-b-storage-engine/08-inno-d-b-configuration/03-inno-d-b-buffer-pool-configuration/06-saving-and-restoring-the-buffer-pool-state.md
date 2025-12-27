#### 17.8.3.6 Salvar e restaurar o estado do pool de buffers

Para reduzir o período de aquecimento após o reinício do servidor, o `InnoDB` salva uma porcentagem das páginas mais recentemente usadas para cada pool de buffers ao desligar o servidor e restaura essas páginas ao iniciar o servidor. A porcentagem de páginas recentemente usadas que é armazenada é definida pela opção de configuração `innodb_buffer_pool_dump_pct`.

Após o reinício de um servidor ocupado, geralmente há um período de aquecimento com um desempenho que aumenta constantemente, pois as páginas do disco que estavam no pool de buffers são trazidas de volta para a memória (já que os mesmos dados são consultados, atualizados, etc.). A capacidade de restaurar o pool de buffers ao iniciar o servidor reduz o período de aquecimento recarregando as páginas do disco que estavam no pool de buffers antes do reinício, em vez de esperar pelas operações DML acessarem as linhas correspondentes. Além disso, as solicitações de E/S podem ser realizadas em lotes grandes, tornando o E/S como um todo mais rápido. A carga de páginas acontece em segundo plano e não retarda o início do banco de dados.

Além de salvar o estado do pool de buffers ao desligar e restaurá-lo ao iniciar, você pode salvar e restaurar o estado do pool de buffers a qualquer momento, enquanto o servidor estiver em execução. Por exemplo, você pode salvar o estado do pool de buffers após atingir um desempenho estável sob uma carga de trabalho constante. Você também pode restaurar o estado anterior do pool de buffers após executar relatórios ou trabalhos de manutenção que trazem páginas de dados para o pool de buffers que são necessárias apenas para essas operações, ou após executar algum outro tipo de carga de trabalho não típico.

Embora um pool de buffers possa ter vários gigabytes de tamanho, os dados do pool de buffers que o `InnoDB` salva no disco são pequenos em comparação. Apenas os IDs de espaço de tabela e IDs de página necessários para localizar as páginas apropriadas são salvos no disco. Essas informações são derivadas da tabela `INNODB_BUFFER_PAGE_LRU` do `INFORMATION_SCHEMA`. Por padrão, os dados de IDs de espaço de tabela e IDs de página são salvos em um arquivo chamado `ib_buffer_pool`, que é salvo no diretório de dados do `InnoDB`. O nome e a localização do arquivo podem ser modificados usando o parâmetro de configuração `innodb_buffer_pool_filename`.

Como os dados são cacheados e descartados do pool de buffers conforme as operações normais do banco de dados, não há problema se as páginas do disco forem atualizadas recentemente ou se uma operação DML envolver dados que ainda não foram carregados. O mecanismo de carregamento ignora as páginas solicitadas que não existem mais.

O mecanismo subjacente envolve um fio de fundo que é enviado para realizar as operações de dump e carregamento.

As páginas do disco de tabelas compactadas são carregadas no pool de buffers em sua forma compactada. As páginas são descompactadas normalmente quando o conteúdo da página é acessado durante operações DML. Como a descompactação das páginas é um processo intensivo em CPU, é mais eficiente que a concorrência realize a operação em um fio de conexão em vez do único fio que realiza a operação de restauração do pool de buffers.

As operações relacionadas à salvação e restauração do estado do pool de buffers são descritas nos seguintes tópicos:

* Configurando a Porcentagem de Dump para Páginas do Pool de Buffer
* Salvando o Estado do Pool de Buffer ao Finalizar e Restaurando-o ao Iniciar
* Salvando e Restaurando o Estado do Pool de Buffer Online
* Exibindo o Progresso do Dump do Pool de Buffer
* Exibindo o Progresso da Carga do Pool de Buffer
* Abandono de uma Operação de Carga do Pool de Buffer
* Monitoramento do Progresso da Carga do Pool de Buffer Usando o Schema de Desempenho

##### Configurando a Porcentagem de Dump para Páginas do Pool de Buffer

Antes de fazer o dump das páginas do pool de buffer, você pode configurar a porcentagem das páginas do pool de buffer mais recentemente usadas que você deseja dumper, definindo a opção `innodb_buffer_pool_dump_pct`. Se você planeja fazer o dump das páginas do pool de buffer enquanto o servidor estiver em execução, você pode configurar a opção dinamicamente:

```
SET GLOBAL innodb_buffer_pool_dump_pct=40;
```

Se você planeja fazer o dump das páginas do pool de buffer ao finalizar o servidor, defina `innodb_buffer_pool_dump_pct` em seu arquivo de configuração.

```
[mysqld]
innodb_buffer_pool_dump_pct=40
```

O valor padrão de `innodb_buffer_pool_dump_pct` é 25 (dumper 25% das páginas mais recentemente usadas).

##### Salvando o Estado do Pool de Buffer ao Finalizar e Restaurando-o ao Iniciar

Para salvar o estado do pool de buffer ao finalizar o servidor, execute a seguinte instrução antes de desligar o servidor:

```
SET GLOBAL innodb_buffer_pool_dump_at_shutdown=ON;
```

`innodb_buffer_pool_dump_at_shutdown` está habilitado por padrão.

Para restaurar o estado do pool de buffer ao iniciar o servidor, especifique a opção `--innodb-buffer-pool-load-at-startup` ao iniciar o servidor:

```
mysqld --innodb-buffer-pool-load-at-startup=ON;
```

`innodb_buffer_pool_load_at_startup` está habilitado por padrão.

##### Salvando e Restaurando o Estado do Pool de Buffer Online

Para salvar o estado do pool de buffer enquanto o servidor MySQL estiver em execução, execute a seguinte instrução:

```
SET GLOBAL innodb_buffer_pool_dump_now=ON;
```

Para restaurar o estado do pool de buffer enquanto o MySQL estiver em execução, execute a seguinte instrução:

```
SET GLOBAL innodb_buffer_pool_load_now=ON;
```

##### Exibindo o Progresso do Dump do Pool de Buffer

Para exibir o progresso ao salvar o estado do pool de buffers no disco, execute a seguinte instrução:

```
SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status';
```

Se a operação ainda não tiver começado, será retornado "não iniciado". Se a operação estiver concluída, o tempo de conclusão será impresso (por exemplo, Concluído em 110505 12:18:02). Se a operação estiver em andamento, informações de status serão fornecidas (por exemplo, Dumpando o pool de buffers 5/7, página 237/2873).

##### Exibindo o Progresso da Carga do Pool de Buffers

Para exibir o progresso ao carregar o pool de buffers, execute a seguinte instrução:

```
SHOW STATUS LIKE 'Innodb_buffer_pool_load_status';
```

Se a operação ainda não tiver começado, será retornado "não iniciado". Se a operação estiver concluída, o tempo de conclusão será impresso (por exemplo, Concluído em 110505 12:23:24). Se a operação estiver em andamento, informações de status serão fornecidas (por exemplo, Carregando 123/22301 páginas).

##### Interrompendo uma Operação de Carregamento de Pool de Buffers

Para interromper uma operação de carregamento de pool de buffers, execute a seguinte instrução:

```
SET GLOBAL innodb_buffer_pool_load_abort=ON;
```

##### Monitorando o Progresso da Carga do Pool de Buffers Usando o Schema de Desempenho

Você pode monitorar o progresso da carga do pool de buffers usando o Schema de Desempenho.

O seguinte exemplo demonstra como habilitar o instrumento de evento `stage/innodb/buffer pool load` e as tabelas de consumidor relacionadas para monitorar o progresso da carga do pool de buffers.

Para informações sobre os procedimentos de dump e carregamento de pool de buffers usados neste exemplo, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffers”. Para informações sobre os instrumentos de evento de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Habilite o instrumento `stage/innodb/buffer pool load`:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/buffer%';
   ```

2. Habilite as tabelas de consumidor de evento de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Descarregue o estado atual do pool de buffer habilitando `innodb_buffer_pool_dump_now`.

   ```
   mysql> SET GLOBAL innodb_buffer_pool_dump_now=ON;
   ```

4. Verifique o status da varredura do pool de buffer para garantir que a operação tenha sido concluída.

   ```
   mysql> SHOW STATUS LIKE 'Innodb_buffer_pool_dump_status'\G
   *************************** 1. row ***************************
   Variable_name: Innodb_buffer_pool_dump_status
           Value: Buffer pool(s) dump completed at 150202 16:38:58
   ```

5. Carregue o pool de buffer habilitando `innodb_buffer_pool_load_now`:

   ```
   mysql> SET GLOBAL innodb_buffer_pool_load_now=ON;
   ```

6. Verifique o status atual da operação de carregamento do pool de buffer consultando a tabela `events_stages_current` do Schema de Desempenho. A coluna `WORK_COMPLETED` mostra o número de páginas do pool de buffer carregadas. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante, em páginas.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           5353 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de carregamento do pool de buffer tiver sido concluída. Nesse caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento concluído. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +-------------------------------+----------------+----------------+
   | EVENT_NAME                    | WORK_COMPLETED | WORK_ESTIMATED |
   +-------------------------------+----------------+----------------+
   | stage/innodb/buffer pool load |           7167 |           7167 |
   +-------------------------------+----------------+----------------+
   ```

Observação

Você também pode monitorar o progresso da carga do pool de buffer usando o Schema de Desempenho ao carregar o pool de buffer no início usando `innodb_buffer_pool_load_at_startup`. Nesse caso, o instrumento `stage/innodb/buffer pool load` e os consumidores relacionados devem ser habilitados no início. Para mais informações, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.