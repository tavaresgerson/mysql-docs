#### 7.6.7.9 Gerenciamento de falhas na operação de clonagem remota

Esta seção descreve a falha na manipulação em diferentes estágios de uma operação de clonagem.

1. Os pré-requisitos são verificados (consulte Pré-requisitos para Clonagem Remota).

   - Se ocorrer uma falha durante a verificação dos pré-requisitos, a operação `CLONE INSTANCE` reporta um erro.

2. Antes do MySQL 8.0.27, um bloqueio de backup nos blocos do doador e do receptor bloqueia operações DDL concorrentes. A partir do MySQL 8.0.27, as operações DDL concorrentes no doador são bloqueadas apenas se a variável `clone_block_ddl` estiver definida como `ON` (o ajuste padrão é `OFF`). Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

   - Se a operação de clonagem não conseguir obter um bloqueio DDL dentro do limite de tempo especificado pela variável `clone_ddl_timeout`, um erro será relatado.

3. Os dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e os logs binários do destinatário são removidos antes de os dados serem clonados para o diretório de dados do destinatário.

   - Quando os dados criados pelo usuário e os logs binários são removidos do diretório de dados do destinatário durante uma operação de clonagem remota, os dados não são salvos e podem ser perdidos se ocorrer uma falha. Se os dados forem importantes, uma cópia de segurança deve ser feita antes de iniciar uma operação de clonagem remota.

     Para fins informativos, os avisos são impressos no log de erros do servidor para especificar quando a remoção de dados começa e termina:

     ```
     [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
     Started...

     [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
     Finished
     ```

     Se ocorrer uma falha durante a remoção de dados, o destinatário pode ficar com um conjunto parcial de esquemas, tabelas e espaços de tabelas que existiam antes da operação de clonagem. Em qualquer momento durante a execução de uma operação de clonagem ou após uma falha, o servidor sempre está em um estado consistente.

4. Os dados são clonados a partir do doador. Os dados criados pelo usuário, os metadados do dicionário e outros dados do sistema são clonados.

   - Se ocorrer uma falha durante a clonagem de dados, a operação de clonagem é revertida e todos os dados clonados são removidos. Nesta fase, os dados criados pelo usuário e os registros binários existentes anteriormente no destinatário também foram removidos.

     Se esse cenário ocorrer, você pode corrigir a causa do erro e reexecutar a operação de clonagem, ou desistir da operação de clonagem e restaurar os dados do destinatário a partir de um backup feito antes da operação de clonagem.

5. O servidor é reiniciado automaticamente (aplica-se a operações de clonagem remota que não clonam para um diretório nomeado). Durante a inicialização, as tarefas de inicialização do servidor são executadas normalmente.

   - Se o reinício automático do servidor falhar, você pode reiniciar o servidor manualmente para concluir a operação de clonagem.

Antes do MySQL 8.0.24, se ocorrer um erro de rede durante uma operação de clonagem, a operação será retomada se o erro for resolvido dentro de cinco minutos. A partir do MySQL 8.0.24, a operação será retomada se o erro for resolvido dentro do tempo especificado pela variável `clone_donor_timeout_after_network_failure`, definida na instância do doador. O valor padrão de `clone_donor_timeout_after_network_failure` é de 5 minutos, mas é suportado um intervalo de 0 a 30 minutos. Se a operação não for retomada dentro do tempo alocado, ela será interrompida e retornará um erro, e o doador descartará o instantâneo. Um valor de zero faz com que o doador descarte o instantâneo imediatamente quando ocorre um erro de rede. Configurar um tempo de espera mais longo permite mais tempo para resolver problemas de rede, mas também aumenta o tamanho do delta na instância do doador, o que aumenta o tempo de recuperação do clone, bem como o atraso na replicação em casos em que o clone é destinado a ser uma replica ou membro de um grupo de replicação.

Antes do MySQL 8.0.24, os threads do doador usam o ajuste `wait_timeout` do MySQL Server ao ouvir comandos do protocolo Clone. Como resultado, um ajuste baixo `wait_timeout` poderia fazer com que uma operação de clonagem remota em andamento por muito tempo expirasse. A partir do MySQL 8.0.24, o tempo de espera para o Clone é definido para o ajuste padrão `wait_timeout`, que é de 28800 segundos (8 horas).
