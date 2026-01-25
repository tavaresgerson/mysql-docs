## 27.9 API Perl do MySQL

O módulo Perl `DBI` fornece uma interface genérica para acesso a Database. Você pode escrever um script DBI que funciona com muitos motores de Database diferentes sem alteração. Para usar o DBI com MySQL, instale o seguinte:

1. O módulo `DBI`.
2. O módulo `DBD::mysql`. Este é o módulo DataBase Driver (DBD) para Perl.

3. Opcionalmente, o módulo DBD para qualquer outro tipo de servidor de Database ao qual você deseja acessar.

O Perl DBI é a interface Perl recomendada. Ele substitui uma interface mais antiga chamada `mysqlperl`, que deve ser considerada obsoleta.

Estas seções contêm informações sobre como usar Perl com MySQL e como escrever aplicações MySQL em Perl:

* Para instruções de instalação para o suporte a Perl DBI, consulte [Seção 2.12, “Notas de Instalação do Perl”](perl-support.html "2.12 Notas de Instalação do Perl").

* Para um exemplo de leitura de opções a partir de arquivos de opção, consulte [Seção 5.7.4, “Usando Programas Client em um Ambiente de Múltiplos Servidores”](multiple-server-clients.html "5.7.4 Usando Programas Client em um Ambiente de Múltiplos Servidores").

* Para dicas de codificação segura, consulte [Seção 6.1.1, “Diretrizes de Segurança”](security-guidelines.html "6.1.1 Diretrizes de Segurança").

* Para dicas de Debugging, consulte [Seção 5.8.1.4, “Debugging mysqld sob gdb”](using-gdb-on-mysqld.html "5.8.1.4 Debugging mysqld sob gdb").
* Para algumas environment variables específicas do Perl, consulte [Seção 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

* Para considerações sobre a execução no macOS, consulte [Seção 2.4, “Instalando MySQL no macOS”](macos-installation.html "2.4 Instalando MySQL no macOS").

* Para maneiras de fazer quote em string literals, consulte [Seção 9.1.1, “String Literals”](string-literals.html "9.1.1 String Literals").

As informações sobre DBI estão disponíveis na linha de comando, online ou em formato impresso:

* Assim que os módulos `DBI` e `DBD::mysql` estiverem instalados, você pode obter informações sobre eles na linha de comando com o comando `perldoc`:

  ```sql
  $> perldoc DBI
  $> perldoc DBI::FAQ
  $> perldoc DBD::mysql
  ```

  Você também pode usar `pod2man`, `pod2html` e assim por diante para traduzir esta informação para outros formatos.

* Para informações online sobre Perl DBI, visite o website do DBI, <http://dbi.perl.org/>. Este site hospeda uma mailing list geral do DBI.

* Para informações impressas, o livro oficial do DBI é *Programming the Perl DBI* (Alligator Descartes e Tim Bunce, O'Reilly & Associates, 2000). Informações sobre o livro estão disponíveis no website do DBI, <http://dbi.perl.org/>.
