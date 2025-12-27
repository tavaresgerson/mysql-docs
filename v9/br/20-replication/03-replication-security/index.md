## 19.3 Segurança da Replicação

19.3.1 Configurando a Replicação para Usar Conexões Encriptadas

19.3.2 Criptografando Arquivos de Registro Binário e Arquivos de Registro de Retransmissão

19.3.3 Verificações de Privilegios da Replicação

Para proteger contra o acesso não autorizado aos dados armazenados e transferidos entre os servidores de origem da replicação e as réplicas, configure todos os servidores envolvidos usando as medidas de segurança que você escolheria para qualquer instância do MySQL em sua instalação, conforme descrito no Capítulo 8, *Segurança*. Além disso, para servidores em uma topologia de replicação, considere implementar as seguintes medidas de segurança:

* Configure fontes e réplicas para usar conexões encriptadas para transferir o registro binário, o que protege esses dados em movimento. A criptografia para essas conexões deve ser ativada usando uma declaração `CHANGE REPLICATION SOURCE TO`, além de configurar os servidores para suportar conexões de rede encriptadas. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

* Criptografar os arquivos de registro binário e os arquivos de registro de retransmissão em fontes e réplicas, o que protege esses dados em repouso, e também quaisquer dados em uso no cache de registro binário. A criptografia do registro binário é ativada usando a variável de sistema `binlog_encryption`. Veja a Seção 19.3.2, “Criptografando Arquivos de Registro Binário e Arquivos de Registro de Retransmissão”.

* Aplicar verificações de privilégios aos aplicadores de replicação, o que ajuda a proteger os canais de replicação contra o uso não autorizado ou acidental de operações privilegiadas ou indesejadas. As verificações de privilégios são implementadas configurando uma conta `PRIVILEGE_CHECKS_USER`, que o MySQL usa para verificar se você autorizou cada transação específica para aquele canal. Veja a Seção 19.3.3, “Verificações de Privilegios da Replicação”.

Para a Replicação em Grupo, a criptografia do log binário e as verificações de privilégios podem ser usadas como uma medida de segurança nos membros do grupo de replicação. Você também deve considerar criptografar as conexões entre os membros do grupo, que incluem as conexões de comunicação do grupo e as conexões de recuperação distribuída, e aplicar a listagem de endereços IP para excluir hosts não confiáveis. Para obter informações sobre essas medidas de segurança específicas para a Replicação em Grupo, consulte a Seção 20.6, “Segurança da Replicação em Grupo”.