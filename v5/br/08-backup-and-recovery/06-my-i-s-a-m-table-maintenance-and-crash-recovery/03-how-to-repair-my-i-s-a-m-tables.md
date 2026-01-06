### 7.6.3 Como reparar as tabelas MyISAM

A discussão nesta seção descreve como usar o **myisamchk** em tabelas `MyISAM` (extensões `.MYI` e `.MYD`).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Veja a Seção 13.7.2.2, “Instrução CHECK TABLE”, e a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

Os sintomas de tabelas corrompidas incluem consultas que são interrompidas inesperadamente e erros observáveis, como estes:

- `tbl_name.frm` está bloqueado para alterações

- Não consigo encontrar o arquivo `tbl_name.MYI` (Código de erro: *`nnn`*)

- Fim de arquivo inesperado

- O arquivo de gravação está travado

- Obtive o erro *`nnn`* do manipulador de tabela

Para obter mais informações sobre o erro, execute **perror** *`nnn`*, onde *`nnn`* é o número do erro. O exemplo a seguir mostra como usar **perror** para encontrar os significados para os números de erro mais comuns que indicam um problema com uma tabela:

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

Observe que os erros 135 (não há mais espaço no arquivo de registro) e 136 (não há mais espaço no arquivo de índice) não são erros que podem ser corrigidos por uma simples reparação. Nesse caso, você deve usar `ALTER TABLE` para aumentar os valores das opções de tabela `MAX_ROWS` e `AVG_ROW_LENGTH`:

```sql
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

Se você não conhece os valores atuais das opções da tabela, use `SHOW CREATE TABLE`.

Para os outros erros, você deve reparar suas tabelas. O **myisamchk** geralmente pode detectar e corrigir a maioria dos problemas que ocorrem.

O processo de reparo envolve até quatro etapas, descritas aqui. Antes de começar, você deve alterar a localização para o diretório do banco de dados e verificar as permissões dos arquivos da tabela. No Unix, certifique-se de que eles sejam legíveis pelo usuário pelo qual o **mysqld** é executado (e por você, porque você precisa acessar os arquivos que está verificando). Se você descobrir que precisa modificar arquivos, eles também devem ser legíveis por você.

Esta seção é para os casos em que uma verificação de tabela falha (como os descritos na Seção 7.6.2, “Como verificar as tabelas MyISAM em busca de erros”), ou se você deseja usar os recursos avançados que o **myisamchk** oferece.

As opções **myisamchk** usadas para a manutenção de tabelas estão descritas na Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”. O **myisamchk** também tem variáveis que você pode definir para controlar a alocação de memória, o que pode melhorar o desempenho. Veja a Seção 4.6.3.6, “Uso de Memória do \*\*myisamchk”].

Se você estiver reparando uma tabela a partir da linha de comando, primeiro você deve parar o servidor **mysqld**. Observe que, quando você executa **mysqladmin shutdown** em um servidor remoto, o servidor **mysqld** ainda está disponível por um tempo após o **mysqladmin** retornar, até que todo o processamento de instruções seja interrompido e todas as alterações de índice sejam descarregadas no disco.

**Fase 1: Verificação das suas tabelas**

Execute \**myisamchk *.MYI** ou \**myisamchk -e *.MYI** se você tiver mais tempo. Use a opção `-s` (silenciosa) para suprimir informações desnecessárias.

Se o servidor **mysqld** estiver parado, você deve usar a opção `--update-state` para informar ao **myisamchk** que a tabela deve ser marcada como "verificada".

Você precisa reparar apenas as tabelas para as quais o **myisamchk** anuncia um erro. Para essas tabelas, prossiga para a Etapa 2.

Se você receber erros inesperados ao verificar (como erros de "sem memória"), ou se o **myisamchk** falhar, vá para a Etapa 3.

**Fase 2: Reparo seguro e fácil**

Primeiro, tente **myisamchk -r -q *`tbl_name`*** (`-r -q` significa "modo de recuperação rápida"). Isso tenta reparar o arquivo de índice sem tocar no arquivo de dados. Se o arquivo de dados contiver tudo o que deveria e os links de exclusão apontarem para os locais corretos dentro do arquivo de dados, isso deve funcionar, e a tabela será corrigida. Comece a reparar a próxima tabela. Caso contrário, use o seguinte procedimento:

1. Faça um backup do arquivo de dados antes de continuar.

2. Use **myisamchk -r *`tbl_name`*** (`-r` significa "modo de recuperação"). Isso remove linhas incorretas e linhas excluídas do arquivo de dados e reconstrui o arquivo de índice.

3. Se a etapa anterior falhar, use **myisamchk --safe-recover *`tbl_name`***. O modo de recuperação segura usa um método de recuperação antigo que lida com alguns casos que o modo de recuperação regular não lida (mas é mais lento).

Nota

Se você deseja que a operação de reparo seja muito mais rápida, deve definir os valores das variáveis `sort_buffer_size` e `key_buffer_size` para cerca de 25% da memória disponível ao executar o **myisamchk**.

Se você receber erros inesperados durante a reparação (como erros de "sem memória"), ou se o **myisamchk** falhar, vá para a Etapa 3.

**Fase 3: Reparo difícil**

Você deve chegar a essa etapa apenas se o primeiro bloco de 16 KB no arquivo de índice for destruído ou contiver informações incorretas, ou se o arquivo de índice estiver ausente. Nesse caso, é necessário criar um novo arquivo de índice. Faça isso da seguinte forma:

1. Mude o arquivo de dados para um local seguro.

2. Use o arquivo de descrição da tabela para criar novos (vazi) arquivos de dados e de índice:

   ```sql
   $> mysql db_name
   ```

   ```sql
   mysql> SET autocommit=1;
   mysql> TRUNCATE TABLE tbl_name;
   mysql> quit
   ```

3. Copie o arquivo de dados antigo de volta para o novo arquivo de dados recém-criado. (Não mova apenas o arquivo antigo de volta para o novo arquivo. Você quer manter uma cópia caso algo dê errado.)

Importante

Se você estiver usando replicação, deve interromper o processo antes de realizar o procedimento acima, pois envolve operações no sistema de arquivos, e essas operações não são registradas pelo MySQL.

Volte para a Etapa 2. **myisamchk -r -q** deve funcionar. (Isso não deve ser um loop infinito.)

Você também pode usar a instrução SQL `REPAIR TABLE tbl_name USE_FRM`, que executa todo o procedimento automaticamente. Além disso, não há possibilidade de interação indesejada entre um utilitário e o servidor, porque o servidor faz todo o trabalho quando você usa `REPAIR TABLE`. Veja a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

**Estágio 4: Reparo muito difícil**

Você deve chegar a essa etapa apenas se o arquivo de descrição `.frm` também falhar. Isso nunca deve acontecer, porque o arquivo de descrição não é alterado após a criação da tabela:

1. Restaure o arquivo de descrição de um backup e volte para a Etapa 3. Você também pode restaurar o arquivo de índice e voltar para a Etapa 2. Neste último caso, você deve começar com **myisamchk -r**.

2. Se você não tiver um backup, mas souber exatamente como a tabela foi criada, crie uma cópia da tabela em outro banco de dados. Remova o novo arquivo de dados e, em seguida, mova os arquivos de descrição `.frm` e `.MYI` do outro banco de dados para o seu banco de dados que falhou. Isso lhe dará novos arquivos de descrição e índice, mas deixará o arquivo de dados `.MYD` em paz. Volte para a Etapa 2 e tente reconstruir o arquivo de índice.
