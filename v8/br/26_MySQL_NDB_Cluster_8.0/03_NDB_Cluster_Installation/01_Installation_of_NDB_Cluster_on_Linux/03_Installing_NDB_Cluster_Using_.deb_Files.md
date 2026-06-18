#### 25.3.1.3 Instalação do NDB Cluster usando arquivos .deb

A seção fornece informações sobre a instalação do NDB Cluster no Debian e em distribuições Linux relacionadas, como o Ubuntu, usando os arquivos `.deb` fornecidos pela Oracle para esse propósito.

A Oracle também fornece um repositório APT do NDB Cluster para Debian e outras distribuições. Consulte *Instalando o MySQL NDB Cluster usando o repositório APT*, para obter instruções e informações adicionais.

A Oracle fornece os arquivos do instalador `.deb` para o NDB Cluster para plataformas de 32 bits e 64 bits. Para um sistema baseado no Debian, é necessário apenas um único arquivo de instalador. Esse arquivo é nomeado de acordo com o padrão mostrado aqui, conforme a versão do NDB Cluster, a versão do Debian e a arquitetura aplicáveis:

```
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Aqui, `ndbver` é o número de versão do motor de 3 partes `NDB`, `debianver` é a versão principal do Debian (`8` ou `9`) e `arch` é um dos `i686` ou `x86_64`. Nos exemplos que se seguem, assumimos que você deseja instalar o NDB 8.0.43 em um sistema Debian 9 de 64 bits; nesse caso, o arquivo do instalador é chamado `mysql-cluster-gpl-8.0.43-debian9-x86_64.deb-bundle.tar`.

Depois de baixar o arquivo `.deb` apropriado, você pode desempacotar-lo e, em seguida, instalá-lo a partir da linha de comando usando `dpkg`, da seguinte maneira:

```
$> dpkg -i mysql-cluster-gpl-8.0.43-debian9-i686.deb
```

Você também pode removê-lo usando `dpkg` como mostrado aqui:

```
$> dpkg -r mysql
```

O arquivo do instalador também deve ser compatível com a maioria dos gerenciadores de pacotes gráficos que trabalham com arquivos `.deb`, como `GDebi` para o ambiente de trabalho Gnome.

O arquivo `.deb` instala o NDB Cluster sob `/opt/mysql/server-version/`, onde `version` é a versão da série de lançamento de duas partes para o servidor MySQL incluído. Para o NDB 8.0, isso é sempre `8.0`. O layout do diretório é o mesmo do layout da distribuição binária genérica do Linux (consulte a Tabela 2.3, “Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux”), com a exceção de que os scripts de inicialização e os arquivos de configuração estão localizados em `support-files` em vez de `share`. Todos os executáveis do NDB Cluster, como **ndb\_mgm**, **ndbd** e **ndb\_mgmd**, estão localizados no diretório `bin`.
