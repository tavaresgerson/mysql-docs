#### 7.6.7.9 Operação de clonagem remota Tratamento de falhas

Esta secção descreve a manipulação de falhas em diferentes fases de uma operação de clonagem.

1. Os pré-requisitos são verificados (ver Pré-requisitos de clonagem remota).

   - Se ocorrer uma falha durante a verificação de pré-requisitos, a operação `CLONE INSTANCE` relata um erro.
2. O DDL simultâneo no doador é bloqueado apenas se a variável `clone_block_ddl` for definida como `ON` (a configuração padrão é `OFF`).

   Se a operação de clonagem não conseguir obter um bloqueio DDL dentro do prazo especificado pela variável `clone_ddl_timeout`, será reportado um erro.
3. Os dados criados pelo utilizador (esquemas, tabelas, espaços de tabelas) e os registos binários do destinatário são removidos antes de os dados serem clonados para o diretório de dados do destinatário.

   Quando os dados criados pelo usuário e os registros binários são removidos do diretório de dados do destinatário durante uma operação de clonagem remota, os dados não são salvos e podem ser perdidos se ocorrer uma falha.

   Para fins informativos, são impressos avisos no registo de erros do servidor para especificar quando começa e termina a remoção de dados:

   ```
   [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
   Started...

   [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
   Finished
   ```

   Se ocorrer uma falha ao remover dados, o destinatário pode ficar com um conjunto parcial de esquemas, tabelas e espaços de tabelas que existiam antes da operação de clonagem.
4. Os dados são clonados a partir do doador. Os dados criados pelo usuário, os metadados do dicionário e outros dados do sistema são clonados.

   Se ocorrer uma falha durante a clonagem de dados, a operação de clonagem é revertida e todos os dados clonados removidos.

   Se este cenário ocorrer, você pode corrigir a causa da falha e re-executar a operação de clonagem, ou desistir da operação de clonagem e restaurar os dados do destinatário a partir de um backup feito antes da operação de clonagem.
5. O servidor é reiniciado automaticamente (aplica-se a operações de clonagem remota que não clonam para um diretório nomeado).

   Se a reinicialização automática do servidor falhar, você pode reiniciar o servidor manualmente para completar a operação de clonagem.

Se um erro de rede ocorrer durante uma operação de clonagem, a operação é retomada se o erro for resolvido dentro do tempo especificado pela variável `clone_donor_timeout_after_network_failure` definida na instância doadora. A configuração padrão `clone_donor_timeout_after_network_failure` é de 5 minutos, mas uma faixa de 0 a 30 minutos é suportada. Se a operação não for retomada dentro do tempo atribuído, ela é abortada e retorna um erro, e o doador deixa cair o instantâneo. Uma configuração de zero faz com que o doador deixe cair o instantâneo imediatamente quando ocorre um erro de rede. Configurar um tempo limite mais longo permite mais tempo para resolver problemas de rede, mas também aumenta o tamanho do delta na instância doadora, o que aumenta o tempo de recuperação do clone, bem como a replicação nos casos em que o clone é destinado como uma réplica ou membro do grupo de replicação.

O tempo de espera do clone está definido na configuração padrão `wait_timeout`, que é de 28800 segundos (8 horas).
