## 2.12 Notas de instalação do Perl

2.12.1 Instalação do Perl no Unix

2.12.2 Instalação do ActiveState Perl no Windows

2.12.3 Problemas usando a interface Perl DBI/DBD

O módulo `DBI` do Perl fornece uma interface genérica para o acesso ao banco de dados. Você pode escrever um script `DBI` que funcione com muitos motores de banco de dados diferentes sem alterações. Para usar o `DBI`, você deve instalar o módulo `DBI`, bem como um módulo de Driver de Base de Dados (DBD) para cada tipo de servidor de banco de dados que você deseja acessar. Para o MySQL, este driver é o módulo `DBD::mysql`.

Nota

O suporte ao Perl não está incluído nas distribuições do MySQL. Você pode obter os módulos necessários em <http://search.cpan.org> para Unix ou usando o programa **ppm** da ActiveState no Windows. As seções a seguir descrevem como fazer isso.

A interface `DBI`/`DBD` requer o Perl 5.6.0, e a versão 5.6.1 ou posterior é preferível. O DBI *não funciona* se você tiver uma versão mais antiga do Perl. Você deve usar o `DBD::mysql` 4.009 ou superior. Embora versões anteriores estejam disponíveis, elas não suportam todas as funcionalidades do MySQL 5.7.
