#### 5.8.1.1 Compilando o MySQL para depuração

Se você tiver um problema muito específico, sempre pode tentar depurar o MySQL. Para isso, você deve configurar o MySQL com a opção `-DWITH_DEBUG=1`. Você pode verificar se o MySQL foi compilado com depuração fazendo: **mysqld --help**. Se a bandeira `--debug` estiver listada nas opções, então você tem a depuração habilitada. **mysqladmin ver** também lista a versão do **mysqld** como **mysql ... --debug** neste caso.

Se o **mysqld** parar de falhar quando você o configura com a opção CMake `-DWITH_DEBUG=1`, provavelmente você encontrou um bug no compilador ou um bug de temporização no MySQL. Nesse caso, você pode tentar adicionar `-g` usando as opções CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` e não usar `-DWITH_DEBUG=1`. Se o **mysqld** morrer, você pode, pelo menos, anexar a ele com **gdb** ou usar **gdb** no arquivo de núcleo para descobrir o que aconteceu.

Ao configurar o MySQL para depuração, você automaticamente habilita muitas funções de verificação de segurança extras que monitoram a saúde do **mysqld**. Se eles encontrarem algo “inoportuno”, uma entrada é escrita no `stderr`, que o **mysqld\_safe** direciona para o log de erros! Isso também significa que, se você estiver tendo alguns problemas inesperados com o MySQL e estiver usando uma distribuição de código-fonte, a primeira coisa que você deve fazer é configurar o MySQL para depuração. Se você acredita ter encontrado um bug, use as instruções na Seção 1.5, “Como relatar bugs ou problemas”.

Na distribuição do Windows MySQL, o `mysqld.exe` é compilado por padrão com suporte para arquivos de registro.
