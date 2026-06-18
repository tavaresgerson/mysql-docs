### 17.18.2 Recuperação do InnoDB

Esta seção descreve a recuperação de `InnoDB`. Os tópicos incluem:

- Recuperação no Ponto de Tempo
- Recuperação de corrupção de dados ou falha no disco
- Recuperação de falha do InnoDB
- Descoberta de Tablespace durante a recuperação de falhas

#### Recuperação no Ponto de Tempo

Para recuperar um banco de dados `InnoDB` até o momento atual a partir do momento em que o backup físico foi feito, você deve executar o servidor MySQL com o registro binário habilitado, mesmo antes de fazer o backup. Para realizar a recuperação em um ponto específico após restaurar um backup, você pode aplicar as alterações do log binário que ocorreram após o backup ter sido feito. Consulte a Seção 9.5, “Recuperação em Ponto Específico (Incremental)”).

#### Recuperação de corrupção de dados ou falha no disco

Se o seu banco de dados ficar corrompido ou ocorrer uma falha no disco, você deve realizar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup básico, realize uma recuperação em um ponto no tempo a partir dos arquivos de log binário usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após a criação do backup.

Em alguns casos de corrupção de banco de dados, é suficiente fazer o dump, drop e recriar uma ou algumas tabelas corrompidas. Você pode usar a instrução `CHECK TABLE` para verificar se uma tabela está corrompida, embora `CHECK TABLE` naturalmente não possa detectar todos os tipos possíveis de corrupção.

Em alguns casos, a aparente corrupção da página do banco de dados é, na verdade, devido ao sistema operacional corromper seu próprio cache de arquivos, e os dados no disco podem estar em ordem. É melhor tentar reiniciar o computador primeiro. Isso pode eliminar erros que pareciam ser corrupção de página do banco de dados. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência `InnoDB`, consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”, para obter etapas para iniciar a instância no modo de recuperação, o que permite que você faça o dump dos dados.

#### Recuperação de falha do InnoDB

Para recuperar de uma saída inesperada do servidor MySQL, a única exigência é reiniciar o servidor MySQL. `InnoDB` verifica automaticamente os logs e realiza um avanço no banco de dados até o momento atual. `InnoDB` desfaz automaticamente as transações não confirmadas que estavam presentes no momento do crash.

A recuperação de falhas do `InnoDB` consiste em várias etapas:

- Descoberta do espaço de tabela

  A descoberta do tablespace é o processo que o `InnoDB` usa para identificar os tablespaces que precisam da aplicação do log de redo. Veja Descoberta de Tablespace durante a Recuperação após o Quebra.

- Aplicação de registro de refaça

  A aplicação do log de refazer é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem descarregadas do pool de buffer para os espaços de tabelas (os arquivos `ibdata*` e `*.ibd`) no momento do desligamento ou do crash, a aplicação do log de refazer é ignorada. O `InnoDB` também ignora a aplicação do log de refazer se os arquivos do log de refazer estiverem ausentes no momento do início.

  - O valor atual do contador de autoincremento máximo é escrito no log de refazer cada vez que o valor muda, o que o torna seguro em caso de falha. Durante a recuperação, o `InnoDB` examina o log de refazer para coletar as mudanças no valor do contador e aplica as mudanças ao objeto da tabela em memória.

    Para obter mais informações sobre como o `InnoDB` lida com valores de autoincremento, consulte a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT no InnoDB” e o Inicialização do Contador de AUTO\_INCREMENT do InnoDB.

  - Quando ocorre a corrupção da árvore de índices, o `InnoDB` escreve uma bandeira de corrupção no log de refazer, o que torna a bandeira de corrupção resistente a falhas. O `InnoDB` também escreve dados da bandeira de corrupção na memória em uma tabela do sistema privada do motor em cada ponto de verificação. Durante a recuperação, o `InnoDB` lê as bandeiras de corrupção dos dois locais e combina os resultados antes de marcar as tabelas e objetos de índice na memória como corrompidos.

  - Não é recomendado remover os registros de rollback para acelerar a recuperação, mesmo que alguma perda de dados seja aceitável. A remoção dos registros de rollback deve ser considerada apenas após um desligamento limpo, com `innodb_fast_shutdown` definido como `0` ou `1`.

- Reverter transações incompletas

  As transações incompletas são aquelas que estavam ativas no momento da saída inesperada ou do desligamento rápido. O tempo necessário para reverter uma transação incompleta pode ser três ou quatro vezes o tempo que a transação está ativa antes de ser interrompida, dependendo da carga do servidor.

  Você não pode cancelar transações que estão sendo revertidas. Em casos extremos, quando a reversão de transações estiver prevista para levar um tempo excepcionalmente longo, pode ser mais rápido começar a `InnoDB` com um `innodb_force_recovery` de `3` ou superior. Veja a Seção 17.21.3, “Forçando a Recuperação do InnoDB”.

- Mudar a fusão do buffer

  Aplicar alterações do buffer de alterações (parte do espaço de tabela do sistema) às páginas de folha de índices secundários, à medida que as páginas do índice são lidas para o pool de buffer.

- Limpeza

  Excluir registros marcados para exclusão que não são mais visíveis para transações ativas.

Os passos que se seguem à aplicação do log de reversão não dependem do log de reversão (exceto para registrar as escritas) e são realizados em paralelo com o processamento normal. Desses, apenas o rollback de transações incompletas é específico para a recuperação de falhas. A fusão do buffer de inserção e a purga são realizadas durante o processamento normal.

Após a aplicação do log de refazer, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o tempo de inatividade. Como parte da recuperação de falhas, o `InnoDB` desfaz transações que não foram confirmadas ou estavam no estado `XA PREPARE` quando o servidor saiu. O desfazimento é realizado por um thread de segundo plano, executado em paralelo com as transações de novas conexões. Até que a operação de desfazimento seja concluída, novas conexões podem encontrar conflitos de bloqueio com as transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido interrompido inesperadamente durante uma atividade intensa, o processo de recuperação acontece automaticamente e não é necessário que o DBA tome nenhuma ação. Se uma falha de hardware ou um erro grave no sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Nesse caso, consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”.

Para obter informações sobre o log binário e a recuperação de falhas `InnoDB`, consulte a Seção 7.4.4, “O Log Binário”.

#### Descoberta de Tablespace durante a recuperação de falhas

Se, durante a recuperação, o `InnoDB` encontrar registros de reverso escritos desde o último ponto de verificação, esses registros de reverso devem ser aplicados aos espaços de tabelas afetados. O processo que identifica os espaços de tabelas afetados durante a recuperação é chamado de *descoberta de espaço de tabela*.

A descoberta de tablespace depende da configuração `innodb_directories`, que define os diretórios a serem verificados ao iniciar para encontrar arquivos de tablespace. A configuração padrão `innodb_directories` é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o InnoDB constrói uma lista de diretórios a serem verificados ao iniciar. Esses diretórios são anexados independentemente de uma configuração `innodb_directories` ser especificada explicitamente. Arquivos de tablespace definidos com um caminho absoluto ou que residem fora dos diretórios anexados à configuração `innodb_directories` devem ser adicionados à configuração `innodb_directories`. A recuperação é encerrada se algum arquivo de tablespace referenciado em um log de redo não tiver sido descoberto anteriormente.
