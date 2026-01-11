## 27.6 libmysqld, a Biblioteca do Servidor MySQL Integrado

27.6.1 Compilando programas com libmysqld

27.6.2 Restrições ao usar o servidor MySQL embutido

27.6.3 Opções com o Servidor Integrado

27.6.4 Exemplos de Servidor Integrado

A biblioteca de servidor MySQL embutida permite executar um servidor MySQL completo dentro de uma aplicação cliente. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações embutidas.

Nota

A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.19 e será removida no MySQL 8.0.

A biblioteca do servidor integrado é baseada na versão cliente/servidor do MySQL, que é escrita em C/C++. Consequentemente, o servidor integrado também é escrito em C/C++. Não há nenhum servidor integrado disponível em outros idiomas.

A API é idêntica para a versão MySQL embutida e para a versão cliente/servidor. Para alterar uma aplicação com suporte a múltiplos fios para usar a biblioteca embutida, normalmente você só precisa adicionar chamadas às seguintes funções.

**Tabela 27.2 Funções da Biblioteca de Servidor Integrado MySQL**

<table summary="Funções da biblioteca do servidor integrado MySQL e descrições de quando as funções devem ser chamadas."><thead><tr> <th><p>Função</p></th> <th><p>Quando ligar</p></th> </tr></thead><tbody><tr> <td><p> <code>mysql_library_init()</code> </p></td> <td><p>Chame antes de qualquer outra função MySQL ser chamada, de preferência no início da função <code>main()</code>.</p></td> </tr><tr> <td><p> <code>mysql_library_end()</code> </p></td> <td><p>Chame antes de o seu programa sair.</p></td> </tr><tr> <td><p> <code>mysql_thread_init()</code> </p></td> <td><p>Chame-o em cada thread que você criar e que acesse o MySQL.</p></td> </tr><tr> <td><code>mysql_thread_end()</code></td> <td>Chame antes de chamar <code>pthread_exit()</code>.</td> </tr></tbody></table>

Em seguida, vincule seu código com `libmysqld.a` em vez de `libmysqlclient.a`. Para garantir a compatibilidade binária entre sua aplicação e a biblioteca do servidor, compile sempre sua aplicação com cabeçalhos da mesma série do MySQL usada para compilar a biblioteca do servidor. Por exemplo, se `libmysqld` foi compilado com cabeçalhos do MySQL 5.6, não compile sua aplicação com cabeçalhos do MySQL 5.7, ou vice-versa.

Como as funções `mysql_library_xxx()` também estão incluídas no `libmysqlclient.a`, você pode alternar entre a versão integrada e a versão cliente/servidor simplesmente vinculando sua aplicação com a biblioteca correta. Veja mysql_library_init().

Uma diferença entre o servidor integrado e o servidor autônomo é que, para o servidor integrado, a autenticação para conexões é desativada por padrão.
