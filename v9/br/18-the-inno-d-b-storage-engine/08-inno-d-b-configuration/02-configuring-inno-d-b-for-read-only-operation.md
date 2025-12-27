### 17.8.2 Configurando o InnoDB para Operação Apenas de Leitura

Você pode consultar tabelas `InnoDB` onde o diretório de dados do MySQL está em mídia de leitura apenas, habilitando a opção de configuração `--innodb-read-only` no início do servidor.

#### Como Habilitar

Para preparar uma instância para operação de leitura apenas, certifique-se de que todas as informações necessárias sejam descarregadas nos arquivos de dados antes de serem armazenadas na mídia de leitura apenas. Execute o servidor com o bufferamento de alterações desativado (`innodb_change_buffering=0`) e faça um desligamento lento.

Para habilitar o modo de leitura apenas para uma instância completa do MySQL, especifique as seguintes opções de configuração no início do servidor:

* `--innodb-read-only=1`
* Se a instância estiver em mídia de leitura apenas, como um DVD ou CD, ou se o diretório `/var` não for gravável por todos: `--pid-file=caminho_em_media_gravável` e `--event-scheduler=disabled`

* `--innodb-temp-data-file-path`. Esta opção especifica o caminho, o nome do arquivo e o tamanho do arquivo para os arquivos de dados do espaço de tabelas temporárias `InnoDB`. O ajuste padrão é `ibtmp1:12M:autoextend`, que cria o arquivo de dados do espaço de tabelas temporárias `ibtmp1` no diretório de dados. Para preparar uma instância para operação de leitura apenas, defina `innodb_temp_data_file_path` para um local fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

Habilitar `innodb_read_only` impede a criação e a operação de remoção de tabelas para todos os motores de armazenamento. Essas operações modificam as tabelas do dicionário de dados na base de dados do sistema `mysql`, mas essas tabelas usam o motor de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está habilitado. A mesma restrição se aplica a qualquer operação que modifique as tabelas do dicionário de dados, como `ANALYZE TABLE` e `ALTER TABLE tbl_name ENGINE=engine_name`.

Além disso, outras tabelas no banco de dados do sistema `mysql` usam o mecanismo de armazenamento `InnoDB` no MySQL 9.5. Tornar essas tabelas apenas de leitura resulta em restrições sobre operações que as modifiquem. Por exemplo, as operações `CREATE USER`, `GRANT`, `REVOKE` e `INSTALL PLUGIN` não são permitidas no modo de leitura.

#### Cenários de Uso

Este modo de operação é apropriado em situações como:

* Distribuir um aplicativo MySQL ou um conjunto de dados MySQL em um meio de armazenamento apenas de leitura, como um DVD ou CD.

* Múltiplas instâncias MySQL fazendo consultas ao mesmo diretório de dados simultaneamente, tipicamente em uma configuração de data warehousing. Você pode usar essa técnica para evitar gargalos que podem ocorrer com uma instância MySQL muito carregada, ou você pode usar diferentes opções de configuração para as várias instâncias para sintonizar cada uma para tipos específicos de consultas.

* Consultar dados que foram colocados em um estado de leitura apenas por razões de segurança ou integridade de dados, como dados de backup arquivados.

Nota

Esta funcionalidade é principalmente destinada à flexibilidade na distribuição e implantação, em vez de desempenho bruto baseado no aspecto de leitura apenas. Veja a Seção 10.5.3, “Otimizando Transações de Leitura Apenas de InnoDB” para maneiras de sintonizar o desempenho de consultas de leitura apenas, que não requerem tornar o servidor inteiro apenas de leitura.

#### Como Funciona

Quando o servidor é executado no modo de leitura através da opção `--innodb-read-only`, certos recursos e componentes do `InnoDB` são reduzidos ou desativados completamente:

* Não é realizada nenhuma bufferização de alterações, em particular, nenhuma fusão do buffer de alterações. Para garantir que o buffer de alterações esteja vazio quando você preparar a instância para operação de leitura apenas, desabilite a bufferização de alterações (`innodb_change_buffering=0`) e faça um desligamento lento primeiro.

* Não há uma fase de recuperação em caso de falha ao iniciar. A instância deve ter realizado um desligamento lento antes de ser colocada no estado de leitura somente.

* A maioria das threads de fundo está desativada. As threads de leitura de E/S permanecem ativas, assim como as threads de escrita de E/S e uma thread de coordenador de varredura de páginas para gravações em arquivos temporários, que são permitidas no modo de leitura somente. Uma thread de redimensionamento do pool de buffers também permanece ativa para permitir o redimensionamento online do pool de buffers.

* Informações sobre bloqueios, saída do monitor, etc., não são escritas em arquivos temporários. Como consequência, o `SHOW ENGINE INNODB STATUS` não produz qualquer saída.

* Alterações nas configurações de opções que normalmente alterariam o comportamento das operações de escrita não têm efeito quando o servidor está no modo de leitura somente.

* O processamento do MVCC para impor os níveis de isolamento está desativado. Todas as consultas leem a versão mais recente de um registro, porque atualizações e exclusões não são possíveis.

* O log de anulação não é usado. Desative todas as configurações para a opção de configuração `innodb_undo_directory`.