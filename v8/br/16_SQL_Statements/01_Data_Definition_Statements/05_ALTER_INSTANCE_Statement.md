### 15.1.5 Declaração ALTER INSTANCE

```
ALTER INSTANCE instance_action

instance_action: {
  | {ENABLE|DISABLE} INNODB REDO_LOG
  | ROTATE INNODB MASTER KEY
  | ROTATE BINLOG MASTER KEY
  | RELOAD TLS
      [FOR CHANNEL {mysql_main | mysql_admin}]
      [NO ROLLBACK ON ERROR]
  | RELOAD KEYRING
}
```

`ALTER INSTANCE` define ações aplicáveis a uma instância do servidor MySQL. A instrução suporta essas ações:

- `ALTER INSTANCE {ENABLE | DISABLE} INNODB REDO_LOG`

  Essa ação habilita ou desabilita o registro de refazer `InnoDB`. O registro de refazer é ativado por padrão. Esse recurso é destinado apenas para carregar dados em uma nova instância do MySQL. A declaração não é escrita no log binário. Essa ação foi introduzida no MySQL 8.0.21.

  Aviso

  *Não desative o registro de refazer em um sistema de produção.* Embora seja permitido desligar e reiniciar o servidor enquanto o registro de refazer estiver desativado, uma parada inesperada do servidor enquanto o registro de refazer estiver desativado pode causar perda de dados e corrupção da instância.

  Uma operação `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG` requer um bloqueio de backup exclusivo, que impede que outras operações `ALTER INSTANCE` sejam executadas simultaneamente. Outras operações `ALTER INSTANCE` devem esperar que o bloqueio seja liberado antes de executar.

  Para obter mais informações, consulte Desativar o registro de refazer.

- `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  Essa ação rotação da chave de criptografia mestre usada para a criptografia do espaço de tabelas `InnoDB` requer o privilégio `ENCRYPTION_KEY_ADMIN` ou `SUPER`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte a Seção 8.4.4, “O Keyring do MySQL”.

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta operações DML concorrentes. No entanto, não pode ser executado de forma concorrente com as operações `CREATE TABLE ... ENCRYPTION` ou `ALTER TABLE ... ENCRYPTION` e são tomadas as bloqueadas para evitar conflitos que possam surgir da execução concorrente dessas instruções. Se uma das instruções conflitantes estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

  As declarações `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para que possam ser executadas em servidores replicados.

  Para obter informações adicionais sobre o uso do `ALTER INSTANCE ROTATE INNODB MASTER KEY` (código de segurança), consulte a Seção 17.13, “Criptografia de dados armazenados no InnoDB”.

- `ALTER INSTANCE ROTATE BINLOG MASTER KEY`

  Essa ação rotação da chave mestre do log binário usada para criptografia do log binário. A rotação da chave mestre do log binário requer o privilégio `BINLOG_ENCRYPTION_ADMIN` ou `SUPER`. A declaração não pode ser usada se a variável de sistema `binlog_encryption` estiver definida como `OFF`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte a Seção 8.4.4, “O Keyring do MySQL”.

  As ações `ALTER INSTANCE ROTATE BINLOG MASTER KEY` não são escritas no log binário e não são executadas nas réplicas. A rotação da chave mestre do log binário pode, portanto, ser realizada em ambientes de replicação que incluem uma mistura de versões do MySQL. Para agendar a rotação regular da chave mestre do log binário em todos os servidores de origem e réplicas aplicáveis, você pode habilitar o Cronômetro de Eventos do MySQL em cada servidor e emitir a declaração `ALTER INSTANCE ROTATE BINLOG MASTER KEY` usando uma declaração `CREATE EVENT`. Se você rotular a chave mestre do log binário porque suspeita que a chave mestre atual ou qualquer uma das chaves anteriores do log binário possam ter sido comprometidas, emita a declaração em todos os servidores de origem e réplicas aplicáveis, o que permite verificar a conformidade imediata.

  Para obter informações adicionais sobre o uso do `ALTER INSTANCE ROTATE BINLOG MASTER KEY`, incluindo o que fazer se o processo não for concluído corretamente ou for interrompido por uma interrupção inesperada do servidor, consulte a Seção 19.3.2, “Criptografar arquivos de registro binários e arquivos de registro de retransmissão”.

- `ALTER INSTANCE RELOAD TLS`

  Essa ação reconsfigura um contexto TLS a partir dos valores atuais das variáveis do sistema que definem o contexto. Também atualiza as variáveis de status que refletem os valores ativos do contexto. Essa ação requer o privilégio `CONNECTION_ADMIN`. Para obter informações adicionais sobre a recarga do contexto TLS, incluindo quais variáveis do sistema e de status estão relacionadas ao contexto, consulte Configuração e monitoramento do tempo de execução no lado do servidor para conexões criptografadas.

  Por padrão, a instrução recarrega o contexto TLS para a interface de conexão principal. Se a cláusula `FOR CHANNEL` (disponível a partir do MySQL 8.0.21) for fornecida, a instrução recarrega o contexto TLS para o canal nomeado: `mysql_main` para a interface de conexão principal, `mysql_admin` para a interface de conexão administrativa. Para obter informações sobre as diferentes interfaces, consulte a Seção 7.1.12.1, “Interfaces de Conexão”. As propriedades do contexto TLS atualizadas são exibidas na tabela do Schema de Desempenho `tls_channel_status`. Consulte a Seção 29.12.21.9, “A tabela tls\_channel\_status”.

  Atualizar o contexto TLS para a interface principal também pode afetar a interface administrativa, pois, a menos que algum valor TLS não padrão seja configurado para essa interface, ela usará o mesmo contexto TLS que a interface principal.

  Nota

  Quando você recarrega o contexto TLS, o OpenSSL recarrega o arquivo que contém a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é reduzida imediatamente após uma grande alocação ser liberada, então, se você emitir a instrução `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

  Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores do contexto anterior continuam sendo usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for fornecida e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desativada para novas conexões na interface à qual a declaração se aplica.

  As declarações `ALTER INSTANCE RELOAD TLS` não são escritas no log binário (e, portanto, não são replicadas). A configuração do TLS é local e depende de arquivos locais que nem sempre estão presentes em todos os servidores envolvidos.

- `ALTER INSTANCE RELOAD KEYRING`

  Se um componente de chave de segurança estiver instalado, essa ação informa ao componente para reler seu arquivo de configuração e reinicializar quaisquer dados de chave de segurança em memória. Se você modificar a configuração do componente em tempo de execução, a nova configuração só entrará em vigor quando você executar essa ação. A recarga da chave de segurança requer o privilégio `ENCRYPTION_KEY_ADMIN`. Essa ação foi adicionada no MySQL 8.0.24.

  Essa ação permite a recarga do componente de chave de segurança instalado atualmente. Ela não permite alterar qual componente está instalado. Por exemplo, se você alterar a configuração do componente de chave de segurança instalado, `ALTER INSTANCE RELOAD KEYRING` faz com que a nova configuração entre em vigor. Por outro lado, se você alterar o componente de chave de segurança nomeado no arquivo de manifesto do servidor, `ALTER INSTANCE RELOAD KEYRING` não tem efeito e o componente atual permanece instalado.

  As declarações `ALTER INSTANCE RELOAD KEYRING` não são escritas no log binário (e, portanto, não são replicadas).
