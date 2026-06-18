#### 17.6.3.4 Refazer Espaços de Tabela

Os espaços de tabelas desfazer contêm registros de desfazer, que são coleções de registros que contêm informações sobre como desfazer a última alteração realizada por uma transação em um registro de índice agrupado.

Os espaços de tabelas desfazer são descritos nos seguintes tópicos desta seção:

- Desfazer tabelas padrão
- Reverter o tamanho do espaço de tabelas
- Adicionar tabelaspaces para desfazer
- Excluir espaços de tabelas Undo
- Mover tabelaspaces para outro local
- Configurar o número de segmentos de rollback
- Truncando Undo Tablespaces
- Reverter variáveis de status do espaço de tabelas

##### Desfazer tabelas padrão

Duas tabelas de recuperação padrão são criadas quando a instância do MySQL é inicializada. As tabelas de recuperação padrão são criadas no momento da inicialização para fornecer um local para os segmentos de rollback que devem existir antes que as instruções SQL possam ser aceitas. É necessário um mínimo de duas tabelas de recuperação para suportar a redução automática das tabelas de recuperação. Veja Redução de tabelas de recuperação.

As tabelas de recuperação padrão são criadas no local definido pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` não for definida, as tabelas de recuperação padrão são criadas no diretório de dados. Os arquivos de dados das tabelas de recuperação padrão padrão são nomeados `undo_001` e `undo_002`. Os nomes das tabelas de recuperação padrão correspondentes definidos no dicionário de dados são `innodb_undo_001` e `innodb_undo_002`.

A partir do MySQL 8.0.14, é possível criar espaços de tabelas de desfazer adicionais em tempo de execução usando SQL. Veja Adicionar espaços de tabelas de desfazer.

##### Reverter o tamanho do espaço de tabelas

Antes do MySQL 8.0.23, o tamanho inicial de um espaço de tabelas de desfazer depende do valor `innodb_page_size`. Para o tamanho de página padrão de 16 KB, o tamanho inicial do arquivo do espaço de tabelas de desfazer é de 10 MiB. Para os tamanhos de página de 4 KB, 8 KB, 32 KB e 64 KB, os tamanhos iniciais dos arquivos do espaço de tabelas de desfazer são, respectivamente, 7 MiB, 8 MiB, 20 MiB e 40 MiB. A partir do MySQL 8.0.23, o tamanho inicial do espaço de tabelas de desfazer é normalmente de 16 MiB. O tamanho inicial pode diferir quando um novo espaço de tabelas de desfazer é criado por uma operação de truncar. Nesse caso, se o tamanho da extensão de arquivo for maior que 16 MB e a extensão de arquivo anterior ocorreru no último segundo, o novo espaço de tabelas de desfazer é criado em um quarto do tamanho definido pela variável `innodb_max_undo_log_size`.

Antes do MySQL 8.0.23, um espaço de undo é estendido em quatro extensões de cada vez. A partir do MySQL 8.0.23, um espaço de undo é estendido por um mínimo de 16 MB. Para lidar com o crescimento agressivo, o tamanho da extensão do arquivo é dobrado se a extensão do arquivo anterior ocorrer menos de 0,1 segundo antes. O dobramento do tamanho da extensão pode ocorrer várias vezes, no máximo, até 256 MB. Se a extensão do arquivo anterior ocorrer mais de 0,1 segundo antes, o tamanho da extensão é reduzido pela metade, o que também pode ocorrer várias vezes, no mínimo, 16 MB. Se a opção `AUTOEXTEND_SIZE` for definida para um espaço de undo, ele é estendido pelo maior dos valores da configuração `AUTOEXTEND_SIZE` e do tamanho da extensão determinado pela lógica descrita acima. Para informações sobre a opção `AUTOEXTEND_SIZE`, consulte a Seção 17.6.3.9, “Configuração do tamanho AUTOEXTEND\_SIZE do espaço de undo”.

##### Adicionar tabelaspaces para desfazer

Como os registros de desfazer podem se tornar grandes durante transações de longa duração, a criação de tabelas de desfazer adicionais pode ajudar a evitar que as tabelas de desfazer individuais se tornem muito grandes. A partir do MySQL 8.0.14, tabelas de desfazer adicionais podem ser criadas em tempo de execução usando a sintaxe `CREATE UNDO TABLESPACE`.

```
CREATE UNDO TABLESPACE tablespace_name ADD DATAFILE 'file_name.ibu';
```

O nome do arquivo do espaço de tabela de desfazer deve ter a extensão `.ibu`. Não é permitido especificar um caminho relativo ao definir o nome do arquivo do espaço de tabela de desfazer. Um caminho totalmente qualificado é permitido, mas o caminho deve ser conhecido pelo `InnoDB`. Caminhos conhecidos são aqueles definidos pela variável `innodb_directories`. Nomes de arquivos de espaço de tabela de desfazer únicos são recomendados para evitar potenciais conflitos de nomes de arquivos ao mover ou clonar dados.

Nota

Em um ambiente de replicação, o diretório de arquivo de espaço de recuperação da fonte e de cada réplica deve ser o mesmo. Replicar a criação de um arquivo de espaço de recuperação em um diretório comum causaria um conflito de nome de arquivo.

Ao inicializar, os diretórios definidos pela variável `innodb_directories` são verificados em busca de arquivos de espaço de recuperação. (A verificação também percorre subdiretórios.) Os diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor `innodb_directories`, independentemente de a variável `innodb_directories` estar definida explicitamente. Portanto, um espaço de recuperação de recuperação pode residir em caminhos definidos por qualquer uma dessas variáveis.

Se o nome do arquivo do espaço de recuperação não incluir um caminho, o espaço de recuperação será criado no diretório definido pela variável `innodb_undo_directory`. Se essa variável estiver indefinida, o espaço de recuperação será criado no diretório de dados.

Nota

O processo de recuperação `InnoDB` exige que os arquivos do espaço de recuperação sejam encontrados em diretórios conhecidos. Os arquivos do espaço de recuperação devem ser descobertos e abertos antes da recuperação de redo e antes de outros arquivos de dados serem abertos para permitir que as transações não confirmadas e as alterações no dicionário de dados sejam revertidas. Um espaço de recuperação não encontrado antes da recuperação não pode ser usado, o que pode levar a inconsistências no banco de dados. Uma mensagem de erro é exibida na inicialização se um espaço de recuperação conhecido pelo dicionário de dados não for encontrado. O requisito de diretório conhecido também suporta a portabilidade do espaço de recuperação. Veja Mover Espaços de Recuperação.

Para criar tabelaspaces de desfazer em um caminho relativo ao diretório de dados, defina a variável `innodb_undo_directory` para o caminho relativo e especifique o nome do arquivo apenas ao criar um tabelaspace de desfazer.

Para visualizar os nomes e caminhos dos espaços de armazenamento de desfazer, execute a consulta `INFORMATION_SCHEMA.FILES`:

```
SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
  WHERE FILE_TYPE LIKE 'UNDO LOG';
```

Uma instância do MySQL suporta até 127 espaços de tabelas de desfazer, incluindo os dois espaços de tabelas de desfazer padrão criados quando a instância do MySQL é inicializada.

Nota

Antes do MySQL 8.0.14, tabelas de desfazer adicionais eram criadas ao configurar a variável de inicialização `innodb_undo_tablespaces`. Essa variável está desatualizada e não mais configurável a partir do MySQL 8.0.14.

Antes do MySQL 8.0.14, aumentar o ajuste `innodb_undo_tablespaces` cria o número especificado de espaços de tabelas de desfazer e adiciona-os à lista de espaços de tabelas de desfazer ativos. Diminuir o ajuste `innodb_undo_tablespaces` remove espaços de tabelas de desfazer da lista de espaços de tabelas de desfazer ativos. Os espaços de tabelas de desfazer removidos da lista ativa permanecem ativos até que não sejam mais usados por transações existentes. A variável `innodb_undo_tablespaces` pode ser configurada em tempo de execução usando uma instrução `SET` ou definida em um arquivo de configuração.

Antes do MySQL 8.0.14, os espaços de recuperação desativados não podem ser removidos. A remoção manual dos arquivos dos espaços de recuperação é possível após um desligamento lento, mas não é recomendada, pois os espaços de recuperação desativados podem conter registros de recuperação ativos por algum tempo após o servidor ser reiniciado, se transações abertas estiverem abertas quando o servidor for desligado. A partir do MySQL 8.0.14, os espaços de recuperação podem ser removidos usando a sintaxe `DROP UNDO TABALESPACE`. Veja Remoção de Espaços de Recuperação.

##### Excluir espaços de tabelas Undo

A partir do MySQL 8.0.14, os espaços de tabela desfechos criados usando a sintaxe `CREATE UNDO TABLESPACE` podem ser eliminados em tempo de execução usando a sintaxe `DROP UNDO TABALESPACE`.

Um espaço de tabelas de desfazer deve estar vazio antes de poder ser excluído. Para esvaziar um espaço de tabelas de desfazer, o espaço de tabelas de desfazer deve ser marcado como inativo primeiro usando a sintaxe `ALTER UNDO TABLESPACE` para que o espaço de tabelas não seja mais usado para atribuir segmentos de rollback a novas transações.

```
ALTER UNDO TABLESPACE tablespace_name SET INACTIVE;
```

Após um espaço de tabelas de desfazer ser marcado como inativo, as transações que atualmente estão usando segmentos de rollback no espaço de tabelas de desfazer podem concluir, assim como quaisquer transações iniciadas antes dessas transações serem concluídas. Após as transações serem concluídas, o sistema de purga libera os segmentos de rollback no espaço de tabelas de desfazer e o espaço de tabelas de desfazer é truncado para seu tamanho inicial. (O mesmo processo é usado ao truncar espaços de tabelas de desfazer. Veja Truncar Espaços de Tabelas de Desfazer.) Uma vez que o espaço de tabelas de desfazer estiver vazio, ele pode ser excluído.

```
DROP UNDO TABLESPACE tablespace_name;
```

Nota

Como alternativa, o espaço de tabela de desfazer pode ser deixado em estado vazio e reativado posteriormente, se necessário, emitindo uma declaração `ALTER UNDO TABLESPACE tablespace_name SET ACTIVE`.

O estado de um espaço de tabelas desfeito pode ser monitorado consultando a tabela do esquema de informações `INNODB_TABLESPACES`.

```
SELECT NAME, STATE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
  WHERE NAME LIKE 'tablespace_name';
```

Um estado `inactive` indica que os segmentos de desfazer em um espaço de tabelas de desfazer não são mais usados por novas transações. Um estado `empty` indica que um espaço de tabelas de desfazer está vazio e pronto para ser excluído ou para ser ativado novamente usando uma instrução `ALTER UNDO TABLESPACE tablespace_name SET ACTIVE`. Tentar excluir um espaço de tabelas de desfazer que não está vazio retorna um erro.

Os espaços de tabelas de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada não podem ser eliminados. No entanto, eles podem ser desativados usando uma instrução `ALTER UNDO TABLESPACE tablespace_name SET INACTIVE`. Antes que um espaço de tabela de desfazer padrão padrão possa ser desativado, deve haver um espaço de tabela de desfazer para ocupar seu lugar. Um mínimo de dois espaços de tabela de desfazer ativos é necessário em todos os momentos para suportar a redução automática dos espaços de tabela de desfazer.

##### Mover tabelaspaces para outro local

As tabelaspaces desfeitas criadas com a sintaxe `CREATE UNDO TABLESPACE` podem ser movidas enquanto o servidor estiver offline para qualquer diretório conhecido. Os diretórios conhecidos são aqueles definidos pela variável `innodb_directories`. Os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor `innodb_directories`, independentemente de a variável `innodb_directories` estar definida explicitamente. Esses diretórios e suas subdiretórios são verificados no momento do início para encontrar arquivos de tabelaspaces desfeitas. Um arquivo de tabelaspace desfeito movido para qualquer um desses diretórios é descoberto no momento do início e considerado como o tabelaspace desfeito que foi movido.

Os espaços de tabela de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada devem residir no diretório definido pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` estiver indefinida, os espaços de tabela de desfazer padrão residem no diretório de dados. Se os espaços de tabela de desfazer padrão forem movidos enquanto o servidor estiver offline, o servidor deve ser iniciado com a variável `innodb_undo_directory` configurada para o novo diretório.

Os padrões de E/S para os registros de desfazer tornam os espaços de tabelas de desfazer bons candidatos para armazenamento em SSD.

##### Configurar o número de segmentos de rollback

A variável `innodb_rollback_segments` define o número de segmentos de rollback alocados para cada espaço de tabelas de desfazer e para o espaço de tabelas temporárias globais. A variável `innodb_rollback_segments` pode ser configurada durante o início ou enquanto o servidor estiver em execução.

O valor padrão para `innodb_rollback_segments` é 128, que também é o valor máximo. Para obter informações sobre o número de transações que um segmento de rollback suporta, consulte a Seção 17.6.6, “Logs de Desfazer”.

##### Truncando Undo Tablespaces

Existem dois métodos para truncar os espaços de tabelas de reversão, que podem ser usados individualmente ou em combinação para gerenciar o tamanho dos espaços de tabelas de reversão. Um método é automatizado, habilitado usando variáveis de configuração. O outro método é manual, realizado usando instruções SQL.

O método automatizado não requer monitoramento do tamanho do espaço de tabelas de desfazer e, uma vez ativado, realiza a desativação, truncação e reativação dos espaços de tabelas de desfazer sem intervenção manual. O método de truncação manual pode ser preferível se você quiser controlar quando os espaços de tabelas de desfazer são desconectados para truncação. Por exemplo, você pode querer evitar truncar espaços de tabelas de desfazer durante os períodos de maior carga de trabalho.

###### Atrinchamento Automático

O truncamento automático de tabelas de rollback requer um mínimo de dois espaços de tabelas de rollback ativos, o que garante que um espaço de tabelas de rollback permaneça ativo enquanto o outro é desativado para ser truncado. Por padrão, dois espaços de tabelas de rollback são criados quando a instância do MySQL é inicializada.

Para que as tabelas espaços sejam desfazeres automaticamente truncadas, habilite a variável `innodb_undo_log_truncate`. Por exemplo:

```
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

Quando a variável `innodb_undo_log_truncate` está habilitada, as tabelas de desfazer que excederem o limite de tamanho definido pela variável `innodb_max_undo_log_size` são sujeitas à redução. A variável `innodb_max_undo_log_size` é dinâmica e tem um valor padrão de 1073741824 bytes (1024 MiB).

```
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

Quando a variável `innodb_undo_log_truncate` estiver habilitada:

1. Os espaços de tabela de desfazer padrão e definidos pelo usuário que excederem o ajuste `innodb_max_undo_log_size` são marcados para truncação. A seleção de um espaço de tabela de desfazer para truncação é realizada de forma circular para evitar a truncação do mesmo espaço de tabela de desfazer cada vez.

2. Os segmentos de rollback que residem no espaço de tabela de desfazer selecionado são tornados inativos para que não sejam atribuídos a novas transações. As transações existentes que estão atualmente usando segmentos de rollback podem ser concluídas.

3. O sistema de purga libera segmentos de rollback ao liberar logs de desfazer que não estão mais em uso.

4. Depois que todos os segmentos de rollback no espaço de tabelas de desfazer forem liberados, a operação de truncar será executada e o espaço de tabelas de desfazer será reduzido para 16 MB.

   A variável `innodb_undo_directory` define a localização dos arquivos de espaço de tabela de desfazer padrão. Se a variável `innodb_undo_directory` não for definida, os espaços de tabela de desfazer padrão padrão residem no diretório de dados. A localização de todos os arquivos de espaço de tabela de desfazer, incluindo espaços de tabela de desfazer definidos pelo usuário criados usando a sintaxe `CREATE UNDO TABLESPACE`, pode ser determinada consultando a tabela do esquema de informações `FILES`:

   ```
   SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_TYPE LIKE 'UNDO LOG';
   ```

5. Os segmentos de rollback são reativados para que possam ser atribuídos a novas transações.

###### Truncando Manual

A redução manual de tabelas de rollback requer um mínimo de três tabelas de rollback ativas. Duas tabelas de rollback ativas são necessárias em todos os momentos para suportar a possibilidade de que a redução automática esteja habilitada. Um mínimo de três tabelas de rollback atende a essa exigência, permitindo que uma tabela de rollback seja desativada manualmente.

Para iniciar manualmente o truncamento de um espaço de recuperação de transações, desative o espaço de recuperação de transações emitindo a seguinte instrução:

```
ALTER UNDO TABLESPACE tablespace_name SET INACTIVE;
```

Após a marcação do espaço de tabelas como inativo, as transações que atualmente estão usando segmentos de rollback no espaço de tabelas de desfazer podem concluir, assim como quaisquer transações iniciadas antes que essas transações sejam concluídas. Após as transações serem concluídas, o sistema de purga libera os segmentos de rollback no espaço de tabelas de desfazer, o espaço de tabelas de desfazer é truncado para seu tamanho inicial e o estado do espaço de tabelas de desfazer muda de `inactive` para `empty`.

Nota

Quando uma declaração `ALTER UNDO TABLESPACE tablespace_name SET INACTIVE` desativa um espaço de recuperação de transações, o fio de purga procura esse espaço de recuperação de transações na próxima oportunidade. Uma vez que o espaço de recuperação de transações é encontrado e marcado para ser truncado, o fio de purga retorna com maior frequência para esvaziar e truncar rapidamente o espaço de recuperação de transações.

Para verificar o estado de um espaço de tabelas desfeito, consulte a tabela do esquema de informações `INNODB_TABLESPACES`.

```
SELECT NAME, STATE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
  WHERE NAME LIKE 'tablespace_name';
```

Uma vez que o espaço de tabela desfazer esteja em um estado `empty`, ele pode ser reativado emitindo a seguinte declaração:

```
ALTER UNDO TABLESPACE tablespace_name SET ACTIVE;
```

Um espaço de tabela desfeito em um estado `empty` também pode ser excluído. Veja Excluindo Espaços de Tabela Desfeitos.

###### Acelerar a Truncagem Automática de Tablespaces de Anulação

O fio de purga é responsável por esvaziar e truncar os espaços de tabelas de reversão. Por padrão, o fio de purga procura por espaços de tabelas de reversão para truncar uma vez a cada 128 vezes que a purga é invocada. A frequência com que o fio de purga procura por espaços de tabelas de reversão para truncar é controlada pela variável `innodb_purge_rseg_truncate_frequency`, que tem um ajuste padrão de 128.

```
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

Para aumentar a frequência, diminua o ajuste `innodb_purge_rseg_truncate_frequency`. Por exemplo, para que o processo de purga procure espaços de tabela de desfazer a cada 32 vezes que a purga for acionada, defina `innodb_purge_rseg_truncate_frequency` para 32.

```
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

###### Impacto no desempenho de truncar arquivos do espaço de recuperação de tabelas

Quando um espaço de tabelas de desfazer é truncado, os segmentos de rollback no espaço de tabelas de desfazer são desativados. Os segmentos de rollback ativos em outros espaços de tabelas de desfazer assumem a responsabilidade por toda a carga do sistema, o que pode resultar em uma leve degradação do desempenho. A extensão em que o desempenho é afetado depende de vários fatores:

- Número de espaços de tabela de desfazer
- Número de registros de desfazer
- Reverter o tamanho do espaço de tabelas
- Velocidade do subsistema de E/S
- Transações de longa duração existentes
- Carga do sistema

A maneira mais fácil de evitar o impacto potencial no desempenho é aumentar o número de espaços de tabelas desfazer.

###### Monitoramento da Remoção de Tablespace

A partir do MySQL 8.0.16, os contadores de subsistemas `undo` e `purge` são fornecidos para monitorar atividades de segundo plano associadas à redução do log de desfazer. Para obter os nomes e descrições dos contadores, consulte a tabela do esquema de informações `INNODB_METRICS`.

```
SELECT NAME, SUBSYSTEM, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%truncate%';
```

Para obter informações sobre como habilitar contadores e consultar dados de contagem, consulte a Seção 17.15.6, “Tabela de métricas do esquema de informações InnoDB”.

###### Desfazer Limite de Truncamento do Espaço de Tabela

A partir do MySQL 8.0.21, o número de operações de truncar nas mesmas tabelas de undo entre os pontos de verificação é limitado a 64. O limite previne problemas potenciais causados por um número excessivo de operações de truncar nas tabelas de undo, que podem ocorrer, por exemplo, se `innodb_max_undo_log_size` for definido muito baixo em um sistema ocupado. Se o limite for excedido, uma tabela de undo ainda pode ser inativa, mas não será truncada até após o próximo ponto de verificação. o limite foi aumentado de 64 para 50.000 no MySQL 8.0.22.

###### Reverter a recuperação de truncamento do espaço de tabelas

Uma operação de truncamento de um espaço de tabelas de desfazer cria um arquivo temporário `undo_space_number_trunc.log` no diretório de log do servidor. Esse diretório de log é definido por `innodb_log_group_home_dir`. Se ocorrer uma falha no sistema durante a operação de truncamento, o arquivo de log temporário permite que o processo de inicialização identifique os espaços de tabelas de desfazer que estavam sendo truncados e continue a operação.

##### Reverter variáveis de status do espaço de tabelas

As seguintes variáveis de status permitem o rastreamento do número total de espaços de tabelas de desfazer, espaços de tabelas de desfazer implícitos (criados por `InnoDB`), espaços de tabelas de desfazer explícitos (criados pelo usuário) e o número de espaços de tabelas de desfazer ativos:

```
mysql> SHOW STATUS LIKE 'Innodb_undo_tablespaces%';
+----------------------------------+-------+
| Variable_name                    | Value |
+----------------------------------+-------+
| Innodb_undo_tablespaces_total    | 2     |
| Innodb_undo_tablespaces_implicit | 2     |
| Innodb_undo_tablespaces_explicit | 0     |
| Innodb_undo_tablespaces_active   | 2     |
+----------------------------------+-------+
```

Para descrições de variáveis de status, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.
