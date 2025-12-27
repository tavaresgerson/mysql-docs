### 17.8.13 Habilitar a Configuração Automática do InnoDB para um Servidor MySQL Dedicado

Quando o servidor é iniciado com `--innodb-dedicated-server`, o `InnoDB` calcula automaticamente os valores para e define as seguintes variáveis de sistema:

* `innodb_buffer_pool_size`
* `innodb_redo_log_capacity`

Você deve considerar usar `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado onde ela possa usar todos os recursos de sistema disponíveis — por exemplo, se você estiver executando o MySQL Server em um contêiner Docker ou VM dedicada que executa apenas o MySQL. Não é recomendado usar `--innodb-dedicated-server` se a instância do MySQL compartilhar recursos de sistema com outras aplicações.

O valor para cada variável afetada é determinado e aplicado pelo `--innodb-dedicated-server` conforme descrito na lista a seguir:

* `innodb_buffer_pool_size`

  O tamanho do buffer pool é calculado de acordo com a quantidade de memória detectada no servidor, conforme mostrado na tabela a seguir:

  **Tabela 17.8 Tamanho Automatizado do Buffer Pool**

  <table summary="A primeira coluna mostra a quantidade de memória do servidor detectada. A segunda coluna mostra o tamanho do buffer pool, que é determinado automaticamente."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Memória do Servidor Detectada</th> <th>Tamanho do Buffer Pool</th> </tr></thead><tbody><tr> <td>Menos de 1GB</td> <td>128MB (o valor padrão)</td> </tr><tr> <td>1GB a 4GB</td> <td><em class="replaceable"><code>memória do servidor detectada</code></em> * 0,5</td> </tr><tr> <td>Maior que 4GB</td> <td><em class="replaceable"><code>memória do servidor detectada</code></em> * 0,75</td> </tr></tbody></table>

* `innodb_redo_log_capacity`

A capacidade do log de refazer é calculada de acordo com o número de processadores lógicos disponíveis no servidor. A fórmula é (número de processadores lógicos disponíveis / 2) GB, com um valor padrão dinâmico máximo de 16 GB.

Se uma das variáveis listadas anteriormente for definida explicitamente em um arquivo de opção ou em outro lugar, esse valor explícito é usado, e uma mensagem de aviso de inicialização semelhante à seguinte é impressa no `stderr`:

[Aviso] [000000] InnoDB: A opção `innodb_dedicated_server` é ignorada para `innodb_buffer_pool_size` porque `innodb_buffer_pool_size=134217728` é especificada explicitamente.

Definir uma variável explicitamente não impede a configuração automática de outras opções.

Se o servidor for iniciado com `--innodb-dedicated-server` e `innodb_buffer_pool_size` for definido explicitamente, as configurações de variáveis baseadas no tamanho do buffer pool usam o valor do tamanho do buffer pool calculado de acordo com a quantidade de memória detectada no servidor, em vez do valor explícito do tamanho do buffer pool definido.

Observação

As configurações de configuração automática são aplicadas por `--innodb-dedicated-server` *apenas* quando o servidor MySQL é iniciado. Se você definir posteriormente qualquer uma das variáveis afetadas explicitamente, isso substitui seu valor predeterminado, e o valor que foi definido explicitamente é aplicado. Definir uma dessas variáveis para `DEFAULT` faz com que ela seja definida pelo valor padrão real, conforme mostrado na descrição da variável no Manual, e *não* faz com que ela retorne ao valor definido por `--innodb-dedicated-server`. A variável de sistema correspondente `innodb_dedicated_server` é alterada apenas ao iniciar o servidor com `--innodb-dedicated-server` (ou com `--innodb-dedicated-server=ON` ou `--innodb-dedicated-server=OFF`); de outra forma, ela é apenas de leitura.