#### 25.3.1.3 Instalando o NDB Cluster Usando Arquivos .deb

A seção fornece informações sobre como instalar o NDB Cluster no Debian e em distribuições Linux relacionadas, como o Ubuntu, usando os arquivos `.deb` fornecidos pela Oracle para esse propósito.

A Oracle também fornece um repositório APT do NDB Cluster para Debian e outras distribuições. Veja *Instalando o MySQL NDB Cluster Usando o Repositório APT*, para instruções e informações adicionais.

A Oracle fornece arquivos instaladores `.deb` para o NDB Cluster para plataformas de 32 bits e 64 bits. Para um sistema baseado no Debian, apenas um único arquivo instalador é necessário. Esse arquivo é nomeado usando o padrão mostrado aqui, de acordo com a versão aplicável do NDB Cluster, a versão do Debian e a arquitetura:

```
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Aqui, *`ndbver`* é o número de versão do motor `NDB` de 3 partes, *`debianver`* é a versão principal do Debian (`8` ou `9`), e *`arch`* é uma das opções `i686` ou `x86_64`. Nos exemplos que se seguem, assumimos que você deseja instalar o NDB 9.4.0 em um sistema Debian 9 de 64 bits; nesse caso, o arquivo instalador é chamado `mysql-cluster-gpl-9.4.0-debian9-x86_64.deb-bundle.tar`.

Uma vez que você tenha baixado o arquivo `.deb` apropriado, você pode desempacotar e, em seguida, instalá-lo a partir da linha de comando usando `dpkg`, assim:

```
$> dpkg -i mysql-cluster-gpl-9.4.0-debian9-i686.deb
```

Você também pode removê-lo usando `dpkg` como mostrado aqui:

```
$> dpkg -r mysql
```

O arquivo instalador também deve ser compatível com a maioria dos gerenciadores de pacotes gráficos que trabalham com arquivos `.deb`, como o `GDebi` para o ambiente de trabalho Gnome.

O arquivo `.deb` instala o NDB Cluster em `/opt/mysql/server-version/`, onde *`version`* é a versão da série de lançamento de duas partes para o servidor MySQL incluído. Para o NDB 9.5, isso é sempre `9.5`. O layout do diretório é o mesmo do layout da distribuição binária genérica do Linux (consulte a Tabela 2.3, “Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux”), com a exceção de que os scripts de inicialização e os arquivos de configuração estão localizados em `support-files` em vez de `share`. Todos os executáveis do NDB Cluster, como **ndb_mgm**, **ndbd** e **ndb_mgmd**, estão localizados no diretório `bin`.