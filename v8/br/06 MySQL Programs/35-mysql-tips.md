#### 6.5.1.6 Conselhos do cliente do mysql

Esta secção fornece informações sobre técnicas para um uso mais eficaz do `mysql` e sobre o comportamento operacional do `mysql`.

- Edição de Linha de Entrada
- Desativar Histórico Interativo
- Suporte Unicode no Windows
- Mostrar os resultados da consulta verticalmente
- Utilizando o modo de actualizações seguras (--safe-updates)
- Desativar a reconexão automática do mysql
- Parser do cliente versus o parser do servidor

##### Edição de Linha de Entrada

`mysql` suporta edição de linha de entrada, o que permite modificar a linha de entrada atual no lugar ou recordar linhas de entrada anteriores. Por exemplo, as teclas de seta esquerda e direita movem-se horizontalmente dentro da linha de entrada atual, e as teclas de seta para cima e para baixo movem-se para cima e para baixo através do conjunto de linhas previamente inseridas. **Backspace** exclui o caractere antes do cursor e digita novos caracteres que os inserem na posição do cursor. Para entrar na linha, pressione **Enter**.

No Windows, as sequências de teclas de edição são as mesmas que são suportadas para edição de comandos em janelas de console. No Unix, as sequências de teclas dependem da biblioteca de entrada usada para construir `mysql` (por exemplo, a biblioteca `libedit` ou `readline`).

A documentação para as bibliotecas `libedit` e `readline` está disponível online. Para alterar o conjunto de sequências de chaves permitidas por uma determinada biblioteca de entrada, defina as ligações de chaves no arquivo de inicialização da biblioteca. Este é um arquivo no seu diretório inicial: `.editrc` para `libedit` e `.inputrc` para `readline`.

Por exemplo, em `libedit`, **Control+W** exclui tudo antes da posição atual do cursor e **Control+U** exclui a linha inteira. Em `readline`, **Control+W** exclui a palavra antes do cursor e **Control+U** exclui tudo antes da posição atual do cursor. Se `mysql` foi construído usando `libedit`, um usuário que prefere o comportamento `readline` para essas duas teclas pode colocar as seguintes linhas no arquivo `.editrc` (criando o arquivo, se necessário):

```
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

Para ver o conjunto atual de ligações de chaves, coloque temporariamente uma linha que diz apenas `bind` no final de `.editrc`. `mysql` mostra as ligações quando ele começa.

##### Desativar Histórico Interativo

A tecla **up-arrow** permite-lhe recordar linhas de entrada das sessões atuais e anteriores. Nos casos em que um console é compartilhado, este comportamento pode ser inadequado. `mysql` suporta a desativação do histórico interativo parcial ou totalmente, dependendo da plataforma host.

No Windows, o histórico é armazenado na memória. **Alt+F7** exclui todas as linhas de entrada armazenadas na memória para o buffer de histórico atual. Também exclui a lista de números seqüenciais na frente das linhas de entrada exibidas com **F7** e lembradas (por número) com **F9**. Novas linhas de entrada inseridas depois de pressionar **Alt+F7** repovoam o buffer de histórico atual. A limpeza do buffer não impede o registro no Windows Event Viewer, se a opção `--syslog` foi usada para iniciar `mysql`. Fechar a janela do console também limpa o buffer de histórico atual.

Para desativar o histórico interativo no Unix, primeiro exclua o arquivo `.mysql_history`, se existir (as entradas anteriores são recordadas de outra forma). Em seguida, inicie `mysql` com a opção `--histignore="*"` para ignorar todas as novas linhas de entrada. Para reativar o comportamento de recordação (e registro), reinicie `mysql` sem a opção.

Se você impedir que o arquivo `.mysql_history` seja criado (veja Controle do arquivo de histórico) e usar `--histignore="*"` para iniciar o cliente `mysql`, a facilidade de recuperação de histórico interativo será desativada completamente. Alternativamente, se você omitir a opção `--histignore`, você pode recuperar as linhas de entrada inseridas durante a sessão atual.

##### Suporte Unicode no Windows

O Windows fornece APIs baseadas em UTF-16LE para leitura e gravação para o console; o cliente `mysql` para o Windows é capaz de usar essas APIs. O instalador do Windows cria um item no menu MySQL chamado `MySQL command line client - Unicode`.

Para aproveitar esse suporte manualmente, execute `mysql` em um console que use uma fonte Unicode compatível e defina o conjunto de caracteres padrão para um conjunto de caracteres Unicode suportado para comunicação com o servidor:

1. Abre uma janela do console.
2. Vá para as propriedades da janela do console, selecione a guia fonte e escolha Lucida Console ou alguma outra fonte Unicode compatível. Isso é necessário porque as janelas do console começam por padrão usando uma fonte raster DOS que é inadequada para Unicode.
3. Execute **mysql.exe** com a `--default-character-set=utf8mb4` (ou `utf8mb3`) opção. Esta opção é necessária porque `utf16le` é um dos conjuntos de caracteres que não podem ser usados como o conjunto de caracteres do cliente. Veja conjuntos de caracteres do cliente inadmissíveis.

Com essas mudanças, `mysql` usa as APIs do Windows para se comunicar com o console usando UTF-16LE, e se comunicar com o servidor usando UTF-8. (O item de menu mencionado anteriormente define a fonte e o conjunto de caracteres como acabamos de descrever.)

Para evitar essas etapas cada vez que você executar `mysql`, você pode criar um atalho que invoca **mysql.exe**. O atalho deve definir a fonte do console para Lucida Console ou alguma outra fonte Unicode compatível, e passar a opção `--default-character-set=utf8mb4` (ou `utf8mb3`) para **mysql.exe**.

Alternativamente, crie um atalho que apenas defina a fonte do console e defina o conjunto de caracteres no grupo `[mysql]` do seu arquivo `my.ini`:

```
[mysql]
default-character-set=utf8mb4   # or utf8mb3
```

##### Mostrar os resultados da consulta verticalmente

Alguns resultados de consulta são muito mais legíveis quando exibidos verticalmente, em vez do formato de tabela horizontal usual. As consultas podem ser exibidas verticalmente terminando a consulta com \G em vez de um ponto e vírgula. Por exemplo, valores de texto mais longos que incluem novas linhas geralmente são muito mais fáceis de ler com saída vertical:

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

##### Utilizando o modo de actualizações seguras (--safe-updates)

Para iniciantes, uma opção de inicialização útil é `--safe-updates` (ou `--i-am-a-dummy`, que tem o mesmo efeito). O modo de atualizações seguras é útil para casos em que você pode ter emitido uma instrução `UPDATE` ou `DELETE` mas esqueceu a cláusula `WHERE` indicando quais linhas para modificar. Normalmente, tais instruções atualizam ou excluem todas as linhas da tabela. Com `--safe-updates`, você pode modificar linhas apenas especificando os valores-chave que os identificam, ou uma cláusula `LIMIT`, ou ambos. Isso ajuda a evitar acidentes. O modo de atualizações seguras também restringe os conjuntos de instruções `SELECT` que produzem (ou são estimados para produzir) resultados muito grandes.

A opção `--safe-updates` faz com que `mysql` execute a seguinte instrução quando se conecta ao servidor MySQL, para definir os valores de sessão das variáveis de sistema `sql_safe_updates`, `sql_select_limit`, e `max_join_size`:

```
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

A instrução `SET` afeta o processamento de instruções da seguinte forma:

- A habilitação de `sql_safe_updates` faz com que as instruções `UPDATE` e `DELETE` produzam um erro se não especificarem uma restrição de chave na cláusula `WHERE`, ou fornecerem uma cláusula `LIMIT`, ou ambas. Por exemplo:

  ```
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```
- A definição de `sql_select_limit` para 1.000 faz com que o servidor limite todos os conjuntos de resultados de `SELECT` para 1.000 linhas, a menos que a instrução inclua uma cláusula de `LIMIT`.
- Definir `max_join_size` para 1.000.000 faz com que as instruções de `SELECT` de tabelas múltiplas produzam um erro se o servidor estima que deve examinar mais de 1.000.000 de combinações de linhas.

Para especificar limites de conjunto de resultados diferentes de 1.000 e 1.000.000, você pode substituir os padrões usando as opções `--select-limit` e `--max-join-size` quando você invoca `mysql`:

```
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

É possível que as instruções `UPDATE` e `DELETE` produzam um erro no modo de atualizações seguras, mesmo com uma chave especificada na cláusula `WHERE`, se o otimizador decidir não usar o índice na coluna de chave:

- O acesso ao intervalo no índice não pode ser usado se o uso de memória exceder o permitido pela variável do sistema `range_optimizer_max_mem_size`.
- Se as comparações de chaves exigirem conversão de tipo, o índice não pode ser usado (ver Seção 10.3.1, "Como o MySQL usa índices"). Suponha que uma coluna de string indexada `c1` seja comparada a um valor numérico usando `WHERE c1 = 2222`. Para tais comparações, o valor da string é convertido em um número e os operandos são comparados numericamente (ver Seção 14.3, "Conversão de tipo na avaliação de expressões"), impedindo o uso do índice. Se o modo de atualizações seguras estiver ativado, ocorre um erro.

Estes comportamentos estão incluídos no modo de atualizações seguras:

- Isso permite o uso de `EXPLAIN` mais `SHOW WARNINGS` para ver por que um índice não é usado, o que pode ser útil em casos como quando ocorre uma violação de `range_optimizer_max_mem_size` ou conversão de tipo e o otimizador não usa um índice, mesmo que uma coluna chave tenha sido especificada na cláusula `WHERE`.
- Quando ocorre um erro de atualizações seguras, a mensagem de erro inclui o primeiro diagnóstico que foi produzido, para fornecer informações sobre o motivo da falha. Por exemplo, a mensagem pode indicar que o valor `range_optimizer_max_mem_size` foi excedido ou ocorreu uma conversão de tipo, qualquer um dos quais pode impedir o uso de um índice.
- Para eliminações e atualizações de várias tabelas, um erro é produzido com atualizações seguras ativadas apenas se qualquer tabela de destino usar uma varredura de tabela.

##### Desativar a reconexão automática do mysql

Se o cliente `mysql` perder a conexão com o servidor ao enviar uma instrução, ele imediata e automaticamente tenta se reconectar uma vez ao servidor e enviar a instrução novamente. No entanto, mesmo que `mysql` consiga se reconectar, sua primeira conexão terminou e todos os objetos e configurações de sessão anteriores são perdidos: tabelas temporárias, o modo de autocommit e variáveis de sessão e definidas pelo usuário. Além disso, qualquer transação atual é revertida. Esse comportamento pode ser perigoso para você, como no exemplo a seguir, onde o servidor foi desligado e reiniciado entre a primeira e a segunda instruções sem que você soubesse:

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

A variável de usuário `@a` foi perdida com a conexão, e após a reconexão é indefinida. Se é importante ter `mysql` terminar com um erro se a conexão foi perdida, você pode iniciar o `mysql` cliente com a opção `--skip-reconnect`.

Para mais informações sobre a reconexão automática e seu efeito sobre as informações de estado quando ocorre uma reconexão, consulte Controle de reconexão automática.

##### Parser do cliente versus o parser do servidor

O cliente `mysql` usa um analisador no lado do cliente que não é uma cópia do analisador completo usado pelo servidor `mysqld` no lado do servidor. Isso pode levar a diferenças no tratamento de certas construções.

- O analisador do servidor trata strings delimitadas por `"` caracteres como identificadores ao invés de strings simples se o `ANSI_QUOTES` modo SQL estiver habilitado.

  O analisador do cliente `mysql` não leva em conta o modo SQL `ANSI_QUOTES`. Ele trata as cadeias de caracteres delimitadas pelos caracteres `"`, `'`, e `` ` `` da mesma forma, independentemente de `ANSI_QUOTES` estar habilitado.
- Dentro dos comentários `/*! ... */` e `/*+ ... */`, o analisador do cliente `mysql` interpreta os comandos `mysql` de forma curta. O analisador do servidor não os interpreta porque esses comandos não têm significado no lado do servidor.

  Se for desejável que `mysql` não interprete comandos de formulário curto dentro de comentários, uma solução parcial é usar a opção `--binary-mode`, que faz com que todos os comandos `mysql` sejam desativados, exceto `\C` e `\d` em modo não interativo (para entrada canalizada para `mysql` ou carregada usando o comando `source`).
