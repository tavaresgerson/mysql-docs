## 27.9 API MySQL Perl

O módulo `DBI` do Perl oferece uma interface genérica para o acesso a bancos de dados. Você pode escrever um script DBI que funcione com muitos motores de banco de dados diferentes sem alterações. Para usar o DBI com o MySQL, instale o seguinte:

1. O módulo `DBI`.

2. O módulo `DBD::mysql`. Este é o módulo do Driver de Base de Dados (DBD) para Perl.

3. Opcionalmente, o módulo DBD para qualquer outro tipo de servidor de banco de dados que você deseja acessar.

Perl DBI é a interface Perl recomendada. Ela substitui uma interface mais antiga chamada `mysqlperl`, que deve ser considerada obsoleta.

Essas seções contêm informações sobre o uso do Perl com o MySQL e a escrita de aplicativos do MySQL no Perl:

- Para instruções de instalação do suporte Perl DBI, consulte Seção 2.12, “Notas de Instalação do Perl”.

- Para obter um exemplo de opções de leitura de arquivos de opções, consulte Seção 5.7.4, “Usando programas de cliente em um ambiente de múltiplos servidores”.

- Para dicas de codificação segura, consulte Seção 6.1.1, “Diretrizes de Segurança”.

- Para dicas de depuração, consulte Seção 5.8.1.4, “Depuração do mysqld sob o gdb”.

- Para informações sobre variáveis de ambiente específicas do Perl, consulte Seção 4.9, “Variáveis de Ambiente”.

- Para considerações sobre como executar no macOS, consulte Seção 2.4, “Instalando o MySQL no macOS”.

- Para saber como citar literais de string, consulte Seção 9.1.1, “Literais de String”.

As informações do DBI estão disponíveis na linha de comando, online ou em formato impresso:

- Depois de instalar os módulos `DBI` e `DBD::mysql`, você pode obter informações sobre eles na linha de comando com o comando `perldoc`:

  ```sql
  $> perldoc DBI
  $> perldoc DBI::FAQ
  $> perldoc DBD::mysql
  ```

  Você também pode usar `pod2man`, `pod2html`, e assim por diante para traduzir essas informações em outros formatos.

- Para obter informações online sobre Perl DBI, visite o site DBI, <http://dbi.perl.org/>. Esse site hospeda uma lista de discussão geral sobre DBI.

- Para informações impressas, o livro oficial do DBI é *Programação com DBI Perl* (Alligator Descartes e Tim Bunce, O'Reilly & Associates, 2000). Informações sobre o livro estão disponíveis no site do DBI, <http://dbi.perl.org/>.
