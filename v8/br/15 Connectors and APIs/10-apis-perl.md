## 31.9 API MySQL em Perl

O módulo `DBI` em Perl fornece uma interface genérica para acesso a bancos de dados. Você pode escrever um script DBI que funcione com muitos motores de banco de dados diferentes sem alterações. Para usar o DBI com MySQL, instale o seguinte:

1. O módulo `DBI`.
2. O módulo `DBD::mysql`. Este é o módulo Driver de Base de Dados (DBD) para Perl.
3. Opcionalmente, o módulo DBD para qualquer outro tipo de servidor de banco de dados que você deseja acessar.

O DBI em Perl é a interface Perl recomendada. Ele substitui uma interface mais antiga chamada `mysqlperl`, que deve ser considerada obsoleta.

Essas seções contêm informações sobre como usar Perl com MySQL e como escrever aplicativos MySQL em Perl:

* Para instruções de instalação do suporte ao DBI em Perl, consulte  Seção 2.10, “Notas de Instalação do Perl”.
* Para um exemplo de leitura de opções de arquivos de opções, consulte  Seção 7.8.4, “Usando Programas de Cliente em um Ambiente com Múltiplos Servidores”.
* Para dicas de codificação segura, consulte  Seção 8.1.1, “Diretrizes de Segurança”.
* Para dicas de depuração, consulte  Seção 7.9.1.4, “Depuração do mysqld sob o gdb”.
* Para algumas variáveis de ambiente específicas do Perl, consulte  Seção 6.9, “Variáveis de Ambiente”.
* Para considerações para execução no macOS, consulte  Seção 2.4, “Instalando MySQL no macOS”.
* Para maneiras de cobrir aspas em literais de string, consulte  Seção 11.1.1, “Literais de String”.

As informações sobre o DBI estão disponíveis na linha de comando, online ou em formato impresso:

* Uma vez que você tenha os módulos `DBI` e `DBD::mysql` instalados, você pode obter informações sobre eles na linha de comando com o comando `perldoc`:

  ```
  $> perldoc DBI
  $> perldoc DBI::FAQ
  $> perldoc DBD::mysql
  ```

Você também pode usar `pod2man`, `pod2html`, e assim por diante para traduzir essas informações em outros formatos.
* Para informações online sobre Perl DBI, visite o site DBI, <http://dbi.perl.org/>. Esse site hospeda uma lista de discussão geral DBI.
* Para informações impressas, o livro oficial DBI é *Programação do Perl DBI* (Alligator Descartes e Tim Bunce, O'Reilly & Associates, 2000). Informações sobre o livro estão disponíveis no site DBI, <http://dbi.perl.org/>.