#### 2.3.4.3 Selecionando um Tipo de MySQL Server

A tabela a seguir mostra os Servers disponíveis para Windows no MySQL 5.7.

<table summary="Servers available for Windows in MySQL 5.7."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Binary</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td>Binary otimizado com suporte a named-pipe</td> </tr><tr> <td><span><strong>mysqld-debug</strong></span></td> <td>Semelhante ao <span><strong>mysqld</strong></span>, mas compilado com Debugging completo e verificação automática de alocação de memória</td> </tr> </tbody></table>

Todos os Binaries precedentes são otimizados para processadores Intel modernos, mas devem funcionar em qualquer processador Intel de classe i386 ou superior.

Cada um dos Servers em uma distribuição suporta o mesmo conjunto de Storage Engines. A instrução `SHOW ENGINES` exibe quais Engines um determinado Server suporta.

Todos os Servers MySQL 5.7 para Windows possuem suporte para Symbolic Linking de diretórios de Database.

O MySQL suporta TCP/IP em todas as plataformas Windows. Os MySQL Servers no Windows também suportam Named Pipes, se você iniciar o Server com a variável de sistema `named_pipe` habilitada. É necessário habilitar esta variável explicitamente porque alguns usuários tiveram problemas ao desligar o MySQL Server quando Named Pipes eram utilizados. O padrão é usar TCP/IP independentemente da plataforma, pois Named Pipes são mais lentos que TCP/IP em muitas configurações do Windows.