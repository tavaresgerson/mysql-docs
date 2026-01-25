## 2.12 Notas de Instalação do Perl

2.12.1 Instalando Perl no Unix

2.12.2 Instalando ActiveState Perl no Windows

2.12.3 Problemas ao Usar a Interface DBI/DBD do Perl

O `module` `DBI` do Perl fornece uma `interface` genérica para acesso a `database`. Você pode escrever um `script` `DBI` que funciona com muitos `database engines` diferentes sem alteração. Para usar o `DBI`, você deve instalar o `module` `DBI`, bem como um `module` de DataBase Driver (DBD) para cada tipo de `database server` que você deseja acessar. Para o MySQL, este `driver` é o `module` `DBD::mysql`.

Nota

O suporte a Perl não está incluído nas distribuições do MySQL. Você pode obter os `modules` necessários em <http://search.cpan.org> para Unix, ou usando o programa **ppm** do ActiveState no Windows. As seções seguintes descrevem como fazer isso.

A `interface` `DBI`/`DBD` requer Perl 5.6.0, sendo preferível a versão 5.6.1 ou posterior. O DBI *não funciona* se você tiver uma versão mais antiga do Perl. Você deve usar `DBD::mysql` 4.009 ou superior. Embora versões anteriores estejam disponíveis, elas não suportam a funcionalidade completa do MySQL 5.7.