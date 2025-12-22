#### 7.6.7.13 Variáveis do sistema de clonagem

Esta seção descreve as variáveis do sistema que controlam a operação do plugin de clone. Se os valores especificados no início estiverem incorretos, o plugin de clone pode falhar na inicialização correta e o servidor não o carregar. Neste caso, o servidor também pode produzir mensagens de erro para outras configurações de clone porque não as reconhece.

Cada variável do sistema tem um valor padrão. As variáveis do sistema podem ser definidas no início do servidor usando opções na linha de comando ou em um arquivo de opções. Eles podem ser alterados dinamicamente no tempo de execução usando a instrução `SET`, que permite modificar a operação do servidor sem ter que pará-lo e reiniciar.

A definição de um valor de tempo de execução de uma variável global do sistema normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`).

As variáveis de clonagem são configuradas na instância do servidor MySQL destinatário onde a operação de clonagem é executada.

- `clone_autotune_concurrency`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-autotune-concurrency</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_autotune_concurrency</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Quando `clone_autotune_concurrency` é habilitado (o padrão), threads adicionais para operações de clonagem remota são gerados dinamicamente para otimizar a velocidade de transferência de dados. A configuração é aplicável apenas à instância do servidor MySQL destinatário.

Durante uma operação de clonagem, o número de threads aumenta de forma incremental em direção a um alvo de duplo da contagem atual de threads. O efeito na velocidade de transferência de dados é avaliado em cada incremento. O processo continua ou pára de acordo com as seguintes regras:

- Se a velocidade de transferência de dados se degradar mais de 5% com um aumento incremental, o processo é interrompido.
- Se houver uma melhoria de, pelo menos, 5% após atingir 25% do objectivo, o processo continua; caso contrário, o processo pára.
- Se houver uma melhoria de pelo menos 10% após atingir 50% do objetivo, o processo continua; caso contrário, o processo pára.
- Se houver pelo menos uma melhoria de 25% após atingir o alvo, o processo continua em direção a um novo alvo de dobro da contagem de fios atual.

O processo de ajuste automático não suporta a diminuição do número de fios.

A variável `clone_max_concurrency` define o número máximo de threads que podem ser gerados.

Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads gerados para uma operação de clonagem remota.

- `clone_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-buffer-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4194304</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>268435456</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Define o tamanho do buffer intermediário usado ao transferir dados durante uma operação de clonagem local. O valor padrão é de 4 mebibytes (MiB). Um tamanho maior do buffer pode permitir que os drivers de dispositivos de E/S busquem dados em paralelo, o que pode melhorar o desempenho da clonagem.

- `clone_block_ddl`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-block-ddl</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_block_ddl</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Permite um bloqueio de backup exclusivo na instância do MySQL Server doador durante uma operação de clonagem, que bloqueia operações DDL concorrentes no doador.

- `clone_delay_after_data_drop`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-delay-after-data-drop</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_delay_after_data_drop</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Especifica um período de atraso imediatamente após a remoção de dados existentes na instância do servidor MySQL do destinatário no início de uma operação de clonagem remota. O atraso destina-se a fornecer tempo suficiente para o sistema de arquivos no host do destinatário liberar espaço antes que os dados sejam clonados da instância do servidor MySQL do doador. Certos sistemas de arquivos, como o VxFS, liberam espaço assíncrono em um processo de fundo. Nestes sistemas de arquivos, o clonamento de dados muito cedo após a eliminação de dados existentes pode resultar em falhas na operação de clonagem devido à insuficiência de espaço. O período de atraso máximo é de 3600 segundos (1 hora). A configuração padrão é 0 (sem atraso).

Esta variável é aplicável apenas à operação de clonagem remota e é configurada na instância do servidor MySQL destinatário.

- `clone_ddl_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-ddl-timeout</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_ddl_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2592000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O tempo em segundos que uma operação de clonagem espera por um bloqueio de backup. O bloqueio de backup bloqueia DDL concorrente ao executar uma operação de clonagem. Esta configuração é aplicada tanto na instância do servidor MySQL doador quanto na do destinatário.

Uma configuração de 0 significa que a operação de clonagem não espera por um bloqueio de backup. Neste caso, executar uma operação DDL simultânea pode fazer com que a operação de clonagem falhe.

DDL simultâneo é permitido no doador durante uma operação de clonagem se `clone_block_ddl` for definido como `OFF` (o padrão). Neste caso, a operação de clonagem não precisa esperar por um bloqueio de backup no doador.

- `clone_donor_timeout_after_network_failure`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-donor-timeout-after-network-failure</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_donor_timeout_after_network_failure</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>30</code>]]</td> </tr><tr><th>Unidade</th> <td>Minutos</td> </tr></tbody></table>

Define a quantidade de tempo em minutos que o doador permite ao receptor para se reconectar e reiniciar uma operação de clonagem após uma falha de rede.

Esta variável está definida na instância do servidor MySQL doador. A definição na instância do servidor MySQL receptor não tem efeito.

- `clone_enable_compression`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-enable-compression</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_enable_compression</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Permite a compressão de dados na camada de rede durante uma operação de clonagem remota. A compressão economiza largura de banda de rede ao custo da CPU. Ativar a compressão pode melhorar a taxa de transferência de dados. Esta configuração é aplicada apenas na instância do servidor MySQL destinatário.

- `clone_max_concurrency`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-max-concurrency</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_concurrency</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>128</code>]]</td> </tr><tr><th>Unidade</th> <td>Fios</td> </tr></tbody></table>

Define o número máximo de threads concorrentes para uma operação de clonagem remota. O valor padrão é 16. Um maior número de threads pode melhorar o desempenho de clonagem, mas também reduz o número de conexões de cliente simultâneas permitidas, o que pode afetar o desempenho das conexões de cliente existentes. Esta configuração é aplicada apenas na instância do servidor MySQL destinatário.

Se `clone_autotune_concurrency` estiver ativado (o padrão), `clone_max_concurrency` é o número máximo de threads que podem ser criados dinamicamente para uma operação de clonagem remota. Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads criados para uma operação de clonagem remota.

A taxa mínima de transferência de dados de 1 mebibyte (MiB) por thread é recomendada para operações de clonagem remota.

- `clone_max_data_bandwidth`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-max-data-bandwidth</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_data_bandwidth</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>miB/segundo</td> </tr></tbody></table>

Define a taxa máxima de transferência de dados em mebibytes (MiB) por segundo para uma operação de clonagem remota. Esta variável ajuda a gerenciar o impacto no desempenho de uma operação de clonagem. Um limite deve ser definido apenas quando a largura de banda de E/S do disco doador está saturada, afetando o desempenho. Um valor de 0 significa  ilimitado, o que permite que as operações de clonagem sejam executadas na maior taxa de transferência de dados possível. Esta configuração é aplicável apenas à instância do servidor MySQL destinatário.

A taxa mínima de transferência de dados é de 1 MiB por segundo, por thread. Por exemplo, se houver 8 threads, a taxa mínima de transferência é de 8 MiB por segundo. A variável `clone_max_concurrency` controla o número máximo de threads gerados para uma operação de clonagem remota.

A taxa de transferência de dados solicitada especificada por `clone_max_data_bandwidth` pode diferir da taxa de transferência de dados real relatada pela coluna `DATA_SPEED` na tabela `performance_schema.clone_progress`. Se a sua operação de clonagem não está alcançando a taxa de transferência de dados desejada e você tem largura de banda disponível, verifique o uso de I/O no destinatário e no doador. Se houver largura de banda subutilizada, I/O é o próximo gargalo mais provável.

- `clone_max_network_bandwidth`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-max-network-bandwidth</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_max_network_bandwidth</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>miB/segundo</td> </tr></tbody></table>

Especifica a taxa de transferência de rede máxima aproximada em mebibytes (MiB) por segundo para uma operação de clonagem remota. Esta variável pode ser usada para gerenciar o impacto de desempenho de uma operação de clonagem na largura de banda da rede. Ela deve ser definida apenas quando a largura de banda da rede está saturada, afetando o desempenho na instância doadora. Um valor de 0 significa  ilimitado, o que permite a clonagem na maior taxa de transferência de dados possível pela rede, fornecendo o melhor desempenho. Esta configuração é aplicável apenas à instância do servidor MySQL receptor.

- `clone_ssl_ca`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-ssl-ca=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_ssl_ca</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Especifica o caminho para o arquivo da autoridade de certificação (CA). Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.

- `clone_ssl_cert`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-ssl-cert=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_ssl_cert</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Especifica o caminho para o certificado de chave pública. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.

- `clone_ssl_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-ssl-key=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_ssl_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Especifica o caminho para o arquivo de chave privada. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.

- `clone_valid_donor_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--clone-valid-donor-list=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>clone_valid_donor_list</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

Define endereços de host doadores válidos para operações de clonagem remota. Esta configuração é aplicada na instância do servidor MySQL receptor. Uma lista de valores separados por vírgulas é permitida no seguinte formato: `HOST1:PORT1,HOST2:PORT2,HOST3:PORT3`. Espaços não são permitidos.

A variável `clone_valid_donor_list` adiciona uma camada de segurança ao fornecer controle sobre as fontes de dados clonados. O privilégio necessário para configurar `clone_valid_donor_list` é diferente do privilégio necessário para executar operações de clonagem remota, o que permite atribuir essas responsabilidades a diferentes funções. Configurar `clone_valid_donor_list` requer o privilégio `SYSTEM_VARIABLES_ADMIN`, enquanto executar uma operação de clonagem remota requer o privilégio `CLONE_ADMIN`.

O formato de endereço do Protocolo da Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.
