## 2.10 Notas de instalação do Perl

O módulo `DBI` do Perl fornece uma interface genérica para o acesso ao banco de dados. Você pode escrever um script `DBI` que funciona com muitos motores de banco de dados diferentes sem alterações. Para usar `DBI`, você deve instalar o módulo `DBI` , bem como um módulo de Driver de Base de Dados (DBD) para cada tipo de servidor de banco de dados que você deseja acessar. Para o MySQL, esse driver é o módulo `DBD::mysql`.

::: info Note

O suporte ao Perl não está incluído nas distribuições MySQL. Você pode obter os módulos necessários em \[<http://search.cpan.org>] para Unix, ou usando o programa ActiveState `ppm` no Windows. As seções seguintes descrevem como fazer isso.

:::

A interface `DBI`/`DBD` requer Perl 5.6.0, e 5.6.1 ou posterior é preferível. DBI *não funciona* se você tiver uma versão mais antiga do Perl. Você deve usar `DBD::mysql` 4.009 ou superior. Embora versões anteriores estejam disponíveis, elas não suportam a funcionalidade completa do MySQL 8.4.
