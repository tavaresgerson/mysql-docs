### 17.8.2 Configurando o InnoDB para operação de leitura somente

Você pode consultar as tabelas `InnoDB` onde o diretório de dados MySQL está em mídia de leitura somente, habilitando a opção de configuração `--innodb-read-only` na inicialização do servidor.

#### Como ativar

Para preparar uma instância para operação apenas de leitura, certifique-se de que todas as informações necessárias foram descarregadas dos arquivos de dados antes de serem armazenadas no meio de leitura apenas. Execute o servidor com o buffer de alterações desativado (`innodb_change_buffering=0`) e faça um desligamento lento.

Para habilitar o modo de leitura somente para uma instância inteira do MySQL, especifique as seguintes opções de configuração na inicialização do servidor:

- `--innodb-read-only=1`

- Se a instância estiver em mídia de leitura somente, como um DVD ou CD, ou se o diretório `/var` não for gravável por todos: `--pid-file=path_on_writeable_media` e `--event-scheduler=disabled`

- `--innodb-temp-data-file-path`. Esta opção especifica o caminho, o nome do arquivo e o tamanho do arquivo para os arquivos de dados do espaço de tabelas temporário `InnoDB`. O ajuste padrão é `ibtmp1:12M:autoextend`, que cria o arquivo de dados do espaço de tabelas temporário `ibtmp1` no diretório de dados. Para preparar uma instância para operação apenas de leitura, defina `innodb_temp_data_file_path` para uma localização fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

  ```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

A partir do MySQL 8.0, a ativação de `innodb_read_only` impede a criação e a remoção de operações de tabelas para todos os motores de armazenamento. Essas operações modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas usam o motor de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está ativado. A mesma restrição se aplica a qualquer operação que modifique as tabelas do dicionário de dados, como `ANALYZE TABLE` e `ALTER TABLE tbl_name ENGINE=engine_name`.

Além disso, outras tabelas no banco de dados do sistema `mysql` usam o mecanismo de armazenamento `InnoDB` no MySQL 8.0. Tornar essas tabelas apenas de leitura resulta em restrições sobre as operações que as modificam. Por exemplo, as operações `CREATE USER`, `GRANT`, `REVOKE` e `INSTALL PLUGIN` não são permitidas no modo de leitura apenas.

#### Cenários de uso

Esse modo de operação é apropriado em situações como:

- Distribuir um aplicativo MySQL ou um conjunto de dados MySQL em um meio de armazenamento apenas de leitura, como um DVD ou CD.

- Múltiplas instâncias do MySQL interrogando o mesmo diretório de dados simultaneamente, geralmente em uma configuração de data warehousing. Você pode usar essa técnica para evitar gargalos que podem ocorrer com uma instância do MySQL muito carregada, ou você pode usar diferentes opções de configuração para as várias instâncias para ajustar cada uma para tipos específicos de consultas.

- Fazer consultas em dados que foram colocados em estado de leitura somente por razões de segurança ou integridade de dados, como dados de backup arquivados.

Nota

Este recurso é destinado principalmente à flexibilidade na distribuição e implantação, e não ao desempenho bruto baseado no aspecto de leitura somente. Consulte a Seção 10.5.3, “Otimizando Transações de Leitura Somente do InnoDB”, para obter maneiras de ajustar o desempenho de consultas de leitura somente, que não exigem tornar o servidor como um todo de leitura somente.

#### Como Funciona

Quando o servidor é executado no modo de leitura apenas através da opção `--innodb-read-only`, certas funcionalidades e componentes `InnoDB` são reduzidos ou desativados completamente:

- Não é realizada nenhuma bufferização de alterações, em particular, nenhuma fusão do buffer de alterações. Para garantir que o buffer de alterações esteja vazio quando você preparar a instância para operação de leitura somente, desative a bufferização de alterações (`innodb_change_buffering=0`) e faça um desligamento lento primeiro.

- Não há uma fase de recuperação após o crash na inicialização. A instância deve ter sido desligada lentamente antes de ser colocada no estado de leitura somente.

- Como o log de revisão não é usado em operações de leitura somente, você pode definir `innodb_log_file_size` para o tamanho menor possível (1 MB) antes de tornar a instância de leitura somente.

- A maioria das threads de plano de fundo está desativada. As threads de leitura de E/S permanecem, assim como as threads de escrita de E/S e uma thread de coordenador de esvaziamento de páginas para escritas em arquivos temporários, que são permitidas no modo de leitura apenas. Uma thread de redimensionamento do pool de buffers também permanece ativa para permitir o redimensionamento online do pool de buffers.

- As informações sobre bloqueios, saída do monitor, e assim por diante, não são escritas em arquivos temporários. Como consequência, o `SHOW ENGINE INNODB STATUS` não produz nenhuma saída.

- Alterações nas configurações das opções de configuração que normalmente alterariam o comportamento das operações de escrita não terão efeito quando o servidor estiver no modo de leitura somente.

- O processamento do MVCC para impor níveis de isolamento está desativado. Todas as consultas leem a versão mais recente de um registro, porque as atualizações e exclusões não são possíveis.

- O registro de desfazer não é usado. Desative todas as configurações das opções de configuração `innodb_undo_tablespaces` e `innodb_undo_directory`.
