### 9.6.3 Como Reparar Tabelas MyISAM

A discussão nesta seção descreve como usar o `myisamchk` em tabelas `MyISAM` (extensões `.MYI` e `.MYD`).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`. Veja a Seção 15.7.3.2, “Instrução CHECK TABLE”, e a Seção 15.7.3.5, “Instrução REPAIR TABLE”.

Os sintomas de tabelas corrompidas incluem consultas que são abortadas inesperadamente e erros observáveis, como estes:

* Não consegue encontrar o arquivo `tbl_name.MYI` (Código de erro: *`nnn`*)
* Fim inesperado do arquivo
* O arquivo de registro está travado
* Obteve o erro *`nnn`* do manipulador da tabela

Para obter mais informações sobre o erro, execute `perror` *`nnn`*, onde *`nnn`* é o número do erro. O exemplo a seguir mostra como usar `perror` para encontrar os significados para os números de erro mais comuns que indicam um problema com uma tabela:

```
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

Note que o erro 135 (não há mais espaço no arquivo de registro) e o erro 136 (não há mais espaço no arquivo de índice) não são erros que podem ser corrigidos por uma simples reparação. Neste caso, você deve usar `ALTER TABLE` para aumentar os valores das opções de tabela `MAX_ROWS` e `AVG_ROW_LENGTH`:

```
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

Se você não conhece os valores atuais das opções de tabela, use `SHOW CREATE TABLE`.

Para os outros erros, você deve reparar suas tabelas. O `myisamchk` geralmente pode detectar e corrigir a maioria dos problemas que ocorrem.

O processo de reparo envolve até três etapas, descritas aqui. Antes de começar, você deve mudar a localização para o diretório do banco de dados e verificar as permissões dos arquivos da tabela. No Unix, certifique-se de que eles sejam legíveis pelo usuário pelo qual o `mysqld` é executado (e por você, porque você precisa acessar os arquivos que está verificando). Se descobrir que precisa modificar arquivos, eles também devem ser legíveis por você.

Esta seção é para os casos em que uma verificação de tabela falha (como os descritos na Seção 9.6.2, “Como Verificar Tabelas MyISAM por Erros”), ou você deseja usar as funcionalidades extensas que o `myisamchk` fornece.

As opções `myisamchk` usadas para a manutenção de tabelas estão descritas na Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”. O `myisamchk` também tem variáveis que você pode definir para controlar a alocação de memória, o que pode melhorar o desempenho. Veja a Seção 6.6.4.6, “Uso de Memória do `myisamchk’”.

Se você vai reparar uma tabela a partir da linha de comando, primeiro você deve parar o servidor `mysqld`. Note que, quando você executa `mysqladmin shutdown` em um servidor remoto, o servidor `mysqld` ainda está disponível por um tempo após o `mysqladmin` retornar, até que todo o processamento de instruções tenha parado e todas as alterações de índice tenham sido descarregadas no disco.

**Estágio 1: Verificação de suas tabelas**

Execute `myisamchk \*.MYI` ou `myisamchk -e \*.MYI` se você tiver mais tempo. Use a opção `-s` (silenciosa) para suprimir informações desnecessárias.

Se o servidor `mysqld` estiver parado, você deve usar a opção `--update-state` para dizer ao `myisamchk` para marcar a tabela como “verificada”.

Você só precisa reparar as tabelas para as quais o `myisamchk` anuncia um erro. Para essas tabelas, prossiga para o Estágio 2.

Se você receber erros inesperados ao verificar (como erros de “sem memória”), ou se o `myisamchk` falhar, vá para o Estágio 3.

**Estágio 2: Reparo seguro fácil**

Primeiro, tente `myisamchk -r -q tbl_name` (`-r -q` significa “modo de recuperação rápida”). Isso tenta reparar o arquivo de índice sem tocar no arquivo de dados. Se o arquivo de dados contiver tudo o que deveria e os links de exclusão apontarem para os locais corretos dentro do arquivo de dados, isso deve funcionar, e a tabela será corrigida. Comece a reparar a próxima tabela. Caso contrário, use o seguinte procedimento:

1. Faça um backup do arquivo de dados antes de continuar.
2. Use `myisamchk -r tbl_name` (`-r` significa "modo de recuperação"). Isso remove linhas incorretas e linhas excluídas do arquivo de dados e reconstrui o arquivo de índice.
3. Se a etapa anterior falhar, use `myisamchk --safe-recover tbl_name` O modo de recuperação segura usa um método de recuperação antigo que lida com alguns casos que o modo de recuperação regular não lida (mas é mais lento).

::: info Nota

Se você quiser que a operação de reparo seja muito mais rápida, deve definir os valores das variáveis `sort_buffer_size` e `key_buffer_size` para cerca de 25% da sua memória disponível ao executar `myisamchk`.

:::

Se você receber erros inesperados ao reparar (como erros de "sem memória"), ou se o `myisamchk` falhar, vá para a Etapa 3.

**Etapa 3: Reparo difícil**

Você deve chegar a esta etapa apenas se o primeiro bloco de 16KB no arquivo de índice for destruído ou contiver informações incorretas, ou se o arquivo de índice estiver ausente. Neste caso, é necessário criar um novo arquivo de índice. Faça-o da seguinte forma:

1. Mova o arquivo de dados para um local seguro.
2. Use o arquivo de descrição da tabela para criar novos (vazi) arquivos de dados e índice:

   ```
   $> mysql db_name
   ```

   ```
   mysql> SET autocommit=1;
   mysql> TRUNCATE TABLE tbl_name;
   mysql> quit
   ```
3. Copie o arquivo de dados antigo de volta para o novo arquivo de dados criado. (Não mova apenas o arquivo antigo de volta para o novo arquivo. Você quer reter uma cópia caso algo dê errado.) Importante

Se você estiver usando replicação, deve interromper-la antes de realizar o procedimento acima, pois envolve operações no sistema de arquivos, e estas não são registradas pelo MySQL.

Volte para a Etapa 2. `myisamchk -r -q` deve funcionar. (Isso não deve ser um loop infinito.)

Você também pode usar a instrução SQL `REPAIR TABLE tbl_name USE_FRM`, que realiza todo o procedimento automaticamente. Também não há possibilidade de interação indesejada entre uma ferramenta e o servidor, porque o servidor faz todo o trabalho quando você usa `REPAIR TABLE`. Veja a Seção 15.7.3.5, “Instrução REPAIR TABLE”.