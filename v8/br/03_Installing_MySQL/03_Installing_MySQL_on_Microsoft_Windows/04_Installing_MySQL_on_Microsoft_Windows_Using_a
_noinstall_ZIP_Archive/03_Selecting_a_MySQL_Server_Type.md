#### 2.3.4.3 Selecionando um tipo de servidor MySQL

A tabela a seguir mostra os servidores disponíveis para Windows no MySQL 8.0.

<table summary="Servidores disponíveis para Windows no MySQL 8.0."><thead><tr> <th>Binário</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td>Binário otimizado com suporte a pipe nomeado</td> </tr><tr> <td><span><strong>mysqld-debug</strong></span></td> <td>Como<span><strong>mysqld</strong></span>, mas compilada com depuração completa e verificação automática de alocação de memória</td> </tr></tbody></table>

Todos os binários anteriores são otimizados para processadores Intel modernos, mas devem funcionar em qualquer processador da classe i386 ou superior da Intel.

Cada servidor de uma distribuição suporta o mesmo conjunto de motores de armazenamento. A declaração `SHOW ENGINES` exibe quais motores um determinado servidor suporta.

Todos os servidores Windows MySQL 8.0 têm suporte para vincular simbolicamente os diretórios de banco de dados.

O MySQL suporta TCP/IP em todas as plataformas Windows. Os servidores MySQL no Windows também suportam tubos nomeados, se você iniciar o servidor com a variável de sistema `named_pipe` habilitada. É necessário habilitar explicitamente essa variável, pois alguns usuários tiveram problemas para desligar o servidor MySQL quando os tubos nomeados foram usados. O padrão é usar TCP/IP, independentemente da plataforma, porque os tubos nomeados são mais lentos que o TCP/IP em muitas configurações do Windows.
