#### 7.5.7.1 Opção de Componentes do Motor Multilíngue e Referência de Variáveis de Status

A tabela a seguir lista todas as variáveis de sistema e variáveis de status do MySQL suportadas pelo componente do motor multilíngue. Descrições detalhadas dessas variáveis podem ser encontradas nas duas seções seguintes.

**Tabela 7.7 Referência de Variáveis do Componente do Motor Multilíngue**

<table border="box" rules="all" summary="Referência para as opções de linha de comando, variáveis de sistema e variáveis de status do MLE.">
<tr>
<th>Nome</th>
<th>Linha de Comando</th>
<th>Arquivo de Opções</th>
<th>Var System</th>
<th>Var Status</th>
<th>Alcance da Var</th>
<th>Dinâmico</th>
</tr>
<tr>
<th>mle_heap_status</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_languages_supported</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_memory_used</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_oom_errors</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_session_resets</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_sessions</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_sessions_max</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_status</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_stored_functions</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_stored_procedures</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_stored_program_bytes_max</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_stored_program_sql_max</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_stored_programs</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_threads</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>mle_threads_max</th>
<td></td>
<td></td>
<td></td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>sysvar_mle.memory_max</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
</tbody></table>

##### Variáveis do Sistema de Componentes MLE

Esta seção fornece uma descrição de cada variável do sistema específica para o componente MLE. Para uma tabela resumida que lista todas as variáveis do sistema suportadas pelo servidor MySQL, consulte a Seção 7.1.5, “Referência de Variáveis do Sistema”. Para informações gerais sobre a manipulação de variáveis do sistema, consulte a Seção 7.1.9, “Uso de Variáveis do Sistema”.

* `mle.memory_max`

  <table frame="box" rules="all" summary="Propriedades para mle.memory_max"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mle.memory-max=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="mle-component-options-variables.html#sysvar_mle.memory_max">mle.memory_max</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variáveis"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Específica à Plataforma</th> <td>Linux</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">(0.05) * (memória física total em GB)</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">320M</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">64G</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Determina a quantidade máxima de memória a ser alocada ao componente MLE. Esta variável é dinâmica, mas pode ser definida apenas quando o componente está inativo; você pode determinar se isso é o caso verificando o valor da variável de status `mle_status`.

Ao aumentar o valor para essa variável, você deve ter em mente que deve permitir memória suficiente para outros usos pelo servidor MySQL, como pools de buffers, memória de conexão, buffers de junção, e assim por diante. Além disso, deve haver memória suficiente para permitir que os processos do sistema operem corretamente.

Importante

Definir esse valor maior que a quantidade de memória disponível no sistema causa comportamento indefinido.

Para mais informações sobre o uso de memória pelo componente MLE, consulte a Seção 7.5.7.3, “Memória do Componente MLE e Uso de Fios”.

##### Variáveis de Status do Componente MLE

Esta seção fornece uma descrição de cada variável de status específica para o componente MLE. Para informações gerais sobre variáveis de status do servidor MySQL, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”. Para uma tabela resumida que lista todas as variáveis de status suportadas pelo servidor MySQL, consulte a Seção 7.1.6, “Referência de Variáveis de Status do Servidor”.

As variáveis de status têm os seguintes significados:

* `mle_languages_supported`

  Lista os idiomas suportados pelo componente MLE. No MySQL 9.5, este é sempre `JavaScript`.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.2, “Status e Informações de Sessão do Componente MLE”, para mais informações.

* `mle_heap_status`

  Status atual do heap usado pelo componente MLE. O valor é um dos: `Não Alocado`, `Alocado` ou `Coleta de Lixo`. O heap é alocado apenas se o componente MLE estiver ativo (ou seja, se `mle_status` for igual a `Active`).

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.3, “Memória e Uso de Fios do Componente MLE”, para mais informações.

* `mle_memory_used`

  Porcentagem de memória alocada usada pelo componente MLE, arredondada para o número inteiro mais próximo.

Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.3, “Memória do Componente MLE e Uso de Fios”, para obter mais informações.

* `mle_oom_errors`

  O número total de erros de falta de memória lançados por programas armazenados MLE, em todas as sessões.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.3, “Status do Componente MLE e Informações de Sessão”, para obter mais informações.

* `mle_session_resets`

  O número de vezes em que as sessões MLE foram limpas usando a função `mle_session_reset()`.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.2, “Status do Componente MLE e Informações de Sessão”, para obter mais informações.

* `mle_sessions`

  Número atual de sessões MLE ativas. Uma sessão MLE é criada dentro de uma sessão de usuário MySQL dada uma vez que o usuário MySQL cria ou executa um programa armazenado em JavaScript. É descartada quando o usuário MySQL chama `mle_session_reset()`, ou quando a sessão MySQL termina.

  Se o usuário MySQL chamar `mle_session_reset()`, e depois criar ou executar um programa armazenado em JavaScript dentro da mesma sessão de usuário MySQL, uma nova sessão MLE é criada. Pode haver no máximo uma sessão MLE por sessão MySQL.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.2, “Status do Componente MLE e Informações de Sessão”, para obter mais informações.

* `mle_sessions_max`

  Número máximo de sessões MLE ativas a qualquer momento desde que o componente MLE se tornou ativo.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.2, “Status do Componente MLE e Informações de Sessão”, para obter mais informações.

* `mle_status`

  Status atual do componente MLE. O valor é um dos seguintes: `Inicializando`, `Inativo`, `Ativo` ou `Pendente de Desligamento`.

Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.2, “Status do componente MLE e Informações da Sessão”, para obter mais informações.

* `mle_functions_armazenadas`

  Este é o número de funções armazenadas MLE atualmente armazenadas em cache em todas as sessões.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.4, “Uso de Programas Armazenados do Componente MLE”, para obter mais informações.

* `mle_procedures_armazenadas`

  O número de procedimentos armazenados MLE atualmente armazenados em cache em todas as sessões.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.4, “Uso de Programas Armazenados do Componente MLE”, para obter mais informações.

* `mle_programs_armazenados`

  Retorna o número de programas armazenados (procedimentos e funções armazenados) atualmente armazenados em cache em todas as sessões. Um programa armazenado MLE é armazenado em cache assim que é executado pela primeira vez, em cada sessão em que foi executado. Ele é descartado do cache da sessão quando qualquer um dos seguintes eventos ocorre:

  + O programa armazenado é explicitamente descartado.
  + A sessão MLE é descartada (consulte a descrição de `mle_sessions`).

  + Um erro de memória é lançado em uma sessão MLE atual.

  Se o mesmo programa armazenado for executado novamente após ser descartado do cache, ele é armazenado em cache novamente, como de costume.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.4, “Uso de Programas Armazenados do Componente MLE”, para obter mais informações.

* `mle_bytes_max_program_armazenado`

  O tamanho do maior programa armazenado MLE, em bytes. Esse valor é igual ao tamanho do texto fonte do programa armazenado, expresso em bytes.

  Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.4, “Uso de Programas Armazenados do Componente MLE”, para obter mais informações.

* `mle_sql_max_program_armazenado`

O número máximo de instruções SQL executadas por qualquer programa armazenado MLE.

Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.4, “Uso de Programa Armazenado de Componente MLE”, para obter mais informações.

* `mle_threads`

Retorna o número atual de threads físicas anexadas ao GraalVM. Uma thread física, fornecida pelo gerenciador de threads do servidor MySQL, é anexada ao GraalVM sempre que ele começa a executar uma operação dentro do GraalVM. Tais operações incluem a criação de pilha, análise de código, execução de código, conversão de argumentos, consultas de uso de memória e desinicialização de programas armazenados. Uma thread é desanexada do GraalVM após sua saída se o número de threads já anexados exceder o número de megabytes de pilha alocados para o Graal. O número de threads físicas anexadas não pode exceder 1,5 vezes o número de megabytes de pilha alocada para o Graal.

Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.3, “Uso de Memória e Threads de Componente MLE”, para obter mais informações.

* `mle_threads_max`

O número máximo de threads MLE ativas em qualquer momento, desde que o componente MLE tenha se tornado ativo pela última vez.

Disponível apenas se o componente MLE estiver instalado. Consulte a Seção 7.5.7.3, “Uso de Memória e Threads de Componente MLE”, para obter mais informações.

Além daquelas listadas aqui, vários variáveis de status que fornecem contagens de instruções SQL da biblioteca JavaScript são suportadas. Consulte as Variáveis Com\_xxx para obter informações sobre essas.