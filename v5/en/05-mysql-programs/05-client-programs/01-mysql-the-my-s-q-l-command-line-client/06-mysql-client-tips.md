#### 4.5.1.6 Dicas do Cliente mysql

Esta seção fornece informações sobre técnicas para um uso mais eficaz do **mysql** e sobre o comportamento operacional do **mysql**.

* Edição da Linha de Input
* Desabilitando o Histórico Interativo
* Suporte a Unicode no Windows
* Exibindo Resultados de Query Verticalmente
* Usando o Modo de Atualizações Seguras (--safe-updates)
* Desabilitando o Auto-Reconect do mysql
* Parser do Cliente mysql Versus Parser do Servidor

##### Edição da Linha de Input

O **mysql** suporta edição da linha de input, o que permite modificar a linha de input atual no local ou recuperar linhas de input anteriores. Por exemplo, as teclas **seta para a esquerda** e **seta para a direita** movem horizontalmente dentro da linha de input atual, e as teclas **seta para cima** e **seta para baixo** movem para cima e para baixo através do conjunto de linhas inseridas anteriormente. **Backspace** apaga o caractere antes do cursor e a digitação de novos caracteres os insere na posição do cursor. Para inserir a linha, pressione **Enter**.

No Windows, as sequências de teclas de edição são as mesmas suportadas para edição de comandos em janelas de console. No Unix, as sequências de teclas dependem da biblioteca de input usada para construir o **mysql** (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação para as bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de teclas permitidas por uma determinada biblioteca de input, defina as vinculações de teclas (key bindings) no arquivo de inicialização da biblioteca. Este é um arquivo no seu diretório home: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, no `libedit`, **Control+W** apaga tudo antes da posição atual do cursor e **Control+U** apaga a linha inteira. No `readline`, **Control+W** apaga a palavra antes do cursor e **Control+U** apaga tudo antes da posição atual do cursor. Se o **mysql** foi construído usando `libedit`, um usuário que prefira o comportamento do `readline` para estas duas teclas pode colocar as seguintes linhas no arquivo `.editrc` (criando o arquivo se necessário):

```sql
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de vinculações de teclas (key bindings), coloque temporariamente uma linha que diga apenas `bind` no final do `.editrc`. Em seguida, o **mysql** mostrará as vinculações ao iniciar.

##### Desabilitando o Histórico Interativo

A tecla **seta para cima** permite recuperar linhas de input de sessões atuais e anteriores. Em casos em que um console é compartilhado, este comportamento pode ser inadequado. O **mysql** suporta a desabilitação do histórico interativo parcial ou totalmente, dependendo da plataforma host.

No Windows, o histórico é armazenado na memória. **Alt+F7** apaga todas as linhas de input armazenadas na memória para o buffer de histórico atual. Ele também apaga a lista de números sequenciais na frente das linhas de input exibidas com **F7** e recuperadas (por número) com **F9**. Novas linhas de input inseridas depois de pressionar **Alt+F7** repovoam o buffer de histórico atual. Limpar o buffer não impede o registro no Windows Event Viewer, se a opção `--syslog` foi usada para iniciar o **mysql**. Fechar a janela do console também limpa o buffer de histórico atual.

Para desabilitar o histórico interativo no Unix, primeiro apague o arquivo `.mysql_history`, se ele existir (caso contrário, entradas anteriores são recuperadas). Em seguida, inicie o **mysql** com a opção `--histignore="*"` para ignorar todas as novas linhas de input. Para reabilitar o comportamento de recuperação (e logging), reinicie o **mysql** sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Controlling the History File) e usar `--histignore="*"` para iniciar o cliente **mysql**, o recurso de recuperação de histórico interativo será totalmente desabilitado. Alternativamente, se você omitir a opção `--histignore`, você poderá recuperar as linhas de input inseridas durante a sessão atual.

##### Suporte a Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e escrita no console; o cliente **mysql** para Windows é capaz de usar estas APIs. O instalador do Windows cria um item no menu MySQL chamado `MySQL command line client - Unicode`. Este item invoca o cliente **mysql** com propriedades definidas para se comunicar através do console com o servidor MySQL usando Unicode.

Para tirar proveito deste suporte manualmente, execute o **mysql** dentro de um console que usa uma fonte Unicode compatível e defina o conjunto de caracteres padrão para um conjunto de caracteres Unicode suportado para comunicação com o servidor:

1. Abra uma janela de console.
2. Vá para as propriedades da janela do console, selecione a aba de fonte e escolha Lucida Console ou alguma outra fonte Unicode compatível. Isso é necessário porque as janelas do console iniciam por padrão usando uma fonte raster DOS que é inadequada para Unicode.
3. Execute **mysql.exe** com a opção `--default-character-set=utf8` (ou `utf8mb4`). Esta opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não pode ser usado como o conjunto de caracteres do cliente. Veja Impermissible Client Character Sets.

Com essas alterações, o **mysql** pode usar as APIs do Windows para se comunicar com o console usando UTF-16LE, e se comunicar com o servidor usando UTF-8. (O item de menu mencionado anteriormente define a fonte e o conjunto de caracteres conforme descrito acima.)

Para evitar essas etapas toda vez que você executar o **mysql**, você pode criar um atalho que invoca **mysql.exe**. O atalho deve definir a fonte do console para Lucida Console ou alguma outra fonte Unicode compatível, e passar a opção `--default-character-set=utf8` (ou `utf8mb4`) para **mysql.exe**.

Alternativamente, crie um atalho que defina apenas a fonte do console, e defina o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```sql
[mysql]
default-character-set=utf8
```

##### Exibindo Resultados de Query Verticalmente

Alguns resultados de Query são muito mais legíveis quando exibidos verticalmente, em vez do formato usual de tabela horizontal. As Queries podem ser exibidas verticalmente encerrando a Query com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem quebras de linha são frequentemente muito mais fáceis de ler com output vertical:

```sql
mysql> SELECT * FROM mails WHERE LENGTH(txt) < 300 LIMIT 300,1\G
*************************** 1. row ***************************
  msg_nro: 3068
     date: 2000-03-01 23:29:50
time_zone: +0200
mail_from: Jones
    reply: jones@example.com
  mail_to: "John Smith" <smith@example.com>
      sbj: UTF-8
      txt: >>>>> "John" == John Smith writes:

John> Hi.  I think this is a good idea.  Is anyone familiar
John> with UTF-8 or Unicode? Otherwise, I'll put this on my
John> TODO list and see what happens.

Yes, please do that.

Regards,
Jones
     file: inbox-jani-1
     hash: 190402944
1 row in set (0.09 sec)
```

##### Usando o Modo de Atualizações Seguras (--safe-updates)

Para iniciantes, uma opção de inicialização útil é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil para casos em que você pode ter emitido uma instrução `UPDATE` ou `DELETE`, mas esqueceu a cláusula `WHERE` indicando quais linhas modificar. Normalmente, tais instruções atualizam ou apagam todas as linhas na tabela. Com `--safe-updates`, você pode modificar linhas apenas especificando os valores da Key que as identificam, ou uma cláusula `LIMIT`, ou ambos. Isso ajuda a evitar acidentes. O modo de atualizações seguras também restringe instruções `SELECT` que produzem (ou se estima que produzam) conjuntos de resultados (result sets) muito grandes.

A opção `--safe-updates` faz com que o **mysql** execute a seguinte instrução ao se conectar ao servidor MySQL, para definir os valores de sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit` e `max_join_size`:

```sql
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A instrução `SET` afeta o processamento da instrução da seguinte forma:

* Habilitar `sql_safe_updates` faz com que as instruções `UPDATE` e `DELETE` produzam um erro se não especificarem uma restrição de Key na cláusula `WHERE`, ou fornecerem uma cláusula `LIMIT`, ou ambos. Por exemplo:

  ```sql
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

* Definir `sql_select_limit` para 1.000 faz com que o servidor limite todos os result sets de `SELECT` a 1.000 linhas, a menos que a instrução inclua uma cláusula `LIMIT`.

* Definir `max_join_size` para 1.000.000 faz com que instruções `SELECT` de múltiplas tabelas produzam um erro se o servidor estimar que deve examinar mais de 1.000.000 de combinações de linhas.

Para especificar limites de result set diferentes de 1.000 e 1.000.000, você pode sobrescrever os defaults usando as opções `--select-limit` e `--max-join-size` ao invocar o **mysql**:

```sql
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as instruções `UPDATE` e `DELETE` produzam um erro no modo de atualizações seguras mesmo com uma Key especificada na cláusula `WHERE`, se o otimizador decidir não usar o Index na coluna da Key:

* O acesso por Range no Index não pode ser usado se o uso de memória exceder o permitido pela variável de sistema `range_optimizer_max_mem_size`. O otimizador então retorna a um table scan. Veja Limiting Memory Use for Range Optimization.

* Se as comparações de Key exigirem conversão de tipo (type conversion), o Index pode não ser usado (veja Seção 8.3.1, “How MySQL Uses Indexes”). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido para um número e os operandos são comparados numericamente (veja Seção 12.3, “Type Conversion in Expression Evaluation”), impedindo o uso do Index. Se o modo de atualizações seguras estiver habilitado, ocorre um erro.

A partir do MySQL 5.7.25, o modo de atualizações seguras também inclui estes comportamentos:

* `EXPLAIN` com instruções `UPDATE` e `DELETE` não produz erros de atualizações seguras. Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um Index não é usado, o que pode ser útil em casos como quando uma violação de `range_optimizer_max_mem_size` ou conversão de tipo ocorre e o otimizador não usa um Index mesmo que uma coluna de Key tenha sido especificada na cláusula `WHERE`.

* Quando ocorre um erro de atualizações seguras, a mensagem de erro inclui o primeiro diagnóstico que foi produzido, para fornecer informações sobre o motivo da falha. Por exemplo, a mensagem pode indicar que o valor de `range_optimizer_max_mem_size` foi excedido ou que ocorreu conversão de tipo, qualquer um dos quais pode impedir o uso de um Index.

* Para DELETEs e UPDATEs de múltiplas tabelas, um erro é produzido com atualizações seguras habilitadas somente se alguma tabela de destino usar um table scan.

##### Desabilitando o Auto-Reconect do mysql

Se o cliente **mysql** perder sua conexão com o servidor enquanto envia uma instrução, ele tenta imediata e automaticamente reconectar-se uma vez ao servidor e enviar a instrução novamente. No entanto, mesmo que o **mysql** consiga reconectar-se, sua primeira conexão foi encerrada e todos os seus objetos e configurações de sessão anteriores são perdidos: tabelas temporárias, o modo autocommit e variáveis de sessão e definidas pelo usuário. Além disso, qualquer transação atual faz rollback. Este comportamento pode ser perigoso para você, como no exemplo a seguir onde o servidor foi desligado e reiniciado entre a primeira e a segunda instruções sem que você soubesse:

```sql
mysql> SET @a=1;
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t VALUES(@a);
ERROR 2006: MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    1
Current database: test

Query OK, 1 row affected (1.30 sec)

mysql> SELECT * FROM t;
+------+
| a    |
+------+
| NULL |
+------+
1 row in set (0.05 sec)
```

A variável de usuário `@a` foi perdida com a conexão e, após a reconexão, está indefinida. Se for importante que o **mysql** encerre com um erro caso a conexão tenha sido perdida, você pode iniciar o cliente **mysql** com a opção `--skip-reconnect`.

Para mais informações sobre o auto-reconnect e seu efeito nas informações de estado quando ocorre uma reconexão, veja Automatic Reconnection Control.

##### Parser do Cliente mysql Versus Parser do Servidor

O cliente **mysql** usa um Parser do lado do cliente que não é uma duplicata do Parser completo usado pelo servidor **mysqld** do lado do servidor. Isso pode levar a diferenças no tratamento de certas construções. Exemplos:

* O Parser do servidor trata strings delimitadas por caracteres `"` como Identifiers (Identificadores) em vez de strings simples se o modo SQL `ANSI_QUOTES` estiver habilitado.

  O Parser do cliente **mysql** não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata strings delimitadas por caracteres `"`, `'`, e `` ` `` da mesma forma, independentemente de `ANSI_QUOTES` estar habilitado.

* Dentro de comentários `/*! ... */`, o Parser do cliente **mysql** interpreta comandos **mysql** de forma abreviada (short-form). O Parser do servidor não os interpreta porque esses comandos não têm significado no lado do servidor.

  Se for desejável que o **mysql** não interprete comandos de forma abreviada dentro de comentários, uma solução alternativa parcial (workaround) é usar a opção `--binary-mode`, que faz com que todos os comandos **mysql** sejam desabilitados, exceto `\C` e `\d` no modo não interativo (para input canalizado para o **mysql** ou carregado usando o comando `source`).