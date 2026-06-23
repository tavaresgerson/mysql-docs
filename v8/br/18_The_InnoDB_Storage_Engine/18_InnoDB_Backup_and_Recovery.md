## 17.18 Backup e recuperação do InnoDB

Esta seção abrange tópicos relacionados ao backup e recuperação do `InnoDB`.

* Para informações sobre técnicas de backup aplicáveis a `InnoDB`, consulte a Seção 17.18.1, “Backup do InnoDB”.

* Para informações sobre recuperação em ponto no tempo, recuperação a partir de falhas ou corrupção de disco e como o `InnoDB` realiza a recuperação em caso de falha, consulte a Seção 17.18.2, “Recuperação InnoDB”.

### 17.18.1 Backup do InnoDB

A chave para a gestão segura de bancos de dados é fazer backups regulares. Dependendo do volume de dados, do número de servidores MySQL e da carga de trabalho do banco de dados, você pode usar essas técnicas de backup, sozinhas ou em combinação: backup quente com *MySQL Enterprise Backup*; backup frio copiando arquivos enquanto o servidor MySQL está desligado; backup lógico com **mysqldump** para volumes de dados menores ou para registrar a estrutura dos objetos do esquema. Os backups quentes e frios são backups físicos que copiam arquivos de dados reais, que podem ser usados diretamente pelo servidor **mysqld** para uma restauração mais rápida.

Usar o *MySQL Enterprise Backup* é o método recomendado para fazer backup dos dados do `InnoDB`.

Nota

`InnoDB` não suporta bancos de dados que são restaurados usando ferramentas de backup de terceiros.

#### Copias de segurança quentes

O comando **mysqlbackup**, parte do componente MySQL Enterprise Backup, permite fazer backup de uma instância de MySQL em execução, incluindo as tabelas `InnoDB`, com mínima interrupção das operações e produção de um instantâneo consistente do banco de dados. Quando o **mysqlbackup** está copiando as tabelas `InnoDB`, as leituras e escritas nas tabelas `InnoDB` podem continuar. O MySQL Enterprise Backup também pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas e bancos de dados. Em conjunto com o log binário do MySQL, os usuários podem realizar recuperação em um ponto no tempo. O MySQL Enterprise Backup faz parte da assinatura do MySQL Enterprise. Para mais detalhes, consulte a Seção 32.1, “Visão geral do MySQL Enterprise Backup”.

#### Cópias de segurança frias

Se você puder desligar o servidor MySQL, pode fazer um backup físico que consiste em todos os arquivos usados pelo `InnoDB` para gerenciar suas tabelas. Use o procedimento a seguir:

1. Realize um [desligamento lento][(glossary.html#glos_slow_shutdown "slow shutdown")] do servidor MySQL e certifique-se de que ele pare sem erros.

2. Copie todos os arquivos de dados `InnoDB` (arquivos `ibdata` e arquivos `.ibd`) em um local seguro.

3. Copie todos os arquivos de registro de refazer `InnoDB` (arquivos `#ib_redoN` no MySQL 8.0.30 e versões posteriores ou arquivos `ib_logfile` em versões anteriores) para um local seguro.

4. Copie seu arquivo de configuração `my.cnf` para um local seguro.

#### Resumos lógicos usando mysqldump

Além dos backups físicos, é recomendável que você crie regularmente backups lógicos, descarregando suas tabelas usando o **mysqldump**. Um arquivo binário pode ser corrompido sem que você perceba. As tabelas descarregadas são armazenadas em arquivos de texto que são legíveis para humanos, então é mais fácil identificar a corrupção da tabela. Além disso, como o formato é mais simples, a chance de corrupção de dados grave é menor. O **mysqldump** também tem uma opção `--single-transaction` para fazer um instantâneo consistente sem bloquear outros clientes. Veja a Seção 9.3.1, “Estabelecendo uma Política de Backup”.

A replicação funciona com as tabelas `InnoDB`, então você pode usar as capacidades de replicação do MySQL para manter uma cópia do seu banco de dados em locais de banco de dados que exigem alta disponibilidade. Veja a Seção 17.19, “InnoDB e replicação do MySQL”.

### 17.18.2 Recuperação do InnoDB

Esta seção descreve a recuperação de `InnoDB`. Os tópicos incluem:

* Recuperação em Ponto no Tempo
* Recuperação de dados corrompidos ou falha no disco
* Recuperação de falha do InnoDB
* Descoberta de tablespace durante a recuperação de falha

#### Recuperação em Ponto de Tempo

Para recuperar um banco de dados `InnoDB` até o momento em que o backup físico foi feito, você deve executar o servidor MySQL com registro binário habilitado, mesmo antes de fazer o backup. Para realizar a recuperação em um ponto específico após a restauração de um backup, você pode aplicar as alterações do registro binário que ocorreram após o backup ter sido feito. Veja a Seção 9.5, “Recuperação em Ponto de Tempo (Incremental)” (Recuperação).

#### Recuperação de corrupção de dados ou falha no disco

Se o seu banco de dados ficar corrompido ou ocorrer falha no disco, você deve realizar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup básico, realize uma recuperação em um ponto no tempo a partir dos arquivos de registro binário usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após a criação do backup.

Em alguns casos de corrupção de banco de dados, é suficiente descartar, eliminar e recriar uma ou algumas tabelas corruptas. Você pode usar a declaração `CHECK TABLE` para verificar se uma tabela está corrupta, embora `CHECK TABLE` (check-table.html "15.7.3.2 CHECK TABLE Statement") naturalmente não possa detectar todo o tipo possível de corrupção.

Em alguns casos, a aparente corrupção da página do banco de dados é, na verdade, devido ao sistema operacional corromper seu próprio cache de arquivos, e os dados no disco podem estar em ordem. É melhor tentar reiniciar o computador primeiro. Isso pode eliminar erros que pareciam ser corrupção de página do banco de dados. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência `InnoDB`, consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”, para obter os passos para iniciar a instância no modo de recuperação, o que lhe permite drenar os dados.

#### Recuperação de falha do InnoDB

Para se recuperar de uma saída inesperada do servidor MySQL, a única exigência é reiniciar o servidor MySQL. `InnoDB` verifica automaticamente os registros e realiza um avanço do banco de dados para o presente. `InnoDB` desfaz automaticamente as transações não comprometidas que estavam presentes no momento do acidente.

A recuperação de emergência `InnoDB` consiste em vários passos:

* Descoberta de tablespace

A descoberta de tablespace é o processo que o `InnoDB` utiliza para identificar os tablespace que requerem a aplicação do log de refazer. Veja Descoberta de tablespace durante a recuperação após o crash.

* Aplicação de registro refeito

A aplicação do log de refazer é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem descarregadas do buffer pool para os espaços de tabelas (os arquivos `ibdata*` e `*.ibd`) no momento do desligamento ou do crash, a aplicação do log de refazer é ignorada. `InnoDB` também ignora a aplicação do log de refazer se os arquivos de log de refazer estiverem ausentes no início.

+ O valor atual do contador de autoincremento máximo é escrito no log de refazer a cada vez que o valor muda, o que o torna seguro em caso de falha. Durante a recuperação, `InnoDB` examina o log de refazer para coletar as mudanças no valor do contador e aplica as mudanças ao objeto da tabela de memória.

Para mais informações sobre como o `InnoDB` lida com valores de autoincremento, consulte a Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB” e Inicialização do Contador de AUTO_INCREMENT do InnoDB.

+ Ao encontrar corrupção na árvore de índice, `InnoDB` escreve uma bandeira de corrupção no log de refazer, o que torna a bandeira de corrupção resistente a falhas. `InnoDB` também escreve dados de bandeira de corrupção em memória em uma tabela de sistema privada do motor em cada ponto de verificação. Durante a recuperação, `InnoDB` lê as bandeiras de corrupção em ambos os locais e combina os resultados antes de marcar as tabelas em memória e os objetos de índice como corruptos.

+ Remover logs de refazer para acelerar a recuperação não é recomendado, mesmo que alguma perda de dados seja aceitável. A remoção de logs de refazer só deve ser considerada após um desligamento limpo, com `innodb_fast_shutdown` definido como `0` ou `1`.

* Reversão de transações incompletas

As transações incompletas são aquelas que estavam ativas no momento da saída inesperada ou do desligamento rápido. O tempo necessário para reverter uma transação incompleta pode ser três ou quatro vezes o tempo que a transação permanece ativa antes de ser interrompida, dependendo da carga do servidor.

Você não pode cancelar transações que estão sendo revertidas. Em casos extremos, quando se espera que a reversão de transações leve um tempo excepcionalmente longo, pode ser mais rápido começar a `InnoDB` com um `innodb_force_recovery` de configuração de `3` ou superior. Veja a Seção 17.21.3, “Forçando a recuperação do InnoDB”.

* Fusão de buffer de alteração

Aplicar alterações do buffer de alterações (parte do [espaço de tabela do sistema][(glossary.html#glos_system_tablespace "system tablespace")]) às páginas de folha de índices secundários, à medida que as páginas do índice são lidas para o pool de buffer.

* Limpeza

Excluir registros marcados para exclusão que não são mais visíveis para transações ativas.

Os passos que se seguem à aplicação do log de refazer não dependem do log de refazer (exceto para registrar as escritas) e são realizados em paralelo com o processamento normal. Desses, apenas o rollback de transações incompletas é específico para a recuperação de falhas. A fusão do buffer de inserção e a purga são realizadas durante o processamento normal.

Após a aplicação do log de refazer, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o tempo de inatividade. Como parte da recuperação em caso de falha, o `InnoDB` desfaz as transações que não foram comprometidas ou estavam no estado do `XA PREPARE` quando o servidor saiu. O desfazimento é realizado por um thread de fundo, executado em paralelo com as transações de novas conexões. Até que a operação de desfazimento seja concluída, novas conexões podem encontrar conflitos de bloqueio com as transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido interrompido inesperadamente durante uma atividade intensa, o processo de recuperação acontece automaticamente e não é necessário que o DBA tome nenhuma ação. Se uma falha de hardware ou um erro grave no sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Nesse caso, consulte a Seção 17.21.3, “Forçando a recuperação do InnoDB”.

Para informações sobre o registro binário e a recuperação de falhas de `InnoDB`, consulte a Seção 7.4.4, “O Registro Binário”.

#### Descoberta de Tablespace durante a recuperação de falha

Se, durante a recuperação, `InnoDB` encontrar registros de refazer escritos desde o último ponto de verificação, os registros de refazer devem ser aplicados aos espaços de tabela afetados. O processo que identifica os espaços de tabela afetados durante a recuperação é denominado *descoberta de espaço de tabela*.

A descoberta de tablespace depende da configuração `innodb_directories`, que define os diretórios a serem verificados no início para arquivos de tablespace. A configuração padrão de `innodb_directories` é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o InnoDB constrói uma lista de diretórios a serem verificados no início. Esses diretórios são anexados independentemente de uma configuração `innodb_directories` ser especificamente definida. Arquivos de tablespace definidos com um caminho absoluto ou que residem fora dos diretórios anexados à configuração `innodb_directories` devem ser adicionados à configuração `innodb_directories`. A recuperação é terminada se qualquer arquivo de tablespace referenciado em um log de redo não tiver sido descoberto anteriormente.