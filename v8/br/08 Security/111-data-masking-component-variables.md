#### 8.5.2.5 Variáveis de Componentes de Mascagem e Desidentificação de Dados do MySQL Enterprise

Os componentes de Mascagem e Desidentificação de Dados do MySQL Enterprise suportam as seguintes variáveis de sistema. Use essas variáveis para configurar operações relacionadas aos componentes. As variáveis não estão disponíveis a menos que os componentes apropriados de Mascagem e Desidentificação de Dados do MySQL Enterprise estejam instalados (consulte a Seção 8.5.2.1, “Instalação dos Componentes de Mascagem e Desidentificação de Dados do MySQL Enterprise”).

*  `component_masking.dictionaries_flush_interval_seconds`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--component-masking.dictionaries-flush-interval-seconds=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>component_masking.dictionaries_flush_interval_seconds</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>60</code></td> </tr><tr><th>Valor Máximo (Unix)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (Windows)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Define o intervalo, em segundos, para aguardar antes de tentar agendar outro esvaziamento da tabela de dicionários de mascagem de dados para o cache de dicionários de mascagem de dados de memória após um reinício ou execução anterior. O valor é tratado conforme listado aqui:

  + 0: Sem esvaziamento
  + 1 a 59 (inclusive): Arredondar para 60, com um aviso
  + >= 60: Aguarde esse número de segundos para realizar o esvaziamento
*  `component_masking.masking_database`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--component-masking.masking-database[=value]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>component_masking.masking_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Sugestão de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mysql</code></td> </tbody></table>

Especifica o banco de dados a ser usado para os dicionários de mascaramento de dados no início da inicialização do servidor. Esta variável é de leitura somente.

Use esta variável para definir e persistir um esquema diferente do valor padrão (`mysql`). Para obter informações adicionais sobre a configuração dos componentes de mascaramento de dados para usar um local alternativo para a tabela de mascaramento de dados, consulte Instalar usando um Schema Dedicado. Para diretrizes gerais sobre o uso da palavra-chave `PERSIST ONLY`, consulte Seção 15.7.6.1, “Sintaxe de Definição de Atribuição de Variáveis”.