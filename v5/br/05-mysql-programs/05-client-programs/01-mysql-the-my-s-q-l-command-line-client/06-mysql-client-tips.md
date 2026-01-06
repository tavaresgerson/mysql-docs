#### 4.5.1.6 Dicas do cliente do MySQL

Esta seção fornece informações sobre técnicas para o uso mais eficaz do **mysql** e sobre o comportamento operacional do **mysql**.

- Edição de linhas de entrada
- Desativar Histórico Interativo
- Suporte ao Unicode no Windows
- Exibir resultados de consulta verticalmente
- Usando o modo de atualizações seguras (--safe-updates)")
- Desativar o Auto-Reconexão do MySQL
- Parser do cliente MySQL versus parser do servidor

##### Edição de linhas de entrada

O **mysql** suporta edição de linhas de entrada, o que permite modificar a linha de entrada atual no local ou recuperar linhas de entrada anteriores. Por exemplo, as teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente dentro da linha de entrada atual, e as teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo pelas linhas previamente inseridas. **Backspace** exclui o caractere antes do cursor e a digitação de novos caracteres os insere na posição do cursor. Para inserir a linha, pressione **Enter**.

No Windows, as sequências de teclas de edição são as mesmas que são suportadas para edição de comandos em janelas de console. No Unix, as sequências de teclas dependem da biblioteca de entrada usada para construir o **mysql** (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação das bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de teclas permitidas por uma determinada biblioteca de entrada, defina as associações de teclas no arquivo de inicialização da biblioteca. Esse é um arquivo no seu diretório de casa: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, no `libedit`, **Control+W** exclui tudo antes da posição atual do cursor e **Control+U** exclui toda a linha. No `readline`, **Control+W** exclui a palavra antes do cursor e **Control+U** exclui tudo antes da posição atual do cursor. Se o `mysql` foi construído usando `libedit`, um usuário que prefere o comportamento do `readline` para essas duas teclas pode colocar as seguintes linhas no arquivo `.editrc` (criando o arquivo, se necessário):

```sql
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de vinculações de teclas, coloque temporariamente uma linha que diga apenas `bind` no final de `.editrc`. Então o **mysql** mostrará as vinculações quando ele for iniciado.

##### Desativar Histórico Interativo

A tecla **seta para cima** permite que você recupere linhas de entrada de sessões atuais e anteriores. Em casos em que um console é compartilhado, esse comportamento pode não ser adequado. O **mysql** suporta a desativação parcial ou total do histórico interativo, dependendo da plataforma do host.

No Windows, o histórico é armazenado na memória. **Alt+F7** exclui todas as linhas de entrada armazenadas na memória do buffer de histórico atual. Também exclui a lista de números sequenciais na frente das linhas de entrada exibidas com **F7** e recuperadas (por número) com **F9**. Novas linhas de entrada inseridas após pressionar **Alt+F7** repopulam o buffer de histórico atual. A limpeza do buffer não impede o registro no Visualizador de Eventos do Windows, se a opção `--syslog` foi usada para iniciar o **mysql**. Fechar a janela da consola também limpa o buffer de histórico atual.

Para desativar o histórico interativo no Unix, primeiro exclua o arquivo `.mysql_history`, se ele existir (as entradas anteriores serão recuperadas caso contrário). Em seguida, inicie o **mysql** com a opção `--histignore="*"` para ignorar todas as novas linhas de entrada. Para reativar o comportamento de recuperação (e registro), reinicie o **mysql** sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Como controlar o arquivo de histórico) e usar `--histignore="*"` para iniciar o cliente **mysql**, a funcionalidade de recall interativo do histórico será desativada completamente. Alternativamente, se você omitir a opção `--histignore`, poderá recuperar as linhas de entrada inseridas durante a sessão atual.

##### Suporte ao Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e escrita no console; o cliente **mysql** para Windows é capaz de usar essas APIs. O instalador do Windows cria um item no menu do MySQL chamado `MySQL command line client - Unicode`. Esse item invoca o cliente **mysql** com propriedades configuradas para se comunicar através do console com o servidor MySQL usando Unicode.

Para aproveitar esse suporte manualmente, execute o **mysql** em um console que use uma fonte Unicode compatível e defina o conjunto de caracteres padrão para um conjunto de caracteres Unicode que seja suportado para a comunicação com o servidor:

1. Abra uma janela do console.

2. Vá para as propriedades da janela do console, selecione a aba fonte e escolha a fonte Lucida Console ou outra fonte Unicode compatível. Isso é necessário porque as janelas do console começam por padrão usando uma fonte raster DOS que é inadequada para Unicode.

3. Execute o **mysql.exe** com a opção `--default-character-set=utf8` (ou `utf8mb4`). Esta opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não podem ser usados como conjunto de caracteres do cliente. Veja Conjuntos de caracteres do cliente impermissíveis.

Com essas mudanças, o **mysql** pode usar as APIs do Windows para se comunicar com o console usando UTF-16LE e se comunicar com o servidor usando UTF-8. (O item do menu mencionado anteriormente define a fonte e o conjunto de caracteres conforme descrito anteriormente.)

Para evitar esses passos toda vez que você executar o **mysql**, você pode criar um atalho que invoque o **mysql.exe**. O atalho deve definir a fonte do console para Lucida Console ou outra fonte Unicode compatível e passar a opção `--default-character-set=utf8` (ou `utf8mb4`) para o **mysql.exe**.

Alternativamente, crie um atalho que configure apenas a fonte do console e defina o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```sql
[mysql]
default-character-set=utf8
```

##### Exibir resultados de consulta verticalmente

Alguns resultados de consultas são muito mais legíveis quando exibidos verticalmente, em vez do formato usual de tabela horizontal. As consultas podem ser exibidas verticalmente terminando a consulta com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem novas linhas são geralmente muito mais fáceis de ler com saída vertical:

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

##### Usando o modo de atualizações seguras (--safe-updates)

Para iniciantes, uma opção útil de inicialização é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil em casos em que você pode ter emitido uma declaração `UPDATE` ou `DELETE`, mas esqueceu a cláusula `WHERE` que indica quais linhas devem ser modificadas. Normalmente, essas declarações atualizam ou excluem todas as linhas da tabela. Com `--safe-updates`, você pode modificar linhas apenas especificando os valores de chave que as identificam, ou uma cláusula `LIMIT`, ou ambas. Isso ajuda a evitar acidentes. O modo de atualizações seguras também restringe declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes.

A opção `--safe-updates` faz com que o **mysql** execute a seguinte instrução quando se conecta ao servidor MySQL, para definir os valores da sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit` e `max_join_size`:

```sql
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A instrução `SET` afeta o processamento das instruções da seguinte forma:

- Ativação de `sql_safe_updates` faz com que as instruções `UPDATE` e `DELETE` produzam um erro se não especificar uma restrição de chave na cláusula `WHERE`, ou fornecer uma cláusula `LIMIT`, ou ambas. Por exemplo:

  ```sql
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

- Definir `sql_select_limit` para 1.000 faz com que o servidor limite todos os conjuntos de resultados `SELECT` para 1.000 linhas, a menos que a instrução inclua uma cláusula `LIMIT`.

- Definir `max_join_size` para 1.000.000 faz com que as instruções `SELECT` de múltiplas tabelas produzam um erro se o servidor estimar que deve examinar mais de 1.000.000 de combinações de linhas.

Para especificar limites de conjunto de resultados diferentes de 1.000 e 1.000.000, você pode substituir os valores padrão usando as opções `--select-limit` e `--max-join-size` ao invocar o **mysql**:

```sql
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as instruções `UPDATE` e `DELETE` gerem um erro no modo de atualizações seguras, mesmo com uma chave especificada na cláusula `WHERE`, se o otimizador decidir não usar o índice na coluna da chave:

- O acesso de intervalo no índice não pode ser usado se o uso de memória exceder o permitido pela variável de sistema `range_optimizer_max_mem_size`. O otimizador, então, retorna a um varredura de tabela. Veja Limitar o uso de memória para otimização de intervalo.

- Se as comparações principais requerem conversão de tipo, o índice pode não ser usado (consulte a Seção 8.3.1, “Como o MySQL Usa Índices”). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido para um número e os operandos são comparados numericamente (consulte a Seção 12.3, “Conversão de Tipo na Avaliação da Expressão”), impedindo o uso do índice. Se o modo de atualizações seguras estiver ativado, um erro ocorre.

A partir do MySQL 5.7.25, o modo safe-updates também inclui esses comportamentos:

- As instruções `EXPLAIN` com `UPDATE` e `DELETE` não geram erros de atualizações seguras. Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um índice não está sendo usado, o que pode ser útil em casos como quando ocorre uma violação do `range_optimizer_max_mem_size` ou conversão de tipo e o otimizador não usa um índice, mesmo que uma coluna chave tenha sido especificada na cláusula `WHERE`.

- Quando ocorre um erro de atualização de segurança, a mensagem de erro inclui o primeiro diagnóstico gerado, para fornecer informações sobre a razão do erro. Por exemplo, a mensagem pode indicar que o valor `range_optimizer_max_mem_size` foi excedido ou que ocorreu uma conversão de tipo, o que pode impedir o uso de um índice.

- Para excluições e atualizações em várias tabelas, um erro é gerado com atualizações seguras habilitadas apenas se qualquer tabela de destino usar uma varredura de tabela.

##### Desativar o Auto-Reconexão do MySQL

Se o cliente **mysql** perder sua conexão com o servidor enquanto envia uma declaração, ele tentará imediatamente e automaticamente reconectar-se ao servidor e enviar a declaração novamente. No entanto, mesmo que o **mysql** consiga reconectar, sua primeira conexão terminará e todos os objetos e configurações de sua sessão anterior serão perdidos: tabelas temporárias, o modo de autocommit e variáveis definidas pelo usuário e de sessão. Além disso, qualquer transação atual será revertida. Esse comportamento pode ser perigoso para você, como no exemplo seguinte, onde o servidor foi desligado e reiniciado entre a primeira e a segunda declarações sem que você soubesse:

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

A variável de usuário `@a` foi perdida com a conexão e, após a reconexão, ela está indefinida. Se for importante que o **mysql** termine com um erro se a conexão for perdida, você pode iniciar o cliente **mysql** com a opção `--skip-reconnect`.

Para obter mais informações sobre a reconexão automática e seu efeito nas informações de estado quando ocorre uma reconexão, consulte o Controle de Reconexão Automática.

##### Parser do cliente MySQL versus parser do servidor

O cliente **mysql** utiliza um analisador no lado do cliente que não é um duplicado do analisador completo utilizado pelo servidor **mysqld** no lado do servidor. Isso pode levar a diferenças no tratamento de certas construções. Exemplos:

- O analisador de servidor trata as cadeias delimitadas por caracteres `"` como identificadores, em vez de como cadeias simples, se o modo SQL `ANSI_QUOTES` estiver ativado.

  O analisador de cliente **mysql** não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata as strings delimitadas por `"`, `'`, e \`\`\` caracteres da mesma forma, independentemente de `ANSI_QUOTES` estar habilitado.

- Nos comentários `/*! ... */`, o analisador de clientes **mysql** interpreta comandos **mysql** de forma abreviada. O analisador do servidor não os interpreta, pois esses comandos não têm significado no lado do servidor.

  Se for desejável que o **mysql** não interprete comandos abreviados dentro de comentários, uma solução parcial é usar a opção `--binary-mode`, que desabilita todos os comandos do **mysql**, exceto `\C` e `\d` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).
