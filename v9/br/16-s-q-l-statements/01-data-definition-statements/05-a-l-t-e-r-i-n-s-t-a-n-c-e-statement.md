### 15.1.5 Declaração `ALTER INSTANCE`

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

`ALTER INSTANCE` define ações aplicáveis a uma instância de servidor MySQL. A declaração suporta essas ações:

* `ALTER INSTANCE {ENABLE | DISABLE} INNODB REDO_LOG`

  Essa ação habilita ou desabilita o registro de redo de `InnoDB`. O registro de redo é habilitado por padrão. Esse recurso é destinado apenas para carregar dados em uma nova instância MySQL. A declaração não é escrita no log binário.

  Aviso

  *Não desabilite o registro de redo em um sistema de produção.* Embora seja permitido desligar e reiniciar o servidor enquanto o registro de redo está desativado, uma parada inesperada do servidor enquanto o registro de redo está desativado pode causar perda de dados e corrupção da instância.

  Uma operação `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG` requer um bloqueio de backup exclusivo, que impede que outras operações `ALTER INSTANCE` sejam executadas simultaneamente. Outras operações `ALTER INSTANCE` devem esperar pelo bloqueio ser liberado antes de executar.

  Para mais informações, consulte Desabilitar o Registro de Redo.

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  Essa ação rotação da chave de criptografia mestre usada para a criptografia do espaço de tabelas `InnoDB. A rotação da chave requer o privilégio `ENCRYPTION_KEY_ADMIN` ou `SUPER`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para instruções, consulte Seção 8.4.5, “A Chave MySQL”.

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta DML concorrente. No entanto, não pode ser executado concorrentemente com operações `CREATE TABLE ... ENCRYPTION` ou `ALTER TABLE ... ENCRYPTION`, e são tomadas blocações para prevenir conflitos que possam surgir da execução concorrente dessas declarações. Se uma das declarações conflitantes estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

As instruções `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para que possam ser executadas em servidores replicados.

Para informações adicionais sobre o uso da instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY`, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* `ALTER INSTANCE ROTATE BINLOG MASTER KEY`

  Essa ação rotação da chave mestre do log binário usada para a criptografia do log binário. A rotação da chave mestre do log binário requer o privilégio `BINLOG_ENCRYPTION_ADMIN` ou `SUPER`. A instrução não pode ser usada se a variável de sistema `binlog_encryption` estiver definida como `OFF`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para instruções, consulte a Seção 8.4.5, “O Keyring do MySQL”.

  As ações `ALTER INSTANCE ROTATE BINLOG MASTER KEY` não são escritas no log binário e não são executadas em réplicas. A rotação da chave mestre do log binário pode, portanto, ser realizada em ambientes de replicação, incluindo uma mistura de versões do MySQL. Para agendar a rotação regular da chave mestre do log binário em todos os servidores de origem e réplicas aplicáveis, você pode habilitar o Cronômetro de Eventos do MySQL em cada servidor e emitir a instrução `ALTER INSTANCE ROTATE BINLOG MASTER KEY` usando uma instrução `CREATE EVENT`. Se você rotear a chave mestre do log binário porque suspeita que a chave mestre do log binário atual ou alguma das chaves anteriores possam ter sido comprometidas, emita a instrução em todos os servidores de origem e réplicas aplicáveis, o que permite verificar a conformidade imediata.

  Para informações adicionais sobre o uso da instrução `ALTER INSTANCE ROTATE BINLOG MASTER KEY`, incluindo o que fazer se o processo não for concluído corretamente ou for interrompido por uma parada inesperada do servidor, consulte a Seção 19.3.2, “Criptografar Arquivos de Log Binário e Arquivos de Log Relay”.

* `ALTER INSTANCE RELOAD TLS`

Essa ação reconsfigura um contexto TLS a partir dos valores atuais das variáveis do sistema que definem o contexto. Ela também atualiza as variáveis de status que refletem os valores ativos do contexto. Essa ação requer o privilégio `CONNECTION_ADMIN`. Para obter informações adicionais sobre a recarga do contexto TLS, incluindo quais variáveis do sistema e de status estão relacionadas ao contexto, consulte Configuração e monitoramento do tempo de execução no lado do servidor para conexões criptografadas.

Por padrão, a instrução recarga o contexto TLS para a interface de conexão principal. Se a cláusula `FOR CHANNEL` for fornecida, a instrução recarga o contexto TLS para o canal nomeado: `mysql_main` para a interface de conexão principal, `mysql_admin` para a interface de conexão administrativa. Para informações sobre as diferentes interfaces, consulte a Seção 7.1.12.1, “Interfaces de conexão”. As propriedades do contexto TLS atualizadas são exibidas na tabela do Schema de desempenho `tls_channel_status`. Consulte a Seção 29.12.22.11, “A tabela tls\_channel\_status”.

Atualizar o contexto TLS para a interface principal também pode afetar a interface administrativa, pois, a menos que algum valor TLS não padrão seja configurado para essa interface, ela usa o mesmo contexto TLS que a interface principal.

Nota

Quando você recarrega o contexto TLS, o OpenSSL recarrega o arquivo que contém a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é reduzida imediatamente após uma grande alocação ser liberada, então se você emitir a declaração `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores dos contextos anteriores continuam sendo usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for dada e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desabilitada para novas conexões na interface à qual a declaração se aplica.

As declarações `ALTER INSTANCE RELOAD TLS` não são escritas no log binário (e, portanto, não são replicadas). A configuração TLS é local e depende de arquivos locais que não estão necessariamente presentes em todos os servidores envolvidos.

* `ALTER INSTANCE RELOAD KEYRING`

  Se um componente de chaveira for instalado, essa ação informa ao componente para reler seu arquivo de configuração e reinicializar quaisquer dados de chaveira em memória. Se você modificar a configuração do componente em tempo de execução, a nova configuração não entra em vigor até que você realize essa ação. A recarga da chaveira requer o privilégio `ENCRYPTION_KEY_ADMIN`.

Essa ação permite a recarga do componente de chave de registro instalado atualmente. Ela não permite a alteração do componente instalado. Por exemplo, se você alterar a configuração do componente de chave de registro instalado, o comando `ALTER INSTANCE RELOAD KEYRING` fará com que a nova configuração entre em vigor. Por outro lado, se você alterar o componente de chave de registro nomeado no arquivo de manifesto do servidor, o comando `ALTER INSTANCE RELOAD KEYRING` não terá efeito e o componente atual permanecerá instalado.

As instruções `ALTER INSTANCE RELOAD KEYRING` não são escritas no log binário (e, portanto, não são replicadas).