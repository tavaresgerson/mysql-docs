## 19.3 Segurança de Replicação

19.3.1 Configurando a replicação para usar conexões criptografadas

19.3.2 Criptografar arquivos de registro binários e arquivos de registro de retransmissão

19.3.3 Verificação de privilégios de replicação

Para proteger contra o acesso não autorizado aos dados armazenados e transferidos entre os servidores de origem de replicação e as réplicas, configure todos os servidores envolvidos usando as medidas de segurança que você escolheria para qualquer instância do MySQL em sua instalação, conforme descrito no Capítulo 8, *Segurança*. Além disso, para servidores em uma topologia de replicação, considere implementar as seguintes medidas de segurança:

- Configure fontes e réplicas para usar conexões criptografadas para transferir o log binário, que protege esses dados em movimento. A criptografia para essas conexões deve ser ativada usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, além de configurar os servidores para suportar conexões de rede criptografadas. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

- Criptografar os arquivos de log binários e os arquivos de log de retransmissão em fontes e réplicas, o que protege esses dados em repouso, e também quaisquer dados em uso no cache de log binário. A criptografia do log binário é ativada usando a variável de sistema `binlog_encryption`. Veja a Seção 19.3.2, “Criptografar Arquivos de Log Binários e Arquivos de Log de Retransmissão”.

- Aplique verificações de privilégios em aplicativos de replicação, que ajudam a proteger os canais de replicação contra o uso não autorizado ou acidental de operações privilegiadas ou indesejadas. As verificações de privilégios são implementadas configurando uma conta `PRIVILEGE_CHECKS_USER`, que o MySQL usa para verificar se você autorizou cada transação específica para esse canal. Veja a Seção 19.3.3, “Verificações de Privilégios de Replicação”.

Para a replicação em grupo, a criptografia do log binário e as verificações de privilégios podem ser usadas como uma medida de segurança nos membros do grupo de replicação. Você também deve considerar criptografar as conexões entre os membros do grupo, que incluem as conexões de comunicação do grupo e as conexões de recuperação distribuída, e aplicar a listagem de endereços IP para excluir hosts não confiáveis. Para obter informações sobre essas medidas de segurança específicas para a replicação em grupo, consulte a Seção 20.6, “Segurança da Replicação em Grupo”.
