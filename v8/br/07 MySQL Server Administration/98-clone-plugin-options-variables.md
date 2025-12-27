#### 7.6.7.13 Clonar Variáveis do Sistema

Esta seção descreve as variáveis do sistema que controlam a operação do plugin de clonagem. Se os valores especificados na inicialização estiverem incorretos, o plugin de clonagem pode não se inicializar corretamente e o servidor não carregá-lo. Nesse caso, o servidor também pode produzir mensagens de erro para outras configurações de clonagem porque não as reconhece.

Cada variável do sistema tem um valor padrão. As variáveis do sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. Elas podem ser alteradas dinamicamente durante a execução usando a instrução  `SET`, que permite modificar a operação do servidor sem precisar pará-lo e reiniciá-lo.

Definir o valor de uma variável do sistema globalmente normalmente requer o privilégio  `SYSTEM_VARIABLES_ADMIN` (ou o desatualizado privilégio `SUPER`). Para mais informações, consulte  Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

As variáveis de clonagem são configuradas na instância do servidor MySQL do destinatário onde a operação de clonagem é executada.

*  `clone_autotune_concurrency`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-autotune-concurrency</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_autotune_concurrency</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tbody></table>

  Quando `clone_autotune_concurrency` está habilitado (o padrão), threads adicionais para operações de clonagem remota são gerados dinamicamente para otimizar a velocidade de transferência de dados. O ajuste é aplicável apenas à instância do servidor MySQL do destinatário.

  Durante uma operação de clonagem, o número de threads aumenta incrementalmente em direção a um alvo do dobro do número atual de threads. O efeito na velocidade de transferência de dados é avaliado em cada incremento. O processo continua ou para de acordo com as seguintes regras:

+ Se a velocidade de transferência de dados diminuir mais de 5% com um aumento incremental, o processo é interrompido.
+ Se houver pelo menos uma melhoria de 5% após atingir 25% do alvo, o processo continua. Caso contrário, o processo é interrompido.
+ Se houver pelo menos uma melhoria de 10% após atingir 50% do alvo, o processo continua. Caso contrário, o processo é interrompido.
+ Se houver pelo menos uma melhoria de 25% após atingir o alvo, o processo continua em direção a um novo alvo de o dobro da contagem atual de threads. Caso contrário, o processo é interrompido.

O processo de autoajuste não suporta a diminuição do número de threads.

A variável `clone_max_concurrency` define o número máximo de threads que podem ser gerados.

Se `clone_autotune_concurrency` estiver desativado, `clone_max_concurrency` define o número de threads gerados para uma operação de clonagem remota.
*  `clone_buffer_size`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-buffer-size</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_buffer_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>4194304</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1048576</code></td> </tr><tr><th>Valor Máximo</th> <td><code>268435456</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

Define o tamanho do buffer intermediário usado ao transferir dados durante uma operação de clonagem local. O valor padrão é de 4 MiB (mebibytes). Um tamanho de buffer maior pode permitir que os drivers de dispositivos de E/S obtenham dados em paralelo, o que pode melhorar o desempenho da clonagem.
*  `clone_block_ddl`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-block-ddl</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_block_ddl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilita um bloqueio de backup exclusivo na instância do servidor MySQL do doador durante uma operação de clonagem, o que bloqueia operações de DDL concorrentes no doador. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.
*  `clone_delay_after_data_drop`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-delay-after-data-drop</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_delay_after_data_drop</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tbody></table>

  Especifica um período de espera imediatamente após a remoção de dados existentes na instância do servidor MySQL do destinatário no início de uma operação de clonagem remota. O atraso destina-se a fornecer tempo suficiente para o sistema de arquivos no host do destinatário liberar espaço antes de os dados serem clonados da instância do servidor MySQL do doador. Certos sistemas de arquivos, como o VxFS, liberam o espaço de forma assíncrona em um processo de fundo. Nesses sistemas de arquivos, a clonagem de dados muito cedo após a remoção de dados existentes pode resultar em falhas na operação de clonagem devido ao espaço insuficiente. O período máximo de atraso é de 3600 segundos (1 hora). O valor padrão é 0 (sem atraso).

Esta variável é aplicável apenas à operação de clonagem remota e é configurada na instância do servidor MySQL do destinatário.
*  `clone_ddl_timeout`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--clone-ddl-timeout</code></td> </tr><tr><th>Variável do sistema</th> <td>`clone_ddl_timeout`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>300</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2592000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  O tempo em segundos que uma operação de clonagem espera por um bloqueio de backup. O bloqueio de backup impede operações DDL concorrentes ao executar uma operação de clonagem. Esta configuração é aplicada tanto nas instâncias do servidor MySQL do doador quanto do destinatário.

  Um valor de 0 significa que a operação de clonagem não espera por um bloqueio de backup. Nesse caso, a execução de uma operação DDL concorrente pode fazer com que a operação de clonagem falhe.

  O DDL concorrente é permitido no doador durante uma operação de clonagem se `clone_block_ddl` estiver definido como `OFF` (o padrão). Nesse caso, a operação de clonagem não precisa esperar por um bloqueio de backup no doador. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.
*  `clone_donor_timeout_after_network_failure`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-clone-donor-timeout-after-network-failure</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_donor_timeout_after_network_failure</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>30</code></td> </tr><tr><th>Unidade</th> <td>minutos</td> </tr></tbody></table>

  Define o tempo em minutos que o doador permite que o destinatário se reconecte e reinicie uma operação de clonagem após uma falha na rede. Para mais informações, consulte a Seção 7.6.7.9, “Tratamento de Falhas na Operação de Clonagem Remota”.

  Esta variável é definida na instância do servidor MySQL do doador. Definir na instância do servidor MySQL do destinatário não tem efeito.
*  `clone_enable_compression`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-max-concurrency</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_max_concurrency</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>16</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>128</code></td> </tr><tr><th>Unidade</th> <td>threads</td> </tbody></table>

  Define o número máximo de threads concorrentes para uma operação de clonagem remota. O valor padrão é 16. Um maior número de threads pode melhorar o desempenho da clonagem, mas também reduz o número de conexões de cliente simultâneas permitidas, o que pode afetar o desempenho das conexões de cliente existentes. Esta configuração é aplicada apenas na instância do servidor MySQL destinatário.

  Se `clone_autotune_concurrency` estiver habilitado (o padrão), `clone_max_concurrency` é o número máximo de threads que podem ser gerados dinamicamente para uma operação de clonagem remota. Se `clone_autotune_concurrency` estiver desabilitado, `clone_max_concurrency` define o número de threads gerados para uma operação de clonagem remota.

  Uma taxa de transferência de dados mínima de 1 megabit (MiB) por thread é recomendada para operações de clonagem remota. A taxa de transferência de dados para uma operação de clonagem remota é controlada pela variável `clone_max_data_bandwidth`.
*  `clone_max_data_bandwidth`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-max-data-bandwidth</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_max_data_bandwidth</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr><tr><th>Unidade</th> <td>MiB/segundo</td> </tbody></table>

  Define a taxa máxima de transferência de dados em megabits (MiB) por segundo para uma operação de clonagem remota. Esta variável ajuda a gerenciar o impacto no desempenho de uma operação de clonagem. Um limite deve ser definido apenas quando a largura de banda de I/O do disco do doador estiver saturada, afetando o desempenho. Um valor de 0 significa “sem limite”, o que permite que as operações de clonagem sejam realizadas na taxa de transferência de dados mais alta possível. Esta configuração é aplicável apenas à instância do servidor MySQL do destinatário.

  A taxa mínima de transferência de dados é de 1 MiB por segundo, por fio. Por exemplo, se houver 8 fios, a taxa de transferência mínima é de 8 MiB por segundo. A variável `clone_max_concurrency` controla o número máximo de fios gerados para uma operação de clonagem remota.

  A taxa de transferência de dados solicitada especificada por `clone_max_data_bandwidth` pode diferir da taxa real de transferência de dados reportada pela coluna `DATA_SPEED` na tabela `performance_schema.clone_progress`. Se a sua operação de clonagem não estiver alcançando a taxa de transferência de dados desejada e você tiver largura de banda disponível, verifique o uso de I/O no destinatário e no doador. Se houver largura de banda subutilizada, o I/O é o gargalo mais provável.
*  `clone_max_network_bandwidth`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-max-network-bandwidth</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_max_network_bandwidth</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1048576</code></td> </tr><tr><th>Unidade</th> <td>MiB/segundo</td> </tbody></table>

  Especifica a taxa de transferência de rede aproximada máxima em mebibytes (MiB) por segundo para uma operação de clonagem remota. Esta variável pode ser usada para gerenciar o impacto no desempenho de uma operação de clonagem na largura de banda da rede. Deve ser definida apenas quando a largura de banda da rede estiver saturada, afetando o desempenho da instância do servidor MySQL destinatário. Um valor de 0 significa “sem limite”, o que permite a clonagem na taxa de transferência de dados mais alta possível pela rede, proporcionando o melhor desempenho. Esta configuração é aplicável apenas à instância do servidor MySQL do destinatário.
*  `clone_ssl_ca`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tbody></table>

  Especifica o caminho para o arquivo da autoridade de certificação (CA). Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.
*  `clone_ssl_cert`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-ssl-cert=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_ssl_cert</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Especifica o caminho para o certificado da chave pública. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.
*  `clone_ssl_key`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--clone-ssl-key=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>clone_ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Especifica o caminho para o arquivo da chave privada. Usado para configurar uma conexão criptografada para uma operação de clonagem remota. Esta configuração configurada no destinatário e usada ao se conectar ao doador.
*  `clone_valid_donor_list`

Define endereços de hosts do doador válidos para operações de clonagem remota. Esta configuração é aplicada na instância do servidor MySQL do destinatário. Uma lista de valores separados por vírgula é permitida no seguinte formato: “`HOST1:PORT1,HOST2:PORT2,HOST3:PORT3`”. Espaços não são permitidos.

A variável `clone_valid_donor_list` adiciona uma camada de segurança ao fornecer controle sobre as fontes dos dados clonados. O privilégio necessário para configurar `clone_valid_donor_list` é diferente do privilégio necessário para executar operações de clonagem remota, o que permite atribuir essas responsabilidades a diferentes papéis. Configurar `clone_valid_donor_list` requer o privilégio `SYSTEM_VARIABLES_ADMIN`, enquanto executar uma operação de clonagem remota requer o privilégio `CLONE_ADMIN`.

O formato de endereço do Protocolo de Internet versão 6 (IPv6) não é suportado. O formato de endereço do Protocolo de Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.