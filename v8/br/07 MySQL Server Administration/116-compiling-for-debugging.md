#### 7.9.1.1 Compilar o MySQL para depuração

Se você tiver algum problema muito específico, você sempre pode tentar depurar o MySQL. Para fazer isso, você deve configurar o MySQL com a opção `-DWITH_DEBUG=1`. Você pode verificar se o MySQL foi compilado com depuração fazendo: **mysqld --help**. Se o `--debug` está listado com as opções, então você tem a depuração ativada. **mysqladmin ver** também lista a versão `mysqld` como **mysql ... --debug** neste caso.

Se `mysqld` parar de falhar quando você o configurar com a opção de CMake `-DWITH_DEBUG=1`, você provavelmente encontrou um bug de compilador ou um bug de tempo no MySQL. Nesse caso, você pode tentar adicionar `-g` usando as opções de CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` e não usar `-DWITH_DEBUG=1`. Se `mysqld` morrer, você pode pelo menos anexar a ele com **gdb** ou usar **gdb** no núcleo para descobrir o que aconteceu.

Quando você configura o MySQL para depuração, você automaticamente ativa muitas funções de verificação de segurança extras que monitoram a saúde do `mysqld`. Se eles encontrarem algo  inesperado, uma entrada é escrita para `stderr`, que `mysqld_safe` direciona para o registro de erros! Isso também significa que se você está tendo alguns problemas inesperados com o MySQL e está usando uma distribuição de origem, a primeira coisa que você deve fazer é configurar o MySQL para depuração. Se você acredita que encontrou um bug, por favor, use as instruções na Seção 1.6,  Como relatar bugs ou problemas.

Na distribuição MySQL do Windows, `mysqld.exe` é compilado por padrão com suporte para arquivos de rastreamento.
