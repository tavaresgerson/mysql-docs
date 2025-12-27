#### 6.5.1.6 Dicas do Cliente do MySQL

Esta seção fornece informações sobre técnicas para o uso mais eficaz do `mysql` e sobre o comportamento operacional do `mysql`.

* Edição de Linhas de Entrada
* Desativação do Histórico Interativo
* Suporte a Unicode no Windows
* Exibição dos Resultados das Consultas Verticais
* Uso do Modo de Atualizações Seguras (--safe-updates)")
* Desativação do Auto-Reconexão do MySQL
* Parser do Cliente do MySQL versus Parser do Servidor

##### Edição de Linhas de Entrada

O `mysql` suporta a edição de linhas de entrada, o que permite modificar a linha de entrada atual no local ou recuperar linhas de entrada anteriores. Por exemplo, as teclas **seta para a esquerda** e **seta para a direita** movem-se horizontalmente dentro da linha de entrada atual, e as teclas **seta para cima** e **seta para baixo** movem-se para cima e para baixo através do conjunto de linhas inseridas anteriormente. **Backspace** exclui o caractere antes do cursor e a digitação de novos caracteres os insere na posição do cursor. Para inserir a linha, pressione **Enter**.

No Windows, as sequências de teclas de edição são as mesmas que são suportadas para edição de comandos em janelas de console. No Unix, as sequências de teclas dependem da biblioteca de entrada usada para construir o `mysql` (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação para as bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de teclas permitidas por uma determinada biblioteca de entrada, defina as associações de teclas no arquivo de inicialização da biblioteca. Este é um arquivo no seu diretório de casa: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, em `libedit`, **Control+W** exclui tudo antes da posição atual do cursor e **Control+U** exclui toda a linha. Em `readline`, **Control+W** exclui a palavra antes do cursor e **Control+U** exclui tudo antes da posição atual do cursor. Se o `mysql` foi construído usando `libedit`, um usuário que prefere o comportamento do `readline` para essas duas teclas pode colocar as seguintes linhas no arquivo `.editrc` (criando o arquivo se necessário):

```
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de vinculações de teclas, coloque uma linha que diga apenas `bind` no final de `.editrc`. `mysql` exibe as vinculações quando ele começa.

##### Desativando o Histórico Interativo

A tecla `seta para cima` permite que você recupere linhas de entrada de sessões atuais e anteriores. Em casos em que um console é compartilhado, esse comportamento pode não ser adequado. `mysql` suporta a desativação parcial ou total do histórico interativo, dependendo da plataforma do host.

No Windows, o histórico é armazenado na memória. `Alt+F` exclui todas as linhas de entrada armazenadas na memória do buffer de histórico atual. Também exclui a lista de números sequenciais na frente das linhas de entrada exibidas com `F7` e recuperadas (por número) com `F9`. Novas linhas de entrada inseridas após você pressionar `Alt+F` repopulam o buffer de histórico atual. Limpar o buffer não impede o registro no Visualizador de Eventos do Windows, se a opção `--syslog` foi usada para iniciar `mysql`. Fechar a janela do console também limpa o buffer de histórico atual.

Para desativar o histórico interativo no Unix, primeiro exclua o arquivo `.mysql_history`, se ele existir (as entradas anteriores são recuperadas caso contrário). Em seguida, inicie `mysql` com a opção `--histignore="*"` para ignorar todas as novas linhas de entrada. Para reativar o comportamento de recuperação (e registro), reinicie `mysql` sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Controlando o arquivo de histórico) e usar `--histignore="*"` para iniciar o cliente `mysql`, a facilidade de recuperação do histórico interativo é desativada completamente. Alternativamente, se você omitir a opção `--histignore`, você pode recuperar as linhas de entrada inseridas durante a sessão atual.

##### Suporte a Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e escrita no console; o cliente `mysql` para Windows é capaz de usar essas APIs. O instalador do Windows cria um item no menu do MySQL chamado `Cliente de linha de comando MySQL - Unicode`. Esse item invoca o cliente `mysql` com propriedades configuradas para se comunicar através do console com o servidor MySQL usando Unicode.

Para aproveitar esse suporte manualmente, execute `mysql` dentro de uma janela de console que use uma fonte Unicode compatível e configure o conjunto de caracteres padrão para um conjunto de caracteres Unicode suportado para comunicação com o servidor:

1. Abra uma janela de console.
2. Vá para as propriedades da janela de console, selecione a aba fonte e escolha Lucida Console ou outra fonte Unicode compatível. Isso é necessário porque as janelas de console começam por padrão usando uma fonte raster DOS que é inadequada para Unicode.
3. Execute `mysql.exe` com a opção `--default-character-set=utf8mb4` (ou `utf8mb3`). Essa opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não podem ser usados como conjunto de caracteres do cliente. Veja Conjuntos de caracteres de cliente impermissíveis.

Com essas alterações, o `mysql` usa as APIs do Windows para se comunicar com o console usando UTF-16LE e se comunicar com o servidor usando UTF-8. (O item do menu mencionado anteriormente configura a fonte e o conjunto de caracteres como descrito anteriormente.)

Para evitar essas etapas cada vez que você executar `mysql`, você pode criar um atalho que invoca `mysql.exe`. O atalho deve configurar a fonte do console para Lucida Console ou outra fonte Unicode compatível e passar a opção `--default-character-set=utf8mb4` (ou `utf8mb3`) para `mysql.exe`.

Alternativamente, crie um atalho que configure apenas a fonte do console e configure o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```
[mysql]
default-character-set=utf8mb4   # or utf8mb3
```

##### Exibir resultados de consulta verticalmente

Alguns resultados de consultas são muito mais legíveis quando exibidos verticalmente, em vez do formato usual de tabela horizontal. As consultas podem ser exibidas verticalmente terminando a consulta com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem novas linhas geralmente são muito mais fáceis de ler com saída vertical:

```
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

##### Usando o Modo de Atualizações Seguras (`--safe-updates`)

Para iniciantes, uma opção de inicialização útil é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil para casos em que você pode ter emitido uma declaração `UPDATE` ou `DELETE` mas esquecido a cláusula `WHERE` indicando quais linhas modificar. Normalmente, tais declarações atualizam ou excluem todas as linhas da tabela. Com  `--safe-updates`, você pode modificar linhas apenas especificando os valores de chave que as identificam, ou uma cláusula `LIMIT`, ou ambas. Isso ajuda a prevenir acidentes. O modo de atualizações seguras também restringe declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes.

A opção `--safe-updates` faz com que o `mysql` execute a seguinte declaração ao se conectar ao servidor MySQL, para definir os valores de sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit` e `max_join_size`:

```
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A declaração `SET` afeta o processamento da declaração da seguinte forma:

* Habilitar `sql_safe_updates` faz com que as declarações `UPDATE` e `DELETE` produzam um erro se não especificar uma restrição de chave na cláusula `WHERE`, ou fornecer uma cláusula `LIMIT`, ou ambas. Por exemplo:

  ```
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```
* Definir `sql_select_limit` para 1.000 faz com que o servidor limite todos os conjuntos de resultados `SELECT` para 1.000 linhas, a menos que a declaração inclua uma cláusula `LIMIT`.
* Definir `max_join_size` para 1.000.000 faz com que declarações `SELECT` de múltiplas tabelas produzam um erro se o servidor estimar que deve examinar mais de 1.000.000 de combinações de linhas.

Para especificar limites de conjunto de resultados diferentes de 1.000 e 1.000.000, você pode substituir os valores padrão usando as opções `--select-limit` e `--max-join-size` ao invocar o `mysql`:

```
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as instruções `UPDATE` e `DELETE` produzam um erro no modo de atualizações seguras, mesmo com uma chave especificada na cláusula `WHERE`, se o otimizador decidir não usar o índice na coluna da chave:

* O acesso de intervalo no índice não pode ser usado se o uso de memória exceder o permitido pela variável de sistema `range_optimizer_max_mem_size`. O otimizador então recorre a uma varredura da tabela. Veja Limitar o uso de memória para otimização de intervalo.
* Se as comparações de chave requerem conversão de tipo, o índice pode não ser usado (veja Seção 10.3.1, “Como o MySQL usa índices”). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido para um número e os operandos são comparados numericamente (veja Seção 14.3, “Conversão de tipo na avaliação de expressões”), impedindo o uso do índice. Se o modo de atualizações seguras estiver habilitado, ocorre um erro.

Esses comportamentos estão incluídos no modo de atualizações seguras:

* As instruções `EXPLAIN` com `UPDATE` e `DELETE` não geram erros de atualizações seguras. Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um índice não é usado, o que pode ser útil em casos como quando ocorre uma violação do `range_optimizer_max_mem_size` ou conversão de tipo e o otimizador não usa um índice, mesmo que uma coluna chave tenha sido especificada na cláusula `WHERE`.
* Quando ocorre um erro de atualizações seguras, a mensagem de erro inclui o primeiro diagnóstico gerado, para fornecer informações sobre a razão do falha. Por exemplo, a mensagem pode indicar que o valor de `range_optimizer_max_mem_size` foi excedido ou ocorreu uma conversão de tipo, qualquer uma das quais pode impedir o uso de um índice.
* Para exclusiões e atualizações de múltiplas tabelas, um erro é gerado com atualizações seguras habilitadas apenas se qualquer tabela de destino usar uma varredura de tabela.

##### Desabilitando o Auto-Reconexão do `mysql`

Se o cliente `mysql` perder sua conexão com o servidor enquanto envia uma instrução, ele tenta imediatamente e automaticamente reconectar-se ao servidor e enviar a instrução novamente. No entanto, mesmo que o `mysql` tenha sucesso na reconexão, sua primeira conexão terminou e todos os objetos e configurações de sua sessão anterior são perdidos: tabelas temporárias, o modo de autocommit e variáveis definidas pelo usuário e de sessão. Além disso, qualquer transação atual é revertida. Esse comportamento pode ser perigoso para você, como no exemplo seguinte, onde o servidor foi desligado e reiniciado entre as primeiras e segundas instruções sem que você soubesse:

```
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

A variável de usuário `@a` foi perdida com a conexão, e após a reconexão, ela está indefinida. Se é importante que o `mysql` termine com um erro se a conexão tiver sido perdida, você pode iniciar o cliente `mysql` com a opção `--skip-reconnect`.

Para mais informações sobre o auto-reconexão e seu efeito nas informações de estado quando ocorre uma reconexão, consulte Controle de Reconexão Automática.

##### Parser do Cliente `mysql` versus Parser do Servidor
English (Brazil):

O cliente `mysql` usa um analisador no lado do cliente que não é um duplicado do analisador completo usado pelo servidor `mysqld` no lado do servidor. Isso pode levar a diferenças no tratamento de certas construções. Exemplos:

* O analisador do servidor trata strings delimitadas por caracteres `"` como identificadores, em vez de como strings simples, se o modo SQL `ANSI_QUOTES` estiver habilitado.

O analisador do cliente `mysql` não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata strings delimitadas por `"`, `'`, e  da mesma forma, independentemente de `ANSI_QUOTES` estar habilitado.
* Dentro dos comentários `/*! ... */` e `/*+ ... */`, o analisador do cliente `mysql` interpreta comandos `mysql` de forma abreviada. O analisador do servidor não os interpreta porque esses comandos não têm significado no lado do servidor.

Se for desejável que o `mysql` não interprete comandos abreviados dentro dos comentários, uma solução parcial é usar a opção `--binary-mode`, que desabilita todos os comandos `mysql`, exceto `\C` e `\d` no modo não interativo (para entrada pipeada para o `mysql` ou carregada usando o comando `source`).