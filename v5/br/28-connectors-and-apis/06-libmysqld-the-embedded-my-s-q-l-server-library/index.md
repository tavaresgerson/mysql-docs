## 27.6 libmysqld, a Biblioteca do Servidor MySQL Embarcado

[27.6.1 Compilando Programas com libmysqld](libmysqld-compiling.html)

[27.6.2 Restrições ao Usar o Servidor MySQL Embarcado](libmysqld-restrictions.html)

[27.6.3 Opções com o Server Embarcado](libmysqld-options.html)

[27.6.4 Exemplos de Server Embarcado](libmysqld-example.html)

A biblioteca do Server MySQL embarcado possibilita executar um Server MySQL completo dentro de uma aplicação cliente. Os principais benefícios são o aumento da velocidade e um gerenciamento mais simples para aplicações embarcadas.

Nota

A biblioteca do server embarcado `libmysqld` está obsoleta a partir do MySQL 5.7.19 e foi removida no MySQL 8.0.

A biblioteca do server embarcado é baseada na versão cliente/server do MySQL, que é escrita em C/C++. Consequentemente, o server embarcado também é escrito em C/C++. Não há um server embarcado disponível em outras linguagens.

A API é idêntica para a versão MySQL embarcada e a versão cliente/server. Para alterar uma aplicação threaded para usar a biblioteca embarcada, você normalmente só precisa adicionar chamadas para as seguintes funções.

**Tabela 27.2 Funções da Biblioteca do Server MySQL Embarcado**

<table summary="Funções da biblioteca do server MySQL embarcado e descrições de quando as funções devem ser chamadas."><thead><tr> <th><p> Função </p></th> <th><p> Quando Chamar </p></th> </tr></thead><tbody><tr> <td><p> <code>mysql_library_init()</code> </p></td> <td><p> Chame-a antes que qualquer outra função MySQL seja chamada, de preferência no início da função <code>main()</code>. </p></td> </tr><tr> <td><p> <code>mysql_library_end()</code> </p></td> <td><p> Chame-a antes que seu programa seja encerrado. </p></td> </tr><tr> <td><p> <code>mysql_thread_init()</code> </p></td> <td><p> Chame-a em cada thread que você criar que acesse o MySQL. </p></td> </tr><tr> <td><code>mysql_thread_end()</code></td> <td>Chame-a antes de chamar <code>pthread_exit()</code>.</td> </tr></tbody></table>

Em seguida, link seu código com `libmysqld.a` em vez de `libmysqlclient.a`. Para garantir a compatibilidade binária entre sua aplicação e a biblioteca do server, sempre compile sua aplicação usando headers da mesma série do MySQL que foi utilizada para compilar a biblioteca do server. Por exemplo, se `libmysqld` foi compilada usando headers do MySQL 5.6, não compile sua aplicação usando headers do MySQL 5.7, ou vice-versa.

Como as funções `mysql_library_xxx()` também estão incluídas em `libmysqlclient.a`, você pode alternar entre a versão embarcada e a versão cliente/server simplesmente linkando sua aplicação com a biblioteca correta. Veja [mysql_library_init()](/doc/c-api/5.7/en/mysql-library-init.html).

Uma diferença entre o server embarcado e o server standalone é que, para o server embarcado, a autenticação para conexões é desabilitada por padrão.
