#### 14.6.3.4 Refazer Espaços de Tabela

Os espaços de tabelas desfazer contêm registros de desfazer, que são coleções de registros que contêm informações sobre como desfazer a última alteração realizada por uma transação em um registro de índice agrupado.

Os registros de desfazer são armazenados nos espaços de tabela do sistema por padrão, mas podem ser armazenados em um ou mais espaços de tabela de desfazer. O uso de espaços de tabela de desfazer pode reduzir a quantidade de espaço necessária para os registros de desfazer em qualquer espaço de tabela. Os padrões de E/S dos registros de desfazer também tornam os espaços de tabela de desfazer bons candidatos para armazenamento em SSD.

O número de espaços de tabela de desfazer usados pelo `InnoDB` é controlado pela opção `innodb_undo_tablespaces`. Essa opção só pode ser configurada durante a inicialização da instância do MySQL. Não pode ser alterada posteriormente.

Nota

A opção `innodb_undo_tablespaces` está desatualizada; espere que ela seja removida em uma futura versão.

As tabelaspaces e os segmentos individuais dentro dessas tabelaspaces não podem ser excluídos. No entanto, os registros de desfazer armazenados em tabelaspaces de desfazer podem ser truncados. Para obter mais informações, consulte "Truncar tabelaspaces de desfazer".

##### Configurando Undo Tablespaces

Este procedimento descreve como configurar os espaços de tabelas de desfazer. Quando os espaços de tabelas de desfazer são configurados, os registros de desfazer são armazenados nos espaços de tabelas de desfazer, em vez do espaço de tabelas do sistema.

O número de tabelas de desfazer só pode ser configurado ao inicializar uma instância do MySQL e é fixo para toda a vida útil da instância, portanto, recomenda-se que você realize o procedimento a seguir em uma instância de teste com uma carga de trabalho representativa antes de implantar a configuração em um sistema de produção.

Para configurar os espaços de tabela de desfazer:

1. Especifique uma localização de diretório para tabelas de recuperação usando a variável `innodb_undo_directory`. Se uma localização de diretório não for especificada, as tabelas de recuperação de recuperação serão criadas no diretório de dados.

2. Defina o número de segmentos de rollback usando a variável `innodb_rollback_segments`. Comece com um valor relativamente baixo e aumente-o gradualmente ao longo do tempo para examinar o efeito no desempenho. O ajuste padrão para `innodb_rollback_segments` é 128, que também é o valor máximo.

   Um segmento de rollback é sempre atribuído ao espaço de tabela do sistema, e 32 segmentos de rollback são reservados para o espaço de tabela temporário (`ibtmp1`). Portanto, para alocar segmentos de rollback aos espaços de tabela de desfazer, defina `innodb_rollback_segments` para um valor maior que 33. Por exemplo, se você tiver dois espaços de tabela de desfazer, defina `innodb_rollback_segments` para 35 para atribuir um segmento de rollback a cada um dos dois espaços de tabela de desfazer. Os segmentos de rollback são distribuídos entre os espaços de tabela de desfazer de forma circular.

   Quando você adiciona tabelas de desfazer, o segmento de rollback no espaço de tabelas do sistema é tornado inativo.

3. Defina o número de espaços de tabelas de reversão usando a opção `innodb_undo_tablespaces`. O número especificado de espaços de tabelas de reversão é fixo para toda a vida útil da instância do MySQL, portanto, se você não tiver certeza sobre um valor ótimo, estime um valor alto.

4. Crie uma nova instância de teste do MySQL usando as configurações que você escolheu.

5. Use uma carga de trabalho realista na sua instância de teste com volume de dados semelhante aos seus servidores de produção para testar a configuração.

6. Avalie o desempenho de cargas de trabalho intensivas em I/O.

7. Aumente periodicamente o valor de `innodb_rollback_segments` e execute novamente os testes de desempenho até que não haja mais melhorias no desempenho de E/S.

##### Truncando Undo Tablespaces

Para truncar os espaços de tabelas de reversão, é necessário que a instância do MySQL tenha pelo menos dois espaços de tabelas de reversão ativos, o que garante que um espaço de tabela de reversão permaneça ativo enquanto o outro é desativado para ser truncado. O número de espaços de tabelas de reversão é definido pela variável `innodb_undo_tablespaces`. O valor padrão é 0. Use esta instrução para verificar o valor de `innodb_undo_tablespaces`:

```sql
mysql> SELECT @@innodb_undo_tablespaces;
+---------------------------+
| @@innodb_undo_tablespaces |
+---------------------------+
|                         2 |
+---------------------------+
```

Para permitir a desfazer a truncação de tabelaspaces, habilite a variável `innodb_undo_log_truncate`. Por exemplo:

```sql
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

Quando a variável `innodb_undo_log_truncate` está habilitada, os espaços de log de desfazer que excederem o limite de tamanho definido pela variável `innodb_max_undo_log_size` estão sujeitos à redução de tamanho. A variável `innodb_max_undo_log_size` é dinâmica e tem um valor padrão de 1073741824 bytes (1024 MiB).

```sql
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

Quando a variável `innodb_undo_log_truncate` estiver habilitada:

1. As tabelaspaces que excederem o valor de configuração `innodb_max_undo_log_size` são marcadas para serem truncadas. A seleção de um tabelaspace de desfazer é feita de forma circular para evitar que o mesmo tabelaspace de desfazer seja truncado a cada vez.

2. Os segmentos de rollback que residem no espaço de tabela de desfazer selecionado são tornados inativos para que não sejam atribuídos a novas transações. As transações existentes que estão atualmente usando segmentos de rollback podem ser concluídas.

3. O sistema de purga libera segmentos de rollback ao liberar logs de desfazer que não estão mais em uso.

4. Depois que todos os segmentos de rollback no espaço de tabelas de desfazer forem liberados, a operação de truncar é executada e o espaço de tabelas de desfazer é reduzido ao seu tamanho inicial. O tamanho inicial de um espaço de tabelas de desfazer depende do valor `innodb_page_size`. Para o tamanho de página padrão de 16 KB, o tamanho inicial do arquivo do espaço de tabelas de desfazer é de 10 MiB. Para os tamanhos de página de 4 KB, 8 KB, 32 KB e 64 KB, os tamanhos iniciais dos arquivos do espaço de tabelas de desfazer são, respectivamente, 7 MiB, 8 MiB, 20 MiB e 40 MiB.

   O tamanho de um espaço de tabelas de desfazer após uma operação de truncar pode ser maior que o tamanho inicial devido ao uso imediato após a conclusão da operação.

   A variável `innodb_undo_directory` define o local dos arquivos do espaço de tabelas de desfazer. Se a variável `innodb_undo_directory` não for definida, os espaços de tabelas de desfazer residem no diretório de dados.

5. Os segmentos de rollback são reativados para que possam ser atribuídos a novas transações.

###### Acelerar a truncação de tabelas de desfazer

O thread de purga é responsável por esvaziar e truncar os espaços de tabelas de reversão. Por padrão, o thread de purga procura por espaços de tabelas de reversão para truncar uma vez a cada 128 vezes que a purga é invocada. A frequência com que o thread de purga procura por espaços de tabelas de reversão para truncar é controlada pela variável `innodb_purge_rseg_truncate_frequency`, que tem um valor padrão de 128.

```sql
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

Para aumentar a frequência, diminua o ajuste `innodb_purge_rseg_truncate_frequency`. Por exemplo, para que o thread de purga procure espaços de tabela undo a cada 32 vezes que a purga for acionada, defina `innodb_purge_rseg_truncate_frequency` para 32.

```sql
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

Quando o thread de purga encontra um espaço de tabelas de desfazer que requer truncação, o thread de purga retorna com maior frequência para esvaziar e truncar rapidamente o espaço de tabelas de desfazer.

###### Impacto no desempenho de truncar arquivos do espaço de recuperação de tabelas

Quando um espaço de tabelas de desfazer é truncado, os segmentos de rollback no espaço de tabelas de desfazer são desativados. Os segmentos de rollback ativos em outros espaços de tabelas de desfazer assumem a responsabilidade por toda a carga do sistema, o que pode resultar em uma leve degradação do desempenho. A extensão em que o desempenho é afetado depende de vários fatores:

- Número de espaços de tabela de desfazer
- Número de registros de desfazer
- Reverter o tamanho do espaço de tabelas
- Velocidade do sistema de E/S
- Transações de longa duração existentes
- Carga do sistema

A maneira mais fácil de evitar o impacto potencial no desempenho é aumentar o número de espaços de tabelas desfazer.

Além disso, duas operações de ponto de verificação são realizadas durante uma operação de truncar um espaço de temporização. A primeira operação de ponto de verificação remove as páginas antigas do espaço de temporização da memória de buffer. A segunda operação de ponto de verificação descarrega as páginas iniciais do novo espaço de temporização para o disco. Em um sistema ocupado, a primeira operação de ponto de verificação, em particular, pode afetar temporariamente o desempenho do sistema se houver um grande número de páginas a serem removidas.

###### Reverter a recuperação de truncamento do espaço de tabelas

Uma operação de truncamento de um espaço de undo cria um arquivo temporário `undo_space_number_trunc.log` no diretório de log do servidor. Esse diretório de log é definido por `innodb_log_group_home_dir`. Se ocorrer uma falha no sistema durante a operação de truncamento, o arquivo de log temporário permite que o processo de inicialização identifique os espaços de undo que estavam sendo truncados e continue a operação.
