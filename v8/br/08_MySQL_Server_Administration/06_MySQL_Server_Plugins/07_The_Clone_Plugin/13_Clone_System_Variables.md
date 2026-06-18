#### 7.6.7.13 Clonar variáveis do sistema

Esta seção descreve as variáveis do sistema que controlam o funcionamento do plugin de clone. Se os valores especificados na inicialização estiverem incorretos, o plugin de clone pode não ser inicializado corretamente e o servidor não o carregará. Nesse caso, o servidor também pode emitir mensagens de erro para outras configurações do clone, pois não as reconhece.

Cada variável do sistema tem um valor padrão. As variáveis do sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. Elas podem ser alteradas dinamicamente durante a execução usando a instrução `SET`, que permite modificar o funcionamento do servidor sem precisar pará-lo e reiniciá-lo.

Definir o valor de runtime de uma variável de sistema global normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Para mais informações, consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

As variáveis de clonagem são configuradas na instância do servidor MySQL do destinatário onde a operação de clonagem é executada.

- `clone_autotune_concurrency`

  <table summary="Propriedades para clone_autotune_concurrency"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-autotune-concurrency</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_autotune_concurrency</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Quando o `clone_autotune_concurrency` está ativado (padrão), threads adicionais para operações de clonagem remota são geradas dinamicamente para otimizar a velocidade de transferência de dados. A configuração é aplicável apenas à instância do servidor MySQL do destinatário.

  Durante uma operação de clonagem, o número de threads aumenta gradualmente até atingir o dobro do número atual de threads. O efeito na velocidade de transferência de dados é avaliado em cada incremento. O processo continua ou para de acordo com as seguintes regras:

  - Se a velocidade de transferência de dados piorar mais de 5% com um aumento incremental, o processo é interrompido.

  - Se houver pelo menos uma melhoria de 5% após atingir 25% do objetivo, o processo continua. Caso contrário, o processo é interrompido.

  - Se houver pelo menos uma melhoria de 10% após atingir 50% do objetivo, o processo continua. Caso contrário, o processo é interrompido.

  - Se houver pelo menos uma melhoria de 25% após atingir o objetivo, o processo continua em direção a um novo objetivo de dobrar o número atual de fios. Caso contrário, o processo é interrompido.

  O processo de autoajuste não suporta a redução do número de threads.

  A variável `clone_max_concurrency` define o número máximo de threads que podem ser geradas.

  Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads gerados para uma operação de clonagem remota.

- `clone_buffer_size`

  <table summary="Propriedades para clone_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Define o tamanho do buffer intermediário usado ao transferir dados durante uma operação de clonagem local. O valor padrão é de 4 MiB (mebibytes). Um tamanho de buffer maior pode permitir que os drivers de dispositivos de E/S obtenham dados em paralelo, o que pode melhorar o desempenho da clonagem.

- `clone_block_ddl`

  <table summary="Propriedades para clone_block_ddl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-block-ddl</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_block_ddl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Habilita um bloqueio de backup exclusivo na instância do servidor MySQL do doador durante uma operação de clonagem, o que bloqueia operações DDL concorrentes no doador. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

- `clone_delay_after_data_drop`

  <table summary="Propriedades para clone_delay_after_data_drop"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-delay-after-data-drop</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.29</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_delay_after_data_drop</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Especifica um período de atraso imediatamente após a remoção de dados existentes na instância do servidor MySQL do destinatário no início de uma operação de clonagem remota. O atraso visa fornecer tempo suficiente para que o sistema de arquivos do hospedeiro do destinatário libere espaço antes de os dados serem clonados da instância do servidor MySQL do doador. Certos sistemas de arquivos, como o VxFS, liberam o espaço em segundo plano de forma assíncrona. Nesses sistemas de arquivos, a clonagem de dados muito cedo após a remoção de dados existentes pode resultar em falhas na operação de clonagem devido ao espaço insuficiente. O período máximo de atraso é de 3600 segundos (1 hora). O ajuste padrão é 0 (sem atraso).

  Esta variável é aplicável apenas à operação de clonagem remota e é configurada na instância do servidor MySQL do destinatário.

- `clone_ddl_timeout`

  <table summary="Propriedades para clone_ddl_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-ddl-timeout</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_ddl_timeout</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2592000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O tempo em segundos que uma operação de clonagem espera por um bloqueio de backup. O bloqueio de backup bloqueia operações DDL concorrentes ao executar uma operação de clonagem. Esta configuração é aplicada tanto nas instâncias do servidor MySQL do doador quanto do receptor.

  Um valor de 0 significa que a operação de clonagem não aguarda uma bloqueio de backup. Nesse caso, a execução de uma operação DDL concorrente pode fazer com que a operação de clonagem falhe.

  Antes do MySQL 8.0.27, o bloqueio de backup impediu operações DDL concorrentes tanto no doador quanto no receptor durante uma operação de clonagem, e uma operação de clonagem não pode prosseguir até que as operações DDL atuais terminem. A partir do MySQL 8.0.27, operações DDL concorrentes são permitidas no doador durante uma operação de clonagem se a variável `clone_block_ddl` for definida como `OFF` (o padrão). Nesse caso, a operação de clonagem não precisa esperar por um bloqueio de backup no doador. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

- `clone_donor_timeout_after_network_failure`

  <table summary="Propriedades para clone_donor_timeout_after_network_failure"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-donor-timeout-after-network-failure</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_donor_timeout_after_network_failure</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>30</code>]]</td> </tr><tr><th>Unidade</th> <td>minutos</td> </tr></tbody></table>

  Define o tempo em minutos que o doador permite que o destinatário se reconecte e reinicie uma operação de clonagem após uma falha na rede. Para mais informações, consulte a Seção 7.6.7.9, “Tratamento de Falhas na Operação de Clonagem Remota”.

  Essa variável é definida na instância do servidor MySQL do doador. Definí-la na instância do servidor MySQL do destinatário não tem efeito.

- `clone_enable_compression`

  <table summary="Propriedades para clone_enable_compression"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-enable-compression</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_enable_compression</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Habilita a compressão de dados na camada de rede durante uma operação de clonagem remota. A compressão economiza largura de banda da rede em detrimento do uso da CPU. A ativação da compressão pode melhorar a taxa de transferência de dados. Esta configuração é aplicada apenas na instância do servidor MySQL do destinatário.

- `clone_max_concurrency`

  <table summary="Propriedades para clone_max_concurrency"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-max-concurrency</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_concurrency</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>16</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>128</code>]]</td> </tr><tr><th>Unidade</th> <td>fios</td> </tr></tbody></table>

  Define o número máximo de threads concorrentes para uma operação de clonagem remota. O valor padrão é 16. Um número maior de threads pode melhorar o desempenho da clonagem, mas também reduz o número de conexões simultâneas de clientes permitidas, o que pode afetar o desempenho das conexões de clientes existentes. Esta configuração é aplicada apenas na instância do servidor MySQL do destinatário.

  Se `clone_autotune_concurrency` estiver habilitado (o padrão), `clone_max_concurrency` é o número máximo de threads que podem ser gerados dinamicamente para uma operação de clonagem remota. Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads gerados para uma operação de clonagem remota.

  Para operações de clonagem remota, recomenda-se uma taxa mínima de transferência de dados de 1 megabyte (MiB) por fio. A taxa de transferência de dados para uma operação de clonagem remota é controlada pela variável `clone_max_data_bandwidth`.

- `clone_max_data_bandwidth`

  <table summary="Propriedades para clone_max_data_bandwidth"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-max-data-bandwidth</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_data_bandwidth</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>miB/segundo</td> </tr></tbody></table>

  Define a taxa máxima de transferência de dados em megabits (MiB) por segundo para uma operação de clonagem remota. Esta variável ajuda a gerenciar o impacto no desempenho de uma operação de clonagem. Um limite deve ser definido apenas quando a largura de banda de E/S do disco do doador estiver saturada, afetando o desempenho. Um valor de 0 significa "sem limite", o que permite que as operações de clonagem sejam realizadas na taxa de transferência de dados mais alta possível. Esta configuração é aplicável apenas à instância do servidor MySQL do destinatário.

  A taxa mínima de transferência de dados é de 1 MiB por segundo, por fio. Por exemplo, se houver 8 fios, a taxa de transferência mínima é de 8 MiB por segundo. A variável `clone_max_concurrency` controla o número máximo de fios gerados para uma operação de clonagem remota.

  A taxa de transferência de dados solicitada especificada por `clone_max_data_bandwidth` pode diferir da taxa real de transferência de dados reportada pela coluna `DATA_SPEED` na tabela `performance_schema.clone_progress`. Se a operação de clonagem não estiver alcançando a taxa de transferência de dados desejada e você tiver largura de banda disponível, verifique o uso de I/O no destinatário e no doador. Se houver largura de banda subutilizada, o uso de I/O é o gargalo mais provável.

- `clone_max_network_bandwidth`

  <table summary="Propriedades para clone_max_network_bandwidth"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-max-network-bandwidth</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_network_bandwidth</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>miB/segundo</td> </tr></tbody></table>

  Especifica a taxa máxima de transferência de rede aproximada em mibibytes (MiB) por segundo para uma operação de clonagem remota. Esta variável pode ser usada para gerenciar o impacto no desempenho de uma operação de clonagem na largura de banda da rede. Deve ser definida apenas quando a largura de banda da rede estiver saturada, afetando o desempenho da instância do servidor MySQL receptor. Um valor de 0 significa "sem limite", o que permite a clonagem na taxa de transferência de dados mais alta possível na rede, proporcionando o melhor desempenho. Esta configuração é aplicável apenas à instância do servidor MySQL receptor.

- `clone_ssl_ca`

  <table summary="Propriedades para clone_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Especifica o caminho para o arquivo da autoridade de certificação (CA). É usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração é configurada no destinatário e usada ao se conectar ao doador.

- `clone_ssl_cert`

  <table summary="Propriedades para clone_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Especifica o caminho para o certificado da chave pública. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração é configurada no destinatário e usada ao se conectar ao doador.

- `clone_ssl_key`

  <table summary="Propriedades para clone_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  Especifica o caminho para o arquivo de chave privada. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração é configurada no destinatário e usada ao se conectar ao doador.

- `clone_valid_donor_list`

  <table summary="Propriedades para clone_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Define endereços de hosts de doadores válidos para operações de clonagem remota. Esta configuração é aplicada na instância do servidor MySQL do destinatário. Uma lista de valores separados por vírgula é permitida no seguinte formato: “\[\[`HOST1:PORT1,HOST2:PORT2,HOST3:PORT3`]”. Espaços não são permitidos.

  A variável `clone_valid_donor_list` adiciona uma camada de segurança ao fornecer controle sobre as fontes dos dados clonados. O privilégio necessário para configurar `clone_valid_donor_list` é diferente do privilégio necessário para executar operações de clonagem remota, o que permite atribuir essas responsabilidades a diferentes papéis. A configuração de `clone_valid_donor_list` requer o privilégio `SYSTEM_VARIABLES_ADMIN`, enquanto a execução de uma operação de clonagem remota requer o privilégio `CLONE_ADMIN`.

  O formato de endereço do Protocolo de Internet versão 6 (IPv6) não é suportado. O formato de endereço do Protocolo de Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.
