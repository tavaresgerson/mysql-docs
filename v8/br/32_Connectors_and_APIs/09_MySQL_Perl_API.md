## 31.9 API MySQL Perl

O módulo Perl `DBI` fornece uma interface genérica para acesso a bancos de dados. Você pode escrever um script DBI que funciona com muitos motores de banco de dados diferentes sem alterações. Para usar o DBI com MySQL, instale o seguinte:

1. O módulo `DBI`. 2. O módulo `DBD::mysql`. Este é o módulo do Driver de Base de Dados (DBD) para Perl.

3. Opcionalmente, o módulo DBD para qualquer outro tipo de servidor de banco de dados que você deseja acessar.

Perl DBI é a interface recomendada para Perl. Ela substitui uma interface mais antiga chamada `mysqlperl`, que deve ser considerada obsoleta.

Essas seções contêm informações sobre o uso do Perl com MySQL e a escrita de aplicativos MySQL no Perl:

* Para instruções de instalação do suporte Perl DBI, consulte a Seção 2.10, “Notas de Instalação do Perl”.

* Para um exemplo de opções de leitura a partir de arquivos de opções, consulte a Seção 7.8.4, “Usando programas de cliente em um ambiente de múltiplos servidores”.

* Para dicas de codificação segura, consulte a Seção 8.1.1, “Diretrizes de Segurança”.

* Para dicas de depuração, consulte a Seção 7.9.1.4, “Depuração do mysqld sob o gdb”.
* Para algumas variáveis de ambiente específicas do Perl, consulte a Seção 6.9, “Variáveis de ambiente”.

* Para considerações sobre o funcionamento no macOS, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

* Para obter informações sobre como citar literais de cadeia, consulte a Seção 11.1.1, “Literais de cadeia”.

As informações do DBI estão disponíveis na linha de comando, online ou em formato impresso:

* Uma vez que você tenha os módulos `DBI` e `DBD::mysql` instalados, você pode obter informações sobre eles na linha de comando com o comando `perldoc`:

  ```
  $> perldoc DBI
  $> perldoc DBI::FAQ
  $> perldoc DBD::mysql
  ```

Você também pode usar `pod2man`, `pod2html`, e assim por diante para traduzir essas informações em outros formatos.

* Para informações online sobre Perl DBI, visite o site DBI, <http://dbi.perl.org/>. Esse site hospeda uma lista de discussão geral sobre DBI.

* Para informações impressas, o livro oficial DBI é *Programação do DBI Perl* (Alligator Descartes e Tim Bunce, O'Reilly & Associates, 2000). Informações sobre o livro estão disponíveis no site DBI, <http://dbi.perl.org/>.