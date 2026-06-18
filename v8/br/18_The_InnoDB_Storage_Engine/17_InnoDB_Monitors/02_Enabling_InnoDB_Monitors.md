### 17.17.2 Habilitar monitores InnoDB

Quando os monitores `InnoDB` estão habilitados para saída periódica, o `InnoDB` escreve a saída no **mysqld** padrão de saída de erro do servidor (`stderr`) a cada 15 segundos, aproximadamente.

`InnoDB` envia a saída do monitor para `stderr` em vez de para `stdout` ou buffers de memória de tamanho fixo para evitar possíveis transbordamentos de buffer.

No Windows, `stderr` é direcionado para o arquivo de log padrão, a menos que seja configurado de outra forma. Se você quiser direcionar a saída para a janela de console em vez do log de erro, inicie o servidor a partir de um prompt de comando em uma janela de console com a opção `--console`. Para obter mais informações, consulte Destino padrão do log de erro no Windows.

Em sistemas Unix e similares, `stderr` é normalmente direcionado para o terminal, a menos que seja configurado de outra forma. Para obter mais informações, consulte Destino padrão do log de erro em sistemas Unix e similares.

Os monitores `InnoDB` só devem ser ativados quando você realmente quiser ver as informações do monitor, pois a geração de saída causa uma certa redução de desempenho. Além disso, se a saída do monitor for direcionada ao log de erros, o log pode se tornar bastante grande se você esquecer de desativá-lo mais tarde.

Nota

Para ajudar na solução de problemas, o `InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` sob certas condições. Para obter mais informações, consulte a Seção 17.21, “Solução de Problemas do InnoDB”.

A saída do monitor `InnoDB` começa com um cabeçalho que contém um timestamp e o nome do monitor. Por exemplo:

```
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
```

O cabeçalho do monitor padrão `InnoDB` (`INNODB MONITOR OUTPUT`) também é usado para o monitor de bloqueio, pois este último produz a mesma saída com a adição de informações extras sobre o bloqueio.

As variáveis de sistema `innodb_status_output` e `innodb_status_output_locks` são usadas para habilitar o Monitor padrão `InnoDB` e o Monitor de bloqueio `InnoDB`.

O privilégio `PROCESS` é necessário para habilitar ou desabilitar os monitores `InnoDB`.

#### Habilitar o Monitor padrão InnoDB

Ative o monitor padrão `InnoDB` definindo a variável de sistema `innodb_status_output` para `ON`.

```
SET GLOBAL innodb_status_output=ON;
```

Para desativar o monitor padrão `InnoDB`, defina `innodb_status_output` para `OFF`.

Quando você desativa o servidor, a variável `innodb_status_output` é definida com o valor padrão `OFF`.

#### Habilitar o Monitor de Bloqueio do InnoDB

Os dados do Monitor de Proteção são impressos com a saída do Monitor Padrão `InnoDB`. Tanto o Monitor Padrão `InnoDB` quanto o Monitor de Proteção `InnoDB` devem estar habilitados para que os dados do Monitor de Proteção `InnoDB` sejam impressos periodicamente.

Para habilitar o Monitor de Bloqueio `InnoDB`, defina a variável de sistema `innodb_status_output_locks` para `ON`. Ambos os monitores padrão `InnoDB` e Monitor de Bloqueio `InnoDB` devem ser habilitados para que os dados do Monitor de Bloqueio `InnoDB` sejam impressos periodicamente:

```
SET GLOBAL innodb_status_output=ON;
SET GLOBAL innodb_status_output_locks=ON;
```

Para desativar o Monitor de Bloqueio `InnoDB`, defina `innodb_status_output_locks` para `OFF`. Defina `innodb_status_output` para `OFF` para desativar também o Monitor Padrão `InnoDB`.

Quando você desativa o servidor, as variáveis `innodb_status_output` e `innodb_status_output_locks` são definidas com o valor padrão `OFF`.

Nota

Para habilitar o Monitor de Bloqueio `InnoDB` para a saída `SHOW ENGINE INNODB STATUS`, você só precisa habilitar `innodb_status_output_locks`.

#### Obter a saída padrão do Monitor InnoDB sob demanda

Como alternativa para habilitar o monitor padrão `InnoDB` para saída periódica, você pode obter a saída padrão do monitor `InnoDB` sob demanda usando a instrução SQL `SHOW ENGINE INNODB STATUS`, que recupera a saída para seu programa cliente. Se você estiver usando o cliente interativo **mysql**, a saída será mais legível se você substituir o caractere de terminação de sentença ponto e vírgula pelo `\G`:

```
mysql> SHOW ENGINE INNODB STATUS\G
```

A saída `SHOW ENGINE INNODB STATUS` também inclui os dados do Monitor de Bloqueio `InnoDB` se o Monitor de Bloqueio `InnoDB` estiver habilitado.

#### Direcionando a saída do Monitor padrão InnoDB para um arquivo de status

A saída do monitor padrão `InnoDB` pode ser habilitada e direcionada para um arquivo de status especificando a opção `--innodb-status-file` durante a inicialização. Quando essa opção é usada, o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída nele a cada 15 segundos, aproximadamente.

`InnoDB` remove o arquivo de status quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode precisar ser removido manualmente.

A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.
