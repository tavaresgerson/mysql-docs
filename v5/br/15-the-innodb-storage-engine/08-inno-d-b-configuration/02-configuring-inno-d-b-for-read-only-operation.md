### 14.8.2 Configurando o InnoDB para Operação Read-Only

Você pode executar Query em tabelas `InnoDB` onde o diretório de dados do MySQL está em mídia read-only (somente leitura), habilitando a opção de configuração `--innodb-read-only` na inicialização do server.

#### Como Habilitar

Para preparar uma instância para operação read-only, certifique-se de que todas as informações necessárias sejam descarregadas (flushed) para os arquivos de dados antes de armazená-la na mídia read-only. Execute o server com o change buffering desabilitado (`innodb_change_buffering=0`) e realize um slow shutdown (desligamento lento).

Para habilitar o modo read-only para uma instância MySQL inteira, especifique as seguintes opções de configuração na inicialização do server:

* `--innodb-read-only=1`
* Se a instância estiver em mídia read-only, como um DVD ou CD, ou se o diretório `/var` não for gravável (writeable) por todos: `--pid-file=path_on_writeable_media` e `--event-scheduler=disabled`

* `--innodb-temp-data-file-path`. Esta opção especifica o path, o nome do arquivo e o tamanho do arquivo para os arquivos de dados do temporary tablespace do `InnoDB`. A configuração padrão é `ibtmp1:12M:autoextend`, que cria o arquivo de dados do temporary tablespace `ibtmp1` no data directory. Para preparar uma instância para operação read-only, defina `innodb_temp_data_file_path` para um local fora do data directory. O path deve ser relativo ao data directory. Por exemplo:

  ```sql
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

#### Cenários de Uso

Este modo de operação é apropriado em situações como:

* Distribuir uma aplicação MySQL, ou um conjunto de dados MySQL, em uma mídia de armazenamento read-only, como um DVD ou CD.

* Múltiplas instâncias MySQL executando Query no mesmo data directory simultaneamente, tipicamente em uma configuração de data warehousing. Você pode usar essa técnica para evitar bottlenecks que podem ocorrer com uma instância MySQL altamente carregada, ou pode usar diferentes opções de configuração para as várias instâncias, a fim de ajustar (tune) cada uma para tipos específicos de Query.

* Executar Query em dados que foram colocados em um estado read-only por motivos de segurança ou integridade de dados, como dados de backup arquivados.

Nota

Este recurso destina-se principalmente à flexibilidade na distribuição e no deployment (implementação), em vez de performance bruta baseada no aspecto read-only. Consulte a Seção 8.5.3, “Otimizando Transações Read-Only do InnoDB”, para maneiras de ajustar (tune) a performance de Query read-only, o que não exige que o server inteiro seja read-only.

#### Como Funciona

Quando o server é executado no modo read-only através da opção `--innodb-read-only`, certos recursos e componentes do `InnoDB` são reduzidos ou desativados completamente:

* Não é realizado change buffering, em particular, não há merges do change buffer. Para garantir que o change buffer esteja vazio ao preparar a instância para operação read-only, desabilite o change buffering (`innodb_change_buffering=0`) e execute um slow shutdown primeiro.

* Não há fase de crash recovery na inicialização. A instância deve ter executado um slow shutdown antes de ser colocada no estado read-only.

* Como o Redo Log não é usado na operação read-only, você pode definir `innodb_log_file_size` para o menor tamanho possível (1 MB) antes de tornar a instância read-only.

* A maioria dos background Threads são desativados. I/O read Threads permanecem, bem como I/O write Threads e um page cleaner Thread para escritas em arquivos temporários, que são permitidas no modo read-only.

* Informações sobre Deadlocks, saída do monitor, e assim por diante, não são escritas em arquivos temporários. Consequentemente, `SHOW ENGINE INNODB STATUS` não produz nenhuma saída.

* Se o MySQL server for iniciado com `--innodb-read-only`, mas o data directory ainda estiver em mídia gravável (writeable), o usuário root ainda pode realizar operações DCL como `GRANT` e `REVOKE`.

* Alterações nas configurações das opções que normalmente mudariam o comportamento das operações de escrita não têm efeito quando o server está no modo read-only.

* O processamento MVCC para impor os níveis de isolation é desativado. Todas as Query leem a versão mais recente de um registro, pois update e delete não são possíveis.

* O Undo Log não é usado. Desative quaisquer configurações para as opções `innodb_undo_tablespaces` e `innodb_undo_directory`.