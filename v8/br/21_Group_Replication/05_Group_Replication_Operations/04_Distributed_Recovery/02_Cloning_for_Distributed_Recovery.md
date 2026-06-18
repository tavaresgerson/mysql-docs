#### 20.5.4.2 Clonagem para Recuperação Distribuída

O plugin de clonagem do MySQL Server está disponível a partir do MySQL 8.0.17. Se você deseja usar operações de clonagem remota para recuperação distribuída em um grupo, é necessário configurar membros existentes e membros que se juntam previamente para suportar essa função. Se você não quiser usar essa função em um grupo, não configure, caso contrário, a Replicação de Grupo usa apenas a transferência de estado do log binário.

Para usar o clonagem, pelo menos um membro do grupo existente e o membro que está se juntando devem ser configurados previamente para suportar operações de clonagem remota. Como mínimo, você deve instalar o plugin de clone no membro doador e no membro que está se juntando, conceder a permissão `BACKUP_ADMIN` ao usuário de replicação para recuperação distribuída e definir a variável de sistema `group_replication_clone_threshold` em um nível apropriado. Para garantir a máxima disponibilidade dos doadores, é aconselhável configurar todos os membros atuais e futuros do grupo para suportar operações de clonagem remota.

Tenha em mente que uma operação de clonagem remota remove os espaços de tabela e os dados criados pelo usuário do membro que está sendo unido antes de transferir os dados do membro doador. Se a operação for interrompida durante a execução, o membro que está sendo unido pode ficar com dados parciais ou sem dados. Isso pode ser corrigido tentando novamente a operação de clonagem remota, o que a Replicação em Grupo faz automaticamente.

##### 20.5.4.2.1 Requisitos para Clonagem

Para obter instruções completas sobre como configurar e configurar o plugin de clonagem, consulte a Seção 7.6.7, “O Plugin de Clonagem”. Os pré-requisitos detalhados para uma operação de clonagem remota são abordados na Seção 7.6.7.3, “Clonagem de Dados Remotas”. Para a Replicação em Grupo, observe os seguintes pontos-chave e diferenças:

- O doador (um membro existente do grupo) e o destinatário (o membro que está se juntando) devem ter o plugin de clone instalado e ativo. Para obter instruções sobre como fazer isso, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clone”.

- O doador e o receptor devem rodar no mesmo sistema operacional e devem usar a mesma série de versões do servidor MySQL. Portanto, o clonagem não é adequada para grupos onde os membros executam versões menores diferentes do MySQL Server, como MySQL 8.0 e 8.4.

  Antes do MySQL 8.0.37, o clonamento exigia que os doadores e os destinatários utilizassem a mesma versão pontual; essa restrição ainda se aplica se o doador, o destinatário ou ambos utilizarem o MySQL 8.0.36 ou versões anteriores.

- O doador e o destinatário devem ter o plugin de replicação por grupo instalado e ativo, e quaisquer outros plugins que estejam ativos no doador (como um plugin de chave de segurança) também devem estar ativos no destinatário.

- Se a recuperação distribuída estiver configurada para usar SSL (`group_replication_recovery_use_ssl=ON`), a Replicação em Grupo aplica essa configuração para operações de clonagem remota. A Replicação em Grupo configura automaticamente as configurações das opções SSL de clonagem (`clone_ssl_ca`, `clone_ssl_cert` e `clone_ssl_key`) para corresponder às configurações das opções de recuperação distribuída de Replicação em Grupo correspondentes (`group_replication_recovery_ssl_ca`, `group_replication_recovery_ssl_cert` e `group_replication_recovery_ssl_key`).

- Você não precisa configurar uma lista de doadores válidos na variável de sistema `clone_valid_donor_list` para se juntar a um grupo de replicação. A replicação em grupo configura essa configuração automaticamente para você após selecionar um doador dos membros do grupo existente. Observe que as operações de clonagem remota usam o nome do host e a porta do protocolo SQL do servidor.

- O plugin de clonagem tem várias variáveis de sistema para gerenciar o impacto da carga de rede e do desempenho da operação de clonagem remota. A Replicação em Grupo não configura essas configurações, então você pode revisá-las e configurá-las se desejar, ou deixá-las configuradas por padrão. Observe que, quando uma operação de clonagem remota é usada para recuperação distribuída, o ajuste `clone_enable_compression` do plugin de clonagem se aplica à operação, em vez do ajuste de compressão da Replicação em Grupo.

- Para invocar a operação de clonagem remota no destinatário, a Replicação em Grupo usa o usuário interno `mysql.session`, que já possui o privilégio `CLONE_ADMIN`, então você não precisa configurá-lo.

- Como usuário clone no doador para a operação de clonagem remota, a Replicação em Grupo usa o usuário de replicação que você configurou para a recuperação distribuída (que é coberta na Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”). Portanto, você deve conceder o privilégio `BACKUP_ADMIN` a esse usuário de replicação em todos os membros do grupo que suportam clonagem. Além disso, deve-se conceder o privilégio ao usuário de replicação quando os membros se juntarem ao grupo, ao configurá-los para a Replicação em Grupo, porque eles podem atuar como doadores após se unirem ao grupo. O mesmo usuário de replicação é usado para a recuperação distribuída em todos os membros do grupo. Para conceder esse privilégio ao usuário de replicação em membros existentes, você pode emitir essa declaração em cada membro do grupo individualmente com o registro binário desativado ou em um membro do grupo com o registro binário ativado:

  ```
  GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
  ```

- Se você usar `START GROUP_REPLICATION` para especificar as credenciais do usuário de replicação em um servidor que forneceu as credenciais do usuário anteriormente usando `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, certifique-se de que você remova as credenciais do usuário dos repositórios de metadados de replicação antes que qualquer operação de clonagem remota ocorra. Além disso, certifique-se de que `group_replication_start_on_boot=OFF` esteja configurado no membro que está se juntando. Para obter instruções, consulte a Seção 20.6.3, “Segurança de Conexões de Recuperação Distribuída”. Se você não desativar as credenciais do usuário, elas serão transferidas para o membro que está se juntando durante operações de clonagem remota. O canal `group_replication_recovery` poderia então ser iniciado acidentalmente com as credenciais armazenadas, seja no membro original ou nos membros que foram clonados a partir dele. Um início automático da Replicação em Grupo no inicialização do servidor (incluindo após uma operação de clonagem remota) usaria as credenciais do usuário armazenadas, e elas também seriam usadas se um operador não especificar as credenciais de recuperação distribuída em uma declaração `START GROUP_REPLICATION`.

##### 20.5.4.2.2 Limiar para Clonagem

Quando os membros do grupo são configurados para suportar o clonagem, a variável de sistema `group_replication_clone_threshold` especifica um limite, expresso como um número de transações, para o uso de uma operação de clonagem remota na recuperação distribuída. Se a diferença entre as transações no membro doador e as transações no membro que está se juntando for maior que esse número, uma operação de clonagem remota é usada para transferir o estado para o membro que está se juntando quando isso for tecnicamente possível. A Replicação de Grupo calcula se o limite foi ultrapassado com base nos conjuntos `gtid_executed` dos membros do grupo existentes. Usar uma operação de clonagem remota no caso de uma grande diferença de transações permite adicionar novos membros ao grupo sem transferir os dados do grupo para o servidor manualmente previamente, e também permite que um membro que está muito desatualizado recupere mais eficientemente.

O valor padrão da variável de sistema `group_replication_clone_threshold` do sistema de replicação em grupo é extremamente alto (o número máximo permitido de sequência para uma transação em um GTID), então ele desativa efetivamente o clonamento sempre que a transferência de estado do log binário for possível. Para permitir que a replicação em grupo selecione uma operação de clonagem remota para transferência de estado, onde isso seja mais apropriado, defina a variável de sistema para especificar um número de transações como o intervalo de transações acima do qual você deseja que o clonamento ocorra.

Aviso

Não use uma configuração baixa para `group_replication_clone_threshold` em um grupo ativo. Se um número de transações acima do limite ocorrer no grupo enquanto a operação de clonagem remota estiver em andamento, o membro que se junta aciona novamente a operação de clonagem remota após o reinício e pode continuar isso indefinidamente. Para evitar essa situação, certifique-se de definir o limite para um número maior que o número de transações que você esperaria ocorrer no grupo durante o tempo necessário para a operação de clonagem remota.

A Replicação em Grupo tenta executar uma operação de clonagem remota, independentemente do seu limiar, quando a transferência de estado de um log binário de um membro doador for impossível, por exemplo, porque as transações necessárias pelo membro que está se juntando não estão disponíveis no log binário de nenhum membro do grupo existente. A Replicação em Grupo identifica isso com base nos conjuntos `gtid_purged` dos membros do grupo existentes. Você não pode usar a variável de sistema `group_replication_clone_threshold` para desativar a clonagem quando as transações necessárias não estão disponíveis nos arquivos de log binário de nenhum membro, porque, nessa situação, a clonagem é a única alternativa para transferir dados para o membro que está se juntando manualmente.

##### 20.5.4.2.3 Operações de Clonagem

Quando os membros do grupo e os membros que estão se juntando são configurados para clonagem, a Replicação em Grupo gerencia as operações de clonagem remota para você. Uma operação de clonagem remota pode levar algum tempo para ser concluída, dependendo do tamanho dos dados. Consulte a Seção 7.6.7.10, “Monitoramento das Operações de Clonagem”, para obter informações sobre o monitoramento do processo.

Nota

Quando a transferência de estado estiver concluída, a Replicação em Grupo reinicia o membro de junção para concluir o processo. Se o `group_replication_start_on_boot=OFF` estiver definido no membro de junção, por exemplo, porque você especifica as credenciais do usuário de replicação na declaração `START GROUP_REPLICATION`, você deve emitir novamente o `START GROUP_REPLICATION` manualmente após esse reinício. Se o `group_replication_start_on_boot=ON` e outras configurações necessárias para iniciar a Replicação em Grupo estiverem definidas em um arquivo de configuração ou usando uma declaração `SET PERSIST`, você não precisa intervir e o processo continua automaticamente para colocar o membro de junção online.

Se o procedimento de clonagem remota demorar muito tempo, em versões anteriores ao MySQL 8.0.22, é possível que o conjunto de informações de certificação que se acumula para o grupo durante esse tempo se torne muito grande para ser transmitido ao membro que está se juntando. Nesse caso, o membro que está se juntando registra uma mensagem de erro e não se junta ao grupo. A partir do MySQL 8.0.22, o Grupo de Replicação gerencia o processo de coleta de lixo para transações aplicadas de maneira diferente para evitar esse cenário. Em versões anteriores, se você vir esse erro, após a operação de clonagem remota ser concluída, aguarde dois minutos para permitir que uma rodada de coleta de lixo ocorra, reduzindo o tamanho das informações de certificação do grupo. Em seguida, emita a seguinte declaração no membro que está se juntando, para que ele pare de tentar aplicar o conjunto anterior de informações de certificação:

```
RESET SLAVE FOR CHANNEL group_replication_recovery;
Or from MySQL 8.0.22:
RESET REPLICA FOR CHANNEL group_replication_recovery;
```

Uma operação de clonagem remota clona configurações que são persistidas em tabelas do doador para o receptor, bem como os dados. A Replicação em Grupo gerencia as configurações que se relacionam especificamente com os canais de Replicação em Grupo. As configurações do membro da Replicação em Grupo que são persistidas em arquivos de configuração, como o endereço local de replicação em grupo, não são clonadas e não são alteradas no membro que está se juntando. A Replicação em Grupo também preserva as configurações do canal que se relacionam com o uso do SSL, portanto, essas são exclusivas do membro individual.

Se as credenciais de usuário de replicação usadas pelo doador para o canal de replicação `group_replication_recovery` tiverem sido armazenadas nos repositórios de metadados de replicação usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, elas são transferidas e usadas pelo membro que está se juntando após o clonagem, e devem ser válidas lá. Com credenciais armazenadas, todos os membros do grupo que receberam a transferência de estado por uma operação de clonagem remota recebem automaticamente o usuário e a senha de replicação para a recuperação distribuída. Se você especificar as credenciais de usuário de replicação na declaração `START GROUP_REPLICATION`, elas são usadas para iniciar a operação de clonagem remota, mas não são transferidas e usadas pelo membro que está se juntando após o clonagem. Se você não quiser que as credenciais sejam transferidas para novos membros e registradas lá, certifique-se de desativá-las antes das operações de clonagem remota, conforme descrito na Seção 20.6.3, “Segurança das Conexões de Recuperação Distribuída”, e use `START GROUP_REPLICATION` para fornecê-las em vez disso.

Se uma conta `PRIVILEGE_CHECKS_USER` tiver sido usada para ajudar a proteger os aplicativos de replicação (consulte a Seção 19.3.3.2, “Verificação de privilégios para canais de replicação de grupo”), a conta `PRIVILEGE_CHECKS_USER` e as configurações relacionadas do doador são clonadas para o membro que está se juntando. Se o membro que está se juntando estiver configurado para iniciar a replicação de grupo ao inicializar, ele usará automaticamente a conta para verificações de privilégios nos canais de replicação apropriados. (No MySQL 8.0.18, devido a várias limitações, recomenda-se que você não use uma conta `PRIVILEGE_CHECKS_USER` com canais de replicação de grupo.)

##### 20.5.4.2.4. Clonagem para outros fins

A replicação em grupo inicia e gerencia operações de clonagem para recuperação distribuída. Os membros do grupo que foram configurados para suportar clonagem também podem participar de operações de clonagem iniciadas manualmente por um usuário. Por exemplo, você pode querer criar uma nova instância de servidor clonando de um membro do grupo como doador, mas não deseja que a nova instância de servidor se junte ao grupo imediatamente, ou talvez nunca.

Em todas as versões que suportam clonagem, você pode iniciar uma operação de clonagem manualmente envolvendo um membro do grupo em que a Replicação em Grupo está parada. Observe que, como a clonagem exige que os plugins ativos em um doador e um destinatário sejam compatíveis, o plugin de Replicação em Grupo deve estar instalado e ativo na outra instância do servidor, mesmo que você não pretenda que essa instância de servidor se junte a um grupo. Você pode instalar o plugin emitindo a seguinte declaração:

```
INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Em versões anteriores ao MySQL 8.0.20, você não pode iniciar uma operação de clonagem manualmente se a operação envolver um membro do grupo em que a Replicação por Grupo está em execução. A partir do MySQL 8.0.20, você pode fazer isso, desde que a operação de clonagem não remova e substitua os dados do destinatário. Portanto, a instrução para iniciar a operação de clonagem deve incluir a cláusula `DATA DIRECTORY` se a Replicação por Grupo estiver em execução.
