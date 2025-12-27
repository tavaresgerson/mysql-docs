## Notas de Instalação do Perl

2.10.1 Instalação do Perl no Unix

2.10.2 Instalação do ActiveState Perl no Windows

2.10.3 Problemas ao Usar a Interface DBI/DBD do Perl

O módulo `DBI` do Perl fornece uma interface genérica para o acesso a bancos de dados. Você pode escrever um script `DBI` que funcione com muitos motores de banco de dados diferentes sem alterações. Para usar o `DBI`, você deve instalar o módulo `DBI`, bem como um módulo de Driver de Base de Dados (DBD) para cada tipo de servidor de banco de dados que você deseja acessar. Para o MySQL, este driver é o módulo `DBD::mysql`.

Observação

O suporte ao Perl não está incluído nas distribuições do MySQL. Você pode obter os módulos necessários em <http://search.cpan.org> para Unix ou usando o programa **ppm** da ActiveState no Windows. As seções a seguir descrevem como fazer isso.

A interface `DBI`/`DBD` requer o Perl 5.6.0 e 5.6.1 ou posterior. O DBI *não funciona* se você tiver uma versão mais antiga do Perl. Você deve usar o `DBD::mysql` 4.009 ou superior. Embora versões anteriores estejam disponíveis, elas não suportam a funcionalidade completa do MySQL 9.5.