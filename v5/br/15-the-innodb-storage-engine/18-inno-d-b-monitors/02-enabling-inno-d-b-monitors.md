### 14.18.2 Habilitar monitores InnoDB

Quando os monitores do `InnoDB` estão habilitados para saída periódica, o `InnoDB` escreve a saída na saída padrão de erro do servidor do **mysqld** (stderr) a cada 15 segundos, aproximadamente.

O `InnoDB` envia a saída do monitor para o `stderr` em vez de para o `stdout` ou buffers de memória de tamanho fixo para evitar possíveis transbordamentos de buffer.

Em Windows, o `stderr` é direcionado para o arquivo de log padrão, a menos que seja configurado de outra forma. Se você quiser direcionar a saída para a janela de console em vez do log de erro, inicie o servidor a partir de um prompt de comando em uma janela de console com a opção `--console`. Para mais informações, consulte a Seção 5.4.2.1, “Registro de Erros em Windows”.

Em sistemas Unix e similares, o `stderr` é direcionado normalmente para o terminal, a menos que seja configurado de outra forma. Para mais informações, consulte a Seção 5.4.2.2, “Registro de erros em sistemas Unix e similares”.

Os monitores do `InnoDB` só devem ser habilitados quando você realmente quiser ver as informações do monitor, pois a geração de saída causa uma certa redução de desempenho. Além disso, se a saída do monitor for direcionada ao log de erro, o log pode se tornar bastante grande se você esquecer de desabilitar o monitor mais tarde.

Nota

Para ajudar na solução de problemas, o `InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` sob certas condições. Para obter mais informações, consulte a Seção 14.22, “Solução de Problemas do \`InnoDB’”.

A saída do monitor `InnoDB` começa com um cabeçalho que contém um timestamp e o nome do monitor. Por exemplo:

```sql
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
```

O cabeçalho do monitor padrão `InnoDB` (`INNODB MONITOR OUTPUT`) também é usado para o monitor de bloqueio, pois este último produz a mesma saída com a adição de informações extras sobre os bloqueios.

As variáveis de sistema `innodb_status_output` e `innodb_status_output_locks` são usadas para habilitar o Monitor padrão do `InnoDB` e o Monitor de Bloqueio do `InnoDB`.

O privilégio `PROCESS` é necessário para habilitar ou desabilitar os monitores do `InnoDB`.

#### Habilitar o Monitor padrão InnoDB

Ative o monitor padrão do `InnoDB` configurando a variável de sistema `innodb_status_output` para `ON`.

```sql
SET GLOBAL innodb_status_output=ON;
```

Para desabilitar o monitor padrão do `InnoDB`, defina `innodb_status_output` para `OFF`.

Quando você desativa o servidor, a variável `innodb_status_output` é definida para o valor padrão `OFF`.

#### Habilitar o Monitor de Bloqueio do InnoDB

Os dados do Monitor de Bloqueio do `InnoDB` são impressos com a saída do Monitor Padrão do `InnoDB`. Tanto o Monitor Padrão do `InnoDB` quanto o Monitor de Bloqueio do `InnoDB` devem estar habilitados para que os dados do Monitor de Bloqueio do `InnoDB` sejam impressos periodicamente.

Para habilitar o Monitor de Bloqueio do `InnoDB`, defina a variável de sistema `innodb_status_output_locks` para `ON`. O Monitor Padrão do `InnoDB` e o Monitor de Bloqueio do `InnoDB` devem estar habilitados para que os dados do Monitor de Bloqueio do `InnoDB` sejam impressos periodicamente:

```sql
SET GLOBAL innodb_status_output=ON;
SET GLOBAL innodb_status_output_locks=ON;
```

Para desabilitar o Monitor de Bloqueio do `InnoDB`, defina `innodb_status_output_locks` para `OFF`. Defina `innodb_status_output` para `OFF` para desabilitar também o Monitor Padrão do `InnoDB`.

Quando você desativa o servidor, as variáveis `innodb_status_output` e `innodb_status_output_locks` são definidas para o valor padrão `OFF`.

Nota

Para habilitar o Monitor de Bloqueio do InnoDB para a saída do comando `SHOW ENGINE INNODB STATUS`, você só precisa habilitar `innodb_status_output_locks`.

#### Obter a saída padrão do Monitor InnoDB sob demanda

Como alternativa para habilitar o Monitor padrão `InnoDB` para saída periódica, você pode obter a saída padrão do Monitor `InnoDB` sob demanda usando a instrução SQL `SHOW ENGINE INNODB STATUS`, que recupera a saída para seu programa cliente. Se você estiver usando o cliente interativo **mysql**, a saída será mais legível se você substituir o caractere de terminação de sentença ponto-e-vírgula usual pelo `\G`:

```sql
mysql> SHOW ENGINE INNODB STATUS\G
```

A saída `SHOW ENGINE INNODB STATUS` também inclui os dados do Monitor de Bloqueio do InnoDB, se o Monitor de Bloqueio do InnoDB estiver habilitado.

#### Direcionando a saída do Monitor padrão InnoDB para um arquivo de status

A saída padrão do Monitor `InnoDB` pode ser habilitada e direcionada para um arquivo de status especificando a opção `--innodb-status-file` durante a inicialização. Quando essa opção é usada, o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída nele a cada 15 segundos, aproximadamente.

O `InnoDB` remove o arquivo de status quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode precisar ser removido manualmente.

A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.
