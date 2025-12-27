### 17.18.2 Recuperação do InnoDB

Esta seção descreve a recuperação do `InnoDB`. Os tópicos incluem:

* Recuperação em Ponto no Tempo
* Recuperação após Corrupção de Dados ou Falha no Disco
* Recuperação de Quebra do InnoDB
* Descoberta de Espaço de Tabelas Durante a Recuperação de Quebra

#### Recuperação em Ponto no Tempo

Para recuperar um banco de dados `InnoDB` até o momento atual a partir do momento em que o backup físico foi feito, você deve executar o servidor MySQL com o registro binário habilitado, mesmo antes de fazer o backup. Para realizar a recuperação em ponto no tempo após restaurar um backup, você pode aplicar as alterações do log binário que ocorreram após o backup ser feito. Veja a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental)” (Recuperação").

#### Recuperação após Corrupção de Dados ou Falha no Disco

Se o seu banco de dados ficar corrompido ou ocorrer uma falha no disco, você deve realizar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup básico, realize uma recuperação em ponto no tempo a partir dos arquivos do log binário usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após o backup ser feito.

Em alguns casos de corrupção do banco de dados, é suficiente fazer uma dump, drop e recriar uma ou algumas tabelas corrompidas. Você pode usar a instrução `CHECK TABLE` para verificar se uma tabela está corrompida, embora a `CHECK TABLE` naturalmente não possa detectar todos os tipos possíveis de corrupção.

Em alguns casos, a aparente corrupção da página do banco de dados é, na verdade, devido ao sistema operacional corromper seu próprio cache de arquivos, e os dados no disco podem estar em ordem. É melhor tentar reiniciar o computador primeiro. Fazer isso pode eliminar erros que pareciam ser corrupção de página do banco de dados. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência do `InnoDB`, consulte a Seção 17.20.3, “Forçar a Recuperação do `InnoDB`” para etapas para iniciar a instância no modo de recuperação, o que permite que você faça o dump dos dados.

#### Recuperação de Quebra do `InnoDB`

Para recuperar de uma saída inesperada do servidor MySQL, o único requisito é reiniciar o servidor MySQL. O `InnoDB` verifica automaticamente os logs e realiza um avanço do banco de dados para o presente. O `InnoDB` desfaz automaticamente as transações não confirmadas que estavam presentes no momento da quebra.

A recuperação de quebra do `InnoDB` consiste em várias etapas:

* Descoberta do espaço de tabelas

  A descoberta do espaço de tabelas é o processo que o `InnoDB` usa para identificar espaços de tabelas que requerem a aplicação do log de redo. Veja Descoberta de Espaço de Tabelas Durante a Recuperação de Quebra.

* Aplicação do log de redo

  A aplicação do log de redo é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem descarregadas do pool de buffers para os espaços de tabelas (`ibdata*` e arquivos `.ibd`) no momento do desligamento ou quebra, a aplicação do log de redo é ignorada. O `InnoDB` também ignora a aplicação do log de redo se os arquivos de log de redo estiverem ausentes no início.

  + O valor atual do contador de incremento automático é escrito no log de redo cada vez que o valor muda, o que o torna seguro em caso de falha. Durante a recuperação, o `InnoDB` examina o log de redo para coletar as mudanças no valor do contador e aplica as mudanças ao objeto de tabela em memória.

Para obter mais informações sobre como o `InnoDB` lida com os valores de autoincremento, consulte a Seção 17.6.1.6, “Manipulação de AUTO\_INCREMENT no InnoDB” e Inicialização do Contador de AUTO\_INCREMENT do InnoDB.

  + Ao encontrar corrupção na árvore de índices, o `InnoDB` escreve um sinalizador de corrupção no log de refazer, o que torna o sinalizador de corrupção resistente a falhas. O `InnoDB` também escreve dados do sinalizador de corrupção na memória em uma tabela do sistema privada do motor em cada ponto de verificação. Durante a recuperação, o `InnoDB` lê os sinais de corrupção de ambos os locais e mescla os resultados antes de marcar os objetos de tabela e índice na memória como corruptos.

  + Remover logs de refazer para acelerar a recuperação não é recomendado, mesmo que alguma perda de dados seja aceitável. A remoção de logs de refazer deve ser considerada apenas após um desligamento limpo, com `innodb_fast_shutdown` definido como `0` ou `1`.

* Reverter transações incompletas

  Transações incompletas são quaisquer transações que estavam ativas no momento da saída inesperada ou do desligamento rápido. O tempo necessário para reverter uma transação incompleta pode ser três ou quatro vezes o tempo que uma transação está ativa antes de ser interrompida, dependendo da carga do servidor.

  Você não pode cancelar transações que estão sendo revertidas. Em casos extremos, quando a expectativa é que a reversão de transações leve um tempo excepcionalmente longo, pode ser mais rápido começar o `InnoDB` com um ajuste de `innodb_force_recovery` de `3` ou maior. Consulte a Seção 17.20.3, “Forçar a Recuperação do InnoDB”.

* Mudança de fusão de buffers

  Aplicar alterações do buffer de alterações (parte do espaço de tabela do sistema) às páginas de folha de índices secundários, à medida que as páginas de índice são lidas para o pool de buffers.

* Limpeza

  Excluir registros marcados para exclusão que não são mais visíveis para transações ativas.

Os passos que seguem a aplicação do log de retificação não dependem do log de retificação (exceto para registrar as escritas) e são realizados em paralelo com o processamento normal. Desses, apenas o rollback de transações incompletas é específico para a recuperação de falhas. A fusão do buffer de inserção e a purga são realizadas durante o processamento normal.

Após a aplicação do log de retificação, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o tempo de inatividade. Como parte da recuperação de falhas, o `InnoDB` desfaz transações que não foram confirmadas ou no estado `XA PREPARE` quando o servidor saiu. O rollback é realizado por um thread de segundo plano, executado em paralelo com as transações de novas conexões. Até que a operação de rollback seja concluída, novas conexões podem encontrar conflitos de bloqueio com transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido interrompido inesperadamente no meio de uma atividade intensa, o processo de recuperação acontece automaticamente e nenhuma ação é necessária do DBA. Se uma falha de hardware ou um erro grave no sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Nesse caso, consulte a Seção 17.20.3, “Forçando a Recuperação do `InnoDB’”.

Para informações sobre o log binário e a recuperação de falhas do `InnoDB`, consulte a Seção 7.4.4, “O Log Binário”.

#### Descoberta de Espaço de Tabela Durante a Recuperação de Falhas

Se, durante a recuperação, o `InnoDB` encontrar logs de retificação escritos desde o último ponto de verificação, os logs de retificação devem ser aplicados aos espaços de tabela afetados. O processo que identifica os espaços de tabela afetados durante a recuperação é referido como *descoberta de espaço de tabela*.

A descoberta de tablespace depende da configuração `innodb_directories`, que define os diretórios a serem verificados ao iniciar para encontrar arquivos de tablespace. A configuração padrão de `innodb_directories` é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o InnoDB constrói uma lista de diretórios a serem verificados ao iniciar. Esses diretórios são anexados, independentemente de uma configuração `innodb_directories` ser especificada explicitamente. Arquivos de tablespace definidos com um caminho absoluto ou que residem fora dos diretórios anexados ao conjunto `innodb_directories` devem ser adicionados ao conjunto `innodb_directories`. A recuperação é encerrada se algum arquivo de tablespace referenciado em um log de redo não tiver sido descoberto anteriormente.