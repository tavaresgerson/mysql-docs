### 17.17.2 Habilitando Monitores do InnoDB

Quando os monitores do `InnoDB` são habilitados para saída periódica, o `InnoDB` escreve a saída no **sinal de erro padrão do servidor mysqld** (`stderr`) a cada 15 segundos, aproximadamente.

O `InnoDB` envia a saída do monitor para o `stderr` em vez de para buffers de memória de tamanho fixo para evitar possíveis transbordamentos de buffer.

No Windows, o `stderr` é direcionado para o arquivo de log padrão, a menos que seja configurado de outra forma. Se você quiser direcionar a saída para a janela de console em vez do log de erro, inicie o servidor a partir de um prompt de comando em uma janela de console com a opção `--console`. Para mais informações, consulte Destino Padrão do Log de Erro no Windows.

Nos sistemas Unix e Unix-like, o `stderr` é tipicamente direcionado para o terminal, a menos que seja configurado de outra forma. Para mais informações, consulte Destino Padrão do Log de Erro em Sistemas Unix e Unix-Like.

Os monitores do `InnoDB` devem ser habilitados apenas quando você realmente deseja ver as informações do monitor, pois a geração de saída causa um pequeno decréscimo de desempenho. Além disso, se a saída do monitor for direcionada para o log de erro, o log pode se tornar bastante grande se você esquecer de desabilitar o monitor mais tarde.

Observação

Para ajudar na solução de problemas, o `InnoDB` habilita temporariamente a saída padrão do Monitor do `InnoDB` sob certas condições. Para mais informações, consulte Seção 17.20, “Solução de Problemas do InnoDB”.

A saída do monitor do `InnoDB` começa com um cabeçalho contendo um timestamp e o nome do monitor. Por exemplo:

```
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
```

O cabeçalho para o Monitor Padrão do `InnoDB` (`INNODB MONITOR OUTPUT`) também é usado para o Monitor de Bloqueio porque este último produz a mesma saída com a adição de informações de bloqueio extras.

As variáveis de sistema `innodb_status_output` e `innodb_status_output_locks` são usadas para habilitar o Monitor padrão `InnoDB` e o Monitor de Bloqueio `InnoDB`.

O privilégio `PROCESS` é necessário para habilitar ou desabilitar os Monitores `InnoDB`.

#### Habilitando o Monitor Padrão `InnoDB`

Habilite o Monitor padrão `InnoDB` definindo a variável de sistema `innodb_status_output` para `ON`.

```
SET GLOBAL innodb_status_output=ON;
```

Para desabilitar o Monitor padrão `InnoDB`, defina `innodb_status_output` para `OFF`. Quando você interrompe o servidor, a variável `innodb_status_output` é definida para o valor padrão `OFF`.

#### Habilitando o Monitor de Bloqueio `InnoDB`

Os dados do Monitor de Bloqueio `InnoDB` são impressos com a saída do Monitor Padrão `InnoDB`. Ambos os Monitores `InnoDB` padrão e o Monitor de Bloqueio `InnoDB` devem estar habilitados para que os dados do Monitor de Bloqueio `InnoDB` sejam impressos periodicamente.

Para habilitar o Monitor de Bloqueio `InnoDB`, defina a variável de sistema `innodb_status_output_locks` para `ON`. Ambos os Monitores padrão `InnoDB` e o Monitor de Bloqueio `InnoDB` devem estar habilitados para que os dados do Monitor de Bloqueio `InnoDB` sejam impressos periodicamente:

```
SET GLOBAL innodb_status_output=ON;
SET GLOBAL innodb_status_output_locks=ON;
```

Para desabilitar o Monitor de Bloqueio `InnoDB`, defina `innodb_status_output_locks` para `OFF`. Defina `innodb_status_output` para `OFF` para desabilitar também o Monitor Padrão `InnoDB`.

Quando você interrompe o servidor, as variáveis `innodb_status_output` e `innodb_status_output_locks` são definidas para o valor padrão `OFF`.

Observação

Para habilitar o Monitor de Bloqueio `InnoDB` para a saída `SHOW ENGINE INNODB STATUS`, você só precisa habilitar `innodb_status_output_locks`.

Como alternativa para habilitar o Monitor padrão `InnoDB` para saída periódica, você pode obter a saída padrão do Monitor `InnoDB` sob demanda usando a instrução SQL `SHOW ENGINE INNODB STATUS`, que recupera a saída para seu programa cliente. Se você estiver usando o cliente interativo **mysql**, a saída será mais legível se você substituir o usual delimitador de sentença ponto-e-vírgula com `\G`:

```
mysql> SHOW ENGINE INNODB STATUS\G
```

A saída de `SHOW ENGINE INNODB STATUS` também inclui os dados do Monitor de Bloqueio `InnoDB` se o Monitor de Bloqueio `InnoDB` estiver habilitado.

#### Direcionando a Saída Padrão do Monitor `InnoDB` para um Arquivo de Status

A saída padrão do Monitor `InnoDB` pode ser habilitada e direcionada para um arquivo de status especificando a opção `--innodb-status-file` na inicialização. Quando essa opção é usada, o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída nele a cada 15 segundos, aproximadamente.

O `InnoDB` remove o arquivo de status quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode ter que ser removido manualmente.

A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.