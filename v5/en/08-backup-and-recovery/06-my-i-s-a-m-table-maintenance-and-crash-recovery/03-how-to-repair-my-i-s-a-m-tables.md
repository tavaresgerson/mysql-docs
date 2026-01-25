### 7.6.3 Como Reparar Tabelas MyISAM

A discussão nesta seção descreve como usar o **myisamchk** em tabelas `MyISAM` (extensões `.MYI` e `.MYD`).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Consulte a Seção 13.7.2.2, “Instrução CHECK TABLE”, e a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

Os sintomas de tabelas corrompidas incluem Queries que abortam inesperadamente e erros observáveis, como estes:

* `tbl_name.frm` está travado contra alterações
* Não é possível encontrar o arquivo `tbl_name.MYI` (Errcode: *`nnn`*)
* Fim de arquivo inesperado
* Arquivo de registro está corrompido
* Erro *`nnn`* recebido do table handler

Para obter mais informações sobre o erro, execute **perror** *`nnn`*, onde *`nnn`* é o número do erro. O exemplo a seguir mostra como usar o **perror** para encontrar os significados dos números de erro mais comuns que indicam um problema com uma tabela:

```sql
$> perror 126 127 132 134 135 136 141 144 145
MySQL error code 126 = Index file is crashed
MySQL error code 127 = Record-file is crashed
MySQL error code 132 = Old database file
MySQL error code 134 = Record was already deleted (or record file crashed)
MySQL error code 135 = No more room in record file
MySQL error code 136 = No more room in index file
MySQL error code 141 = Duplicate unique key or constraint on write or update
MySQL error code 144 = Table is crashed and last repair failed
MySQL error code 145 = Table was marked as crashed and should be repaired
```

Note que o erro 135 (não há mais espaço no arquivo de registro) e o erro 136 (não há mais espaço no Index file) não são erros que podem ser corrigidos por um simples repair. Neste caso, você deve usar `ALTER TABLE` para aumentar os valores das opções de tabela `MAX_ROWS` e `AVG_ROW_LENGTH`:

```sql
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

Se você não souber os valores atuais das opções da tabela, use `SHOW CREATE TABLE`.

Para os outros erros, você deve reparar suas tabelas. O **myisamchk** geralmente pode detectar e corrigir a maioria dos problemas que ocorrem.

O processo de repair envolve até quatro estágios, descritos aqui. Antes de começar, você deve mudar o diretório para o diretório do Database e verificar as permissões dos arquivos da tabela. No Unix, certifique-se de que eles sejam legíveis pelo usuário que executa o **mysqld** (e por você, pois você precisa acessar os arquivos que está verificando). Se for necessário modificar os arquivos, eles também devem ser graváveis por você.

Esta seção é para os casos em que uma verificação de tabela falha (como as descritas na Seção 7.6.2, “Como Verificar Erros em Tabelas MyISAM”), ou quando você deseja usar os recursos estendidos que o **myisamchk** oferece.

As opções do **myisamchk** usadas para manutenção de tabela estão descritas na Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabela MyISAM”. O **myisamchk** também possui variáveis que você pode configurar para controlar a alocação de memória, o que pode melhorar o performance. Consulte a Seção 4.6.3.6, “Uso de Memória do myisamchk”.

Se você for reparar uma tabela a partir da linha de comando, você deve primeiro parar o servidor **mysqld**. Note que, quando você executa **mysqladmin shutdown** em um servidor remoto, o servidor **mysqld** ainda fica disponível por um tempo após o retorno do **mysqladmin**, até que todo o processamento de instruções tenha parado e todas as alterações de Index tenham sido descarregadas para o disco.

**Estágio 1: Verificando suas tabelas**

Execute **myisamchk \*.MYI** ou **myisamchk -e \*.MYI** se você tiver mais tempo. Use a opção `-s` (silent/silencioso) para suprimir informações desnecessárias.

Se o servidor **mysqld** estiver parado, você deve usar a opção `--update-state` para instruir o **myisamchk** a marcar a tabela como “verificada” (checked).

Você deve reparar apenas as tabelas para as quais o **myisamchk** anuncia um erro. Para essas tabelas, prossiga para o Estágio 2.

Se você receber erros inesperados durante a verificação (como erros de `out of memory`), ou se o **myisamchk** falhar (crash), vá para o Estágio 3.

**Estágio 2: Repair fácil e seguro**

Primeiro, tente **myisamchk -r -q *`tbl_name`*** (`-r -q` significa “quick recovery mode” ou "modo de recuperação rápida"). Isso tenta reparar o Index file sem tocar no data file. Se o data file contiver tudo o que deveria e os links de exclusão apontarem para os locais corretos dentro do data file, isso deve funcionar e a tabela será corrigida. Comece a reparar a próxima tabela. Caso contrário, use o seguinte procedimento:

1. Faça um backup do data file antes de continuar.
2. Use **myisamchk -r *`tbl_name`*** (`-r` significa “recovery mode”). Isso remove linhas incorretas e linhas excluídas do data file e reconstrói o Index file.
3. Se a etapa anterior falhar, use **myisamchk --safe-recover *`tbl_name`***. O safe recovery mode (modo de recuperação seguro) utiliza um método de recuperação antigo que lida com alguns casos que o recovery mode regular não lida (mas é mais lento).

Nota

Se você deseja que uma operação de repair seja muito mais rápida, você deve configurar os valores das variáveis `sort_buffer_size` e `key_buffer_size` para cerca de 25% da sua memória disponível ao executar o **myisamchk**.

Se você receber erros inesperados durante o repair (como erros de `out of memory`), ou se o **myisamchk** falhar (crash), vá para o Estágio 3.

**Estágio 3: Repair difícil**

Você só deve chegar a este estágio se o primeiro bloco de 16KB no Index file estiver destruído ou contiver informações incorretas, ou se o Index file estiver faltando. Neste caso, é necessário criar um novo Index file. Faça isso da seguinte forma:

1. Mova o data file para um local seguro.
2. Use o arquivo de descrição da tabela para criar novos data files e Index files (vazios):

   ```sql
   $> mysql db_name
   ```

   ```sql
   mysql> SET autocommit=1;
   mysql> TRUNCATE TABLE tbl_name;
   mysql> quit
   ```

3. Copie o data file antigo de volta para o data file recém-criado. (Não apenas mova o arquivo antigo para o novo. Você deve manter uma cópia caso algo dê errado.)

Importante

Se você estiver usando Replication, você deve pará-lo antes de executar o procedimento acima, pois ele envolve operações de sistema de arquivos, e estas não são logadas pelo MySQL.

Volte ao Estágio 2. O **myisamchk -r -q** deve funcionar. (Isto não deve ser um loop infinito.)

Você também pode usar a instrução SQL `REPAIR TABLE tbl_name USE_FRM`, que executa todo o procedimento automaticamente. Além disso, não há possibilidade de interação indesejada entre um utilitário e o server, porque o server faz todo o trabalho quando você usa `REPAIR TABLE`. Consulte a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

**Estágio 4: Repair muito difícil**

Você só deve chegar a este estágio se o arquivo de descrição `.frm` também tiver falhado (crash). Isso nunca deveria acontecer, pois o arquivo de descrição não é alterado após a criação da tabela:

1. Restaure o arquivo de descrição a partir de um backup e volte ao Estágio 3. Você também pode restaurar o Index file e voltar ao Estágio 2. Neste último caso, você deve começar com **myisamchk -r**.

2. Se você não tiver um backup, mas souber exatamente como a tabela foi criada, crie uma cópia da tabela em outro Database. Remova o novo data file e, em seguida, mova os arquivos de descrição `.frm` e Index files `.MYI` do outro Database para o seu Database corrompido. Isso fornece novos arquivos de descrição e Index files, mas deixa o data file `.MYD` intacto. Volte ao Estágio 2 e tente reconstruir o Index file.