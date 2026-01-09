#### 2.3.3.3 Selecionando um Tipo de Servidor MySQL

A tabela a seguir mostra os servidores disponíveis para Windows no MySQL 9.5.

<table summary="Servidores disponíveis para Windows no MySQL 9.5."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Binário</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td>Binário otimizado com suporte a pipes nomeados</td> </tr><tr> <td><span><strong>mysqld-debug</strong></span></td> <td>Como <span><strong>mysqld</strong></span>, mas compilado com depuração completa e verificação automática de alocação de memória</td> </tr></tbody></table>

Cada um dos servidores em uma distribuição suporta o mesmo conjunto de motores de armazenamento. A instrução `SHOW ENGINES` exibe quais motores um determinado servidor suporta.

Todos os servidores MySQL 9.5 para Windows têm suporte para vincular simbolicamente diretórios de banco de dados.

O MySQL suporta TCP/IP em todas as plataformas Windows. Os servidores MySQL para Windows também suportam pipes nomeados, se você iniciar o servidor com a variável de sistema `named_pipe` habilitada. É necessário habilitar explicitamente essa variável porque alguns usuários tiveram problemas para desligar o servidor MySQL quando pipes nomeados foram usados. O padrão é usar TCP/IP independentemente da plataforma, pois pipes nomeados são mais lentos que TCP/IP em muitas configurações do Windows.