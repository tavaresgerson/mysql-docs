#### 17.6.3.4 Reverter Espaços de Tabelas

Os espaços de tabelas de reversão contêm registros de reversão, que são coleções de registros contendo informações sobre como reverter a última alteração realizada por uma transação em um registro de índice agrupado.

Os espaços de tabelas de reversão são descritos nos seguintes tópicos nesta seção:

* Espaços de tabelas de reversão padrão
* Tamanho do espaço de tabelas de reversão
* Adicionar espaços de tabelas de reversão
* Remover espaços de tabelas de reversão
* Mover espaços de tabelas de reversão
* Configurar o número de segmentos de reversão
* Truncar espaços de tabelas de reversão

##### Espaços de tabelas de reversão padrão

Dois espaços de tabelas de reversão padrão são criados quando a instância do MySQL é inicializada. Os espaços de tabelas de reversão padrão são criados no momento da inicialização para fornecer um local para os segmentos de reversão que devem existir antes que as instruções SQL possam ser aceitas. É necessário um mínimo de dois espaços de tabelas de reversão para suportar a redução automática dos espaços de tabelas de reversão. Veja Reduzir Espaços de Tabelas de Reversão.

Os espaços de tabelas de reversão padrão são criados na localização definida pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` não for definida, os espaços de tabelas de reversão padrão são criados no diretório de dados. Os arquivos de dados dos espaços de tabelas de reversão padrão são nomeados `undo_001` e `undo_002`. Os nomes correspondentes dos espaços de tabelas de reversão definidos no dicionário de dados são `innodb_undo_001` e `innodb_undo_002`.

Espaços de tabelas de reversão adicionais podem ser criados em tempo de execução usando instruções SQL. Veja Adicionar Espaços de Tabelas de Reversão.

##### Tamanho do espaço de tabelas de reversão

O tamanho inicial do espaço de tabelas de desfazer é normalmente de 16 MiB. O tamanho inicial pode diferir quando um novo espaço de tabelas de desfazer é criado por uma operação de truncar. Neste caso, se o tamanho do arquivo for maior que 16 MB e o arquivo anterior ocorreru dentro do último segundo, o novo espaço de tabelas de desfazer é criado em um quarto do tamanho definido pela variável `innodb_max_undo_log_size`.

Um espaço de tabelas de desfazer é ampliado por um mínimo de 16 MB. Para lidar com o crescimento agressivo, o tamanho do arquivo é dobrado se o arquivo anterior ocorreru menos de 0,1 segundo antes. O dobramento do tamanho do arquivo pode ocorrer várias vezes, no máximo, até 256 MB. Se o arquivo anterior ocorreru mais de 0,1 segundo antes, o tamanho do arquivo é reduzido pela metade, o que também pode ocorrer várias vezes, para um mínimo de 16 MB. Se a opção `AUTOEXTEND_SIZE` for definida para um espaço de tabelas de desfazer, ele é ampliado pelo maior dos valores definidos pela configuração `AUTOEXTEND_SIZE` e do tamanho do arquivo determinado pela lógica descrita acima. Para informações sobre a opção `AUTOEXTEND_SIZE`, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND_SIZE do Espaço de Tabelas”.

##### Adicionando Espaços de Tabelas de Desfazer

Como os registros de desfazer podem se tornar grandes durante transações de longa duração, a criação de espaços de tabelas de desfazer adicionais pode ajudar a evitar que os espaços de tabelas de desfazer individuais se tornem muito grandes. Espaços de tabelas de desfazer adicionais podem ser criados em tempo de execução usando a sintaxe `CREATE UNDO TABLESPACE`.

```
CREATE UNDO TABLESPACE tablespace_name ADD DATAFILE 'file_name.ibu';
```

O nome do arquivo do espaço de tabelas de desfazer deve ter a extensão `.ibu`. Não é permitido especificar um caminho relativo ao definir o nome do arquivo do espaço de tabelas de desfazer. É permitido um caminho totalmente qualificado, mas o caminho deve ser conhecido pelo `InnoDB`. Caminhos conhecidos são aqueles definidos pela variável `innodb_directories`. Nomes de arquivos de espaço de tabelas de desfazer únicos são recomendados para evitar potenciais conflitos de nomes de arquivos ao mover ou clonar dados.

Nota

Em um ambiente de replicação, a fonte e cada replica devem ter seu próprio diretório de arquivo do espaço de tabelas de desfazer. Replicar a criação de um arquivo do espaço de tabelas de desfazer para um diretório comum causaria um conflito de nome de arquivo.

Ao inicializar, os diretórios definidos pela variável `innodb_directories` são verificados em busca de arquivos do espaço de tabelas de desfazer. (A verificação também percorre subdiretórios.) Diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor de `innodb_directories`, independentemente de a variável `innodb_directories` ser definida explicitamente. Portanto, um espaço de tabelas de desfazer pode residir em caminhos definidos por qualquer uma dessas variáveis.

Se o nome do arquivo do espaço de tabelas de desfazer não incluir um caminho, o espaço de tabelas de desfazer é criado no diretório definido pela variável `innodb_undo_directory`. Se essa variável estiver indefinida, o espaço de tabelas de desfazer é criado no diretório de dados.

Nota

O processo de recuperação do `InnoDB` exige que os arquivos do espaço de recuperação de desfazer estejam em diretórios conhecidos. Os arquivos do espaço de desfazer devem ser descobertos e abertos antes da recuperação de desfazer e antes que outros arquivos de dados sejam abertos para permitir que transações não confirmadas e alterações no dicionário de dados sejam revertidas. Um espaço de desfazer não encontrado antes da recuperação não pode ser usado, o que pode levar a inconsistências no banco de dados. Uma mensagem de erro é exibida ao iniciar se um espaço de desfazer conhecido pelo dicionário de dados não for encontrado. O requisito de diretório conhecido também suporta a portabilidade dos espaços de desfazer. Veja Mover Espaços de Desfazer.

Para criar espaços de desfazer em um caminho relativo ao diretório de dados, defina a variável `innodb_undo_directory` para o caminho relativo e especifique o nome do arquivo apenas ao criar um espaço de desfazer.

Para visualizar os nomes e caminhos dos espaços de desfazer, execute a consulta `INFORMATION_SCHEMA.FILES`:

```
SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
  WHERE FILE_TYPE LIKE 'UNDO LOG';
```

Uma instância do MySQL suporta até 127 espaços de desfazer, incluindo os dois espaços de desfazer padrão criados quando a instância do MySQL é inicializada.

Espaços de desfazer podem ser removidos usando a sintaxe `DROP UNDO TABALESPACE`. Veja Remover Espaços de Desfazer.

##### Remover Espaços de Desfazer

Espaços de desfazer criados usando a sintaxe `CREATE UNDO TABLESPACE` podem ser removidos em tempo de execução usando a sintaxe `DROP UNDO TABALESPACE`.

Um espaço de desfazer deve estar vazio antes de ser removido. Para esvaziar um espaço de desfazer, o espaço de desfazer deve primeiro ser marcado como inativo usando a sintaxe `ALTER UNDO TABLESPACE` para que o espaço de desfazer não seja mais usado para atribuir segmentos de desfazer a novas transações.

```
ALTER UNDO TABLESPACE tablespace_name SET INACTIVE;
```

Após um espaço de tabelas de desfazer ser marcado como inativo, as transações que atualmente estão usando segmentos de rollback no espaço de tabelas de desfazer podem concluir, assim como quaisquer transações iniciadas antes dessas transações serem concluídas. Após as transações serem concluídas, o sistema de purga libera os segmentos de rollback no espaço de tabelas de desfazer, e o espaço de tabelas de desfazer é truncado para seu tamanho inicial. (O mesmo processo é usado ao truncar espaços de tabelas de desfazer. Veja Truncar Espaços de Tabelas de Desfazer.) Uma vez que o espaço de tabelas de desfazer esteja vazio, ele pode ser excluído.

```
DROP UNDO TABLESPACE tablespace_name;
```

Nota

Alternativamente, o espaço de tabelas de desfazer pode ser deixado em estado vazio e reativado posteriormente, se necessário, emitindo uma declaração `ALTER UNDO TABLESPACE tablespace_name SET ACTIVE`.

O estado de um espaço de tabelas de desfazer pode ser monitorado consultando a tabela do Schema de Informações `INNODB_TABLESPACES`.

```
SELECT NAME, STATE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
  WHERE NAME LIKE 'tablespace_name';
```

Um estado `inativo` indica que os segmentos de rollback em um espaço de tabelas de desfazer não são mais usados por novas transações. Um estado `vazio` indica que um espaço de tabelas de desfazer está vazio e pronto para ser excluído, ou pronto para ser reativado novamente usando uma declaração `ALTER UNDO TABLESPACE tablespace_name SET ACTIVE`. Tentar excluir um espaço de tabelas de desfazer que não está vazio retorna um erro.

Os espaços de tabelas de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada não podem ser excluídos. No entanto, eles podem ser desativados usando uma declaração `ALTER UNDO TABLESPACE tablespace_name SET INACTIVE`. Antes que um espaço de tabelas de desfazer padrão possa ser desativado, deve haver um espaço de tabelas de desfazer para substituí-lo. Um mínimo de dois espaços de tabelas de desfazer ativos são necessários em todos os momentos para suportar a truncagem automatizada de espaços de tabelas de desfazer.

##### Movimentando Espaços de Tabelas de Desfazer

As tabelaspaces desfeitas criadas com a sintaxe `CREATE UNDO TABLESPACE` podem ser movidas enquanto o servidor estiver offline para qualquer diretório conhecido. Os diretórios conhecidos são aqueles definidos pela variável `innodb_directories`. Os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor de `innodb_directories`, independentemente de a variável `innodb_directories` ser definida explicitamente. Esses diretórios e seus subdiretórios são verificados no início para encontrar arquivos de tabelaspaces desfeitas. Um arquivo de tabelaspace desfeito movido para qualquer um desses diretórios é descoberto no início e assumido como sendo o tabelaspace desfeito que foi movido.

Os tabelaspaces desfeitos padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada devem residir no diretório definido pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` não for definida, os tabelaspaces desfeitos padrão residem no diretório de dados. Se os tabelaspaces desfeitos padrão forem movidos enquanto o servidor estiver offline, o servidor deve ser iniciado com a variável `innodb_undo_directory` configurada para o novo diretório.

Os padrões de I/O para logs de desfecho tornam os tabelaspaces desfechos bons candidatos para armazenamento em SSD.

##### Configurando o Número de Segmentos de Reversão

A variável `innodb_rollback_segments` define o número de segmentos de reversão alocados para cada tabelaspace desfeito e para o espaço de tabelas temporárias global. A variável `innodb_rollback_segments` pode ser configurada no início ou enquanto o servidor estiver em execução.

O ajuste padrão para `innodb_rollback_segments` é 128, que também é o valor máximo. Para informações sobre o número de transações que um segmento de reversão suporta, consulte a Seção 17.6.6, “Logs de Desfecho”.

##### Truncar Tabelaspaces Desfechos

Existem dois métodos para truncar espaços de tabelas de undo, que podem ser usados individualmente ou em combinação para gerenciar o tamanho dos espaços de tabelas de undo. Um método é automatizado, habilitado usando variáveis de configuração. O outro método é manual, realizado usando instruções SQL.

O método automatizado não requer monitoramento do tamanho do espaço de tabelas de undo e, uma vez habilitado, realiza a desativação, o truncamento e a reativação dos espaços de tabelas de undo sem intervenção manual. O método de truncamento manual pode ser preferível se você quiser controlar quando os espaços de tabelas de undo são desconectados para o truncamento. Por exemplo, você pode querer evitar truncar espaços de tabelas de undo durante os períodos de maior carga de trabalho.

###### Truncamento Automatizado

O truncamento automatizado de espaços de tabelas de undo requer um mínimo de dois espaços de tabelas de undo ativos, o que garante que um espaço de tabelas de undo permaneça ativo enquanto o outro é desconectado para ser truncado. Por padrão, dois espaços de tabelas de undo são criados quando a instância do MySQL é inicializada.

Para ter espaços de tabelas de undo truncados automaticamente, habilite a variável `innodb_undo_log_truncate`. Por exemplo:

```
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

Quando a variável `innodb_undo_log_truncate` é habilitada, os espaços de tabelas de undo que excedem o limite de tamanho definido pela variável `innodb_max_undo_log_size` estão sujeitos ao truncamento. A variável `innodb_max_undo_log_size` é dinâmica e tem um valor padrão de 1073741824 bytes (1024 MiB).

```
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

Quando a variável `innodb_undo_log_truncate` é habilitada:

1. Espaços de tabelas de undo padrão e definidos pelo usuário que excedem o ajuste `innodb_max_undo_log_size` são marcados para truncamento. A seleção de um espaço de tabelas de undo para truncamento é realizada de forma circular para evitar truncar o mesmo espaço de tabelas de undo cada vez.

2. Os segmentos de rollback que residem no espaço de tabelas de desfazer selecionado são tornados inativos para que não sejam atribuídos a novas transações. As transações existentes que estão atualmente usando segmentos de rollback podem terminar.

3. O sistema de purga libera os segmentos de rollback, liberando os registros de desfazer que não estão mais em uso.

4. Após todos os segmentos de rollback no espaço de tabelas de desfazer serem liberados, a operação de truncar é executada e o espaço de tabelas de desfazer é truncado para 16 MB.

A variável `innodb_undo_directory` define a localização dos arquivos padrão do espaço de tabelas de desfazer. Se a variável `innodb_undo_directory` não for definida, os espaços de tabelas de desfazer padrão residem no diretório de dados. A localização de todos os arquivos de espaço de tabelas de desfazer, incluindo espaços de tabelas de desfazer definidos pelo usuário criados usando a sintaxe `CREATE UNDO TABLESPACE`, pode ser determinada consultando a tabela do Esquema de Informações `FILES`:

```
   SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_TYPE LIKE 'UNDO LOG';
   ```

5. Os segmentos de rollback são reativados para que possam ser atribuídos a novas transações.

###### Truncação Manual

A truncação manual de espaços de tabelas de desfazer requer um mínimo de três espaços de tabelas de desfazer ativos. Dois espaços de tabelas de desfazer ativos são necessários em todos os momentos para suportar a possibilidade de que a truncação automatizada esteja habilitada. Um mínimo de três espaços de tabelas de desfazer atende a esse requisito enquanto permite que um espaço de tabelas de desfazer seja desconectado manualmente.

Para iniciar manualmente a truncação de um espaço de tabelas de desfazer, desative o espaço de tabelas de desfazer emitindo a seguinte declaração:

```
ALTER UNDO TABLESPACE tablespace_name SET INACTIVE;
```

Após o espaço de tabelas de desfazer ser marcado como inativo, as transações que atualmente estão usando segmentos de rollback no espaço de tabelas de desfazer podem concluir, assim como quaisquer transações iniciadas antes dessas transações serem concluídas. Após as transações serem concluídas, o sistema de purga libera os segmentos de rollback no espaço de tabelas de desfazer, o espaço de tabelas de desfazer é truncado para seu tamanho inicial e o estado do espaço de tabelas de desfazer muda de `inativo` para `vazio`.

Nota

Quando uma declaração `ALTER UNDO TABLESPACE tablespace_name SET INACTIVE` desativa um espaço de tabelas de desfazer, o fio de purga procura por esse espaço de tabelas de desfazer na próxima oportunidade. Uma vez que o espaço de tabelas de desfazer é encontrado e marcado para truncação, o fio de purga retorna com maior frequência para esvaziar e truncar rapidamente o espaço de tabelas de desfazer.

Para verificar o estado de um espaço de tabelas de desfazer, consulte a tabela do esquema de informações `INNODB_TABLESPACES`.

```
SELECT NAME, STATE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
  WHERE NAME LIKE 'tablespace_name';
```

Uma vez que o espaço de tabelas de desfazer esteja em um estado `vazio`, ele pode ser reativado emitindo a seguinte declaração:

```
ALTER UNDO TABLESPACE tablespace_name SET ACTIVE;
```

Um espaço de tabelas de desfazer em um estado `vazio` também pode ser excluído. Veja Excluindo Espaços de Tabelas de Desfazer.

###### Agilizando a Truncação Automática de Espaços de Tabelas de Desfazer

O fio de purga é responsável por esvaziar e truncar espaços de tabelas de desfazer. Por padrão, o fio de purga procura por espaços de tabelas de desfazer para truncar uma vez a cada 128 vezes que a purga é invocada. A frequência com que o fio de purga procura por espaços de tabelas de desfazer para truncar é controlada pela variável `innodb_purge_rseg_truncate_frequency`, que tem um ajuste padrão de 128.

```
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

Para aumentar a frequência, diminua o ajuste `innodb_purge_rseg_truncate_frequency`. Por exemplo, para que o thread de purga procure os espaços de tabelas de desfazer a cada 32 vezes que a purga é invocada, defina `innodb_purge_rseg_truncate_frequency` para 32.

```
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

###### Impacto no Desempenho da Truncação de Espaços de Tabelas de Desfazer

Quando um espaço de tabelas de desfazer é truncado, os segmentos de desfazer no espaço de tabelas de desfazer são desativados. Os segmentos de desfazer ativos em outros espaços de tabelas de desfazer assumem a responsabilidade por toda a carga do sistema, o que pode resultar em uma leve degradação do desempenho. A extensão em que o desempenho é afetado depende de vários fatores:

* Número de espaços de tabelas de desfazer
* Número de logs de desfazer
* Tamanho do espaço de tabelas de desfazer
* Velocidade do subsistema de E/S
* Transações em execução existentes
* Carga do sistema

A maneira mais fácil de evitar o impacto potencial no desempenho é aumentar o número de espaços de tabelas de desfazer.

###### Monitoramento da Truncação de Espaços de Tabelas de Desfazer

Os contadores do subsistema `undo` e `purge` são fornecidos para monitorar atividades de fundo associadas à truncação de logs de desfazer. Para obter os nomes e descrições dos contadores, consulte a tabela do esquema de informações `INNODB_METRICS`.

```
SELECT NAME, SUBSYSTEM, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%truncate%';
```

Para obter informações sobre como habilitar os contadores e consultar os dados dos contadores, consulte a Seção 17.15.6, “Tabela de métricas do esquema de informações InnoDB”.

###### Limite de Truncação de Espaços de Tabelas de Desfazer

O número de operações de truncação nas mesmas tabelas de undo entre os pontos de verificação é limitado a 64. O limite previne problemas potenciais causados por um número excessivo de operações de truncação de tabelas de undo, que podem ocorrer, por exemplo, se `innodb_max_undo_log_size` for definido como muito baixo em um sistema ocupado. Se o limite for excedido, uma tabela de undo ainda pode ser inativada, mas não será truncada até após o próximo ponto de verificação. No MySQL 9.5, o limite é de 50000.

###### Recuperação de Truncação de Tabelas de Undo

Uma operação de truncação de tabela de undo cria um arquivo temporário `undo_space_number_trunc.log` no diretório de log do servidor. Esse diretório de log é definido por `innodb_log_group_home_dir`. Se ocorrer uma falha no sistema durante a operação de truncação, o arquivo de log temporário permite que o processo de inicialização identifique as tabelas de undo que estavam sendo truncadas e continue a operação.